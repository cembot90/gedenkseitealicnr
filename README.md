# Gedenkseite Ali Çinar

Statische Seite auf GitHub Pages (`https://cembot90.github.io/gedenkseitealicnr/`), Gedenkbuch und Lichter über Firebase Firestore (Projekt `alicnr-ccf0a`). Eingerichtet und getestet.

## Aufbau

| Datei | Inhalt |
|---|---|
| `index.html` | Seitengerüst |
| `assets/js/content.js` | **Alle Inhalte**: Lebensweg, Erinnerungen, Reden mit Zeitmarken, Galerie, Texte DE/TR |
| `assets/js/config.js` | Firebase- und App-Check-Schlüssel |
| `assets/js/app.js` | Darstellung, Sprache, Musik, Reden-Player |
| `assets/js/store.js` | Datenbank (Gedenkbuch, Kerzen) |
| `assets/css/style.css` | Design |
| `audio/` | `trauerlied.m4a` (Hintergrundmusik), `rede-de.m4a`, später `rede-tr.m4a` |
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

- Besucher können nur neue Einträge anlegen, nie etwas ändern, löschen oder unfreigegebene Einträge lesen.
- Länge und Felder werden serverseitig geprüft, unbekannte Felder werden abgelehnt.
- Alle Texte werden als reiner Text angezeigt, eingeschleuster Code wird nie ausgeführt.
- Content Security Policy erlaubt nur Skripte von dieser Seite und von Google/Firebase.
- Suchmaschinen sind ausgeschlossen (`robots.txt`, `noindex`).
- Es liegen keine geheimen Schlüssel im Repository.
