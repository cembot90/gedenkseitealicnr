/*
  Verwaltung: Fotos freigeben, Einträge und Lichter ausblenden oder löschen.
  Die eigentliche Absicherung liegt in firestore.rules (isAdmin): Selbst wer diese Seite kopiert,
  kann ohne das Google-Konto cembot90@gmail.com nichts lesen oder ändern.
  Alle Texte werden über textContent gesetzt.
*/
const SDK = "https://www.gstatic.com/firebasejs/10.12.2";
const ADMIN = "cembot90@gmail.com";
const [{ initializeApp }, fs, au] = await Promise.all([
  import(`${SDK}/firebase-app.js`),
  import(`${SDK}/firebase-firestore.js`),
  import(`${SDK}/firebase-auth.js`)
]);
const { getFirestore, collection, doc, getDoc, query, where, orderBy, limit, onSnapshot, updateDoc, deleteDoc, writeBatch } = fs;

const app = initializeApp(window.FIREBASE_CONFIG);
const db = getFirestore(app);
const auth = au.getAuth(app);

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
const df = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
const when = ts => ts?.toDate ? df.format(ts.toDate()) : "";
const okImg = v => typeof v === "string" && v.startsWith("data:image/jpeg;base64,");

let toastT;
function toast(s) { const n = $("#toast"); n.textContent = s; n.classList.add("is-on"); clearTimeout(toastT); toastT = setTimeout(() => n.classList.remove("is-on"), 2600); }

/* ---------- Anmeldung ---------- */
$("#loginBtn").addEventListener("click", async () => {
  $("#loginStatus").textContent = "";
  try { await au.signInWithPopup(auth, new au.GoogleAuthProvider()); }
  catch (e) { console.error(e); $("#loginStatus").textContent = `Anmeldung fehlgeschlagen (${e.code || "unbekannt"}).`; $("#loginStatus").classList.add("is-error"); }
});
$("#logout").addEventListener("click", () => au.signOut(auth));

let unsubs = [];
au.onAuthStateChanged(auth, user => {
  unsubs.forEach(u => u()); unsubs = [];
  const isAdmin = !!user && user.email === ADMIN && user.emailVerified;
  $("#who").textContent = user && !user.isAnonymous ? user.email : "";
  $("#logout").hidden = !user || user.isAnonymous;
  $("#login").hidden = isAdmin;
  $("#panel").hidden = !isAdmin;
  if (user && !user.isAnonymous && !isAdmin) {
    $("#loginStatus").textContent = "Dieses Konto hat keinen Zugang zur Verwaltung.";
    $("#loginStatus").classList.add("is-error");
  }
  if (isAdmin) start();
});

/* ---------- Reiter ---------- */
$$(".admin__tabs button").forEach(b => b.addEventListener("click", () => {
  $$(".admin__tabs button").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
  $$("[data-panel]").forEach(p => p.hidden = p.dataset.panel !== b.dataset.tab);
}));

/* ---------- Großansicht ---------- */
const lb = $("#lightbox"), lbImg = lb.querySelector("img");
async function showFull(id, thumb, cap) {
  lbImg.src = thumb; lb.querySelector(".lightbox__cap").textContent = cap; lb.showModal();
  try { const d = await getDoc(doc(db, "photoFull", id)); const v = d.exists() ? d.data().data : null; if (okImg(v) && lb.open) lbImg.src = v; } catch (e) { console.error(e); }
}
lb.addEventListener("click", e => { if (e.target === lb || e.target.closest(".lightbox__close")) lb.close(); });

/* ---------- Aktionen ---------- */
async function act(fn, done) {
  try { await fn(); toast(done); } catch (e) { console.error(e); toast(`Hat nicht geklappt (${e.code || "Fehler"}).`); }
}
const setApproved = (col, id, v) => updateDoc(doc(db, col, id), { approved: v });
async function deletePhoto(id) {
  const b = writeBatch(db);
  b.delete(doc(db, "photoFull", id)); b.delete(doc(db, "photos", id));
  await b.commit();
}
function button(cls, text, onClick) { const b = el("button", cls, text); b.type = "button"; b.addEventListener("click", onClick); return b; }
function sure(text) { return window.confirm(text); }

/* ---------- Listen ---------- */
function photoCard(d, pending) {
  const x = d.data(), c = el("article", "card");
  if (okImg(x.thumb)) {
    const im = el("img"); im.src = x.thumb; im.alt = x.caption || "Geteiltes Foto"; im.loading = "lazy";
    im.addEventListener("click", () => showFull(d.id, x.thumb, [x.caption, x.name].filter(Boolean).join(" · ")));
    c.append(im);
  }
  const body = el("div", "card__body");
  body.append(el("strong", null, x.name || "Ohne Namen"));
  if (x.caption) body.append(el("span", "msg", x.caption));
  body.append(el("span", "meta", when(x.createdAt)));
  const a = el("div", "card__actions");
  if (pending) a.append(button("ok", "Freigeben", () => act(() => setApproved("photos", d.id, true), "Foto freigegeben")));
  else a.append(button("soft", "Ausblenden", () => act(() => setApproved("photos", d.id, false), "Foto ausgeblendet")));
  a.append(button("del", "Löschen", () => { if (sure("Dieses Foto endgültig löschen?")) act(() => deletePhoto(d.id), "Foto gelöscht"); }));
  c.append(body, a);
  return c;
}
function entryRow(d) {
  const x = d.data(), r = el("article", "row" + (x.approved ? "" : " is-hidden"));
  const body = el("div", "card__body");
  body.append(el("span", "msg", x.message || ""));
  body.append(el("span", "meta", [x.name || "Anonym", x.relation, when(x.createdAt), x.approved ? "" : "ausgeblendet"].filter(Boolean).join(" · ")));
  const a = el("div", "card__actions");
  a.append(x.approved
    ? button("soft", "Ausblenden", () => act(() => setApproved("guestbook", d.id, false), "Eintrag ausgeblendet"))
    : button("ok", "Wieder zeigen", () => act(() => setApproved("guestbook", d.id, true), "Eintrag wieder sichtbar")));
  a.append(button("del", "Löschen", () => { if (sure("Diesen Eintrag endgültig löschen?")) act(() => deleteDoc(doc(db, "guestbook", d.id)), "Eintrag gelöscht"); }));
  r.append(body, a);
  return r;
}
function candleRow(d) {
  const x = d.data(), r = el("article", "row");
  const body = el("div", "card__body");
  body.append(el("strong", null, x.name || "Ohne Namen"), el("span", "meta", when(x.createdAt)));
  const a = el("div", "card__actions");
  a.append(button("del", "Löschen", () => { if (sure("Dieses Licht löschen?")) act(() => deleteDoc(doc(db, "candles", d.id)), "Licht gelöscht"); }));
  r.append(body, a);
  return r;
}
function fill(panel, docs, make, emptyText, countEl, showCount) {
  const box = $(`[data-panel="${panel}"]`); box.replaceChildren();
  if (!docs.length) box.append(el("p", "empty-admin", emptyText));
  docs.forEach(d => box.append(make(d)));
  $(countEl).textContent = showCount && docs.length ? String(docs.length) : "";
}
function watch(q, cb) {
  unsubs.push(onSnapshot(q, snap => cb(snap.docs), err => { console.error(err); toast(`Laden fehlgeschlagen (${err.code || "Fehler"}). Fehlt der Index?`); }));
}
function start() {
  const photos = collection(db, "photos");
  watch(query(photos, where("approved", "==", false), orderBy("createdAt", "desc"), limit(200)),
    docs => fill("pending", docs, d => photoCard(d, true), "Keine Fotos warten auf Freigabe.", "#cPending", true));
  watch(query(photos, where("approved", "==", true), orderBy("createdAt", "desc"), limit(200)),
    docs => fill("approved", docs, d => photoCard(d, false), "Noch keine freigegebenen Fotos.", "#cApproved", false));
  watch(query(collection(db, "guestbook"), orderBy("createdAt", "desc"), limit(300)),
    docs => fill("book", docs, entryRow, "Noch keine Einträge.", "#cBook", false));
  watch(query(collection(db, "candles"), orderBy("createdAt", "desc"), limit(500)),
    docs => fill("candles", docs, candleRow, "Noch keine Lichter.", "#cCandles", false));
}
