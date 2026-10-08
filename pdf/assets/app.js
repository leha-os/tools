/* PDF Tools — 100% client-side. Requires: pdf-lib (window.PDFLib), PDF.js (window.pdfjsLib), PdfCrypto. */
(function () {
'use strict';

const PDFLib = window.PDFLib;

/* ================= helpers ================= */
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function el(html) { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function fmtBytes(n) {
  if (!isFinite(n)) return '—';
  if (n < 1024) return n + ' B';
  const u = ['KB','MB','GB']; let i = -1;
  do { n /= 1024; i++; } while (n >= 1024 && i < u.length - 1);
  return n.toFixed(n >= 100 ? 0 : 1) + ' ' + u[i];
}
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.hidden = false;
  clearTimeout(t._h); t._h = setTimeout(() => t.hidden = true, 2600);
}
function downloadBytes(u8, name, mime) {
  const blob = new Blob([u8], { type: mime || 'application/octet-stream' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
}
async function downloadSequential(items) {
  for (const it of items) { downloadBytes(it.bytes, it.name, it.mime); await sleep(700); }
}
async function readU8(file) { return new Uint8Array(await file.arrayBuffer()); }
function hexToRgb01(hex) {
  const h = hex.replace('#','');
  const v = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const n = parseInt(v, 16);
  return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
}
function setStatus(box, msg, cls) {
  box.innerHTML = msg ? `<div class="status-line ${cls||''}">${esc(msg)}</div>` : '';
}
function showAlert(box, msg, type) {
  box.innerHTML = `<div class="alert ${type||'info'}">${esc(msg)}</div>`;
}
function progressBar(box) {
  const p = el('<div class="progress" hidden><div></div></div>');
  box.appendChild(p);
  return { show(){ p.hidden = false; }, set(v){ p.firstChild.style.width = Math.round(v*100)+'%'; }, hide(){ p.hidden = true; } };
}

/* ================= i18n wiring ================= */
function applyStaticI18n() {
  $$('[data-i18n]').forEach(elm => { elm.textContent = t(elm.getAttribute('data-i18n')); });
  $$('[data-i18n-html]').forEach(elm => { elm.innerHTML = t(elm.getAttribute('data-i18n-html')); });
  $$('[data-i18n-attr]').forEach(elm => {
    elm.getAttribute('data-i18n-attr').split(';').forEach(pair => {
      const i = pair.indexOf(':');
      if (i > 0) elm.setAttribute(pair.slice(0, i).trim(), t(pair.slice(i + 1).trim()));
    });
  });
}
/* Switch language, persist to localStorage ('leha_lang'), re-render current view. */
function applyLang(l) {
  lehaSaveLang(l);
  const cur = lehaGetLang();
  document.documentElement.lang = cur;
  document.title = t('meta.title');
  const md = document.querySelector('meta[name="description"]');
  if (md) md.setAttribute('content', t('meta.desc'));
  applyStaticI18n();
  $$('#langToggle button').forEach(b => b.classList.toggle('active', b.dataset.lang === cur));
  router();
}

/* ================= PDF loading ================= */
async function loadPdfDoc(u8) {
  if (window.PdfCrypto && PdfCrypto.isEncrypted(u8)) {
    const e = new Error(t('err.encrypted'));
    e.code = 'encrypted'; throw e;
  }
  try { return await PDFLib.PDFDocument.load(u8, { updateMetadata: false }); }
  catch (e) { throw new Error(t('err.corrupt')); }
}

/* ================= PDF.js (thumbnails / raster) ================= */
let pdfjsState = null; // null | true | false
async function pdfjsAvailable() {
  if (pdfjsState !== null) return pdfjsState;
  if (!window.pdfjsLib) { pdfjsState = false; return false; }
  try {
    if (window.PDF_WORKER_B64) {
      const bin = atob(window.PDF_WORKER_B64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        URL.createObjectURL(new Blob([bytes], { type: 'application/javascript' }));
    } else {
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'libs/pdf.worker.min.js';
    }
    pdfjsState = true;
  } catch (e) { pdfjsState = false; }
  return pdfjsState;
}
async function openWithPdfJs(u8, password) {
  const ok = await pdfjsAvailable();
  if (!ok) throw new Error(t('err.pdfjs'));
  try {
    return await pdfjsLib.getDocument({ data: u8, password: password || undefined }).promise;
  } catch (e) {
    if (e && e.name === 'PasswordException') { const x = new Error(t('err.badpw')); x.code='badpw'; throw x; }
    throw new Error(t('err.pdfjs_open', { msg: e.message || e }));
  }
}
async function renderThumb(pdfjsDoc, pageNum, maxW) {
  maxW = maxW || 150;
  const page = await pdfjsDoc.getPage(pageNum);
  const v0 = page.getViewport({ scale: 1 });
  const scale = maxW / v0.width;
  const vp = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.ceil(vp.width));
  canvas.height = Math.max(1, Math.ceil(vp.height));
  await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
  return canvas;
}
/* Build a thumbnail grid. opts: {mode:'select'|'drag'|'none', selected:Set, onChange} */
async function thumbGrid(box, pdfjsDoc, opts) {
  opts = opts || {};
  const mode = opts.mode || 'select';
  const selected = opts.selected || new Set();
  box.innerHTML = `<div class="status-line">${esc(t('tg.rendering'))}</div>`;
  const n = pdfjsDoc.numPages;
  const grid = el('<div class="thumb-grid"></div>');
  box.innerHTML = ''; box.appendChild(grid);
  const order = [];
  for (let p = 1; p <= n; p++) {
    const card = el(`<div class="thumb-card" data-p="${p}"><div class="pg">${esc(t('tg.page'))} ${p}</div></div>`);
    try { card.prepend(await renderThumb(pdfjsDoc, p)); }
    catch (e) { card.prepend(el(`<div class="status-line err">${esc(t('tg.prevfail'))}</div>`)); }
    if (mode === 'select') {
      if (selected.has(p)) card.classList.add('selected');
      card.addEventListener('click', () => {
        if (selected.has(p)) { selected.delete(p); card.classList.remove('selected'); }
        else { selected.add(p); card.classList.add('selected'); }
        if (opts.onChange) opts.onChange(selected);
      });
    } else if (mode === 'drag') {
      card.draggable = true;
      card.addEventListener('dragstart', e => { card.classList.add('dragging'); e.dataTransfer.setData('text/plain', String(p)); });
      card.addEventListener('dragend', () => card.classList.remove('dragging'));
      card.addEventListener('dragover', e => e.preventDefault());
      card.addEventListener('drop', e => {
        e.preventDefault();
        const from = parseInt(e.dataTransfer.getData('text/plain'), 10);
        if (!from || from === p) return;
        const fi = order.indexOf(from), ti = order.indexOf(p);
        order.splice(ti, 0, order.splice(fi, 1)[0]);
        const cards = Array.from(grid.children);
        const ref = cards[ti + (fi < ti ? 1 : 0)];
        grid.insertBefore(grid.querySelector(`[data-p="${from}"]`), ref || null);
        // relabel
        Array.from(grid.children).forEach((c, idx) => { c.querySelector('.pg').textContent = t('tg.page') + ' ' + order[idx]; });
        if (opts.onChange) opts.onChange(order.slice());
      });
    }
    grid.appendChild(card);
    order.push(p);
  }
  return { order, selected };
}

/* ================= shared UI components ================= */
function dropZone(o) {
  o = o || {};
  const dz = el(`<div class="dropzone">
    <div class="dz-icon"><svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="1.6">
      <path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 20h16"/></svg></div>
    <p><strong>${esc(t('dz.title'))}</strong> ${esc(t('dz.or'))} <span class="browse">${esc(t('dz.browse'))}</span></p>
    <p style="font-size:12px">${esc(o.hint || '')}</p>
  </div>`);
  const input = el(`<input type="file" accept="${esc(o.accept || '.pdf')}" ${o.multiple === false ? '' : 'multiple'} hidden>`);
  dz.appendChild(input);
  dz.addEventListener('click', () => input.click());
  ;['dragover','dragenter'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.add('dragover'); }));
  ;['dragleave','drop'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.remove('dragover'); }));
  dz.addEventListener('drop', e => { const f = [...e.dataTransfer.files]; if (f.length && dz.onfiles) dz.onfiles(f); });
  input.addEventListener('change', () => { const f = [...input.files]; input.value = ''; if (f.length && dz.onfiles) dz.onfiles(f); });
  dz.onfiles = null;
  return dz;
}
/* Sortable file list. getFiles()->array; onChange() after any mutation. meta(i)->html string. */
function fileList(box, getFiles, onChange, meta) {
  function render() {
    const files = getFiles();
    box.innerHTML = '';
    if (!files.length) { box.innerHTML = `<div class="status-line">${esc(t('fl.empty'))}</div>`; return; }
    files.forEach((f, i) => {
      const row = el(`<div class="file-row">
        <span class="fname" title="${esc(f.name)}">${esc(f.name)}</span>
        <span class="fmeta">${meta ? meta(i) : ''}</span>
        <button class="icon-btn" data-a="up" title="${esc(t('fl.up'))}" ${i === 0 ? 'disabled' : ''}>↑</button>
        <button class="icon-btn" data-a="down" title="${esc(t('fl.down'))}" ${i === files.length - 1 ? 'disabled' : ''}>↓</button>
        <button class="icon-btn danger" data-a="rm" title="${esc(t('fl.rm'))}">✕</button>
      </div>`);
      row.querySelector('[data-a=up]').onclick = () => { const a = getFiles(); [a[i-1], a[i]] = [a[i], a[i-1]]; onChange(); render(); };
      row.querySelector('[data-a=down]').onclick = () => { const a = getFiles(); [a[i+1], a[i]] = [a[i], a[i+1]]; onChange(); render(); };
      row.querySelector('[data-a=rm]').onclick = () => { getFiles().splice(i, 1); onChange(); render(); };
      box.appendChild(row);
    });
  }
  render();
  return { render };
}
function fieldRow(html) { return `<div class="field-row">${html}</div>`; }

/* ================= tool registry ================= */
const ICON = (inner) => `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
const TOOLS = [
  { id: 'merge', title: 'Merge PDF', desc: 'Combine multiple PDFs into one file, in your chosen order.',
    icon: ICON('<rect x="3" y="7" width="11" height="14" rx="2"/><path d="M10 7V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2"/>') },
  { id: 'split', title: 'Split PDF', desc: 'Split by page ranges (e.g. 1-3, 4-6) or every N pages.',
    icon: ICON('<circle cx="6" cy="7" r="2.4"/><circle cx="6" cy="17" r="2.4"/><path d="M8.2 8.8L20 19M8.2 15.2L20 5"/>') },
  { id: 'extract', title: 'Extract Pages', desc: 'Keep or delete selected pages with visual thumbnails.',
    icon: ICON('<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><path d="M9.5 13.5l1.8 1.8 3.2-3.6"/>') },
  { id: 'rotate', title: 'Rotate Pages', desc: 'Rotate selected pages by 90°, 180° or 270°.',
    icon: ICON('<path d="M20 12a8 8 0 1 1-2.34-5.66"/><path d="M20 3v4.5h-4.5"/>') },
  { id: 'reorder', title: 'Reorder Pages', desc: 'Drag thumbnails to rearrange page order.',
    icon: ICON('<path d="M8 3v18M8 3L5.5 5.5M8 3l2.5 2.5M16 21V3M16 21l-2.5-2.5M16 21l2.5-2.5"/>') },
  { id: 'singlepage', title: 'PDF to Single Page', desc: 'Join all pages into one long page — vector stays razor-sharp, no seams.',
    icon: ICON('<rect x="8" y="2" width="8" height="20" rx="1.5"/><path d="M8 8h8M8 13h8M8 18h8"/>') },
  { id: 'compress', title: 'Compress PDF', desc: 'Shrink file size: optimize structure or reduce image quality.',
    icon: ICON('<path d="M4 9h5V4M20 15h-5v5M4 4l7 7M20 20l-7-7"/>') },
  { id: 'img2pdf', title: 'Images to PDF', desc: 'Convert JPG / PNG images into a PDF document.',
    icon: ICON('<rect x="3" y="5" width="12" height="12" rx="2"/><circle cx="7.6" cy="9.4" r="1.4"/><path d="M3.5 14.5l3.5-3.5 2.5 2.5 2-2 3 3"/>') },
  { id: 'pdf2img', title: 'PDF to Images', desc: 'Export each page as PNG / JPEG, up to 600 DPI.',
    icon: ICON('<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><rect x="9" y="13" width="8" height="6" rx="1"/>') },
  { id: 'protect', title: 'Protect PDF', desc: 'Add a password (128-bit RC4, opens in any reader).',
    icon: ICON('<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>') },
  { id: 'unlock', title: 'Unlock PDF', desc: 'Remove password protection with the correct password.',
    icon: ICON('<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 7.8-1.3"/>') },
  { id: 'watermark', title: 'Watermark', desc: 'Stamp semi-transparent text across pages.',
    icon: ICON('<path d="M12 3s6 6.6 6 11a6 6 0 0 1-12 0c0-4.4 6-11 6-11z"/>') },
  { id: 'pagenum', title: 'Page Numbers', desc: 'Add "1 / 10" style page numbers anywhere.',
    icon: ICON('<path d="M8 6h13M8 12h13M8 18h13"/><path d="M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>') },
  { id: 'metadata', title: 'Metadata', desc: 'View and edit title, author, subject, keywords.',
    icon: ICON('<path d="M3.5 3.5H11l10 10-7.5 7.5-10-10z"/><circle cx="8" cy="8" r="1.6"/>') },
];

/* ================= router ================= */
function showHub() {
  $('#view-hub').hidden = false;
  $('#view-tool').hidden = true;
  const grid = $('#tool-grid');
  grid.innerHTML = '';
  TOOLS.forEach(tool => {
    const card = el(`<a class="tool-card" href="#/${tool.id}">
      <div class="ic">${tool.icon}</div>
      <div><h3>${esc(t('tool.' + tool.id + '.t'))}</h3><p>${esc(t('tool.' + tool.id + '.d'))}</p></div>
    </a>`);
    grid.appendChild(card);
  });
}
async function showTool(tool) {
  $('#view-hub').hidden = true;
  $('#view-tool').hidden = false;
  $('#tool-icon').innerHTML = tool.icon.replace('width="24" height="24"', 'width="30" height="30"');
  $('#tool-title').textContent = t('tool.' + tool.id + '.t');
  $('#tool-desc').textContent = t('tool.' + tool.id + '.d');
  const body = $('#tool-body');
  body.innerHTML = `<div class="status-line">${esc(t('tool.loading'))}</div>`;
  window.scrollTo(0, 0);
  try { await tool.render(body); }
  catch (e) { showAlert(body, t('tool.loadfail', { msg: e.message }), 'err'); }
}
function router() {
  const m = (location.hash || '').match(/^#\/([a-z0-9-]+)/);
  const tool = m && TOOLS.find(x => x.id === m[1]);
  if (tool) showTool(tool); else showHub();
}

/* ================= MERGE ================= */
TOOLS.find(t => t.id === 'merge').render = async function (body) {
  const files = [];
  body.innerHTML = `
    <div class="panel"><h3>${esc(t('c.add_pdfs'))}</h3><div id="dz"></div><div id="fl"></div></div>
    <div class="panel"><h3>${esc(t('merge.step2'))}</h3>
      <div id="status"></div><div id="prog"></div>
      <div class="btn-row"><button class="btn" id="go" disabled>${esc(t('merge.go'))}</button></div>
      <div id="result"></div>
    </div>`;
  const status = $('#status', body), progBox = $('#prog', body), result = $('#result', body);
  const go = $('#go', body);
  const dz = dropZone({ accept: '.pdf,application/pdf', hint: t('c.hint_pdf') });
  $('#dz', body).appendChild(dz);
  async function refreshMeta() {
    for (const f of files) {
      if (f._meta) continue;
      try { const d = await loadPdfDoc(await readU8(f)); f._meta = t('c.pages', { n: d.getPageCount() }); }
      catch (e) { f._meta = t('c.unreadable'); f._err = e.message; }
    }
    list.render();
    go.disabled = files.filter(f => !f._err).length < 1;
  }
  const list = fileList($('#fl', body), () => files, () => { go.disabled = files.filter(f => !f._err).length < 1; }, i => esc(files[i]._meta || '…'));
  dz.onfiles = (fs) => { fs.forEach(f => { if (/\.pdf$/i.test(f.name) || f.type === 'application/pdf') files.push(f); }); refreshMeta(); };
  const prog = progressBar(progBox);
  go.onclick = async () => {
    setStatus(status, ''); result.innerHTML = ''; prog.show();
    try {
      const valid = files.filter(f => !f._err);
      const out = await PDFLib.PDFDocument.create();
      let done = 0;
      for (const f of valid) {
        setStatus(status, t('merge.processing', { name: f.name }));
        const src = await loadPdfDoc(await readU8(f));
        const pages = await out.copyPages(src, src.getPageIndices());
        pages.forEach(p => out.addPage(p));
        done++; prog.set(done / valid.length * 0.9);
      }
      setStatus(status, t('merge.saving')); prog.set(0.95);
      const bytes = await out.save();
      prog.set(1);
      setStatus(status, t('merge.done', { n: out.getPageCount(), size: fmtBytes(bytes.length) }), 'ok');
      result.innerHTML = `<div class="result-list"><div class="result-row">
        <span class="fname">merged.pdf</span><span class="fmeta">${fmtBytes(bytes.length)}</span>
        <button class="btn secondary" id="dl">${esc(t('c.download'))}</button></div></div>`;
      $('#dl', result).onclick = () => downloadBytes(bytes, 'merged.pdf', 'application/pdf');
    } catch (e) { showAlert(status, e.message, 'err'); }
    prog.hide();
  };
};

/* ================= SPLIT ================= */
function parseRanges(input, pageCount) {
  // "1-3, 5, 8-10" -> [{label, indices}]
  const parts = input.split(',').map(s => s.trim()).filter(Boolean);
  if (!parts.length) throw new Error(t('split.err_empty'));
  const out = [];
  for (const part of parts) {
    const m = part.match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!m) throw new Error(t('split.err_invalid', { p: part }));
    let a = parseInt(m[1], 10), b = m[2] ? parseInt(m[2], 10) : a;
    if (a > b) [a, b] = [b, a];
    if (a < 1 || b > pageCount) throw new Error(t('split.err_outside', { p: part, n: pageCount }));
    const indices = [];
    for (let p = a; p <= b; p++) indices.push(p - 1);
    out.push({ label: a === b ? `page-${a}` : `pages-${a}-${b}`, indices });
  }
  return out;
}
TOOLS.find(t => t.id === 'split').render = async function (body) {
  let file = null, pageCount = 0;
  body.innerHTML = `
    <div class="panel"><h3>${esc(t('c.choose_pdf'))}</h3><div id="dz"></div><div id="finfo"></div></div>
    <div class="panel"><h3>${esc(t('split.step2'))}</h3>
      <div class="field"><div class="radio-row">
        <label><input type="radio" name="smode" value="ranges" checked> ${esc(t('split.mode_ranges'))}</label>
        <label><input type="radio" name="smode" value="every"> ${esc(t('split.mode_every'))}</label>
      </div></div>
      <div class="field" id="ranges-f"><label>${esc(t('split.ranges_label'))}</label>
        <input type="text" id="ranges" placeholder="1-3, 4-6"><div class="hint">${esc(t('split.ranges_hint'))}</div></div>
      <div class="field" id="every-f" hidden><label>${esc(t('split.every_label'))}</label>
        <input type="number" id="everyn" value="1" min="1" style="max-width:160px"></div>
      <div id="status"></div><div id="prog"></div>
      <div class="btn-row"><button class="btn" id="go" disabled>${esc(t('split.go'))}</button></div>
      <div id="result"></div>
    </div>`;
  const status = $('#status', body), result = $('#result', body), go = $('#go', body);
  const dz = dropZone({ accept: '.pdf,application/pdf', multiple: false, hint: t('c.hint_one') });
  $('#dz', body).appendChild(dz);
  dz.onfiles = async (fs) => {
    file = fs[0]; setStatus(status, ''); result.innerHTML = '';
    try {
      const doc = await loadPdfDoc(await readU8(file));
      pageCount = doc.getPageCount();
      $('#finfo', body).innerHTML = `<div class="status-line ok">${t('c.finfo', { name: esc(file.name), n: pageCount })}</div>`;
      go.disabled = false;
    } catch (e) { showAlert($('#finfo', body), e.message, 'err'); go.disabled = true; }
  };
  $$('input[name=smode]', body).forEach(r => r.addEventListener('change', () => {
    const v = $('input[name=smode]:checked', body).value;
    $('#ranges-f', body).hidden = v !== 'ranges';
    $('#every-f', body).hidden = v !== 'every';
  }));
  const prog = progressBar($('#prog', body));
  go.onclick = async () => {
    setStatus(status, ''); result.innerHTML = ''; prog.show();
    try {
      const mode = $('input[name=smode]:checked', body).value;
      let groups;
      if (mode === 'ranges') groups = parseRanges($('#ranges', body).value, pageCount);
      else {
        const n = Math.max(1, parseInt($('#everyn', body).value, 10) || 1);
        groups = [];
        for (let s = 0; s < pageCount; s += n) {
          const idx = []; for (let p = s; p < Math.min(s + n, pageCount); p++) idx.push(p);
          groups.push({ label: `pages-${s + 1}-${s + idx.length}`, indices: idx });
        }
      }
      const src = await loadPdfDoc(await readU8(file));
      const items = [];
      let i = 0;
      for (const g of groups) {
        const out = await PDFLib.PDFDocument.create();
        (await out.copyPages(src, g.indices)).forEach(p => out.addPage(p));
        const bytes = await out.save();
        items.push({ bytes, name: `${file.name.replace(/\.pdf$/i, '')}-${g.label}.pdf`, mime: 'application/pdf' });
        i++; prog.set(i / groups.length);
        setStatus(status, t('split.created', { i: i, n: groups.length }));
      }
      setStatus(status, t('split.done', { n: groups.length }), 'ok');
      result.innerHTML = `<div class="result-list">` + items.map((it, k) =>
        `<div class="result-row"><span class="fname">${esc(it.name)}</span><span class="fmeta">${fmtBytes(it.bytes.length)}</span>
         <button class="btn secondary" data-k="${k}">${esc(t('c.download'))}</button></div>`).join('') +
        `</div><div class="btn-row"><button class="btn" id="dlall">${esc(t('c.download_all'))}</button></div>`;
      $$('#result [data-k]', body).forEach(b => b.onclick = () => { const it = items[+b.dataset.k]; downloadBytes(it.bytes, it.name, it.mime); });
      $('#dlall', result).onclick = () => downloadSequential(items);
    } catch (e) { showAlert(status, e.message, 'err'); }
    prog.hide();
  };
};

/* ================= EXTRACT / DELETE PAGES ================= */
TOOLS.find(t => t.id === 'extract').render = async function (body) {
  let file = null, pdfjsDoc = null;
  const selected = new Set();
  body.innerHTML = `
    <div class="panel"><h3>${esc(t('c.choose_pdf'))}</h3><div id="dz"></div></div>
    <div class="panel" id="p2" hidden><h3>${esc(t('extract.step2'))}</h3>
      <div class="field"><div class="radio-row">
        <label><input type="radio" name="emode" value="keep" checked> ${esc(t('extract.keep'))}</label>
        <label><input type="radio" name="emode" value="delete"> ${esc(t('extract.delete'))}</label>
      </div></div>
      <div class="btn-row" style="margin:0 0 6px">
        <button class="btn secondary" id="selall">${esc(t('c.select_all'))}</button>
        <button class="btn secondary" id="selnone">${esc(t('c.clear'))}</button>
      </div>
      <div id="thumbs"></div>
      <div id="status"></div><div id="prog"></div>
      <div class="btn-row"><button class="btn" id="go">${esc(t('extract.apply'))}</button></div>
      <div id="result"></div>
    </div>`;
  const status = $('#status', body), result = $('#result', body), thumbs = $('#thumbs', body);
  const dz = dropZone({ accept: '.pdf,application/pdf', multiple: false, hint: t('c.hint_one') });
  $('#dz', body).appendChild(dz);
  dz.onfiles = async (fs) => {
    file = fs[0]; selected.clear(); setStatus(status, ''); result.innerHTML = '';
    try {
      await loadPdfDoc(await readU8(file)); // validates (rejects encrypted)
      pdfjsDoc = await openWithPdfJs(await readU8(file));
      $('#p2', body).hidden = false;
      await thumbGrid(thumbs, pdfjsDoc, { mode: 'select', selected });
    } catch (e) { showAlert(body, e.message, 'err'); }
  };
  $('#selall', body).onclick = async () => { for (let p = 1; p <= pdfjsDoc.numPages; p++) selected.add(p); await thumbGrid(thumbs, pdfjsDoc, { mode: 'select', selected }); };
  $('#selnone', body).onclick = async () => { selected.clear(); await thumbGrid(thumbs, pdfjsDoc, { mode: 'select', selected }); };
  const prog = progressBar($('#prog', body));
  $('#go', body).onclick = async () => {
    setStatus(status, ''); result.innerHTML = '';
    try {
      const mode = $('input[name=emode]:checked', body).value;
      const n = pdfjsDoc.numPages;
      let keep;
      if (mode === 'keep') keep = [...selected].sort((a, b) => a - b);
      else keep = Array.from({ length: n }, (_, i) => i + 1).filter(p => !selected.has(p));
      if (!keep.length) throw new Error(mode === 'keep' ? t('extract.err_keep') : t('extract.err_del'));
      prog.show();
      const src = await loadPdfDoc(await readU8(file));
      const out = await PDFLib.PDFDocument.create();
      (await out.copyPages(src, keep.map(p => p - 1))).forEach(p => out.addPage(p));
      const bytes = await out.save(); prog.hide();
      setStatus(status, t('extract.done', { n: keep.length }), 'ok');
      const name = `${file.name.replace(/\.pdf$/i, '')}-extracted.pdf`;
      result.innerHTML = `<div class="result-list"><div class="result-row">
        <span class="fname">${esc(name)}</span><span class="fmeta">${fmtBytes(bytes.length)}</span>
        <button class="btn secondary" id="dl">${esc(t('c.download'))}</button></div></div>`;
      $('#dl', result).onclick = () => downloadBytes(bytes, name, 'application/pdf');
    } catch (e) { prog.hide(); showAlert(status, e.message, 'err'); }
  };
};

/* ================= ROTATE ================= */
TOOLS.find(t => t.id === 'rotate').render = async function (body) {
  let file = null, pdfjsDoc = null;
  const selected = new Set();
  const pending = new Map(); // pageNum -> degrees to add
  body.innerHTML = `
    <div class="panel"><h3>${esc(t('c.choose_pdf'))}</h3><div id="dz"></div></div>
    <div class="panel" id="p2" hidden><h3>${esc(t('rotate.step2'))}</h3>
      <div class="btn-row" style="margin:0 0 6px">
        <button class="btn secondary" id="selall">${esc(t('c.select_all'))}</button>
        <button class="btn secondary" id="selnone">${esc(t('c.clear'))}</button>
      </div>
      <div id="thumbs"></div>
      <div class="field"><label>${esc(t('rotate.label'))}</label>
        <div class="btn-row" style="margin-top:0">
          <button class="btn secondary" data-deg="90">${esc(t('rotate.b90'))}</button>
          <button class="btn secondary" data-deg="180">${esc(t('rotate.b180'))}</button>
          <button class="btn secondary" data-deg="270">${esc(t('rotate.b270'))}</button>
        </div>
        <div class="hint">${esc(t('rotate.hint'))}</div>
      </div>
      <div id="status"></div><div id="prog"></div>
      <div class="btn-row"><button class="btn" id="go">${esc(t('rotate.go'))}</button></div>
      <div id="result"></div>
    </div>`;
  const status = $('#status', body), result = $('#result', body), thumbs = $('#thumbs', body);
  const dz = dropZone({ accept: '.pdf,application/pdf', multiple: false, hint: t('c.hint_one') });
  $('#dz', body).appendChild(dz);
  async function drawGrid() { await thumbGrid(thumbs, pdfjsDoc, { mode: 'select', selected }); paintBadges(); }
  function paintBadges() {
    $$('.thumb-card', thumbs).forEach(c => {
      const p = +c.dataset.p, old = c.querySelector('.rot-badge');
      if (old) old.remove();
      const d = pending.get(p);
      if (d) c.appendChild(el(`<span class="rot-badge">${d}°</span>`));
    });
  }
  dz.onfiles = async (fs) => {
    file = fs[0]; selected.clear(); pending.clear(); setStatus(status, ''); result.innerHTML = '';
    try {
      await loadPdfDoc(await readU8(file));
      pdfjsDoc = await openWithPdfJs(await readU8(file));
      $('#p2', body).hidden = false;
      await drawGrid();
    } catch (e) { showAlert(body, e.message, 'err'); }
  };
  $('#selall', body).onclick = async () => { for (let p = 1; p <= pdfjsDoc.numPages; p++) selected.add(p); await drawGrid(); };
  $('#selnone', body).onclick = async () => { selected.clear(); await drawGrid(); };
  $$('[data-deg]', body).forEach(b => b.onclick = () => {
    if (!selected.size) { toast(t('rotate.toast')); return; }
    const d = +b.dataset.deg;
    selected.forEach(p => pending.set(p, ((pending.get(p) || 0) + d) % 360));
    paintBadges();
  });
  const prog = progressBar($('#prog', body));
  $('#go', body).onclick = async () => {
    setStatus(status, ''); result.innerHTML = '';
    try {
      if (![...pending.values()].some(v => v)) throw new Error(t('rotate.err_none'));
      prog.show();
      const src = await loadPdfDoc(await readU8(file));
      const out = await PDFLib.PDFDocument.create();
      const pages = await out.copyPages(src, src.getPageIndices());
      pages.forEach((p, i) => {
        const add = pending.get(i + 1) || 0;
        if (add) p.setRotation(PDFLib.degrees((p.getRotation().angle + add) % 360));
        out.addPage(p);
      });
      const bytes = await out.save(); prog.hide();
      setStatus(status, t('rotate.done'), 'ok');
      const name = `${file.name.replace(/\.pdf$/i, '')}-rotated.pdf`;
      result.innerHTML = `<div class="result-list"><div class="result-row">
        <span class="fname">${esc(name)}</span><span class="fmeta">${fmtBytes(bytes.length)}</span>
        <button class="btn secondary" id="dl">${esc(t('c.download'))}</button></div></div>`;
      $('#dl', result).onclick = () => downloadBytes(bytes, name, 'application/pdf');
    } catch (e) { prog.hide(); showAlert(status, e.message, 'err'); }
  };
};

/* ================= REORDER ================= */
TOOLS.find(t => t.id === 'reorder').render = async function (body) {
  let file = null, pdfjsDoc = null, order = [];
  body.innerHTML = `
    <div class="panel"><h3>${esc(t('c.choose_pdf'))}</h3><div id="dz"></div></div>
    <div class="panel" id="p2" hidden><h3>${esc(t('reorder.step2'))}</h3>
      <div id="thumbs"></div>
      <div id="status"></div><div id="prog"></div>
      <div class="btn-row"><button class="btn" id="go">${esc(t('reorder.go'))}</button></div>
      <div id="result"></div>
    </div>`;
  const status = $('#status', body), result = $('#result', body), thumbs = $('#thumbs', body);
  const dz = dropZone({ accept: '.pdf,application/pdf', multiple: false, hint: t('c.hint_one') });
  $('#dz', body).appendChild(dz);
  dz.onfiles = async (fs) => {
    file = fs[0]; setStatus(status, ''); result.innerHTML = '';
    try {
      await loadPdfDoc(await readU8(file));
      pdfjsDoc = await openWithPdfJs(await readU8(file));
      $('#p2', body).hidden = false;
      const g = await thumbGrid(thumbs, pdfjsDoc, { mode: 'drag', onChange: (o) => { order = o; } });
      order = g.order;
    } catch (e) { showAlert(body, e.message, 'err'); }
  };
  const prog = progressBar($('#prog', body));
  $('#go', body).onclick = async () => {
    setStatus(status, ''); result.innerHTML = '';
    try {
      prog.show();
      const src = await loadPdfDoc(await readU8(file));
      const out = await PDFLib.PDFDocument.create();
      (await out.copyPages(src, order.map(p => p - 1))).forEach(p => out.addPage(p));
      const bytes = await out.save(); prog.hide();
      setStatus(status, t('reorder.done'), 'ok');
      const name = `${file.name.replace(/\.pdf$/i, '')}-reordered.pdf`;
      result.innerHTML = `<div class="result-list"><div class="result-row">
        <span class="fname">${esc(name)}</span><span class="fmeta">${fmtBytes(bytes.length)}</span>
        <button class="btn secondary" id="dl">${esc(t('c.download'))}</button></div></div>`;
      $('#dl', result).onclick = () => downloadBytes(bytes, name, 'application/pdf');
    } catch (e) { prog.hide(); showAlert(status, e.message, 'err'); }
  };
};

/* ================= PDF TO SINGLE PAGE =================
   Joins ALL pages into ONE long page, stacked vertically.
   Vector-safe: pages are embedded with embedPage()/drawPage() — never rasterized,
   drawn back-to-back so no seams are visible. */
TOOLS.find(t => t.id === 'singlepage').render = async function (body) {
  let file = null, pageCount = 0;
  body.innerHTML = `
    <div class="panel"><h3>${esc(t('c.choose_pdf'))}</h3><div id="dz"></div><div id="finfo"></div></div>
    <div class="panel"><h3>${esc(t('sp.step2'))}</h3>
      ${fieldRow(`
      <div class="field"><label>${esc(t('sp.gap'))}</label>
        <input type="number" id="gap" value="0" min="0" max="200" style="max-width:160px">
        <div class="hint">${esc(t('sp.gap_hint'))}</div></div>
      <div class="field"><label>${esc(t('sp.align'))}</label>
        <select id="align"><option value="center" selected>${esc(t('sp.center'))}</option><option value="left">${esc(t('sp.left'))}</option></select></div>`)}
      <div class="alert info">${esc(t('sp.note'))}</div>
      <div id="status"></div><div id="prog"></div>
      <div class="btn-row"><button class="btn" id="go" disabled>${esc(t('sp.go'))}</button></div>
      <div id="result"></div>
    </div>`;
  const status = $('#status', body), result = $('#result', body), go = $('#go', body);
  const dz = dropZone({ accept: '.pdf,application/pdf', multiple: false, hint: t('c.hint_one') });
  $('#dz', body).appendChild(dz);
  dz.onfiles = async (fs) => {
    file = fs[0]; setStatus(status, ''); result.innerHTML = '';
    try {
      const doc = await loadPdfDoc(await readU8(file));
      pageCount = doc.getPageCount();
      $('#finfo', body).innerHTML = `<div class="status-line ok">${t('c.finfo', { name: esc(file.name), n: pageCount })}</div>`;
      go.disabled = false;
    } catch (e) { showAlert($('#finfo', body), e.message, 'err'); go.disabled = true; }
  };
  const prog = progressBar($('#prog', body));
  go.onclick = async () => {
    setStatus(status, ''); result.innerHTML = ''; prog.show();
    try {
      const gap = Math.max(0, parseFloat($('#gap', body).value) || 0);
      const align = $('#align', body).value;
      const src = await loadPdfDoc(await readU8(file));
      const pages = src.getPages();
      const sizes = pages.map(p => p.getSize());
      const maxW = Math.max(...sizes.map(s => s.width));
      const totalH = sizes.reduce((a, s) => a + s.height, 0) + gap * (pages.length - 1);
      if (totalH > 14400) {
        const cont = confirm(t('sp.confirm', { w: Math.round(maxW), h: Math.round(totalH) }));
        if (!cont) { prog.hide(); return; }
      }
      const out = await PDFLib.PDFDocument.create();
      const outPage = out.addPage([maxW, totalH]);
      let y = totalH;
      for (let i = 0; i < pages.length; i++) {
        setStatus(status, t('sp.embedding', { i: i + 1, n: pages.length }));
        prog.set(i / pages.length * 0.9);
        const emb = await out.embedPage(pages[i]);
        const { width, height } = sizes[i];
        y -= height;
        const x = align === 'center' ? (maxW - width) / 2 : 0;
        outPage.drawPage(emb, { x, y, width, height });
        y -= gap;
        await sleep(0);
      }
      const bytes = await out.save();
      prog.set(1); prog.hide();
      setStatus(status, t('sp.done', { w: Math.round(maxW), h: Math.round(totalH), size: fmtBytes(bytes.length) }), 'ok');
      const name = `${file.name.replace(/\.pdf$/i, '')}-single-page.pdf`;
      result.innerHTML = `<div class="result-list"><div class="result-row">
        <span class="fname">${esc(name)}</span><span class="fmeta">${fmtBytes(bytes.length)}</span>
        <button class="btn secondary" id="dl">${esc(t('c.download'))}</button></div></div>`;
      $('#dl', result).onclick = () => downloadBytes(bytes, name, 'application/pdf');
    } catch (e) { prog.hide(); showAlert(status, e.message, 'err'); }
  };
};

/* ================= COMPRESS ================= */
TOOLS.find(t => t.id === 'compress').render = async function (body) {
  let file = null, origBytes = null;
  body.innerHTML = `
    <div class="panel"><h3>${esc(t('c.choose_pdf'))}</h3><div id="dz"></div><div id="finfo"></div></div>
    <div class="panel"><h3>${esc(t('compress.step2'))}</h3>
      <div class="field"><div class="radio-row">
        <label><input type="radio" name="cmode" value="optimize" checked> ${esc(t('compress.opt'))}</label>
        <label><input type="radio" name="cmode" value="raster"> ${esc(t('compress.raster'))}</label>
      </div>
      <div class="hint">${esc(t('compress.hint'))}</div></div>
      <div id="raster-opts" hidden>
        ${fieldRow(`
        <div class="field"><label>${esc(t('compress.dpi'))}</label>
          <select id="dpi"><option value="72">${esc(t('compress.dpi72'))}</option><option value="110" selected>${esc(t('compress.dpi110'))}</option><option value="150">${esc(t('compress.dpi150'))}</option></select></div>
        <div class="field"><label>${t('compress.q', { v: '<span id="qv">80</span>' })}</label>
          <input type="range" id="quality" min="10" max="95" value="80"></div>`)}
      </div>
      <div id="status"></div><div id="prog"></div>
      <div class="btn-row"><button class="btn" id="go" disabled>${esc(t('compress.go'))}</button></div>
      <div id="result"></div>
    </div>`;
  const status = $('#status', body), result = $('#result', body), go = $('#go', body);
  const dz = dropZone({ accept: '.pdf,application/pdf', multiple: false, hint: t('c.hint_one') });
  $('#dz', body).appendChild(dz);
  dz.onfiles = async (fs) => {
    file = fs[0]; setStatus(status, ''); result.innerHTML = '';
    try {
      origBytes = await readU8(file);
      const doc = await loadPdfDoc(origBytes);
      $('#finfo', body).innerHTML = `<div class="status-line ok">${t('c.finfo_size', { name: esc(file.name), n: doc.getPageCount(), size: fmtBytes(origBytes.length) })}</div>`;
      go.disabled = false;
    } catch (e) { showAlert($('#finfo', body), e.message, 'err'); go.disabled = true; }
  };
  $$('input[name=cmode]', body).forEach(r => r.addEventListener('change', () => {
    $('#raster-opts', body).hidden = $('input[name=cmode]:checked', body).value !== 'raster';
  }));
  $('#quality', body).addEventListener('input', e => $('#qv', body).textContent = e.target.value);
  const prog = progressBar($('#prog', body));
  go.onclick = async () => {
    setStatus(status, ''); result.innerHTML = ''; prog.show();
    try {
      const mode = $('input[name=cmode]:checked', body).value;
      let bytes;
      if (mode === 'optimize') {
        setStatus(status, t('compress.optimizing'));
        const doc = await loadPdfDoc(origBytes);
        doc.setTitle(''); doc.setAuthor(''); doc.setSubject(''); doc.setKeywords([]); doc.setProducer(''); doc.setCreator('');
        bytes = await doc.save({ useObjectStreams: true });
      } else {
        const dpi = parseInt($('#dpi', body).value, 10);
        const q = parseInt($('#quality', body).value, 10) / 100;
        const pdfjsDoc = await openWithPdfJs(origBytes);
        const out = await PDFLib.PDFDocument.create();
        const n = pdfjsDoc.numPages;
        for (let p = 1; p <= n; p++) {
          setStatus(status, t('compress.rendering', { p: p, n: n })); prog.set(p / n * 0.9);
          const page = await pdfjsDoc.getPage(p);
          const vp = page.getViewport({ scale: dpi / 72 });
          const canvas = document.createElement('canvas');
          canvas.width = Math.ceil(vp.width); canvas.height = Math.ceil(vp.height);
          await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
          const blob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', q));
          const jpg = await out.embedJpg(new Uint8Array(await blob.arrayBuffer()));
          const pg = out.addPage([canvas.width, canvas.height]);
          pg.drawImage(jpg, { x: 0, y: 0, width: canvas.width, height: canvas.height });
          await sleep(0);
        }
      }
      prog.set(1); prog.hide();
      const ratio = (1 - bytes.length / origBytes.length) * 100;
      const msg = ratio >= 0
        ? t('compress.done_shrink', { a: fmtBytes(origBytes.length), b: fmtBytes(bytes.length), r: ratio.toFixed(1) })
        : t('compress.done_noshrink', { b: fmtBytes(bytes.length) });
      setStatus(status, msg + (mode === 'raster' ? t('compress.note_raster') : t('compress.note_lossless')), 'ok');
      const name = `${file.name.replace(/\.pdf$/i, '')}-compressed.pdf`;
      result.innerHTML = `<div class="result-list"><div class="result-row">
        <span class="fname">${esc(name)}</span><span class="fmeta">${fmtBytes(bytes.length)}</span>
        <button class="btn secondary" id="dl">${esc(t('c.download'))}</button></div></div>`;
      $('#dl', result).onclick = () => downloadBytes(bytes, name, 'application/pdf');
    } catch (e) { prog.hide(); showAlert(status, e.message, 'err'); }
  };
};

/* ================= IMAGES TO PDF ================= */
async function imageFileToPngU8(file) {
  // decode any image/* via <img>, return PNG bytes
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = url; });
    const c = document.createElement('canvas');
    c.width = img.naturalWidth; c.height = img.naturalHeight;
    c.getContext('2d').drawImage(img, 0, 0);
    const blob = await new Promise(r => c.toBlob(r, 'image/png'));
    return new Uint8Array(await blob.arrayBuffer());
  } finally { URL.revokeObjectURL(url); }
}
TOOLS.find(t => t.id === 'img2pdf').render = async function (body) {
  const files = [];
  body.innerHTML = `
    <div class="panel"><h3>${esc(t('c.add_images'))}</h3><div id="dz"></div><div id="fl"></div></div>
    <div class="panel"><h3>${esc(t('img2pdf.step2'))}</h3>
      <div class="field"><label>${esc(t('img2pdf.psize'))}</label>
        <select id="psize" style="max-width:280px">
          <option value="fit" selected>${esc(t('img2pdf.fit'))}</option>
          <option value="a4p">${esc(t('img2pdf.a4p'))}</option>
          <option value="a4l">${esc(t('img2pdf.a4l'))}</option>
        </select></div>
      <div id="status"></div><div id="prog"></div>
      <div class="btn-row"><button class="btn" id="go" disabled>${esc(t('img2pdf.go'))}</button></div>
      <div id="result"></div>
    </div>`;
  const status = $('#status', body), result = $('#result', body), go = $('#go', body);
  const dz = dropZone({ accept: 'image/*', hint: t('c.hint_img') });
  $('#dz', body).appendChild(dz);
  const list = fileList($('#fl', body), () => files, () => { go.disabled = !files.length; }, i => esc(files[i]._meta || ''));
  dz.onfiles = async (fs) => {
    for (const f of fs) {
      if (!f.type.startsWith('image/')) continue;
      f._meta = '…'; files.push(f);
      const idx = files.length - 1;
      try {
        const u8 = await readU8(f);
        const isJpg = f.type === 'image/jpeg' || /^\xff\xd8/.test(String.fromCharCode(u8[0], u8[1]));
        if (isJpg || f.type === 'image/png') {
          const tmp = await PDFLib.PDFDocument.create();
          const im = isJpg ? await tmp.embedJpg(u8) : await tmp.embedPng(u8);
          f._im = { bytes: u8, w: im.width, h: im.height, jpg: isJpg };
        } else {
          const png = await imageFileToPngU8(f);
          const tmp = await PDFLib.PDFDocument.create();
          const im = await tmp.embedPng(png);
          f._im = { bytes: png, w: im.width, h: im.height, jpg: false };
        }
        f._meta = `${f._im.w}×${f._im.h}px`;
      } catch (e) { f._meta = t('c.unreadable'); f._err = true; }
      list.render();
    }
    go.disabled = !files.filter(f => !f._err).length;
  };
  const prog = progressBar($('#prog', body));
  go.onclick = async () => {
    setStatus(status, ''); result.innerHTML = ''; prog.show();
    try {
      const mode = $('#psize', body).value;
      const A4 = { p: [595.28, 841.89], l: [841.89, 595.28] };
      const out = await PDFLib.PDFDocument.create();
      const valid = files.filter(f => !f._err);
      let i = 0;
      for (const f of valid) {
        setStatus(status, t('img2pdf.adding', { name: f.name, i: ++i, n: valid.length }));
        const { bytes, w, h, jpg } = f._im;
        const im = jpg ? await out.embedJpg(bytes) : await out.embedPng(bytes);
        let pw, ph, dw, dh;
        if (mode === 'fit') { pw = w; ph = h; dw = w; dh = h; }
        else {
          [pw, ph] = mode === 'a4p' ? A4.p : A4.l;
          const s = Math.min(pw / w, ph / h);
          dw = w * s; dh = h * s;
        }
        const page = out.addPage([pw, ph]);
        page.drawImage(im, { x: (pw - dw) / 2, y: (ph - dh) / 2, width: dw, height: dh });
        prog.set(i / valid.length);
        await sleep(0);
      }
      const bytes = await out.save(); prog.hide();
      setStatus(status, t('img2pdf.done', { n: valid.length, size: fmtBytes(bytes.length) }), 'ok');
      result.innerHTML = `<div class="result-list"><div class="result-row">
        <span class="fname">images.pdf</span><span class="fmeta">${fmtBytes(bytes.length)}</span>
        <button class="btn secondary" id="dl">${esc(t('c.download'))}</button></div></div>`;
      $('#dl', result).onclick = () => downloadBytes(bytes, 'images.pdf', 'application/pdf');
    } catch (e) { prog.hide(); showAlert(status, e.message, 'err'); }
  };
};

/* ================= PDF TO IMAGES =================
   Honest DPI limits: browsers cap canvas at ~16384 px per side and tabs run out
   of memory long before absurd DPIs. 100000 DPI on A4 would need ~3.8 TB RAM —
   physically impossible. We cap at 600 DPI with a RAM guard. */
const PDF2IMG = { MAX_DPI: 600, MAX_DIM: 16384, MAX_RAM: 1.5 * 1024 * 1024 * 1024 };
function checkDpiLimits(wPt, hPt, dpi) {
  const wPx = Math.ceil(wPt * dpi / 72), hPx = Math.ceil(hPt * dpi / 72);
  const ram = wPx * hPx * 4;
  if (!isFinite(dpi) || dpi < 36 || dpi > 1000000)
    return { ok: false, wPx, hPx, ram, error: t('pdf2img.err_range') };
  if (dpi > PDF2IMG.MAX_DPI)
    return { ok: false, wPx, hPx, ram, error: t('pdf2img.err_cap', { max: PDF2IMG.MAX_DPI, dim: PDF2IMG.MAX_DIM.toLocaleString() }) };
  if (wPx > PDF2IMG.MAX_DIM || hPx > PDF2IMG.MAX_DIM)
    return { ok: false, wPx, hPx, ram, error: t('pdf2img.err_dim', { w: wPx.toLocaleString(), h: hPx.toLocaleString(), dim: PDF2IMG.MAX_DIM.toLocaleString() }) };
  if (ram > PDF2IMG.MAX_RAM)
    return { ok: false, wPx, hPx, ram, error: t('pdf2img.err_ram', { ram: fmtBytes(ram), maxram: fmtBytes(PDF2IMG.MAX_RAM) }) };
  return { ok: true, wPx, hPx, ram };
}
TOOLS.find(t => t.id === 'pdf2img').render = async function (body) {
  let file = null, pdfjsDoc = null, pageSize = null;
  body.innerHTML = `
    <div class="panel"><h3>${esc(t('c.choose_pdf'))}</h3><div id="dz"></div><div id="finfo"></div></div>
    <div class="panel"><h3>${esc(t('pdf2img.step2'))}</h3>
      ${fieldRow(`
      <div class="field"><label>${esc(t('pdf2img.format'))}</label>
        <select id="fmt"><option value="png">PNG</option><option value="jpeg">JPEG</option></select></div>
      <div class="field" id="q-f" hidden><label>${t('pdf2img.q', { v: '<span id="qv">90</span>' })}</label>
        <input type="range" id="quality" min="10" max="100" value="90"></div>`)}
      <div class="field"><label>${esc(t('pdf2img.dpi'))}</label>
        <div class="radio-row" id="dpi-radios">
          ${[72, 150, 300, 600].map(d => `<label><input type="radio" name="dpi" value="${d}" ${d === 300 ? 'checked' : ''}> ${d}</label>`).join('')}
          <label><input type="radio" name="dpi" value="custom"> ${esc(t('pdf2img.custom'))}</label>
          <input type="number" id="dpi-custom" value="600" min="36" max="600" style="width:90px">
        </div>
        <div class="hint" id="dpi-est"></div>
      </div>
      <div class="alert info">${t('pdf2img.note', { dim: PDF2IMG.MAX_DIM.toLocaleString(), max: PDF2IMG.MAX_DPI })}</div>
      <div id="status"></div><div id="prog"></div>
      <div class="btn-row"><button class="btn" id="go" disabled>${esc(t('pdf2img.go'))}</button></div>
      <div id="result"></div>
    </div>`;
  const status = $('#status', body), result = $('#result', body), go = $('#go', body);
  const dz = dropZone({ accept: '.pdf,application/pdf', multiple: false, hint: t('c.hint_one') });
  $('#dz', body).appendChild(dz);
  function currentDpi() {
    const v = $('input[name=dpi]:checked', body).value;
    return v === 'custom' ? parseInt($('#dpi-custom', body).value, 10) : parseInt(v, 10);
  }
  function updateEst() {
    const est = $('#dpi-est', body);
    if (!pageSize) { est.textContent = ''; return; }
    const dpi = currentDpi();
    const c = checkDpiLimits(pageSize.width, pageSize.height, dpi);
    if (!c.ok) { est.innerHTML = `<span style="color:var(--red)">${esc(c.error)}</span>`; go.disabled = true; }
    else {
      est.innerHTML = t('pdf2img.est', { w: c.wPx.toLocaleString(), h: c.hPx.toLocaleString(), ram: fmtBytes(c.ram) });
      go.disabled = false;
    }
  }
  dz.onfiles = async (fs) => {
    file = fs[0]; setStatus(status, ''); result.innerHTML = '';
    try {
      const u8 = await readU8(file);
      await loadPdfDoc(u8);
      pdfjsDoc = await openWithPdfJs(u8);
      const pg = await pdfjsDoc.getPage(1);
      const vp = pg.getViewport({ scale: 1 });
      pageSize = { width: vp.width, height: vp.height };
      $('#finfo', body).innerHTML = `<div class="status-line ok">${t('c.finfo', { name: esc(file.name), n: pdfjsDoc.numPages })}</div>`;
      updateEst();
    } catch (e) { showAlert($('#finfo', body), e.message, 'err'); go.disabled = true; }
  };
  $$('input[name=dpi]', body).forEach(r => r.addEventListener('change', updateEst));
  $('#dpi-custom', body).addEventListener('input', updateEst);
  $('#fmt', body).addEventListener('change', e => $('#q-f', body).hidden = e.target.value !== 'jpeg');
  $('#quality', body).addEventListener('input', e => $('#qv', body).textContent = e.target.value);
  const prog = progressBar($('#prog', body));
  go.onclick = async () => {
    setStatus(status, ''); result.innerHTML = '';
    const dpi = currentDpi();
    const c = checkDpiLimits(pageSize.width, pageSize.height, dpi);
    if (!c.ok) { showAlert(status, c.error, 'err'); return; }
    const fmt = $('#fmt', body).value;
    const q = parseInt($('#quality', body).value, 10) / 100;
    prog.show();
    try {
      const n = pdfjsDoc.numPages;
      const items = [];
      for (let p = 1; p <= n; p++) {
        setStatus(status, t('pdf2img.rendering', { p: p, n: n, dpi: dpi }));
        prog.set((p - 1) / n);
        const page = await pdfjsDoc.getPage(p);
        const vp = page.getViewport({ scale: dpi / 72 });
        const canvas = document.createElement('canvas');
        canvas.width = Math.ceil(vp.width); canvas.height = Math.ceil(vp.height);
        await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
        const blob = await new Promise(r => canvas.toBlob(r, fmt === 'png' ? 'image/png' : 'image/jpeg', q));
        const bytes = new Uint8Array(await blob.arrayBuffer());
        items.push({ bytes, name: `${file.name.replace(/\.pdf$/i, '')}-p${String(p).padStart(2, '0')}.${fmt === 'png' ? 'png' : 'jpg'}`,
          mime: fmt === 'png' ? 'image/png' : 'image/jpeg' });
        await sleep(0);
      }
      prog.set(1); prog.hide();
      setStatus(status, t('pdf2img.done', { n: n, dpi: dpi }), 'ok');
      result.innerHTML = `<div class="result-list">` + items.map((it, k) =>
        `<div class="result-row"><span class="fname">${esc(it.name)}</span><span class="fmeta">${fmtBytes(it.bytes.length)}</span>
         <button class="btn secondary" data-k="${k}">${esc(t('c.download'))}</button></div>`).join('') +
        `</div><div class="btn-row"><button class="btn" id="dlall">${esc(t('c.download_all'))}</button></div>`;
      $$('#result [data-k]', body).forEach(b => b.onclick = () => { const it = items[+b.dataset.k]; downloadBytes(it.bytes, it.name, it.mime); });
      $('#dlall', result).onclick = () => downloadSequential(items);
    } catch (e) { prog.hide(); showAlert(status, t('pdf2img.fail', { msg: e.message || e }), 'err'); }
  };
};

/* ================= PROTECT (password) =================
   Real PDF password protection: 128-bit RC4 (V=2/R=3), opens in Adobe Reader,
   Chrome, macOS Preview, etc. Implemented per ISO 32000, cross-validated. */
TOOLS.find(t => t.id === 'protect').render = async function (body) {
  let file = null, origBytes = null;
  body.innerHTML = `
    <div class="panel"><h3>${esc(t('c.protect_choose'))}</h3><div id="dz"></div><div id="finfo"></div></div>
    <div class="panel"><h3>${esc(t('protect.step2'))}</h3>
      ${fieldRow(`
      <div class="field"><label>${esc(t('protect.pw1'))}</label>
        <input type="password" id="pw1" autocomplete="new-password"><div class="hint">${esc(t('protect.pw1_hint'))}</div></div>
      <div class="field"><label>${esc(t('protect.pw2'))}</label>
        <input type="password" id="pw2" autocomplete="new-password"></div>`)}
      <div class="field"><label>${esc(t('protect.pwo'))}</label>
        <input type="password" id="pwo" autocomplete="new-password">
        <div class="hint">${esc(t('protect.pwo_hint'))}</div></div>
      <div class="alert info">${esc(t('protect.note'))}</div>
      <div id="status"></div><div id="prog"></div>
      <div class="btn-row"><button class="btn" id="go" disabled>${esc(t('protect.go'))}</button></div>
      <div id="result"></div>
    </div>`;
  const status = $('#status', body), result = $('#result', body), go = $('#go', body);
  const dz = dropZone({ accept: '.pdf,application/pdf', multiple: false, hint: t('c.hint_one') });
  $('#dz', body).appendChild(dz);
  dz.onfiles = async (fs) => {
    file = fs[0]; setStatus(status, ''); result.innerHTML = '';
    try {
      origBytes = await readU8(file);
      const doc = await loadPdfDoc(origBytes); // throws if already encrypted
      $('#finfo', body).innerHTML = `<div class="status-line ok">${t('c.finfo', { name: esc(file.name), n: doc.getPageCount() })}</div>`;
      go.disabled = false;
    } catch (e) { showAlert($('#finfo', body), e.message, 'err'); go.disabled = true; }
  };
  const prog = progressBar($('#prog', body));
  go.onclick = async () => {
    setStatus(status, ''); result.innerHTML = '';
    const pw1 = $('#pw1', body).value, pw2 = $('#pw2', body).value, pwo = $('#pwo', body).value;
    if (!pw1) { showAlert(status, t('protect.err_empty'), 'err'); return; }
    if (pw1 !== pw2) { showAlert(status, t('protect.err_mismatch'), 'err'); return; }
    if (/[^\x20-\x7E]/.test(pw1)) { showAlert(status, t('protect.warn_latin'), 'warn'); }
    prog.show();
    try {
      setStatus(status, t('protect.st_normal'));
      const doc = await loadPdfDoc(origBytes);
      const normalized = await doc.save({ useObjectStreams: false });
      setStatus(status, t('protect.st_enc')); prog.set(0.5);
      await sleep(10);
      const enc = PdfCrypto.encryptPdf(normalized, pw1, pwo);
      setStatus(status, t('protect.st_verify')); prog.set(0.8);
      const check = await openWithPdfJs(enc, pw1); // throws if broken
      const n = check.numPages; if (check.destroy) await check.destroy();
      prog.set(1); prog.hide();
      setStatus(status, t('protect.done', { n: n }), 'ok');
      const name = `${file.name.replace(/\.pdf$/i, '')}-protected.pdf`;
      result.innerHTML = `<div class="result-list"><div class="result-row">
        <span class="fname">${esc(name)}</span><span class="fmeta">${fmtBytes(enc.length)}</span>
        <button class="btn secondary" id="dl">${esc(t('c.download'))}</button></div></div>`;
      $('#dl', result).onclick = () => downloadBytes(enc, name, 'application/pdf');
    } catch (e) { prog.hide(); showAlert(status, t('protect.fail', { msg: e.message || e }), 'err'); }
  };
};

/* ================= UNLOCK =================
   Opens with the password via PDF.js (handles RC4 + AES), then rebuilds an
   unprotected PDF. Pages are rasterized at high quality — stated honestly. */
TOOLS.find(t => t.id === 'unlock').render = async function (body) {
  let file = null, fileBytes = null;
  body.innerHTML = `
    <div class="panel"><h3>${esc(t('c.choose_enc'))}</h3><div id="dz"></div><div id="finfo"></div></div>
    <div class="panel"><h3>${esc(t('unlock.step2'))}</h3>
      <div class="field"><label>${esc(t('unlock.pw'))}</label>
        <input type="password" id="pw" autocomplete="current-password" style="max-width:320px"></div>
      <div class="alert warn">${esc(t('unlock.note'))}</div>
      <div id="status"></div><div id="prog"></div>
      <div class="btn-row"><button class="btn" id="go" disabled>${esc(t('unlock.go'))}</button></div>
      <div id="result"></div>
    </div>`;
  const status = $('#status', body), result = $('#result', body), go = $('#go', body);
  const dz = dropZone({ accept: '.pdf,application/pdf', multiple: false, hint: t('c.hint_one') });
  $('#dz', body).appendChild(dz);
  dz.onfiles = async (fs) => {
    file = fs[0]; setStatus(status, ''); result.innerHTML = '';
    fileBytes = await readU8(file);
    if (window.PdfCrypto && !PdfCrypto.isEncrypted(fileBytes)) {
      showAlert($('#finfo', body), t('unlock.notenc'), 'warn');
      go.disabled = true; return;
    }
    $('#finfo', body).innerHTML = `<div class="status-line ok">${t('unlock.ready', { name: esc(file.name) })}</div>`;
    go.disabled = false;
  };
  const prog = progressBar($('#prog', body));
  go.onclick = async () => {
    setStatus(status, ''); result.innerHTML = '';
    const pw = $('#pw', body).value;
    if (!pw) { showAlert(status, t('unlock.err_empty'), 'err'); return; }
    prog.show();
    try {
      setStatus(status, t('unlock.st_dec'));
      const pdfjsDoc = await openWithPdfJs(fileBytes, pw);
      const out = await PDFLib.PDFDocument.create();
      const n = pdfjsDoc.numPages, SCALE = 2; // 144 DPI
      for (let p = 1; p <= n; p++) {
        setStatus(status, t('unlock.st_rebuild', { p: p, n: n })); prog.set(p / n * 0.9);
        const page = await pdfjsDoc.getPage(p);
        const vp = page.getViewport({ scale: SCALE });
        const canvas = document.createElement('canvas');
        canvas.width = Math.ceil(vp.width); canvas.height = Math.ceil(vp.height);
        await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
        const blob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', 0.92));
        const jpg = await out.embedJpg(new Uint8Array(await blob.arrayBuffer()));
        const pg = out.addPage([canvas.width, canvas.height]);
        pg.drawImage(jpg, { x: 0, y: 0, width: canvas.width, height: canvas.height });
        await sleep(0);
      }
      const bytes = await out.save(); prog.hide();
      setStatus(status, t('unlock.done', { n: n }), 'ok');
      const name = `${file.name.replace(/\.pdf$/i, '')}-unlocked.pdf`;
      result.innerHTML = `<div class="result-list"><div class="result-row">
        <span class="fname">${esc(name)}</span><span class="fmeta">${fmtBytes(bytes.length)}</span>
        <button class="btn secondary" id="dl">${esc(t('c.download'))}</button></div></div>`;
      $('#dl', result).onclick = () => downloadBytes(bytes, name, 'application/pdf');
    } catch (e) {
      prog.hide();
      showAlert(status, e.code === 'badpw' ? t('unlock.err_badpw') : (e.message || e), 'err');
    }
  };
};

/* ================= WATERMARK ================= */
TOOLS.find(t => t.id === 'watermark').render = async function (body) {
  let file = null, pageCount = 0;
  body.innerHTML = `
    <div class="panel"><h3>${esc(t('c.choose_pdf'))}</h3><div id="dz"></div><div id="finfo"></div></div>
    <div class="panel"><h3>${esc(t('wm.step2'))}</h3>
      ${fieldRow(`
      <div class="field"><label>${esc(t('wm.text'))}</label><input type="text" id="wm-text" value="${esc(t('wm.deftext'))}" maxlength="80"></div>
      <div class="field"><label>${esc(t('wm.size'))}</label><input type="number" id="wm-size" value="64" min="8" max="300"></div>`)}
      ${fieldRow(`
      <div class="field"><label>${esc(t('wm.color'))}</label><input type="color" id="wm-color" value="#808080"></div>
      <div class="field"><label>${t('wm.opacity', { v: '<span id="wm-ov">35</span>' })}</label>
        <input type="range" id="wm-opacity" min="5" max="100" value="35"></div>`)}
      ${fieldRow(`
      <div class="field"><label>${esc(t('wm.rot'))}</label><input type="number" id="wm-rot" value="45" min="-90" max="90"></div>
      <div class="field"><label>${esc(t('wm.layout'))}</label>
        <select id="wm-layout"><option value="center" selected>${esc(t('wm.center'))}</option><option value="tiled">${esc(t('wm.tiled'))}</option></select></div>`)}
      <div class="field"><label>${esc(t('wm.pages'))}</label>
        <input type="text" id="wm-pages" placeholder="${esc(t('wm.pages_ph'))}"></div>
      <div id="status"></div><div id="prog"></div>
      <div class="btn-row"><button class="btn" id="go" disabled>${esc(t('wm.go'))}</button></div>
      <div id="result"></div>
    </div>`;
  const status = $('#status', body), result = $('#result', body), go = $('#go', body);
  const dz = dropZone({ accept: '.pdf,application/pdf', multiple: false, hint: t('c.hint_one') });
  $('#dz', body).appendChild(dz);
  dz.onfiles = async (fs) => {
    file = fs[0]; setStatus(status, ''); result.innerHTML = '';
    try {
      const doc = await loadPdfDoc(await readU8(file));
      pageCount = doc.getPageCount();
      $('#finfo', body).innerHTML = `<div class="status-line ok">${t('c.finfo', { name: esc(file.name), n: pageCount })}</div>`;
      go.disabled = false;
    } catch (e) { showAlert($('#finfo', body), e.message, 'err'); go.disabled = true; }
  };
  $('#wm-opacity', body).addEventListener('input', e => $('#wm-ov', body).textContent = e.target.value);
  const prog = progressBar($('#prog', body));
  go.onclick = async () => {
    setStatus(status, ''); result.innerHTML = '';
    try {
      const text = $('#wm-text', body).value.trim();
      if (!text) throw new Error(t('wm.err_empty'));
      const size = Math.min(300, Math.max(8, parseInt($('#wm-size', body).value, 10) || 64));
      const color = hexToRgb01($('#wm-color', body).value);
      const opacity = (parseInt($('#wm-opacity', body).value, 10) || 35) / 100;
      const angle = parseFloat($('#wm-rot', body).value) || 0;
      const layout = $('#wm-layout', body).value;
      const pagesStr = $('#wm-pages', body).value.trim();
      const groups = pagesStr ? parseRanges(pagesStr, pageCount) : [{ indices: Array.from({ length: pageCount }, (_, i) => i) }];
      const target = [...new Set(groups.flatMap(g => g.indices))].sort((a, b) => a - b);
      prog.show();
      const doc = await loadPdfDoc(await readU8(file));
      const font = await doc.embedFont(PDFLib.StandardFonts.HelveticaBold);
      const rad = angle * Math.PI / 180, cos = Math.cos(rad), sin = Math.sin(rad);
      const rgb = PDFLib.rgb(color[0], color[1], color[2]);
      const tw = font.widthOfTextAtSize(text, size), th = size;
      let k = 0;
      for (const pi of target) {
        const page = doc.getPage(pi);
        const { width: w, height: h } = page.getSize();
        const spots = [];
        if (layout === 'center') {
          // center the rotated bounding box on the page
          spots.push({
            x: w / 2 - (tw / 2) * cos + (th / 2) * sin,
            y: h / 2 - (tw / 2) * sin - (th / 2) * cos,
          });
        } else {
          const stepX = tw * 0.9 + 60, stepY = th * 2.2 + 60;
          for (let gx = -th; gx < w + th; gx += stepX)
            for (let gy = 0; gy < h + th; gy += stepY)
              spots.push({ x: gx, y: gy });
        }
        for (const s of spots)
          page.drawText(text, { x: s.x, y: s.y, size, font, color: rgb, opacity, rotate: PDFLib.degrees(angle) });
        k++; prog.set(k / target.length * 0.9);
        if (k % 5 === 0) await sleep(0);
      }
      const bytes = await doc.save(); prog.hide();
      setStatus(status, t('wm.done', { n: target.length }), 'ok');
      const name = `${file.name.replace(/\.pdf$/i, '')}-watermarked.pdf`;
      result.innerHTML = `<div class="result-list"><div class="result-row">
        <span class="fname">${esc(name)}</span><span class="fmeta">${fmtBytes(bytes.length)}</span>
        <button class="btn secondary" id="dl">${esc(t('c.download'))}</button></div></div>`;
      $('#dl', result).onclick = () => downloadBytes(bytes, name, 'application/pdf');
    } catch (e) { prog.hide(); showAlert(status, e.message, 'err'); }
  };
};

/* ================= PAGE NUMBERS ================= */
TOOLS.find(t => t.id === 'pagenum').render = async function (body) {
  let file = null, pageCount = 0;
  body.innerHTML = `
    <div class="panel"><h3>${esc(t('c.choose_pdf'))}</h3><div id="dz"></div><div id="finfo"></div></div>
    <div class="panel"><h3>${esc(t('pn.step2'))}</h3>
      ${fieldRow(`
      <div class="field"><label>${esc(t('pn.pos'))}</label><select id="pn-pos">
        <option value="bc" selected>${esc(t('pn.bc'))}</option><option value="br">${esc(t('pn.br'))}</option>
        <option value="bl">${esc(t('pn.bl'))}</option><option value="tc">${esc(t('pn.tc'))}</option>
        <option value="tr">${esc(t('pn.tr'))}</option><option value="tl">${esc(t('pn.tl'))}</option></select></div>
      <div class="field"><label>${esc(t('pn.fmt'))}</label><select id="pn-fmt">
        <option value="n" selected>${esc(t('pn.opt_n'))}</option><option value="nN">${esc(t('pn.opt_nN'))}</option>
        <option value="pn">${esc(t('pn.opt_pn'))}</option><option value="pnN">${esc(t('pn.opt_pnN'))}</option></select></div>`)}
      ${fieldRow(`
      <div class="field"><label>${esc(t('pn.start'))}</label><input type="number" id="pn-start" value="1" min="1"></div>
      <div class="field"><label>${esc(t('pn.size'))}</label><input type="number" id="pn-size" value="11" min="6" max="72"></div>`)}
      ${fieldRow(`
      <div class="field"><label>${esc(t('pn.color'))}</label><input type="color" id="pn-color" value="#333333"></div>
      <div class="field"><label>${esc(t('pn.margin'))}</label><input type="number" id="pn-margin" value="36" min="0" max="200"></div>`)}
      <div id="status"></div><div id="prog"></div>
      <div class="btn-row"><button class="btn" id="go" disabled>${esc(t('pn.go'))}</button></div>
      <div id="result"></div>
    </div>`;
  const status = $('#status', body), result = $('#result', body), go = $('#go', body);
  const dz = dropZone({ accept: '.pdf,application/pdf', multiple: false, hint: t('c.hint_one') });
  $('#dz', body).appendChild(dz);
  dz.onfiles = async (fs) => {
    file = fs[0]; setStatus(status, ''); result.innerHTML = '';
    try {
      const doc = await loadPdfDoc(await readU8(file));
      pageCount = doc.getPageCount();
      $('#finfo', body).innerHTML = `<div class="status-line ok">${t('c.finfo', { name: esc(file.name), n: pageCount })}</div>`;
      go.disabled = false;
    } catch (e) { showAlert($('#finfo', body), e.message, 'err'); go.disabled = true; }
  };
  const prog = progressBar($('#prog', body));
  go.onclick = async () => {
    setStatus(status, ''); result.innerHTML = '';
    try {
      const pos = $('#pn-pos', body).value, fmt = $('#pn-fmt', body).value;
      const start = Math.max(1, parseInt($('#pn-start', body).value, 10) || 1);
      const size = Math.min(72, Math.max(6, parseInt($('#pn-size', body).value, 10) || 11));
      const color = hexToRgb01($('#pn-color', body).value);
      const margin = Math.max(0, parseFloat($('#pn-margin', body).value) || 36);
      prog.show();
      const doc = await loadPdfDoc(await readU8(file));
      const font = await doc.embedFont(PDFLib.StandardFonts.Helvetica);
      const rgb = PDFLib.rgb(color[0], color[1], color[2]);
      for (let i = 0; i < pageCount; i++) {
        const page = doc.getPage(i);
        const { width: w, height: h } = page.getSize();
        const num = start + i;
        const total = start + pageCount - 1;
        const text = fmt === 'n' ? String(num) : fmt === 'nN' ? t('pn.fmt_nN', { n: num, t: total })
          : fmt === 'pn' ? t('pn.fmt_pn', { n: num }) : t('pn.fmt_pnN', { n: num, t: total });
        const tw = font.widthOfTextAtSize(text, size);
        let x, y;
        const v = pos[0], hz = pos[1];
        y = v === 'b' ? margin : h - margin - size;
        x = hz === 'c' ? (w - tw) / 2 : hz === 'r' ? w - margin - tw : margin;
        page.drawText(text, { x, y, size, font, color: rgb });
        prog.set((i + 1) / pageCount * 0.9);
        if (i % 10 === 0) await sleep(0);
      }
      const bytes = await doc.save(); prog.hide();
      setStatus(status, t('pn.done'), 'ok');
      const name = `${file.name.replace(/\.pdf$/i, '')}-numbered.pdf`;
      result.innerHTML = `<div class="result-list"><div class="result-row">
        <span class="fname">${esc(name)}</span><span class="fmeta">${fmtBytes(bytes.length)}</span>
        <button class="btn secondary" id="dl">${esc(t('c.download'))}</button></div></div>`;
      $('#dl', result).onclick = () => downloadBytes(bytes, name, 'application/pdf');
    } catch (e) { prog.hide(); showAlert(status, e.message, 'err'); }
  };
};

/* ================= METADATA ================= */
TOOLS.find(t => t.id === 'metadata').render = async function (body) {
  let file = null, origBytes = null;
  body.innerHTML = `
    <div class="panel"><h3>${esc(t('c.choose_pdf'))}</h3><div id="dz"></div></div>
    <div class="panel" id="p2" hidden><h3>${esc(t('md.step2'))}</h3>
      <div class="field"><label>${esc(t('md.title'))}</label><input type="text" id="m-title"></div>
      <div class="field"><label>${esc(t('md.author'))}</label><input type="text" id="m-author"></div>
      <div class="field"><label>${esc(t('md.subject'))}</label><input type="text" id="m-subject"></div>
      <div class="field"><label>${esc(t('md.keywords'))}</label><input type="text" id="m-keywords"></div>
      ${fieldRow(`
      <div class="field"><label>${esc(t('md.creator'))}</label><input type="text" id="m-creator"></div>
      <div class="field"><label>${esc(t('md.producer'))}</label><input type="text" id="m-producer"></div>`)}
      <div id="status"></div><div id="prog"></div>
      <div class="btn-row"><button class="btn" id="go">${esc(t('md.go'))}</button></div>
      <div id="result"></div>
    </div>`;
  const status = $('#status', body), result = $('#result', body);
  const dz = dropZone({ accept: '.pdf,application/pdf', multiple: false, hint: t('c.hint_one') });
  $('#dz', body).appendChild(dz);
  dz.onfiles = async (fs) => {
    file = fs[0]; setStatus(status, ''); result.innerHTML = '';
    try {
      origBytes = await readU8(file);
      const doc = await loadPdfDoc(origBytes);
      $('#m-title', body).value = doc.getTitle() || '';
      $('#m-author', body).value = doc.getAuthor() || '';
      $('#m-subject', body).value = doc.getSubject() || '';
      const kw = doc.getKeywords(); $('#m-keywords', body).value = Array.isArray(kw) ? kw.join(', ') : (kw || '');
      $('#m-creator', body).value = doc.getCreator() || '';
      $('#m-producer', body).value = doc.getProducer() || '';
      $('#p2', body).hidden = false;
    } catch (e) { showAlert(body, e.message, 'err'); }
  };
  const prog = progressBar($('#prog', body));
  $('#go', body).onclick = async () => {
    setStatus(status, ''); result.innerHTML = ''; prog.show();
    try {
      const doc = await loadPdfDoc(origBytes);
      doc.setTitle($('#m-title', body).value);
      doc.setAuthor($('#m-author', body).value);
      doc.setSubject($('#m-subject', body).value);
      doc.setKeywords($('#m-keywords', body).value.split(',').map(s => s.trim()).filter(Boolean));
      doc.setCreator($('#m-creator', body).value);
      doc.setProducer($('#m-producer', body).value);
      const bytes = await doc.save();
      prog.hide();
      setStatus(status, t('md.done'), 'ok');
      const name = `${file.name.replace(/\.pdf$/i, '')}-metadata.pdf`;
      result.innerHTML = `<div class="result-list"><div class="result-row">
        <span class="fname">${esc(name)}</span><span class="fmeta">${fmtBytes(bytes.length)}</span>
        <button class="btn secondary" id="dl">${esc(t('c.download'))}</button></div></div>`;
      $('#dl', result).onclick = () => downloadBytes(bytes, name, 'application/pdf');
    } catch (e) { prog.hide(); showAlert(status, e.message, 'err'); }
  };
};

/* ================= init ================= */
$('#back-btn').addEventListener('click', () => { location.hash = '#/'; });
(function initLang() {
  const cur = lehaGetLang();
  document.documentElement.lang = cur;
  document.title = t('meta.title');
  const md = document.querySelector('meta[name="description"]');
  if (md) md.setAttribute('content', t('meta.desc'));
  applyStaticI18n();
  $$('#langToggle button').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === cur);
    b.addEventListener('click', () => applyLang(b.dataset.lang));
  });
})();
if (!window.PDFLib) {
  $('#app').innerHTML = `<div class="alert err">${esc(t('init.nolib'))}</div>`;
} else {
  router();
  window.addEventListener('hashchange', router);
}

})();
