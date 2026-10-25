/*
  Datenanbindung für Gedenkbuch und Kerzen.
  Sicherheitsprinzip:
  - Besucher können Einträge nur ANLEGEN, nie ändern oder löschen (erzwungen in firestore.rules).
  - Einträge erscheinen sofort (approved:true). Spam blendet die Familie aus (approved:false) oder löscht ihn.
  - Serverseitige Pausenzeit pro Besucher (30 s) und Linksperre, siehe firestore.rules.
  - App Check sorgt dafür, dass nur diese Webseite schreiben darf, nicht beliebige Skripte.
  - Die Ausgabe erfolgt in app.js ausschließlich über textContent, eingeschleuster Code wird nie ausgeführt.
*/
const cfg = window.FIREBASE_CONFIG || {};
const SDK = "https://www.gstatic.com/firebasejs/10.12.2";

function ready(store) {
  window.MemorialStore = store;
  window.dispatchEvent(new Event("memorial-store-ready"));
}

if (!cfg.apiKey) {
  /* ---------- Vorschaumodus ohne Datenbank ---------- */
  const candles = [{ name: "Familie" }, { name: "Cem" }, { name: "" }];
  const entries = [
    { name: "[Beispiel] Ayşe", relation: "Nichte", message: "Dayı, deine Geschichten am Teetisch werden mir immer fehlen. Danke für jedes Lachen.", date: new Date(2026, 9, 20) },
    { name: "[Beispiel] Thomas", relation: "Nachbar", message: "Ein Mensch, der immer zuerst gefragt hat, wie es dem anderen geht. Wir vermissen ihn.", date: new Date(2026, 9, 18) }
  ];
  const cl = new Set(), el = new Set();
  ready({
    demo: true,
    onCandles(cb) { cl.add(cb); cb([...candles]); },
    onEntries(cb) { el.add(cb); cb([...entries]); },
    async addCandle(name) { candles.unshift({ name }); cl.forEach(cb => cb([...candles])); },
    async addEntry(e) { await new Promise(r => setTimeout(r, 400)); entries.unshift({ ...e, date: new Date() }); el.forEach(cb => cb([...entries])); }
  });
} else {
  /* ---------- Live mit Firebase ---------- */
  const [{ initializeApp }, fs, au, ac] = await Promise.all([
    import(`${SDK}/firebase-app.js`),
    import(`${SDK}/firebase-firestore.js`),
    import(`${SDK}/firebase-auth.js`),
    window.APPCHECK_SITE_KEY ? import(`${SDK}/firebase-app-check.js`) : Promise.resolve(null)
  ]);
  const { getFirestore, collection, doc, writeBatch, serverTimestamp, query, where, orderBy, limit, onSnapshot } = fs;

  const app = initializeApp(cfg);
  if (ac) ac.initializeAppCheck(app, { provider: new ac.ReCaptchaV3Provider(window.APPCHECK_SITE_KEY), isTokenAutoRefreshEnabled: true });
  const db = getFirestore(app);
  const auth = au.getAuth(app);
  const guestbook = collection(db, "guestbook");
  const candles = collection(db, "candles");
  const clean = (s, n) => String(s || "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, n);

  // Anonyme Anmeldung erst beim ersten Beitrag (nicht beim Seitenaufruf).
  // Sie dient nur dem Spamschutz: pro Anmeldung ein Beitrag alle 30 Sekunden.
  async function uid() {
    if (auth.currentUser) return auth.currentUser.uid;
    const cred = await au.signInAnonymously(auth);
    return cred.user.uid;
  }
  async function write(col, data) {
    const id = await uid();
    const batch = writeBatch(db);
    batch.set(doc(db, "ratelimits", id), { last: serverTimestamp() });
    batch.set(doc(col), data);
    try { await batch.commit(); }
    catch (e) { if (e && e.code === "permission-denied") { const err = new Error("rejected"); err.code = "rejected"; throw err; } throw e; }
  }

  ready({
    demo: false,
    onCandles(cb) {
      onSnapshot(query(candles, orderBy("createdAt", "desc"), limit(300)),
        snap => cb(snap.docs.map(d => ({ name: clean(d.data().name, 40) }))),
        err => { console.error(err); cb([]); });
    },
    onEntries(cb) {
      onSnapshot(query(guestbook, where("approved", "==", true), orderBy("createdAt", "desc"), limit(200)),
        snap => cb(snap.docs.map(d => {
          const x = d.data();
          return { name: clean(x.name, 60), relation: clean(x.relation, 60), message: clean(x.message, 1500), date: x.createdAt?.toDate?.() || null };
        })),
        err => { console.error(err); cb([]); });
    },
    async addCandle(name) {
      await write(candles, { name: clean(name, 40), createdAt: serverTimestamp() });
    },
    async addEntry({ name, relation, message, lang }) {
      await write(guestbook, {
        name: clean(name, 60), relation: clean(relation, 60), message: clean(message, 1500),
        lang: lang === "tr" ? "tr" : "de", approved: true, createdAt: serverTimestamp()
      });
    }
  });
}
