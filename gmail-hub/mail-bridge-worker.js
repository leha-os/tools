// Gmail Hub Mail Bridge — IMAP/SMTP qua mật khẩu ứng dụng (không cần OAuth, không cần Test User)
// Variables: ALLOWED_ORIGIN (vd https://leha.world), APP_KEY (chuỗi bí mật tự đặt, dán cùng vào app)
import { connect } from "cloudflare:sockets";
const enc = new TextEncoder(), dec = new TextDecoder();
const MAXBODY = 150000;

class Conn {
  constructor(sock) { this.sock = sock; this.r = sock.readable.getReader(); this.w = sock.writable.getWriter(); this.buf = new Uint8Array(0); }
  async fill() {
    const { value, done } = await this.r.read();
    if (done) throw new Error("Máy chủ mail đóng kết nối");
    const n = new Uint8Array(this.buf.length + value.length); n.set(this.buf); n.set(value, this.buf.length); this.buf = n;
  }
  async readLine() {
    let from = 0;
    for (;;) {
      for (let i = from; i < this.buf.length - 1; i++) {
        if (this.buf[i] === 13 && this.buf[i + 1] === 10) { const l = dec.decode(this.buf.subarray(0, i)); this.buf = this.buf.subarray(i + 2); return l; }
      }
      from = Math.max(0, this.buf.length - 1);
      await this.fill();
    }
  }
  async readBytes(n) { while (this.buf.length < n) await this.fill(); const o = this.buf.slice(0, n); this.buf = this.buf.subarray(n); return o; }
  async write(s) { await this.w.write(typeof s === "string" ? enc.encode(s) : s); }
  close() { try { this.sock.close(); } catch (e) {} }
}

const q = (s) => '"' + String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
function b64(u8) { let s = ""; for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000)); return btoa(s); }

class Imap {
  constructor(c) { this.c = c; this.n = 0; }
  static async open(email, pass) {
    const c = new Conn(connect({ hostname: "imap.gmail.com", port: 993 }, { secureTransport: "on" }));
    const im = new Imap(c);
    await c.readLine();
    try { await im.cmd("LOGIN " + q(email) + " " + q(pass)); }
    catch (e) { c.close(); throw new Error("AUTHENTICATIONFAILED: sai email hoặc mật khẩu ứng dụng"); }
    return im;
  }
  async readResp() {
    let text = ""; const lits = [];
    for (;;) {
      const l = await this.c.readLine(); const m = /\{(\d+)\}$/.exec(l);
      if (!m) return { text: text + l, lits };
      text += l.slice(0, m.index) + "\u0001" + lits.length + "\u0001";
      lits.push(await this.c.readBytes(+m[1]));
    }
  }
  async cmd(line) {
    const tag = "A" + ++this.n; await this.c.write(tag + " " + line + "\r\n");
    const out = [];
    for (;;) {
      const r = await this.readResp();
      if (r.text.startsWith(tag + " ")) { if (!/^\S+ OK/.test(r.text)) throw new Error(r.text); return out; }
      out.push(r);
    }
  }
  async select(box) {
    const out = await this.cmd("SELECT " + (box ? q(box) : "INBOX"));
    const uv = out.map((r) => /UIDVALIDITY (\d+)/.exec(r.text)).find(Boolean);
    return uv ? uv[1] : "0";
  }
  async trashBox() {
    const out = await this.cmd('LIST "" "*"');
    for (const r of out) { const m = /^\* LIST \(([^)]*)\) (?:"[^"]*"|NIL) (.+)$/.exec(r.text); if (m && /\\Trash/i.test(m[1])) return m[2].replace(/^"|"$/g, ""); }
    return "[Gmail]/Trash";
  }
  close() { try { this.c.write("Z LOGOUT\r\n"); } catch (e) {} this.c.close(); }
}

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const imapDate = (d) => d.getUTCDate() + "-" + MON[d.getUTCMonth()] + "-" + d.getUTCFullYear();

async function sync(b) {
  const im = await Imap.open(b.email, b.password);
  try {
    const uv = await im.select();
    const since = new Date(Date.now() - (b.days || 30) * 86400000);
    const s = await im.cmd("UID SEARCH SINCE " + imapDate(since));
    let uids = []; for (const r of s) if (/^\* SEARCH/.test(r.text)) uids = r.text.replace("* SEARCH", "").trim().split(/\s+/).filter(Boolean).map(Number);
    uids = uids.sort((a, z) => z - a).slice(0, b.limit || 40);
    const have = new Set(b.have || []);
    const items = [];
    if (uids.length) {
      const fl = await im.cmd("UID FETCH " + uids.join(",") + " (UID FLAGS INTERNALDATE)");
      for (const r of fl) {
        const u = /UID (\d+)/.exec(r.text); if (!u) continue;
        const f = /FLAGS \(([^)]*)\)/.exec(r.text), d = /INTERNALDATE "([^"]+)"/.exec(r.text);
        items.push({ uid: +u[1], seen: !!(f && /\\Seen/.test(f[1])), date: d ? d[1] : "" });
      }
      const fresh = uids.filter((u) => !have.has(u));
      for (let i = 0; i < fresh.length; i += 10) {
        const part = fresh.slice(i, i + 10);
        const out = await im.cmd("UID FETCH " + part.join(",") + " (UID BODY.PEEK[]<0." + MAXBODY + ">)");
        for (const r of out) {
          const u = /UID (\d+)/.exec(r.text), l = /\u0001(\d+)\u0001/.exec(r.text);
          if (!u || !l) continue;
          const it = items.find((x) => x.uid === +u[1]); if (it) it.raw = b64(r.lits[+l[1]]);
        }
      }
    }
    return { uv, items };
  } finally { im.close(); }
}

async function act(b) {
  const im = await Imap.open(b.email, b.password);
  try {
    await im.select();
    const set = (b.uids || []).join(","); if (!set) return { ok: true };
    if (b.op === "read") await im.cmd("UID STORE " + set + " +FLAGS.SILENT (\\Seen)");
    else if (b.op === "unread") await im.cmd("UID STORE " + set + " -FLAGS.SILENT (\\Seen)");
    else if (b.op === "trash") {
      const box = await im.trashBox();
      await im.cmd("UID COPY " + set + " " + q(box));
      await im.cmd("UID STORE " + set + " +FLAGS.SILENT (\\Deleted)");
      await im.cmd("EXPUNGE");
    } else throw new Error("op không hợp lệ");
    return { ok: true };
  } finally { im.close(); }
}

async function smtpReply(c) {
  let code, last;
  do { last = await c.readLine(); code = last.slice(0, 3); } while (last[3] === "-");
  return { code, text: last };
}
async function smtpCmd(c, line, want) {
  await c.write(line + "\r\n"); const r = await smtpReply(c);
  if (!want.includes(r.code)) throw new Error("SMTP: " + r.text); return r;
}
async function send(b) {
  const c = new Conn(connect({ hostname: "smtp.gmail.com", port: 465 }, { secureTransport: "on" }));
  try {
    await smtpReply(c);
    await smtpCmd(c, "EHLO bridge", ["250"]);
    await smtpCmd(c, "AUTH PLAIN " + btoa("\0" + b.email + "\0" + b.password), ["235"]);
    await smtpCmd(c, "MAIL FROM:<" + b.email + ">", ["250"]);
    for (const t of b.to || []) await smtpCmd(c, "RCPT TO:<" + t + ">", ["250", "251"]);
    await smtpCmd(c, "DATA", ["354"]);
    let raw = (b.raw || "").replace(/\r?\n/g, "\r\n").replace(/^\./gm, "..");
    if (!/^From:/im.test(raw)) raw = "From: " + b.email + "\r\n" + raw;
    await c.write(raw + "\r\n.\r\n");
    const r = await smtpReply(c); if (r.code !== "250") throw new Error("SMTP: " + r.text);
    try { await c.write("QUIT\r\n"); } catch (e) {}
    return { ok: true };
  } finally { c.close(); }
}

export default {
  async fetch(req, env) {
    const cors = { "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*", "Access-Control-Allow-Headers": "content-type,x-key", "Access-Control-Allow-Methods": "POST,OPTIONS" };
    const json = (o, st = 200) => new Response(JSON.stringify(o), { status: st, headers: { ...cors, "content-type": "application/json" } });
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });
    if (req.method !== "POST") return new Response("Gmail Hub Mail Bridge OK");
    if (env.APP_KEY && req.headers.get("x-key") !== env.APP_KEY) return json({ error: "Sai APP_KEY" }, 401);
    try {
      const b = await req.json(); const p = new URL(req.url).pathname;
      if (!b.email || !b.password) return json({ error: "Thiếu email hoặc mật khẩu" }, 400);
      b.password = String(b.password).replace(/\s+/g, "");
      if (p === "/verify") { const im = await Imap.open(b.email, b.password); im.close(); return json({ ok: true }); }
      if (p === "/sync") return json(await sync(b));
      if (p === "/act") return json(await act(b));
      if (p === "/send") return json(await send(b));
      return json({ error: "Không có đường dẫn này" }, 404);
    } catch (e) { return json({ error: String(e.message || e) }, 502); }
  },
};
