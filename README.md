# Transformation – Enis Sentürk

Website für Websites, Automatisierung & KI-Transformation aus Reutlingen.
Statisch (HTML/CSS/JS), läuft direkt auf GitHub Pages: https://enoveqz.github.io/Transformation/

- `index.html` – Startseite (Texte direkt hier ändern)
- `assets/style.css` – Gestaltung (Farben oben unter `:root`)
- `assets/main.js` – Menü, Einblendungen, animierter Farbverlauf
- `assets/img/og.png` – Vorschaubild beim Teilen des Links
- `demos/` – 5 Beispiel-Websites (fiktive Betriebe): schreinerei, friseur, doener, baeckerei, werkstatt
- `assets/img/demos/` – Screenshots für die Polaroid-Galerie (Polaroid, Desktop, Handy)
- `impressum.html`, `datenschutz.html`, `sitemap.xml`

**Preise ändern:** in `index.html` nach `card__price` suchen.
**Telefonnummer ergänzen:** in `index.html` und `impressum.html` neben der E-Mail.

**Neues Beispiel hinzufügen:** Seite in `demos/` anlegen, drei Screenshots in `assets/img/demos/` (`name-polaroid.webp`, `name-desktop.webp`, `name-mobil.webp`), dann in `index.html` ein Polaroid ergänzen und in `assets/main.js` einen Eintrag im `data`-Array.

Schriften in `demos/fonts/` stehen unter der SIL Open Font License (Lizenztexte liegen bei).
