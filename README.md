# Gedenkseite Ali Çınar

Statische Seite auf GitHub Pages (`https://cembot90.github.io/gedenkseitealicnr/`), Gedenkbuch und Lichter über Firebase Firestore (Projekt `alicnr-ccf0a`). Eingerichtet und getestet.

## Aufbau

| Datei | Inhalt |
|---|---|
| `index.html` | Seitengerüst |
| `assets/js/content.js` | **Alle Inhalte**: Lebensweg, Erinnerungen, Reden mit Zeitmarken, Galerie, Texte DE/TR |
| `assets/js/config.js` | Firebase- und App-Check-Schlüssel |
| `assets/js/app.js` | Darstellung, Sprache, Musik, Reden-Player |
| `assets/js/store.js` | Datenbank (Gedenkbuch, Lichter, Inhalte aus der Verwaltung) |
| `assets/js/gate.js` | Wartungsmodus / Passwortschutz |
| `admin.html`, `assets/js/admin.js` | Verwaltung |
| `assets/css/style.css` | Design |
| `audio/` | `trauerlied.m4a` (Hintergrundmusik), `rede-de.m4a`, `rede-tr.m4a` |
| `images/` | Porträt und Galerie |
| `firestore.rules` | Sicherheitsregeln der Datenbank |
| `impressum.html`, `datenschutz.html` | Rechtstexte |
| `assets/fonts/` | Lokal eingebundene Schriften (keine Verbindung zu Google Fonts) |

## Audio

- Das Trauerlied startet beim Betreten der Seite (blockiert der Browser das, beim ersten Klick oder Tippen).
- Startet jemand die Rede oder das Video, stoppt die Musik; wieder an nur über den Musik-Knopf.
- Die Gedenkrede hat einen Umschalter DE | TR. Sätze mit Startzeit in Sekunden stehen in `content.js`.
- Nach Änderungen an CSS/JS die Versionsnummer `?v=` in `index.html` erhöhen, damit Browser die neue Fassung laden.

## Gedenkbuch absichern (einmalig, ca. 15 Minuten)

1. **Firebase-Projekt**: [console.firebase.google.com](https://console.firebase.google.com), Projekt anlegen, Firestore-Datenbank erstellen (Region `europe-west3`, Frankfurt), im **Produktionsmodus**.
2. **Web-App** registrieren, die Werte `apiKey`, `authDomain`, `projectId`, `appId` in `assets/js/config.js` eintragen.
3. **Regeln**: Inhalt von `firestore.rules` unter *Firestore > Regeln* einfügen und veröffentlichen.
4. **Index**: beim ersten Laden zeigt die Browser-Konsole einen Link zum Anlegen des Index (approved + createdAt). Anklicken genügt. Alternativ `firestore.indexes.json` per Firebase CLI deployen.
5. **App Check** (optional, nur bei Spam einschalten): lädt Google reCAPTCHA. Dann vorher den auskommentierten Abschnitt in `datenschutz.html` ergänzen.
   - reCAPTCHA v3 Schlüssel anlegen unter [google.com/recaptcha/admin](https://www.google.com/recaptcha/admin), Domain `cembot90.github.io` (bzw. eigene Domain) eintragen.
   - In Firebase unter *App Check* die Web-App mit diesem Schlüssel registrieren.
   - Den **Websiteschlüssel** in `config.js` bei `APPCHECK_SITE_KEY` eintragen.
   - Nach ein paar Tagen ohne Probleme unter *App Check > Firestore* auf **Erzwingen** stellen.
6. **API-Schlüssel einschränken**: Google Cloud Console > APIs & Dienste > Anmeldedaten > Browser-Schlüssel > HTTP-Verweis-URLs auf `https://cembot90.github.io/*` begrenzen.

### Anonyme Anmeldung einschalten (für den Spamschutz nötig)

Firebase-Konsole > Authentication > „Jetzt starten“ > Anmeldemethode > **Anonym** aktivieren.

### Spam ausblenden

Einträge erscheinen sofort. Unpassendes in der Firebase-Konsole > Firestore > `guestbook` ausblenden (Feld `approved` auf `false`) oder löschen. Lichter unter `candles` löschen.

### Was die Sicherheit ausmacht

- Datenbankregeln (`firestore.rules`) erzwingen alles serverseitig: Besucher können nur anlegen, nie ändern, löschen oder Verborgenes lesen. Felder, Längen und Formate werden geprüft, Links abgelehnt, 30 Sekunden Pause pro Besucher.
- Verwaltung nur mit Google-Konto `cembot90@gmail.com` (bestätigte E-Mail). Die Admin-Seite lässt sich nicht in fremde Seiten einbetten.
- Alle Texte werden als reiner Text angezeigt (`textContent`), eingeschleuster Code wird nie ausgeführt. Bilder nur aus `images/`, `video/` oder der eigenen Mediathek.
- Content Security Policy: Skripte nur von dieser Seite und `gstatic.com` (Firebase), Verbindungen nur zu Google-APIs, keine Inline-Skripte.
- Keine Cookies, kein Tracking, Schriften lokal. Fotos ohne GPS-/Kameradaten, Audio/Video ohne Metadaten.
- Kostenloser Spark-Tarif ohne Zahlungsdaten: Missbrauch kann keine Kosten verursachen.
- Suchmaschinen: `noindex` auf allen Seiten.
- Keine geheimen Schlüssel im Repository (der Firebase-`apiKey` ist öffentlich und per Website-Beschränkung gesichert).

## Verwaltung (`admin.html`)

Übersicht, Inhalte (Editor DE/TR für Seitenkopf, Jahresgedenken, Lebensweg, Erinnerungen, Galerie), Mediathek, Freigaben, Gedenkbuch, Lichter, Einstellungen.
Inhalte aus der Verwaltung liegen in Firestore (`site/content`) und überschreiben `content.js`; Fotos in `media`/`mediaData`. Audio und Video bleiben im Repo.

## Wartungsmodus / Passwortschutz

In der Verwaltung unter Einstellungen: „Mit Passwort“ oder „Geschlossen“, wirkt sofort. Das Passwort liegt nur als PBKDF2-Hash (210.000 Runden, Salz) in `site/gate`.
Wer in der Verwaltung angemeldet ist, sieht die Seite immer. Hinweis: Das ist ein Sichtschutz. Statische Dateien (Fotos, Audio) bleiben bei GitHub Pages über ihre direkte Adresse abrufbar.
Antwortet die Datenbank nicht innerhalb von 8 Sekunden, öffnet sich die Seite, damit niemand dauerhaft ausgesperrt wird.

## „Fotos mit Ali“ (in der Verwaltung unter Einstellungen einschaltbar)

Besucher teilen Fotos, die erst nach Freigabe erscheinen (Verwaltung über `admin.html`, Google-Login nur für cembot90@gmail.com).
Vor dem Einschalten in Firebase die Regeln aus `firestore.rules` veröffentlichen,
Index `photos` (approved aufsteigend, createdAt absteigend) anlegen, Google-Anmeldung aktivieren, `cembot90.github.io` als autorisierte Domain
eintragen, `https://alicnr-ccf0a.firebaseapp.com/*` beim API-Schlüssel ergänzen und die auskommentierten Abschnitte in `datenschutz.html`/`impressum.html` aktivieren.
