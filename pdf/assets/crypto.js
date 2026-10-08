/* PdfCrypto — minimal PDF standard encryption (RC4, V=1/V=2, R=2/R=3)
 * Implements ISO 32000 Algorithms 1–6 for the RC4 cases.
 * encryptPdf(): adds password protection (128-bit RC4) to a PDF saved
 *   WITHOUT object streams (e.g. pdf-lib save with useObjectStreams:false).
 * Works in browser (window.PdfCrypto) and Node (module.exports).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.PdfCrypto = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ---------------- MD5 (RFC 1321) ---------------- */
  function md5(input) {
    // input: Uint8Array -> output: Uint8Array(16)
    var msg = input;
    var origLen = msg.length;
    var bitLen = origLen * 8;
    var newLen = (((origLen + 8) >> 6) + 1) * 64;
    var buf = new Uint8Array(newLen);
    buf.set(msg);
    buf[origLen] = 0x80;
    var dv = new DataView(buf.buffer);
    // append 64-bit little-endian bit length
    dv.setUint32(newLen - 8, bitLen >>> 0, true);
    dv.setUint32(newLen - 4, Math.floor(bitLen / 4294967296), true);

    var a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;
    var S = [7,12,17,22, 7,12,17,22, 7,12,17,22, 7,12,17,22,
             5, 9,14,20, 5, 9,14,20, 5, 9,14,20, 5, 9,14,20,
             4,11,16,23, 4,11,16,23, 4,11,16,23, 4,11,16,23,
             6,10,15,21, 6,10,15,21, 6,10,15,21, 6,10,15,21];
    var K = [];
    for (var i = 0; i < 64; i++) K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296) >>> 0;

    function rotl(x, c) { return ((x << c) | (x >>> (32 - c))) >>> 0; }
    function add() { var r = 0; for (var k = 0; k < arguments.length; k++) r = (r + (arguments[k] >>> 0)) >>> 0; return r >>> 0; }

    var M = new Array(16);
    for (var off = 0; off < newLen; off += 64) {
      for (var j = 0; j < 16; j++) M[j] = dv.getUint32(off + j * 4, true);
      var A = a0, B = b0, C = c0, D = d0;
      for (var t = 0; t < 64; t++) {
        var F, g;
        if (t < 16) { F = (B & C) | (~B & D); g = t; }
        else if (t < 32) { F = (D & B) | (~D & C); g = (5 * t + 1) % 16; }
        else if (t < 48) { F = B ^ C ^ D; g = (3 * t + 5) % 16; }
        else { F = C ^ (B | ~D); g = (7 * t) % 16; }
        F = add(F, A, K[t], M[g]);
        A = D; D = C; C = B;
        B = add(B, rotl(F, S[t]));
      }
      a0 = add(a0, A); b0 = add(b0, B); c0 = add(c0, C); d0 = add(d0, D);
    }
    var out = new Uint8Array(16);
    var odv = new DataView(out.buffer);
    odv.setUint32(0, a0, true); odv.setUint32(4, b0, true);
    odv.setUint32(8, c0, true); odv.setUint32(12, d0, true);
    return out;
  }

  /* ---------------- RC4 ---------------- */
  function rc4(key, data) {
    var S = new Uint8Array(256), i, j = 0, out = new Uint8Array(data.length);
    for (i = 0; i < 256; i++) S[i] = i;
    for (i = 0; i < 256; i++) { j = (j + S[i] + key[i % key.length]) & 255; var t = S[i]; S[i] = S[j]; S[j] = t; }
    i = 0; j = 0;
    for (var k = 0; k < data.length; k++) {
      i = (i + 1) & 255; j = (j + S[i]) & 255;
      var tt = S[i]; S[i] = S[j]; S[j] = tt;
      out[k] = data[k] ^ S[(S[i] + S[j]) & 255];
    }
    return out;
  }

  /* ---------------- helpers ---------------- */
  var PADDING = new Uint8Array([0x28,0xBF,0x4E,0x5E,0x4E,0x75,0x8A,0x41,0x64,0x00,0x4E,0x56,0xFF,0xFA,0x01,0x08,0x2E,0x2E,0x00,0xB6,0xD0,0x68,0x3E,0x80,0x2F,0x0C,0xA9,0xFE,0x64,0x53,0x69,0x7A]);

  function strToBytes(s) { // latin1
    var b = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) b[i] = s.charCodeAt(i) & 0xFF;
    return b;
  }
  function bytesToStr(b) {
    var s = '', CH = 8192;
    for (var i = 0; i < b.length; i += CH) s += String.fromCharCode.apply(null, b.subarray(i, i + CH));
    return s;
  }
  function concat() {
    var total = 0, i;
    for (i = 0; i < arguments.length; i++) total += arguments[i].length;
    var out = new Uint8Array(total), p = 0;
    for (i = 0; i < arguments.length; i++) { out.set(arguments[i], p); p += arguments[i].length; }
    return out;
  }
  function hexEncode(b) {
    var h = '';
    for (var i = 0; i < b.length; i++) h += ('0' + b[i].toString(16)).slice(-2);
    return h.toUpperCase();
  }
  function hexDecode(h) {
    h = h.replace(/\s+/g, '');
    if (h.length % 2) h += '0';
    var b = new Uint8Array(h.length / 2);
    for (var i = 0; i < b.length; i++) b[i] = parseInt(h.substr(i * 2, 2), 16);
    return b;
  }
  function pad32(pwBytes) {
    var out = new Uint8Array(32);
    var n = Math.min(32, pwBytes.length);
    out.set(pwBytes.subarray(0, n));
    if (n < 32) out.set(PADDING.subarray(0, 32 - n), n);
    return out;
  }
  function xorKey(key, n) {
    if (!n) return key;
    var k = new Uint8Array(key.length);
    for (var i = 0; i < key.length; i++) k[i] = key[i] ^ n;
    return k;
  }
  function rc4chain(key, data, rounds) {
    var out = data;
    for (var i = 0; i < rounds; i++) out = rc4(xorKey(key, i), out);
    return out;
  }
  function le32(n) {
    return new Uint8Array([n & 0xFF, (n >> 8) & 0xFF, (n >> 16) & 0xFF, (n >> 24) & 0xFF]);
  }

  /* PDF key algorithms (ISO 32000). n = key length bytes (16 for 128-bit). R = revision. */
  function computeO(userPw, ownerPw, n, R) {
    var h = md5(pad32(ownerPw));
    if (R >= 3) for (var i = 0; i < 50; i++) h = md5(h);
    var key = h.subarray(0, n);
    return rc4chain(key, pad32(userPw), R >= 3 ? 20 : 1);
  }
  function computeEncryptionKey(userPw, O, P, id0, n, R) {
    var h = md5(concat(pad32(userPw), O, le32(P >>> 0), id0));
    if (R >= 3) for (var i = 0; i < 50; i++) h = md5(h.subarray(0, n));
    return h.subarray(0, n);
  }
  function computeU(encKey, id0, R) {
    if (R <= 2) return rc4(encKey, PADDING.slice());
    var uhash = md5(concat(PADDING.slice(), id0));
    var first16 = rc4chain(encKey, uhash, 20).subarray(0, 16);
    return concat(first16, PADDING.subarray(0, 16));
  }
  function objectKey(encKey, objNum, genNum, n) {
    var data = concat(encKey,
      new Uint8Array([objNum & 0xFF, (objNum >> 8) & 0xFF, (objNum >> 16) & 0xFF]),
      new Uint8Array([genNum & 0xFF, (genNum >> 8) & 0xFF]));
    return md5(data).subarray(0, Math.min(n + 5, 16));
  }

  /* ---------------- PDF structure parsing ---------------- */
  function findLast(hay, needle, fromEnd) {
    if (fromEnd === undefined) fromEnd = hay.length;
    return hay.lastIndexOf(needle, fromEnd);
  }

  // Parse an (uncompressed) xref section chain. Returns {objects: Map(num->{offset,gen}), trailer: string, lastXref: number}
  function parseXrefChain(s) {
    var objects = new Map();
    // IMPORTANT: use the LAST startxref (file may have incremental updates)
    var idx = s.lastIndexOf('startxref');
    if (idx < 0) throw new Error('No startxref found');
    var m = /startxref\s*(\d+)/.exec(s.slice(idx, idx + 40));
    if (!m) throw new Error('Bad startxref');
    var xrefOff = parseInt(m[1], 10);
    var trailer = '';
    var guard = 0;
    while (xrefOff > 0 && guard++ < 20) {
      var sec = s.slice(xrefOff, xrefOff + 64);
      if (sec.slice(0, 4) !== 'xref') throw new Error('Compressed xref not supported');
      var pos = xrefOff + 4;
      // subsections
      while (true) {
        var hm = /^\s*(\d+)\s+(\d+)\s*\r?\n/.exec(s.slice(pos, pos + 40));
        if (!hm) break;
        // check it's really a subsection header and not "trailer"
        pos += hm[0].length;
        var first = parseInt(hm[1], 10), count = parseInt(hm[2], 10);
        for (var k = 0; k < count; k++) {
          var e = s.slice(pos, pos + 20);
          var em = /^(\d{10}) (\d{5}) ([fn])/.exec(e);
          pos += em ? (e.indexOf('\n') + 1) : 20;
          if (em && em[3] === 'n') {
            var num = first + k;
            if (!objects.has(num)) objects.set(num, { offset: parseInt(em[1], 10), gen: parseInt(em[2], 10) });
          }
        }
      }
      var tIdx = s.indexOf('trailer', pos);
      if (tIdx < 0) throw new Error('No trailer');
      var dStart = s.indexOf('<<', tIdx);
      // find matching >> (trailer dict has no nesting except ID array)
      var depth = 0, p = dStart, dEnd = -1;
      for (; p < s.length; p++) {
        if (s[p] === '<' && s[p + 1] === '<') { depth++; p++; }
        else if (s[p] === '>' && s[p + 1] === '>') { depth--; p++; if (depth === 0) { dEnd = p + 1; break; } }
      }
      if (dEnd < 0) throw new Error('Bad trailer dict');
      if (!trailer) trailer = s.slice(dStart, dEnd); // keep newest trailer (first in chain)
      var pm = /\/Prev\s+(\d+)/.exec(trailer);
      xrefOff = pm ? parseInt(pm[1], 10) : 0;
    }
    return { objects: objects, trailer: trailer, lastXref: parseInt(m[1], 10) };
  }

  function getTrailerVal(trailer, key) {
    var m = new RegExp('/' + key + '\\s+(\\d+)\\s+(\\d+)\\s+R').exec(trailer);
    if (m) return { num: parseInt(m[1], 10), gen: parseInt(m[2], 10) };
    return null;
  }
  function getTrailerInt(trailer, key) {
    var m = new RegExp('/' + key + '\\s+(-?\\d+)').exec(trailer);
    return m ? parseInt(m[1], 10) : null;
  }
  function getTrailerID(trailer) {
    var m = /\/ID\s*\[\s*<([0-9A-Fa-f]*)>\s*<([0-9A-Fa-f]*)>\s*\]/.exec(trailer);
    return m ? [m[1], m[2]] : null;
  }

  // Find raw byte range of object num: {start, end} (end after 'endobj')
  function objectRange(s, offset) {
    var end = s.indexOf('endobj', offset);
    if (end < 0) throw new Error('No endobj');
    return { start: offset, end: end + 6 };
  }

  // Encrypt/decrypt strings+streams inside one object's raw latin1 string.
  // Mutates the byte array in place (same lengths).
  function cryptObjectStrings(buf, objStart, objEnd, key) {
    var s = bytesToStr(buf.subarray(objStart, objEnd));
    var hm = /^(\d+)\s+(\d+)\s+obj[\r\n]+/.exec(s);
    if (!hm) return;
    var bodyStart = hm[0].length;
    var body = s.slice(bodyStart);
    // locate stream (if any)
    var streamMatch = />>\s*stream\r?\n/.exec(body);
    var regions = []; // [start,end) within `body` to scan for strings
    var streamData = null; // {start,end} within body
    if (streamMatch) {
      var dictEnd = streamMatch.index + streamMatch[0].length;
      var lm = /\/Length\s+(\d+)/.exec(body.slice(0, streamMatch.index));
      if (!lm) throw new Error('Indirect /Length not supported');
      var len = parseInt(lm[1], 10);
      streamData = { start: dictEnd, end: dictEnd + len };
      regions.push([0, streamMatch.index]);
      var afterStream = body.indexOf('endstream', streamData.end);
      if (afterStream > 0) regions.push([afterStream, body.length]);
    } else {
      regions.push([0, body.length]);
    }
    function cryptRange(a, b) {
      var sub = body.slice(a, b);
      var out = sub.split('');
      var i = 0;
      while (i < sub.length) {
        var ch = sub[i];
        if (ch === '(') {
          // literal string: find matching close paren honoring escapes
          var depth = 1, j = i + 1;
          while (j < sub.length && depth > 0) {
            if (sub[j] === '\\') j += 2;
            else { if (sub[j] === '(') depth++; else if (sub[j] === ')') depth--; j++; }
          }
          var cs = i + 1, ce = j - 1; // raw content bytes
          if (ce > cs) {
            var enc = rc4(key, strToBytes(sub.slice(cs, ce)));
            for (var k = 0; k < enc.length; k++) out[cs + k] = String.fromCharCode(enc[k]);
          }
          i = j;
        } else if (ch === '<') {
          if (sub[i + 1] === '<') { i += 2; continue; }
          var e = sub.indexOf('>', i + 1);
          if (e < 0) break;
          var cs2 = i + 1, ce2 = e;
          if (ce2 > cs2) {
            var enc2 = rc4(key, strToBytes(sub.slice(cs2, ce2)));
            for (var k2 = 0; k2 < enc2.length; k2++) out[cs2 + k2] = String.fromCharCode(enc2[k2]);
          }
          i = e + 1;
        } else i++;
      }
      return out.join('');
    }
    var parts = [];
    var last = 0;
    // rebuild body with crypted regions; stream data crypted separately
    var regionSet = regions;
    var newBody = '';
    var cursor = 0;
    var items = [];
    regionSet.forEach(function (r) { items.push({ t: 'str', a: r[0], b: r[1] }); });
    if (streamData) items.push({ t: 'bin', a: streamData.start, b: streamData.end });
    items.sort(function (x, y) { return x.a - y.a; });
    items.forEach(function (it) {
      newBody += body.slice(cursor, it.a);
      if (it.t === 'str') newBody += cryptRange(it.a, it.b);
      else {
        var encB = rc4(key, strToBytes(body.slice(it.a, it.b)));
        newBody += bytesToStr(encB);
      }
      cursor = it.b;
    });
    newBody += body.slice(cursor);
    var newBytes = strToBytes(newBody);
    buf.set(newBytes, objStart + bodyStart);
  }

  function isEncrypted(pdfBytes) {
    var s = bytesToStr(pdfBytes.subarray(0, Math.min(pdfBytes.length, 4096)));
    // cheap heuristic on header area is unreliable; scan whole file for /Encrypt token
    var full = bytesToStr(pdfBytes);
    return /\/Encrypt(?![A-Za-z])/.test(full);
  }

  function randomHex(n) {
    var b = new Uint8Array(n);
    for (var i = 0; i < n; i++) b[i] = (Math.random() * 256) | 0;
    return hexEncode(b);
  }

  /* ---------------- encrypt ---------------- */
  function encryptPdf(pdfBytes, userPassword, ownerPassword, permissions) {
    if (isEncrypted(pdfBytes)) throw new Error('PDF is already encrypted');
    var buf = new Uint8Array(pdfBytes); // work on a copy
    var s = bytesToStr(buf);
    if (s.indexOf('/ObjStm') >= 0 || s.indexOf('/XRef') >= 0) {
      // crude check for object streams / compressed xref
      // (pdf-lib with useObjectStreams:false never produces these)
      if (/\/Type\s*\/ObjStm/.test(s)) throw new Error('Object streams not supported — re-save without them');
    }
    var chain = parseXrefChain(s);
    var P = (permissions === undefined ? -4 : permissions) | 0;
    var n = 16; // 128-bit
    var userPw = strToBytes(String(userPassword === undefined ? '' : userPassword));
    var ownerPw = strToBytes(String(ownerPassword === undefined || ownerPassword === '' ? (userPassword || '') : ownerPassword));
    var ids = getTrailerID(chain.trailer);
    var id0hex = ids ? ids[0] : randomHex(16);
    var id0 = hexDecode(id0hex);
    var O = computeO(userPw, ownerPw, n, 3);
    var encKey = computeEncryptionKey(userPw, O, P, id0, n, 3);
    var U = computeU(encKey, id0, 3);

    var nums = Array.from(chain.objects.keys()).sort(function (a, b) { return a - b; });
    nums.forEach(function (num) {
      var info = chain.objects.get(num);
      var r = objectRange(s, info.offset);
      var key = objectKey(encKey, num, info.gen, n);
      cryptObjectStrings(buf, r.start, r.end, key);
    });

    // append Encrypt dict object + incremental xref/trailer
    var newNum = Math.max.apply(null, nums) + 1;
    var encObjStr = '\n' + newNum + ' 0 obj\n<< /Filter /Standard /V 2 /R 3 /Length 128 /O <' +
      hexEncode(O) + '> /U <' + hexEncode(U) + '> /P ' + P + ' >>\nendobj\n';
    var root = getTrailerVal(chain.trailer, 'Root');
    var size = getTrailerInt(chain.trailer, 'Size') || (newNum + 1);
    var newId1 = randomHex(16);
    var encObjBytes = strToBytes(encObjStr);
    var encObjOff = buf.length;
    var xrefEntry = strPad(encObjOff) + ' 00000 n \n';
    var trailerStr = 'trailer\n<< /Size ' + (newNum + 1) +
      ' /Root ' + (root ? root.num + ' ' + root.gen + ' R' : '1 0 R') +
      ' /ID [<' + id0hex + '><' + newId1 + '>]' +
      ' /Encrypt ' + newNum + ' 0 R /Prev ' + chain.lastXref + ' >>\n';
    var xrefOffPos = encObjOff + encObjBytes.length;
    var xrefStr = 'xref\n' + newNum + ' 1\n' + xrefEntry + trailerStr +
      'startxref\n' + xrefOffPos + '\n%%EOF';
    var xrefBytes = strToBytes(xrefStr);
    var out = new Uint8Array(encObjOff + encObjBytes.length + xrefBytes.length);
    out.set(buf, 0);
    out.set(encObjBytes, encObjOff);
    out.set(xrefBytes, encObjOff + encObjBytes.length);
    return out;

    function strPad(num) {
      var t = String(num);
      while (t.length < 10) t = '0' + t;
      return t;
    }
  }

  return {
    md5: md5, rc4: rc4,
    encryptPdf: encryptPdf, isEncrypted: isEncrypted
  };
});
