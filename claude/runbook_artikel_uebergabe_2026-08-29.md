# Runbook: Artikel vom Homelab-Projekt ins Repo

**05.09.2026, v2.2** · Im Repo als `claude/runbook_artikel_uebergabe_2026-08-29.md` (`1b31388`, `96d9712`) — **der Dateiname bleibt, obwohl das Datum darin älter ist als der Inhalt.** Auf ihn zeigen die Dateikarte und das Projektwissen; eine Umbenennung erzeugt einen zweiten Pfad ins Leere. Das Dokument gehört dem Pixelyard-Projekt; Claude Code meldet Abweichungen, ändert sie nicht. · Gilt für jeden Beitrag. v1 entstand vor dem ersten Durchlauf; v2 trägt nach, was der Durchlauf mit „Mein Weg ins Homelab" gezeigt hat; **v2.2 (05.09.2026) hängt das Werkzeug `werkzeuge/artikel` ein — §6 nennt ab jetzt Menüpunkte, §10 trägt Entscheid und Anlass.** Alle Werte in §2, §4, §5 und §8 sind **gelesen oder gemessen** (Claude Code, 29.08.), nicht aus dem Gedächtnis.

---

## 1. Adressaten

| Wer | Was |
|---|---|
| **Claude Cowork im Homelab-Projekt** | schreibt und anonymisiert den Artikel, liefert `.mdx` mit den Feldern aus §2 |
| **Cedric** | Download am Mac → `~/Downloads/blogbeitraege/` · Sichtabnahme hell/dunkel · Freigabe |
| **Claude Code**, `~/Projekte/pixelyard` | Kopie ins Repo, Angleichen, SVG, Kontrast, Prüfskript, Commits, Push, Nachmessung |
| **Claude im Pixelyard-Projekt** | Entscheide, Runbook, Nachtragen |

**Übergabeordner:** `~/Downloads/blogbeitraege/` — ausserhalb des Repos, das Prüfskript läuft dort nicht. Original bleibt liegen, ins Repo wird kopiert.

**Unterordner `erledigt/`** (seit 04.09.2026): Dort landet die gelieferte Fassung, **nachdem** der Artikel live ist — verschoben, nicht gelöscht. Zwei Gründe, und der zweite wiegt schwerer als der erste:

1. Die Auswahlliste im Werkzeug wächst sonst mit jedem Beitrag. **Irgendwann wählt man in einer Liste von zwanzig die falsche Zeile.**
2. 🔑 Der Vergleich zwischen `erledigt/<slug>.mdx` und der Fassung im Repo beantwortet *„wurde am Text vor dem Livegang noch etwas geändert?"* **als Messung statt aus der Erinnerung** — und damit auch, ob es etwas ans Homelab-Projekt zurückzumelden gibt.

⚠️ **Das Aufräumen bewegt nur `.mdx`.** `.md`-Dateien im Übergabeordner — Runbooks, Notizen, Auftragstexte — bleiben liegen. Ausführung: Menüpunkt `8`, Bedingung und Entscheid in §10.

**Textänderungen im Repo gehen zurück ans Homelab-Projekt** — Zeile, alt, neu — damit Quelle und Repo nicht auseinanderlaufen.

---

## 2. Schema der Sammlung `artikel` — `src/content.config.ts`

Loader: `glob`, Basis `src/content/artikel`, Muster `**/*.{md,mdx}`.

| Feld | Typ | Pflicht | Standard |
|---|---|---|---|
| `titel` | string | ✅ | — |
| `beschreibung` | string | ✅ | — |
| `datum` | Datum | ✅ | — |
| `paar` | string | ✅ | — |
| `aktualisiert` | Datum | — | keiner |
| `schlagworte` | string[] | — | `[]` |
| `sprache` | `de` \| `en` | — | `de` |
| `entwurf` | boolean | — | **`false`** |
| `autor` | string | — | `Cedric Graber` |
| `faq` | `{frage, antwort}[]` | — | keiner |

🔴 **`entwurf` steht standardmässig auf `false`.** Ein Artikel ohne das Feld geht mit dem nächsten Push live. Bei jedem neuen Artikel explizit `entwurf: true`.

**`paar`** = Dateiname ohne `.mdx` — Schlüssel für das Sprachpaar (`hreflang`). ✅ Bestätigt per `grep` am 29.08.

Nicht vorhanden: `title`, `description`, `pubDate`, `tags`, `draft`. `datum` ist das Veröffentlichungsdatum; `aktualisiert` erst bei späteren Korrekturen.

---

## 3. Bauteile und Links

`<TLDR>`, `<Erklaerung>`, `<Prompt>`, `<Affiliatelink>` — keine Import-Zeilen in der `.mdx`; die Artikelseite reicht sie durch. Markdown im Inneren wird gerendert. `<TLDR>` als erstes Element. `Affiliatelink` steht seit 29.08. in der Bauteil-Tabelle der `CLAUDE.md`.

**`<Affiliatelink>` nur, wenn Geld fliesst.** Ein Produkt- oder Shop-Link wird genau dann als Bauteil gesetzt, wenn er eine Provisionskennung trägt. Das Bauteil setzt sichtbar „Werbung" und schaltet `MERKMALE.affiliate` für Impressum und Datenschutz — auf einen unbezahlten Link gesetzt, wäre die Kennzeichnung selbst falsch. Alle anderen externen Links bleiben Markdown.

**Externe Links öffnen im neuen Fenster** (`target="_blank" rel="noopener"`), per `rehype-external-links` — das erste rehype-Paket im Baum, Commit `bc7ee6f`. Interne Links nicht. ⚠️ Das Plugin unterscheidet nach Protokoll: ein absolut geschriebener interner Link (`https://www.pixelyard.ch/…`) bekäme `_blank`. Interne Links relativ schreiben.

---

## 4. Diagramme

Kein Mermaid-Plugin, es kommt keines. Mermaid → **SVG inline in der `.mdx`**, Mermaid-Quelle als Kommentar an der Stelle. Zahlen aus dem Diagramm stehen zusätzlich als Tabelle (Designbrief §6).

**Gemessen 29.08.:** `var()` in SVG-Präsentationsattributen löst sauber auf — Schrift kommt als IBM Plex Mono, Farben als RGB. Keine `<style>`-Regel nötig.

🔴 **Diagrammfarben brauchen dieselbe Kontrastrechnung wie Text.** Beim ersten Artikel waren beide Diagramme in beiden Modi unter 1.5:1 — nicht der Dunkelmodus war schuld, er hat es nur sichtbar gemacht. Schwellen: **4.5:1 für Text, 3:1 für Linien und Flächen**, gegen die Fläche, auf der gezeichnet wird (`--py-surface` in einer `<figure>`).

| Rolle im SVG | Token | hell / dunkel gegen `--py-surface` |
|---|---|---|
| Struktur-Striche, Rahmen | `--py-text-leise` | 5.77 / 5.94 |
| grüner Text | `--py-link` | 9.17 / 6.74 |
| grüne Striche (Wege, Rahmen) | `--py-primary` | 9.17 / 3.99 — reicht für Grafik, nicht für Text |
| Kastenfüllung | `--py-bg` | leiser Ton, Absicht |

**Nicht** `--py-line` in Figuren: 1.31 / 1.46 — s. §8.

**Anonymisierung von Diagrammen:** Zonenstruktur mit Gerätegattungen („Handys", „NAS", „Firmenlaptop") ist erlaubt; verboten sind Namen, Adressen, VLAN-IDs. `CLAUDE.md` seit `83d1ca6` entsprechend geschärft, Verweis Designbrief §5a.

---

## 5. Entwürfe

`src/lib/artikel.ts`: `zeigeEntwuerfe = import.meta.env.DEV`. ✅ **Gemessen 29.08.:** Dev-Server liefert den Entwurf mit HTTP 200 und listet ihn auf `/de/`; der Bau lässt ihn weg. Sichtprüfung also mit `npm run dev`, ohne Umschalten des Feldes.

---

## 6. Die Schritte

🔑 **Schritt 1–6 führt ab jetzt `./werkzeuge/artikel` aus** (seit 05.09.2026, `15b6c09` — Beschreibung und Entscheid in §10). Nicht mehr die Einzelbefehle von Hand.

**Die Tabelle bleibt trotzdem stehen, und zwar als Begründung.** Sie sagt, *warum* ein Schritt existiert und *woran* er gemessen wird; das Werkzeug sagt nur, dass er gelaufen ist. Wer die Tabelle durch die Menüliste ersetzt, behält die Reihenfolge und verliert den Anlass — und damit die Möglichkeit, einen Menüpunkt zu ändern, ohne einen Grund zu zerstören, den niemand mehr kennt.

| # | Adressat | Schritt | Prüfpunkt | Menüpunkt |
|---|---|---|---|---|
| 0 | Cowork/Homelab | `.mdx` mit Schema §2, Bauteile, Mermaid-Quelle im Kommentar, Anonymisierung | Zählung TL;DR/Erklärung/Prompt geliefert | — · liegt vor dem Werkzeug (`7` erzeugt den Auftragstext dafür) |
| 1 | Cedric | Download → `~/Downloads/blogbeitraege/` | `ls -l`, `wc -w` | **`1` Lage** — was liegt im Ordner, inkl. Zahl in `erledigt/` · dann **`2` Prüfen** |
| 2 | Claude Code | Kopie nach `src/content/artikel/de/<slug>.mdx`, Frontmatter gegen §2, `entwurf: true` | `npm run build` ohne Schemafehler | **`3` Übernehmen** — Kopie, Anonymisierung, Bau in einem |
| 3 | Claude Code | Mermaid → SVG mit Tokens aus §4, **Kontrast gerechnet**, Tabelle vorhanden | Werte hell/dunkel ≥ 3:1 bzw. 4.5:1 | **`2` Prüfen** meldet roher Mermaid-Block und `--py-line` im SVG. ⚠️ **Die Kontrastrechnung selbst bleibt Claude Code** — das Werkzeug rechnet nicht |
| 4 | Claude Code | `./werkzeuge/anonymisierung-pruefen.sh`, SVGs einzeln lesen, Text auf Ortshinweise und unbelegte Aussagen lesen | drei Abschnitte sauber; Funde als Entscheid melden, nicht selbst entscheiden | **`2` Prüfen** / **`3` Übernehmen** rufen das Skript. ⚠️ **Das Lesen bleibt Mensch und Claude Code** — s. §7 und §10 |
| 5 | Claude Code + Cedric | `npm run dev`, Artikel hell **und** dunkel ansehen | Cedric sagt „gesehen, OK" — nach dem Ansehen, nicht davor | **`4` Vorschau** — startet den Dev-Server und listet auf, was nur ein Mensch sieht |
| 6 | Claude Code | `git status`, nur die Artikeldatei gestaged, `entwurf: true` im Diff, Commit, Push | `curl -s https://www.pixelyard.ch/de/ \| grep -c <slug>` → `0` | **`5` Freigabe** (Commit und Push mit Rückfrage) · **`6` Nachmessen** einzeln wiederholbar |
| 7 | Cedric → Homelab | Textänderungen zurückmelden | Zeile, alt, neu | **`8` Aufräumen** — der Vergleich `erledigt/` ↔ Repo sagt, *ob* es etwas zurückzumelden gibt (§1) |
| 8 | Claude im Pixelyard-Projekt | Nachtragen, was abwich | diese Datei aktualisiert | — · kein Werkzeug, das ist Urteil |

**Freigabe — Menüpunkt `5`**, nicht mehr die Einzelbefehle: `entwurf: false`, `datum` prüfen, Bau (Seitenzahl +1, Artikel in `rss.xml`, `sitemap-0.xml`, `llms.txt`, `/de/`), Prüfskript, Commit, Push, Nachmessung, Aufräumen — jeder Schritt mit Rückfrage, Standardantwort Nein. Die Messungen nach dem Deploy laufen darin mit und sind über Menüpunkt `6` einzeln wiederholbar — **mehrfach probieren, der Bau dauert**:

```
curl -s  https://www.pixelyard.ch/de/ | grep -c <slug>              → ≥ 1
curl -sI https://www.pixelyard.ch/de/artikel/<slug>/                → HTTP/2 200
curl -sI https://www.pixelyard.ch/de/<erfundener-pfad>/             → HTTP/2 404
```

Die dritte Zeile gehört dazu: Seit `a2ee9a9` (Soft-404 behoben, `404.astro`) liefert ein unbekannter Pfad 404. Vorher lieferte er 200 — dann bewiese die zweite Zeile nichts.

---

## 7. Wer was nicht kann

- **Claude Code sieht nicht.** Er rechnet Kontrast, zählt Bauteile, misst Statuscodes. Ob ein Diagramm blass wirkt, ob Text lesbar ist, sieht nur Cedric am Bildschirm. Beides gehört zur Abnahme, keines ersetzt das andere.
- **Das Prüfskript liest keine Bedeutung.** Ortshinweise („im Sommer 2026 wurde unsere Strasse angeschlossen"), unbelegte Aussagen („kein einziges Byte") und Topologie in Diagrammen findet nur, wer den Text liest.
- **Claude im Pixelyard-Projekt schreibt nicht ins Repo.** Runbook-Änderungen gehen als Datei über `~/Downloads/blogbeitraege/` an Claude Code (`claude/runbook_artikel_uebergabe_2026-08-29.md`) und als Upload ins Projektwissen.

---

## 8. Design-System — Befunde vom 29.08.

| Befund | Entscheid | Commit |
|---|---|---|
| `--py-line` gegen `--py-surface` 1.31 / 1.46, gegen `--py-bg` 1.46 / 1.87 | **`--py-line` nur auf `--py-bg`, nur als Zierlinie.** Vier Stellen auf `--py-surface` umgestellt auf `--py-text-leise`. Regel als vierte gemessene Korrektur in `tokens.css` | `70f115a` |
| Camel-Rahmen `.py-tldr`, `.py-fehlt` auf `--py-surface`: hell 2.04 | `--py-accent-text` (5.69 / 6.35), bleibt Camel, dunkel identischer Wert | `929c8c3` |
| `.py-werbung` Rahmen Camel: hell 2.28 auf `--py-bg`, **2.04 auf `--py-surface`** — das Abzeichen hat keinen eigenen Hintergrund und kann auf beiden landen | `--py-accent-text` (6.34 / 5.69), dunkel unverändert. Die Schrift war schon lesbar, nur der Rahmen nicht. Wirkt erst beim ersten Provisionslink (`MERKMALE.affiliate` ist `false`) | `90c8750` |
| `.py-erklaerung` 3px-Balken Camel auf `--py-bg` | bleibt, reine Zier — der einzige verbliebene `--py-accent`-Rahmen im Stylesheet | — |
| Soft-404: jeder unbekannte Pfad lieferte 200 | `404.astro`, Pages antwortet 404 | `a2ee9a9` |
| Prüfstück `mustertext-design-system.mdx` | entfernt, bleibt in der Historie, enthielt nie Klarwerte | `92b7688` |

---

## 9. Offen

- **Kopfzeile fixieren** (Wunsch 29.08.): Die Schalterzeile soll beim Lesen stehen bleiben, damit „Erklärungen ein/aus" ohne Scrollen erreichbar ist. Zu entscheiden: nur die Schalterzeile oder der ganze Kopf; was sie auf einem Handy an Höhe kostet; Kontrast der fixierten Zeile über Fliesstext, Kasten und Terminal-Block (drei Hintergründe, gerechnet, nicht geschätzt). Adressat Claude Code, Vorschlag mit Screenshots hell/dunkel, Desktop und Handy, vor dem Commit.

- Zeitmessung `editorial.md` §7 — der zweite Artikel war der erste Messpunkt, nicht gemessen
- Keine Serien-Nummerierung auf der Seite; falls gewünscht, Schemafeld `serie`/`teil` als eigener Entscheid

---

## 10. Das Werkzeug `werkzeuge/artikel` — Beschreibung und Entscheide

*Stand 05.09.2026. Entstanden 04./05.09.2026 im Homelab-Projekt (Cowork), bis zur v2.2 dieses Runbooks als eigene Datei `claude/werkzeug_artikel.md` geführt — **die ist mit dem Einhängen hier gelöscht worden.** Zwei Fassungen desselben Wissens sind schlimmer als keine: Man pflegt die eine und liest die andere.*

> **Arbeitsteilung, damit nichts doppelt gepflegt wird:** Die **Bedienung** steht im Werkzeug selbst — `./werkzeuge/artikel`, Menüpunkt `h`, sieben Kapitel. **Dieser Abschnitt trägt den Entscheid und seinen Anlass.**

### Was das Werkzeug ist

**`werkzeuge/artikel`** — ein Bash-Menü, das den Weg aus §6 abbildet. **Committet am 05.09.2026 als `15b6c09`.**

**Anlass:** Der Livegang lief über die Shell und über Claude Code. Der Weg hat neun Schritte, drei davon sind still — der stillste ist der Entwurfsschalter (grüner Bau, fehlende Seite, 404). **Ein Menü kostet nichts und ersetzt das Erinnern.**

**Eigenschaften, die aus den bestehenden Entscheiden folgen:**

- **Bash, keine Abhängigkeiten**, bash-3.2-tauglich — die Version auf einem Mac ohne Homebrew. Passt zu `werkzeuge/anonymisierung-pruefen.sh`.
- **Kein Klarwert in der Ausgabe**, nur Datei und Zeilennummer — dieselbe Regel wie im Prüfskript. **Die Ausgabe darf man einem Assistenten zeigen.**
- **Jeder schreibende Schritt fragt vorher und zeigt vorher, was er tun würde.** Standardantwort ist Nein; Enter heisst abbrechen.
- **Der Übergabeordner bleibt unangetastet**, bis der Artikel live ist — es wird kopiert, nicht verschoben. Erst danach wandert die Fassung nach `erledigt/` (§1).
- **Die Anleitung steckt im Werkzeug** (Menüpunkt `h`).

### Die Menüpunkte

| # | Punkt | Was er tut |
|---|---|---|
| 1 | **Lage** | Was liegt im Übergabeordner (inkl. Zahl in `erledigt/`), was im Repo, welcher Artikel ist Entwurf, was sagt `git status` |
| 2 | **Prüfen** | Frontmatter gegen `src/content.config.ts`, Entwurfsschalter, Bauteile, strukturelle Muster, technische Fallen — **ohne etwas anzufassen** |
| 3 | **Übernehmen** | Kopie ins Repo, `anonymisierung-pruefen.sh`, `npm run build` |
| 4 | **Vorschau** | `npm run dev` plus die Liste dessen, was nur ein Mensch sieht |
| 5 | **Freigabe** | Schalter umlegen, Datum, Bau, Anonymisierung, Commit, Push, Nachmessung, Aufräumen — jeder Schritt mit Rückfrage |
| 6 | **Nachmessen** | drei `curl`-Messungen mit Wiederholung, falls der Cloudflare-Bau noch lief |
| 7 | **Auftrag für Claude Code** | erzeugt den fertigen Auftragstext mit Dateiname und Prüfpunkten, `pbcopy` wenn vorhanden |
| 8 | **Übergabeordner aufräumen** | verschiebt jede Fassung nach `erledigt/`, deren Artikel im Repo liegt und dort **nicht** mehr auf Entwurf steht |
| 9 | **Selbsttest** | ruft `anonymisierung-pruefen.sh --selbsttest` |
| h | **Handbuch** | sieben Kapitel: Weg · Menüpunkte · Prüfungen mit Anlass · was kein Skript prüft · Merksätze · Ablage · Fehlerfälle |

### `erledigt/` — Entscheid 04.09.2026

**`~/Downloads/blogbeitraege/erledigt/`** nimmt die gelieferte Fassung auf, sobald der Artikel live ist. Kurzfassung in §1, hier der Anlass:

**Warum überhaupt:** Die Auswahlliste im Werkzeug wächst sonst mit jedem Beitrag. **Irgendwann wählt man in einer Liste von zwanzig die falsche Zeile** — dieselbe Fehlerklasse wie der Koordinaten-Klick in einer umsortierten Portliste.

**Warum verschoben und nicht gelöscht:** Die Fassung, die ausgeliefert wurde, bleibt nachlesbar. **Sie ist ab dem Commit trotzdem nicht mehr die Quelle** — deshalb heisst der Ordner `erledigt` und nicht `archiv`.

**Die Bedingung fürs Verschieben ist gemessen, nicht angenommen:** Der Artikel muss im Repo liegen **und** dort `entwurf` auf etwas anderes als `true` haben. Alles andere bleibt liegen, mit Begründung in der Zeile.

🔑 **Nebenertrag, der wichtiger ist als das Aufräumen:** Der Vergleich zwischen `erledigt/<slug>.mdx` und der Fassung im Repo beantwortet die Frage *„wurde am Text vor dem Livegang noch etwas geändert?“* **als Messung statt aus der Erinnerung.** Am 05.09. so geprüft: bei `wlan-pro-stockwerk.mdx` war es genau eine Zeile — `entwurf: true` → `false`. Damit war nichts ans Homelab-Projekt zurückzutragen, und das war belegt statt vermutet.

⚠️ **`.md`-Dateien im Übergabeordner werden vom Aufräumen nicht angefasst** — es bewegt nur `.mdx`.

### Die Prüfungen — und warum jede drin ist

| Prüfung | Anlass |
|---|---|
| **Entwurfsschalter, richtungsabhängig** — bei Übernahme muss er `true` sein, bei Freigabe `false` | §6, Schritt 2 und Freigabe. **Sie sehen ähnlich aus und prüfen Gegenteiliges** — deshalb prüft das Werkzeug pro Schritt genau eine Richtung und nennt sie im Klartext |
| **Fehlt `entwurf` ganz → rot** | Schema-Standard ist `false` (§2): ein Artikel ohne das Feld geht mit dem nächsten Push live |
| **Fremdfelder `title`, `description`, `pubDate`, `tags`, `draft`, `author`** | sehen richtig aus und sind es nicht — das Schema ist deutsch (§2) |
| **`paar` gegen Dateinamen** | daran hängt hreflang |
| **`<TLDR>` genau einmal und als erstes Element** · Zählung Erklärungen/Prompts/FAQ | Editorial, §3 |
| **Prompt-Box ohne „Lade keine …“** → rot | Editorial-Regel: ein Prompt, der den Leser implizit zum Hochladen zwingt, hält die Regel dem Wortlaut nach ein und bricht sie in der Sache |
| **`<Affiliatelink>`** → Warnung | nur mit Provisionskennung, sonst ist die Kennzeichnung selbst falsch (§3) |
| **Roher ```mermaid-Block** → rot | es gibt kein Mermaid-Plugin, und es kommt keines (§4) |
| **Absoluter interner Link** → Warnung | `rehype-external-links` unterscheidet nach Protokoll und gäbe ihm `_blank` (§3) |
| **`--py-line` im SVG** → rot | Kontrast 1.31 / 1.46, s. §8 |
| **Nach dem Bau:** liegt die Seite in `dist/`, und steht der Slug in Liste, `rss.xml`, `sitemap-0.xml`, `llms.txt`? | alle vier ziehen aus `alleArtikel()`; **fehlt einer, fehlen alle** |
| **Nachmessung mit Kontrollmessung** — ein erfundener Pfad muss 404 liefern | ohne sie beweist die 200 nichts (Soft-404, `a2ee9a9`, §6) |

### 🔑 Was das Werkzeug ausdrücklich **nicht** kann

- **Es sieht nicht.** Sichtabnahme hell/dunkel, Desktop/Handy, Diagramm-Wirkung, Bildhintergründe.
- **Es liest keine Bedeutung.** Ortshinweise in Prosa, unbelegte Aussagen, die Kombination aus Anbieter und Zeitpunkt, doppelte Pointen aus früheren Artikeln.
- **Ein grüner Lauf ist kein Freibrief.** Das Werkzeug sagt das nach jedem sauberen Durchgang selbst.

Das ist dieselbe Grenze wie in §7 — das Werkzeug verschiebt sie nicht, es macht sie nur sichtbarer.

> **Merksatz: Ein Werkzeug, das alle prüfbaren Schritte übernimmt, macht die unprüfbaren zur einzigen verbleibenden Arbeit — es muss sie deshalb benennen, sonst verschwinden sie hinter dem grünen Haken.**

### Betriebsregel: wo das Werkzeug läuft

**Im Terminal am Mac, nicht aus einer Cowork-Sitzung heraus.**

Am 04.09. blieben zwei Git-Sperrdateien im Repo liegen, weil eine Cowork-Sitzung `git status` im verbundenen Ordner ausführte — **und dort nicht löschen kann.** Sie mussten umbenannt statt entfernt werden; im Originalnamen hätten sie jedes Git-Kommando blockiert. ✅ **Am 05.09. von Cedric gelöscht.**

> **Merksatz: Ein Kanal, der schreiben darf, aber nicht aufräumen, hinterlässt genau die Reste, die er selbst erzeugt.** Aus Cowork wird im Repo gelesen, nicht gearbeitet.

### Stand

| Punkt | Stand |
|---|---|
| `werkzeuge/artikel` committet | ✅ **05.09.2026, `15b6c09`** |
| Git-Sperrdateien entfernt | ✅ 05.09.2026 |
| `erledigt/` eingeführt und im Werkzeug automatisiert | ✅ 04.09.2026 |
| Erster echter Durchlauf | ✅ **05.09.2026, Beitrag 3 „WLAN pro Stockwerk“ (`a68ed3f`)** — Freigabe, Push und Nachmessung liefen ohne Abweichung |
| §6 auf Menüpunkte umgestellt, `erledigt/` in §1 | ✅ **05.09.2026, v2.2** |
| `claude/werkzeug_artikel.md` als §10 eingehängt und gelöscht | ✅ **05.09.2026, v2.2** — die Fassung im Projektwissen ist damit überholt und gehört durch dieses Runbook ersetzt |
