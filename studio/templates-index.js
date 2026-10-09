/* ============================================================================
   LEHA Studio — template registry (load LAST, after all data files).
   Aggregates split data files into the single registry the editors and
   the gallery expect: window.LEHA_TEMPLATES = { photo:{}, vector:{} }.
   ============================================================================ */
window.LEHA_TEMPLATES = {
  photo: window.__LEHA_PHOTO_TPL__ || {},
  vector: window.__LEHA_VECTOR_TPL__ || {}
};
