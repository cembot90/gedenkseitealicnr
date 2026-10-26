/*
  Verwaltung der Gedenkseite
  - Inhalte (Texte DE/TR, Lebensweg, Erinnerungen, Galerie) als ein Dokument site/content
  - Mediathek: Fotos verkleinert im Browser, gespeichert in media (Vorschau) und mediaData (groß)
  - Freigaben geteilter Fotos, Gedenkbuch, Lichter, Schalter
  Die Absicherung liegt in firestore.rules (isAdmin). Alle Texte werden über textContent gesetzt.
*/
// Schutz gegen Einbetten in fremde Seiten (Clickjacking); GitHub Pages erlaubt keine eigenen HTTP-Header
if (window.top !== window.self) { document.body.replaceChildren(); throw new Error("framed"); }
const SDK = "https://www.gstatic.com/firebasejs/10.12.2";
const ADMIN = "cembot90@gmail.com";
const [{ initializeApp }, fs, au] = await Promise.all([
  import(`${SDK}/firebase-app.js`),
  import(`${SDK}/firebase-firestore.js`),
  import(`${SDK}/firebase-auth.js`)
]);
const { getFirestore, collection, doc, getDoc, setDoc, query, where, orderBy, limit, onSnapshot, updateDoc, deleteDoc, writeBatch, serverTimestamp } = fs;

const app = initializeApp(window.FIREBASE_CONFIG);
const db = getFirestore(app);
const auth = au.getAuth(app);

/* ---------- Helfer ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
const svg = (paths) => { const s = document.createElementNS("http://www.w3.org/2000/svg", "svg"); s.setAttribute("viewBox", "0 0 24 24"); s.setAttribute("aria-hidden", "true"); s.innerHTML = paths; return s; };
const ICON = {
  up: '<path d="m6 14 6-6 6 6"/>', down: '<path d="m6 10 6 6 6-6"/>', trash: '<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/>',
  plus: '<path d="M12 5v14M5 12h14"/>', image: '<rect x="3.5" y="5" width="17" height="14" rx="2.5"/><circle cx="9" cy="10" r="1.6"/><path d="m4 17 5-4.5 4 3.5 3-2.5 4 3.5"/>'
};
const df = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
const when = ts => ts?.toDate ? df.format(ts.toDate()) : "";
const okImg = v => typeof v === "string" && v.startsWith("data:image/jpeg;base64,");
const clone = o => JSON.parse(JSON.stringify(o ?? null));
function getPath(o, path) { return path.split(".").reduce((a, k) => (a == null ? undefined : a[k]), o); }
function setPath(o, path, v) {
  const ks = path.split("."); let a = o;
  ks.slice(0, -1).forEach((k, i) => { if (a[k] == null || typeof a[k] !== "object") a[k] = /^\d+$/.test(ks[i + 1]) ? [] : {}; a = a[k]; });
  a[ks[ks.length - 1]] = v;
}
let toastT;
function toast(s) { const n = $("#toast"); n.textContent = s; n.classList.add("is-on"); clearTimeout(toastT); toastT = setTimeout(() => n.classList.remove("is-on"), 2800); }
function button(cls, text, onClick, title) { const b = el("button", cls, text); b.type = "button"; if (title) { b.title = title; b.setAttribute("aria-label", title); } b.addEventListener("click", onClick); return b; }
function iconBtn(name, title, onClick, extra = "") { const b = button("iconbtn " + extra, null, onClick, title); b.append(svg(ICON[name])); return b; }
async function act(fn, done) { try { await fn(); if (done) toast(done); } catch (e) { console.error(e); toast(e.code ? `Hat nicht geklappt (${e.code}).` : (e.message || "Hat nicht geklappt.")); } }

/* ---------- Zustand ---------- */
const EDITABLE = ["intro", "anniversary", "timeline", "memories", "gallery", "family", "features"];
const PERSON_KEYS = ["nickname", "born", "died", "places", "portrait", "portraitPosition", "wordsMeaning", "wordsAfter"];
function defaults() {
  const M = window.MEMORIAL || {}, c = {};
  EDITABLE.forEach(k => { if (M[k] !== undefined) c[k] = clone(M[k]); });
  c.person = {}; PERSON_KEYS.forEach(k => { if (M.person && M.person[k] !== undefined) c.person[k] = clone(M.person[k]); });
  c.features = Object.assign({ sharedPhotos: false }, c.features || {});
  return c;
}
const state = {
  user: null, published: null, publishedAt: null, draft: null, dirty: false, loaded: false,
  media: [], pending: [], approved: [], entries: [], candles: [], gate: null, view: "home", sub: "kopf"
};
const mediaThumb = id => (state.media.find(m => m.id === id) || {}).thumb || "";

/* ---------- Anmeldung ---------- */
$("#loginBtn").addEventListener("click", async () => {
  const st = $("#loginStatus"); st.textContent = ""; st.classList.remove("is-error");
  try { await au.signInWithPopup(auth, new au.GoogleAuthProvider()); }
  catch (e) { console.error(e); st.textContent = `Anmeldung fehlgeschlagen (${e.code || "unbekannt"}).`; st.classList.add("is-error"); }
});
$("#logout").addEventListener("click", () => { if (!state.dirty || confirm("Ungespeicherte Änderungen verwerfen und abmelden?")) au.signOut(auth); });
addEventListener("beforeunload", e => { if (state.dirty) { e.preventDefault(); e.returnValue = ""; } });

let unsubs = [];
au.onAuthStateChanged(auth, user => {
  unsubs.forEach(u => u()); unsubs = [];
  const isAdmin = !!user && user.email === ADMIN && user.emailVerified;
  state.user = isAdmin ? user : null;
  $("#login").hidden = isAdmin;
  $("#app").hidden = !isAdmin;
  if (user && !user.isAnonymous && !isAdmin) {
    $("#loginStatus").textContent = "Dieses Konto hat keinen Zugang zur Verwaltung."; $("#loginStatus").classList.add("is-error");
  }
  if (isAdmin) { $("#who").textContent = user.email; start(); }
});

/* ---------- Daten beobachten ---------- */
function watch(q, cb) {
  unsubs.push(onSnapshot(q, snap => cb(snap), err => { console.error(err); toast(`Laden fehlgeschlagen (${err.code || "Fehler"}). Regeln oder Index prüfen.`); }));
}
function start() {
  watch(doc(db, "site", "content"), d => {
    const remote = d.exists() && d.data().content ? Object.assign(defaults(), d.data().content) : defaults();
    state.published = JSON.stringify(remote);
    state.publishedAt = d.exists() ? d.data().updatedAt : null;
    if (!state.dirty) state.draft = clone(remote);
    state.loaded = true; render();
  });
  watch(doc(db, "site", "gate"), d => { state.gate = d.exists() ? d.data() : { enabled: false, mode: "password" }; renderIf("settings", "home"); });
  watch(query(collection(db, "media"), orderBy("createdAt", "desc"), limit(500)), s => { state.media = s.docs.map(d => ({ id: d.id, ...d.data() })); renderIf("media", "content", "home"); });
  watch(query(collection(db, "photos"), where("approved", "==", false), orderBy("createdAt", "desc"), limit(200)), s => { state.pending = s.docs; badges(); renderIf("review", "home"); });
  watch(query(collection(db, "photos"), where("approved", "==", true), orderBy("createdAt", "desc"), limit(200)), s => { state.approved = s.docs; renderIf("review"); });
  watch(query(collection(db, "guestbook"), orderBy("createdAt", "desc"), limit(400)), s => { state.entries = s.docs; badges(); renderIf("book", "home"); });
  watch(query(collection(db, "candles"), orderBy("createdAt", "desc"), limit(600)), s => { state.candles = s.docs; badges(); renderIf("candles", "home"); });
}
function badges() {
  $("#bReview").textContent = state.pending.length ? String(state.pending.length) : "";
  $("#bBook").textContent = state.entries.length ? String(state.entries.length) : "";
  $("#bCandles").textContent = state.candles.length ? String(state.candles.length) : "";
}

/* ---------- Navigation ---------- */
$$(".side__nav button").forEach(b => b.addEventListener("click", () => go(b.dataset.view)));
function go(view, sub) {
  state.view = view; if (sub) state.sub = sub;
  history.replaceState(null, "", "#" + view);
  render(); $("#main").focus({ preventScroll: true }); scrollTo(0, 0);
}
const initial = location.hash.slice(1);
if (["home", "content", "media", "review", "book", "candles", "settings"].includes(initial)) state.view = initial;

function renderIf(...views) { if (views.includes(state.view)) render(); }
function render() {
  if (!state.user) return;
  $$(".side__nav button").forEach(b => b.toggleAttribute("aria-current", b.dataset.view === state.view) || b.setAttribute("aria-current", b.dataset.view === state.view ? "page" : "false"));
  $$(".side__nav button").forEach(b => { if (b.dataset.view === state.view) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current"); });
  const main = $("#main"); main.replaceChildren();
  if (!state.loaded) { main.append(el("p", "empty-admin", "Lade …")); return; }
  ({ home: viewHome, content: viewContent, media: viewMedia, review: viewReview, book: viewBook, candles: viewCandles, settings: viewSettings })[state.view](main);
  $("#savebar").hidden = !state.dirty;
}
function head(main, title, text, extra) {
  const h = el("header", "view__head"); const t = el("div");
  t.append(el("h1", null, title)); if (text) t.append(el("p", null, text));
  h.append(t); if (extra) h.append(extra); main.append(h);
}

/* ---------- Speichern ---------- */
function markDirty() {
  state.dirty = JSON.stringify(state.draft) !== state.published;
  $("#savebar").hidden = !state.dirty;
}
$("#discard").addEventListener("click", () => { state.draft = JSON.parse(state.published); state.dirty = false; render(); toast("Änderungen verworfen"); });
$("#publish").addEventListener("click", () => act(async () => {
  const btn = $("#publish"); btn.disabled = true; btn.textContent = "Wird veröffentlicht …";
  try {
    await setDoc(doc(db, "site", "content"), { content: clone(state.draft), updatedAt: serverTimestamp(), updatedBy: state.user.email });
    state.dirty = false; $("#savebar").hidden = true;
  } finally { btn.disabled = false; btn.textContent = "Veröffentlichen"; }
}, "Veröffentlicht. Die Seite zeigt die Änderungen sofort."));

/* =========================================================
   Übersicht
   ========================================================= */
function viewHome(main) {
  head(main, "Übersicht", "Willkommen. Hier siehst du auf einen Blick, was neu ist.");
  const tiles = el("div", "tiles");
  const tile = (n, label, view, gold) => { const b = el("button", "tile" + (gold && n ? " tile--gold" : "")); b.type = "button"; b.append(el("b", null, String(n)), el("span", null, label)); b.addEventListener("click", () => go(view)); return b; };
  tiles.append(
    tile(state.pending.length, "Fotos warten auf Freigabe", "review", true),
    tile(state.entries.length, "Einträge im Gedenkbuch", "book"),
    tile(state.candles.length, "Lichter angezündet", "candles"),
    tile(state.media.length, "Fotos in der Mediathek", "media")
  );
  main.append(tiles);
  if (state.gate && state.gate.enabled) {
    const g = el("section", "panel panel--gold");
    g.append(el("h2", null, state.gate.mode === "password" ? "Passwortschutz ist aktiv" : "Seite ist geschlossen"),
             el("p", null, "Besucher sehen die Gedenkseite gerade nicht. Du selbst siehst sie, solange du hier angemeldet bist."));
    const b2 = button("btn btn--ghost", "Ändern", () => go("settings")); b2.style.marginTop = "16px"; g.append(b2); main.append(g);
  }
  const p = el("section", "panel");
  p.append(el("h2", null, "Inhalte"));
  p.append(el("p", null, state.publishedAt ? `Zuletzt veröffentlicht am ${when(state.publishedAt)}.` : "Noch nichts aus der Verwaltung veröffentlicht. Die Seite zeigt die Inhalte aus dem Repo."));
  const b = button("btn btn--primary", "Inhalte bearbeiten", () => go("content")); b.style.marginTop = "16px";
  p.append(b); main.append(p);
  const last = state.entries.slice(0, 3);
  if (last.length) {
    const q = el("section", "panel"); q.append(el("h2", null, "Neueste Einträge"));
    const rows = el("div", "rows"); rows.style.marginTop = "12px";
    last.forEach(d => { const x = d.data(); const r = el("div", "row"); const c = el("div", "card__body"); c.append(el("span", "msg", x.message || ""), el("span", "meta", [x.name || "Anonym", when(x.createdAt)].filter(Boolean).join(" · "))); r.append(c); rows.append(r); });
    q.append(rows); main.append(q);
  }
}

/* =========================================================
   Inhalte bearbeiten
   ========================================================= */
const SUBS = [["kopf", "Seitenkopf"], ["jahr", "Jahresgedenken"], ["leben", "Lebensweg"], ["erinnerungen", "Erinnerungen"], ["galerie", "Galerie"]];
const COLORS = [["amber", "Abendrot"], ["sea", "Türkis"], ["rose", "Rosé"], ["sky", "Himmelblau"], ["olive", "Olivgrün"]];
const ICONS = [["sun", "Sonne"], ["star", "Stern"], ["heart", "Herz"], ["wave", "Welle"], ["leaf", "Blatt"]];

function viewContent(main) {
  head(main, "Inhalte", "Änderungen werden erst sichtbar, wenn du unten auf „Veröffentlichen“ tippst.",
    (() => { const a = el("a", "btn btn--ghost", "Seite ansehen"); a.href = "index.html"; a.target = "_blank"; a.rel = "noopener"; return a; })());
  const tabs = el("div", "subtabs");
  SUBS.forEach(([k, label]) => { const b = button("", label, () => { state.sub = k; render(); }); b.setAttribute("aria-pressed", String(state.sub === k)); tabs.append(b); });
  main.append(tabs);
  const form = el("div", "form"); main.append(form);
  ({ kopf: formKopf, jahr: formJahr, leben: formLeben, erinnerungen: formErinnerungen, galerie: formGalerie })[state.sub](form);
}

/* --- Feldbausteine --- */
function textField(label, path, opts = {}) {
  const g = el("div", "fgroup"); const id = "f" + Math.random().toString(36).slice(2);
  const l = el("label", null, label); l.htmlFor = id; g.append(l);
  const i = el(opts.area ? "textarea" : "input"); if (!opts.area) i.type = "text"; i.id = id;
  i.value = getPath(state.draft, path) ?? ""; i.addEventListener("input", () => { setPath(state.draft, path, i.value); markDirty(); });
  g.append(i); if (opts.hint) g.append(el("p", "hint", opts.hint)); return g;
}
function biField(label, path, opts = {}) {
  const g = el("div", "fgroup"); g.append(el("span", "flabel", label));
  const row = el("div", "bi");
  ["de", "tr"].forEach(lg => {
    const w = el("div", "lang-in"); w.dataset.lang = lg.toUpperCase();
    const i = el(opts.area ? "textarea" : "input"); if (!opts.area) i.type = "text";
    i.lang = lg; i.setAttribute("aria-label", `${label} (${lg === "de" ? "Deutsch" : "Türkisch"})`);
    i.value = getPath(state.draft, `${path}.${lg}`) ?? "";
    i.addEventListener("input", () => { const cur = getPath(state.draft, path); if (!cur || typeof cur !== "object") setPath(state.draft, path, { de: "", tr: "" }); setPath(state.draft, `${path}.${lg}`, i.value); markDirty(); });
    w.append(i); row.append(w);
  });
  g.append(row); if (opts.hint) g.append(el("p", "hint", opts.hint)); return g;
}
function selectField(label, path, options) {
  const g = el("div", "fgroup"); const id = "s" + Math.random().toString(36).slice(2);
  const l = el("label", null, label); l.htmlFor = id; g.append(l);
  const s = el("select"); s.id = id;
  options.forEach(([v, t]) => { const o = el("option", null, t); o.value = v; s.append(o); });
  s.value = getPath(state.draft, path) ?? options[0][0];
  s.addEventListener("change", () => { setPath(state.draft, path, s.value); markDirty(); });
  g.append(s); return g;
}
function imageField(label, path, opts = {}) {
  const g = el("div", "imgfield"); g.append(el("span", "flabel", label));
  const prev = el("div", "imgfield__prev");
  const src = getPath(state.draft, path) || "";
  if (src) {
    const im = el("img"); im.alt = label;
    if (src.startsWith("media:")) { const t = mediaThumb(src.slice(6)); if (t) im.src = t; prev.append(im, el("span", "tag", "Mediathek")); }
    else if (/^(images|video)\/[\w\-./]+\.(jpe?g|png|webp)$/i.test(src)) { im.src = src; prev.append(im, el("span", "tag", "Repo")); }
  } else prev.textContent = "Kein Bild";
  g.append(prev);
  if (!opts.locked) g.append(button("btn btn--ghost", src ? "Bild ändern" : "Bild wählen", () => openPicker(id => { setPath(state.draft, path, "media:" + id); markDirty(); render(); })));
  else g.append(el("p", "hint", opts.locked));
  return g;
}
function listEditor(form, listPath, titleOf, renderItem, blank, addLabel) {
  const list = getPath(state.draft, listPath) || [];
  const wrap = el("div", "items");
  list.forEach((item, i) => {
    const card = el("section", "item");
    const h = el("div", "item__head");
    h.append(el("strong", null, titleOf(item, i)));
    const up = iconBtn("up", "Nach oben", () => { [list[i - 1], list[i]] = [list[i], list[i - 1]]; markDirty(); render(); }); up.disabled = i === 0;
    const dn = iconBtn("down", "Nach unten", () => { [list[i + 1], list[i]] = [list[i], list[i + 1]]; markDirty(); render(); }); dn.disabled = i === list.length - 1;
    const del = iconBtn("trash", "Entfernen", () => { if (confirm("Diesen Abschnitt entfernen?")) { list.splice(i, 1); markDirty(); render(); } }, "iconbtn--del");
    h.append(up, dn, del); card.append(h);
    renderItem(card, `${listPath}.${i}`, item, i);
    wrap.append(card);
  });
  form.append(wrap);
  const add = el("button", "addbtn"); add.type = "button"; add.append(svg(ICON.plus), document.createTextNode(addLabel));
  add.addEventListener("click", () => { if (!getPath(state.draft, listPath)) setPath(state.draft, listPath, []); getPath(state.draft, listPath).push(clone(blank)); markDirty(); render(); });
  form.append(add);
}
const L = v => (v && typeof v === "object") ? (v.de || v.tr || "") : (v || "");

/* --- Formulare --- */
function formKopf(f) {
  const r = el("div", "row2");
  r.append(imageField("Porträt", "person.portrait"));
  const right = el("div", "form");
  right.append(
    biField("Unter dem Namen", "person.nickname", { hint: "z. B. Vater, Onkel, Bruder" }),
    textField("Geboren", "person.born"), textField("Gestorben", "person.died"),
    biField("Orte", "person.places")
  );
  r.append(right); f.append(r);
  f.append(
    biField("Übersetzung seiner Worte", "person.wordsMeaning", { area: true, hint: "Erscheint unter „Ömrümü yaşayamadan gittim.“" }),
    biField("Satz danach", "person.wordsAfter"),
    biField("Einleitung über dem Lebensweg", "intro", { area: true }),
    biField("Fußzeile", "family")
  );
}
function formJahr(f) {
  f.append(biField("Überschrift", "anniversary.title"), biField("Untertitel", "anniversary.eyebrow"));
  // Absätze: de[] und tr[] paarweise bearbeiten
  const paras = getPath(state.draft, "anniversary.paragraphs") || { de: [], tr: [] };
  setPath(state.draft, "anniversary.paragraphs", paras);
  const n = Math.max(paras.de?.length || 0, paras.tr?.length || 0);
  const g = el("div", "fgroup"); g.append(el("span", "flabel", "Absätze"));
  const items = el("div", "items");
  for (let i = 0; i < n; i++) {
    const card = el("section", "item"); const h = el("div", "item__head"); h.append(el("strong", null, `Absatz ${i + 1}`));
    h.append(iconBtn("trash", "Absatz entfernen", () => { paras.de.splice(i, 1); paras.tr.splice(i, 1); markDirty(); render(); }, "iconbtn--del"));
    card.append(h);
    const row = el("div", "bi");
    ["de", "tr"].forEach(lg => {
      const w = el("div", "lang-in"); w.dataset.lang = lg.toUpperCase(); const t = el("textarea"); t.lang = lg; t.value = (paras[lg] || [])[i] || "";
      t.setAttribute("aria-label", `Absatz ${i + 1} (${lg})`);
      t.addEventListener("input", () => { paras[lg] = paras[lg] || []; paras[lg][i] = t.value; markDirty(); });
      w.append(t); row.append(w);
    });
    card.append(row); items.append(card);
  }
  g.append(items);
  const add = el("button", "addbtn"); add.type = "button"; add.append(svg(ICON.plus), document.createTextNode("Absatz hinzufügen"));
  add.addEventListener("click", () => { (paras.de = paras.de || []).push(""); (paras.tr = paras.tr || []).push(""); markDirty(); render(); });
  g.append(add); f.append(g);
  f.append(
    biField("Gedanke (kursiv)", "anniversary.reflection", { area: true }),
    biField("Segen", "anniversary.blessing"),
    biField("Gruß", "anniversary.closing"), biField("Unterschrift", "anniversary.signature")
  );
}
function formLeben(f) {
  listEditor(f, "timeline", (it, i) => `${it.year || "Jahr"} · ${L(it.title) || "Neuer Abschnitt"}`, (card, p) => {
    card.append(textField("Jahr", `${p}.year`, { hint: "z. B. 1966 oder 1980er" }), biField("Titel", `${p}.title`), biField("Text", `${p}.text`, { area: true }));
  }, { year: "", title: { de: "", tr: "" }, text: { de: "", tr: "" } }, "Abschnitt hinzufügen");
}
function formErinnerungen(f) {
  listEditor(f, "memories", it => L(it.title) || "Neue Erinnerung", (card, p) => {
    const r = el("div", "row2");
    r.append(imageField("Foto", `${p}.image`));
    const right = el("div", "form");
    const sel = el("div", "bi"); sel.append(selectField("Farbe", `${p}.color`, COLORS), selectField("Symbol", `${p}.icon`, ICONS));
    right.append(biField("Titel", `${p}.title`), biField("Text", `${p}.text`, { area: true }), sel);
    r.append(right); card.append(r);
  }, { color: "amber", icon: "heart", image: "", title: { de: "", tr: "" }, text: { de: "", tr: "" } }, "Erinnerung hinzufügen");
}
function formGalerie(f) {
  f.append(el("p", "hint", "Reihenfolge wie auf der Seite. Videos liegen im Repo, bei ihnen lässt sich nur die Bildunterschrift ändern."));
  listEditor(f, "gallery", it => L(it.caption) || (it.video ? "Video" : "Foto"), (card, p, it) => {
    const r = el("div", "row2");
    r.append(imageField(it.video ? "Video (Vorschaubild)" : "Foto", `${p}.src`, it.video ? { locked: "Video aus dem Repo" } : {}));
    const right = el("div", "form"); right.append(biField("Bildunterschrift", `${p}.caption`)); r.append(right); card.append(r);
  }, { src: "", caption: { de: "", tr: "" } }, "Foto hinzufügen");
}

/* =========================================================
   Mediathek
   ========================================================= */
async function loadBitmap(file) {
  if ("createImageBitmap" in window) { try { return await createImageBitmap(file, { imageOrientation: "from-image" }); } catch {} }
  return await new Promise((res, rej) => { const u = URL.createObjectURL(file), im = new Image(); im.onload = () => { URL.revokeObjectURL(u); res(im); }; im.onerror = () => { URL.revokeObjectURL(u); rej(new Error("Bild nicht lesbar")); }; im.src = u; });
}
function encode(src, maxSide, maxChars, q0) {
  const k = Math.min(1, maxSide / Math.max(src.width, src.height));
  let w = Math.round(src.width * k), h = Math.round(src.height * k), q = q0, out = "";
  const c = document.createElement("canvas"), x = c.getContext("2d");
  for (let i = 0; i < 12; i++) {
    c.width = w; c.height = h; x.fillStyle = "#000"; x.fillRect(0, 0, w, h); x.drawImage(src, 0, 0, w, h);
    out = c.toDataURL("image/jpeg", q); if (out.length <= maxChars) return { data: out, w, h };
    if (q > .55) q -= .08; else { w = Math.round(w * .85); h = Math.round(h * .85); }
  }
  return null;
}
async function uploadFiles(files, statusEl) {
  const list = [...files].filter(f => f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name));
  const ids = [];
  for (let n = 0; n < list.length; n++) {
    const file = list[n];
    if (statusEl) statusEl.textContent = `Lade hoch: ${n + 1} von ${list.length} …`;
    try {
      const bmp = await loadBitmap(file);
      const big = encode(bmp, 2000, 900000, .86), thumb = encode(bmp, 520, 120000, .74);
      if (bmp.close) bmp.close();
      if (!big || !thumb) throw new Error("zu groß");
      const ref = doc(collection(db, "media"));
      const b = writeBatch(db);
      b.set(ref, { thumb: thumb.data, w: big.w, h: big.h, name: file.name.slice(0, 120), createdAt: serverTimestamp() });
      b.set(doc(db, "mediaData", ref.id), { data: big.data, createdAt: serverTimestamp() });
      await b.commit(); ids.push(ref.id);
    } catch (e) { console.error(e); toast(`„${file.name}“ konnte nicht hochgeladen werden (${e.code || e.message}).`); }
  }
  if (statusEl) statusEl.textContent = ids.length ? `${ids.length} Foto${ids.length > 1 ? "s" : ""} hochgeladen.` : "";
  return ids;
}
function usage(id) {
  const s = JSON.stringify(state.draft || {}) + (state.published || "");
  return s.includes(`"media:${id}"`);
}
async function showMedia(id, cap) {
  const lb = $("#lightbox"), im = lb.querySelector("img");
  im.src = mediaThumb(id); lb.querySelector(".lightbox__cap").textContent = cap || ""; lb.showModal();
  try { const d = await getDoc(doc(db, "mediaData", id)); const v = d.exists() ? d.data().data : null; if (okImg(v) && lb.open) im.src = v; } catch (e) { console.error(e); }
}
function viewMedia(main) {
  head(main, "Mediathek", "Alle Fotos, die du hochlädst. Im Editor wählst du sie für Porträt, Erinnerungen und Galerie aus. Standortdaten werden beim Hochladen entfernt.");
  const grid = el("div", "mgrid");
  const zone = el("label", "uploadzone");
  const inp = el("input"); inp.type = "file"; inp.accept = "image/*"; inp.multiple = true; inp.hidden = true;
  const status = el("small", null, "Tippen oder Fotos hierher ziehen");
  zone.append(svg(ICON.image), el("span", null, "Fotos hochladen"), status, inp);
  inp.addEventListener("change", () => uploadFiles(inp.files, status));
  zone.addEventListener("dragover", e => { e.preventDefault(); zone.classList.add("is-over"); });
  zone.addEventListener("dragleave", () => zone.classList.remove("is-over"));
  zone.addEventListener("drop", e => { e.preventDefault(); zone.classList.remove("is-over"); uploadFiles(e.dataTransfer.files, status); });
  grid.append(zone);
  state.media.forEach(m => {
    const f = el("figure", "mtile");
    const im = el("img"); im.src = m.thumb; im.alt = m.name || "Foto"; im.loading = "lazy"; im.addEventListener("click", () => showMedia(m.id, m.name));
    f.append(im);
    const used = usage(m.id); if (used) f.append(el("span", "use", "verwendet"));
    const cap = el("figcaption"); cap.append(el("span", null, m.name || ""));
    cap.append(iconBtn("trash", "Foto löschen", () => {
      if (usage(m.id)) { toast("Dieses Foto wird noch auf der Seite verwendet. Erst im Editor austauschen."); return; }
      if (!confirm("Dieses Foto endgültig löschen?")) return;
      act(async () => { const b = writeBatch(db); b.delete(doc(db, "mediaData", m.id)); b.delete(doc(db, "media", m.id)); await b.commit(); }, "Foto gelöscht");
    }, "iconbtn--del"));
    f.append(cap); grid.append(f);
  });
  main.append(grid);
}

/* --- Auswahl-Dialog --- */
let pickCb = null;
function openPicker(cb) { pickCb = cb; $("#pickStatus").textContent = ""; fillPicker(); $("#pickDialog").showModal(); }
function fillPicker() {
  const g = $("#pickGrid"); g.replaceChildren();
  if (!state.media.length) g.append(el("p", "empty-admin", "Noch keine Fotos in der Mediathek. Lade oben eins hoch."));
  state.media.forEach(m => {
    const b = el("button", "mtile pickable"); b.type = "button";
    const im = el("img"); im.src = m.thumb; im.alt = m.name || "Foto"; b.append(im);
    const cap = el("figcaption"); cap.append(el("span", null, m.name || "")); b.append(cap);
    b.addEventListener("click", () => { $("#pickDialog").close(); if (pickCb) pickCb(m.id); });
    g.append(b);
  });
}
$("#pickClose").addEventListener("click", () => $("#pickDialog").close());
$("#pickUpload").addEventListener("change", async e => {
  const ids = await uploadFiles(e.target.files, $("#pickStatus")); e.target.value = "";
  if (ids.length === 1) { setTimeout(() => { $("#pickDialog").close(); if (pickCb) pickCb(ids[0]); }, 400); }
  else setTimeout(fillPicker, 600);
});

/* =========================================================
   Freigaben, Gedenkbuch, Lichter
   ========================================================= */
const setApproved = (col, id, v) => updateDoc(doc(db, col, id), { approved: v });
async function deletePhoto(id) { const b = writeBatch(db); b.delete(doc(db, "photoFull", id)); b.delete(doc(db, "photos", id)); await b.commit(); }
async function showPhoto(id, thumb, cap) {
  const lb = $("#lightbox"), im = lb.querySelector("img");
  im.src = thumb; lb.querySelector(".lightbox__cap").textContent = cap; lb.showModal();
  try { const d = await getDoc(doc(db, "photoFull", id)); const v = d.exists() ? d.data().data : null; if (okImg(v) && lb.open) im.src = v; } catch (e) { console.error(e); }
}
function photoCard(d, pending) {
  const x = d.data(), c = el("article", "card");
  if (okImg(x.thumb)) { const im = el("img"); im.src = x.thumb; im.alt = x.caption || "Geteiltes Foto"; im.loading = "lazy"; im.addEventListener("click", () => showPhoto(d.id, x.thumb, [x.caption, x.name].filter(Boolean).join(" · "))); c.append(im); }
  const body = el("div", "card__body"); body.append(el("strong", null, x.name || "Ohne Namen")); if (x.caption) body.append(el("span", "msg", x.caption)); body.append(el("span", "meta", when(x.createdAt)));
  const a = el("div", "card__actions");
  a.append(pending ? button("ok", "Freigeben", () => act(() => setApproved("photos", d.id, true), "Foto freigegeben"))
                   : button("soft", "Ausblenden", () => act(() => setApproved("photos", d.id, false), "Foto ausgeblendet")));
  a.append(button("del", "Löschen", () => { if (confirm("Dieses Foto endgültig löschen?")) act(() => deletePhoto(d.id), "Foto gelöscht"); }));
  c.append(body, a); return c;
}
function viewReview(main) {
  head(main, "Freigaben", state.draft?.features?.sharedPhotos ? "Fotos, die Besucher mit Ali geteilt haben. Erst nach deiner Freigabe erscheinen sie auf der Seite." : "„Fotos mit Ali“ ist auf der Seite noch ausgeschaltet. Einschalten unter Einstellungen.");
  main.append(el("h2", "flabel", `Warten auf Freigabe (${state.pending.length})`));
  const c1 = el("div", "cards"); c1.style.margin = "12px 0 36px";
  if (!state.pending.length) c1.append(el("p", "empty-admin", "Nichts zu prüfen."));
  state.pending.forEach(d => c1.append(photoCard(d, true))); main.append(c1);
  main.append(el("h2", "flabel", `Freigegeben (${state.approved.length})`));
  const c2 = el("div", "cards"); c2.style.marginTop = "12px";
  if (!state.approved.length) c2.append(el("p", "empty-admin", "Noch keine freigegebenen Fotos."));
  state.approved.forEach(d => c2.append(photoCard(d, false))); main.append(c2);
}
function viewBook(main) {
  head(main, "Gedenkbuch", "Einträge erscheinen sofort. Ausgeblendete Einträge sieht nur die Verwaltung.");
  const rows = el("div", "rows");
  if (!state.entries.length) rows.append(el("p", "empty-admin", "Noch keine Einträge."));
  state.entries.forEach(d => {
    const x = d.data(), r = el("article", "row" + (x.approved ? "" : " is-hidden"));
    const body = el("div", "card__body");
    body.append(el("span", "msg", x.message || ""), el("span", "meta", [x.name || "Anonym", x.relation, when(x.createdAt), x.approved ? "" : "ausgeblendet"].filter(Boolean).join(" · ")));
    const a = el("div", "card__actions");
    a.append(x.approved ? button("soft", "Ausblenden", () => act(() => setApproved("guestbook", d.id, false), "Eintrag ausgeblendet"))
                        : button("ok", "Wieder zeigen", () => act(() => setApproved("guestbook", d.id, true), "Eintrag wieder sichtbar")));
    a.append(button("del", "Löschen", () => { if (confirm("Diesen Eintrag endgültig löschen?")) act(() => deleteDoc(doc(db, "guestbook", d.id)), "Eintrag gelöscht"); }));
    r.append(body, a); rows.append(r);
  });
  main.append(rows);
}
function viewCandles(main) {
  head(main, "Lichter", "Angezündete Lichter mit Namen. Unpassende kannst du löschen.");
  const rows = el("div", "rows");
  if (!state.candles.length) rows.append(el("p", "empty-admin", "Noch keine Lichter."));
  state.candles.forEach(d => {
    const x = d.data(), r = el("article", "row");
    const body = el("div", "card__body"); body.append(el("strong", null, x.name || "Ohne Namen"), el("span", "meta", when(x.createdAt)));
    const a = el("div", "card__actions"); a.append(button("del", "Löschen", () => { if (confirm("Dieses Licht löschen?")) act(() => deleteDoc(doc(db, "candles", d.id)), "Licht gelöscht"); }));
    r.append(body, a); rows.append(r);
  });
  main.append(rows);
}

/* =========================================================
   Einstellungen
   ========================================================= */
async function deriveHash(pw, salt, iter) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(pw), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: enc.encode(salt), iterations: iter }, key, 256);
  return btoa(String.fromCharCode(...new Uint8Array(bits)));
}
function gatePanel(main) {
  const g = state.gate || { enabled: false, mode: "password" };
  const box = el("section", "panel gatepanel"); box.style.maxWidth = "760px";
  const top = el("label", "switchrow switchrow--flat");
  const t = el("div"); t.append(el("strong", null, "Wartungsmodus"), el("p", "hint", "Die Gedenkseite ist für Besucher verborgen. Du siehst sie weiterhin, solange du hier angemeldet bist. Wirkt sofort beim Speichern."));
  const sw = el("span", "switch"); const on = el("input"); on.type = "checkbox"; on.checked = !!g.enabled; on.setAttribute("role", "switch");
  sw.append(on, el("span")); top.append(t, sw); box.append(top);

  const opts = el("div", "form"); opts.style.marginTop = "18px";
  const modeG = el("div", "fgroup"); modeG.append(el("span", "flabel", "Art"));
  const seg = el("div", "subtabs"); seg.style.marginBottom = "0";
  let mode = g.mode === "closed" ? "closed" : "password";
  const mkSeg = (v, label) => { const b = button("", label, () => { mode = v; seg.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", String(x === b))); pwG.hidden = mode !== "password"; }); b.setAttribute("aria-pressed", String(mode === v)); return b; };
  seg.append(mkSeg("password", "Mit Passwort"), mkSeg("closed", "Geschlossen"));
  modeG.append(seg); opts.append(modeG);

  const pwG = el("div", "fgroup"); pwG.hidden = mode !== "password";
  const pl = el("label", null, g.hash ? "Neues Passwort (leer lassen, um das bisherige zu behalten)" : "Passwort"); const pw = el("input"); pw.type = "text"; pw.autocomplete = "new-password"; pw.id = "gatePwNew"; pl.htmlFor = pw.id;
  pwG.append(pl, pw, el("p", "hint", "Mindestens 8 Zeichen. Gib es an Familie und Freunde weiter. Wer es eingegeben hat, wird auf dem Gerät gemerkt, bis du es änderst."));
  opts.append(pwG);

  const msgG = el("div", "fgroup"); msgG.append(el("span", "flabel", "Hinweis für Besucher (optional)"));
  const row = el("div", "bi"); const msg = { de: (g.message && g.message.de) || "", tr: (g.message && g.message.tr) || "" };
  ["de", "tr"].forEach(lg => { const w = el("div", "lang-in"); w.dataset.lang = lg.toUpperCase(); const i = el("input"); i.type = "text"; i.lang = lg; i.value = msg[lg]; i.addEventListener("input", () => msg[lg] = i.value); w.append(i); row.append(w); });
  msgG.append(row, el("p", "hint", "Leer lassen für den Standardtext."));
  opts.append(msgG);

  const save = button("btn btn--primary", "Speichern", () => act(async () => {
    const enabling = on.checked, newPw = pw.value.trim();
    let { hash = "", salt = "", iter = 210000 } = g;
    if (mode === "password" && newPw) {
      if (newPw.length < 8) throw new Error("Das Passwort braucht mindestens 8 Zeichen.");
      salt = Array.from(crypto.getRandomValues(new Uint8Array(16)), b => b.toString(16).padStart(2, "0")).join("");
      iter = 210000; hash = await deriveHash(newPw, salt, iter);
    }
    if (enabling && mode === "password" && !hash) throw new Error("Bitte zuerst ein Passwort festlegen.");
    await setDoc(doc(db, "site", "gate"), { enabled: enabling, mode, hash, salt, iter, message: { de: msg.de.trim().slice(0, 300), tr: msg.tr.trim().slice(0, 300) }, updatedAt: serverTimestamp(), updatedBy: state.user.email });
    pw.value = "";
  }, on.checked ? "Gespeichert. Die Seite ist jetzt für Besucher verborgen." : "Gespeichert. Die Seite ist wieder öffentlich."));
  save.style.justifySelf = "start";
  opts.append(save);
  box.append(opts);
  main.append(box);
}
function viewSettings(main) {
  head(main, "Einstellungen", "Zugang zur Seite und Schalter für einzelne Bereiche.");
  gatePanel(main);
  main.append(el("h2", "flabel settings__sub", "Bereiche (wirksam nach „Veröffentlichen“)"));
  const row = el("label", "switchrow");
  const t = el("div"); t.append(el("strong", null, "Fotos mit Ali"), el("p", "hint", "Besucher können gemeinsame Fotos teilen. Sie erscheinen erst nach deiner Freigabe unter „Freigaben“."));
  const sw = el("span", "switch"); const cb = el("input"); cb.type = "checkbox"; cb.checked = !!state.draft?.features?.sharedPhotos; cb.setAttribute("role", "switch");
  cb.addEventListener("change", () => { state.draft.features = Object.assign({}, state.draft.features, { sharedPhotos: cb.checked }); markDirty(); });
  sw.append(cb, el("span")); row.append(t, sw); main.append(row);

  const acc = el("section", "panel"); acc.style.maxWidth = "760px";
  acc.append(el("h2", null, "Konto"), el("p", null, `Angemeldet als ${state.user.email}`));
  const btns = el("div"); btns.style.cssText = "display:flex;gap:10px;flex-wrap:wrap;margin-top:16px";
  const view = el("a", "btn btn--ghost", "Seite ansehen"); view.href = "index.html"; view.target = "_blank"; view.rel = "noopener";
  btns.append(view, button("btn btn--ghost", "Abmelden", () => $("#logout").click()));
  acc.append(btns); main.append(acc);
}

/* ---------- Großansicht schließen ---------- */
$("#lightbox").addEventListener("click", e => { if (e.target === e.currentTarget || e.target.closest(".lightbox__close")) e.currentTarget.close(); });
