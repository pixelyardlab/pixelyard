# pixelyard

Ein Blog über den Aufbau eines privaten Homelabs — Netz, NAS, lokale KI,
Dokumentenarchiv. Geschrieben von jemandem, der kein Administrator von Beruf
ist und die Entscheidungswege mitschreibt: die Zahlen, die Irrtümer und das,
was sie gekostet haben.

**→ [www.pixelyard.ch](https://www.pixelyard.ch)**

Dies ist der Quelltext der Website. Die Artikel liegen als MDX darin.

---

## Worum es geht

Nicht „so klickst du X zusammen", sondern Entscheidungswege mit Zahlen —
einschliesslich dem, was schiefging. Das Verworfene gehört in den Artikel,
nicht nur das Gewählte.

Drei Regeln tragen die Texte:

1. **Jede Behauptung, die eine Messung sein könnte, ist eine Messung** — oder
   sie wird als Annahme markiert.
2. **Ein grüner Status ist kein Nachweis.** Wo ein Artikel behauptet, etwas
   funktioniere, nennt er die Zahl oder das Protokoll, an dem man es sieht.
3. **Ein Irrtum, der korrigiert wurde, ist wertvoller als ein Ergebnis, das
   immer schon stimmte.** Korrekturen werden als solche geschrieben, nicht
   wegretuschiert.

Ausführlich in [`CLAUDE.md`](CLAUDE.md).

---

## Zwei Dinge, die diese Seite anders macht

**Zwei Lesetiefen, eine Quelle.** Jeder Artikel hat `<Erklaerung>`-Blöcke für
Begriffe, die nicht jeder kennt. Sie stehen **immer im HTML** und werden per
Attribut am `<html>` ein- oder ausgeblendet — Suchmaschinen und die
Druckansicht sehen den vollständigen Text. Der Kompaktmodus ist kürzer, aber
nie unvollständig; das wird bei jedem Artikel einmal gegengelesen.

**Prompt-Boxen.** Jeder Artikel enthält fertige, selbsttragende Prompts zum
Kopieren — für Leser, die einen Begriff lieber selbst vertiefen. Sie sind
immer sichtbar, anbieterneutral, und **sie fassen niemals Leserdaten an**:
Kein Prompt fordert dazu auf, eigene Dokumente irgendwo hochzuladen. Ein Blog,
der Local-First vertritt und den Leser im Nebensatz zu einer Cloud-KI schickt,
untergräbt seine eigene These.

---

## Stack

| | |
|---|---|
| Generator | [Astro](https://astro.build) 7, statische Ausgabe |
| Hosting | Cloudflare Pages |
| Schriften | IBM Plex Sans + Mono, self-hosted (kein Font-CDN) |
| Analytics | derzeit keine |
| Cookies | keine |

Bewusst **nicht** auf der heimischen NAS: Die Architektur des Heimnetzes ist
„inbound = nichts", und ein selbst gehosteter Blog wäre das erste Loch darin.

```bash
npm install      # Node 24, s. .node-version
npm run dev      # http://localhost:4321
npm run build    # statische Ausgabe nach dist/
```

---

## Aufbau

```
src/
  content/artikel/de/   Artikel als MDX
  components/           Erklaerung · Prompt · TLDR · Schalter · Wortmarke
  layouts/              Basis · Artikel
  lib/seite.ts          Sprachen, Oberflächentexte, Impressumsangaben
  styles/tokens.css     einzige Quelle für Farbwerte
werkzeuge/              Prüfskript für die Anonymisierung
```

**`/de/design`** zeigt das Design-System an sich selbst — mit den
Kontrastwerten als gerechnete Zahlen, nicht als Zusicherung. Die Seite ist
nicht indexiert, aber öffentlich: Wer will, kann nachrechnen.

---

## Was hier nicht liegt

Der Blog handelt von einem Heimnetz, das nicht auffindbar sein soll. Deshalb
kommen bestimmte Angaben in keinem Artikel, keinem Commit und keinem Bild vor:
IP- und MAC-Adressen, Hostnamen, Netz-Topologie sowie die Nummern von
Belegen, Bestellungen und Geräten.

Die **Formen** dieser Werte stehen in [`CLAUDE.md`](CLAUDE.md) — sie sind
Muster, keine Werte, und dürfen mitreisen. Die **konkreten Werte** liegen
ausserhalb dieses Repos, wo sie gar nicht committet werden *können*.

Geprüft wird das mit:

```bash
./werkzeuge/anonymisierung-pruefen.sh              # Arbeitsbaum
./werkzeuge/anonymisierung-pruefen.sh --historie   # alle Commits
./werkzeuge/anonymisierung-pruefen.sh --selbsttest # prüft das Skript selbst
```

Der dritte Aufruf ist der interessante: Er schiebt dem Skript absichtlich
einen Treffer unter und prüft, ob es anschlägt. **Ein Test, der nie rot war,
hat seine Nützlichkeit nie belegt.**

---

## Rechte

Texte und Bilder: © Cedric Graber. Zitate mit Quellenangabe sind willkommen;
für die Weiterverwendung ganzer Artikel bitte kurz fragen.

Für den Code ist **keine Lizenz** vergeben — es gilt damit das Urheberrecht in
seiner Grundeinstellung. Wer etwas davon nachbauen will, fragt am besten kurz
an; die Antwort ist voraussichtlich ja.

[Impressum](https://www.pixelyard.ch/de/impressum) ·
[Datenschutz](https://www.pixelyard.ch/de/datenschutz)
