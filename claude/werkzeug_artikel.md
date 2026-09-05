# Werkzeug `artikel` — Beschreibung und Entscheide

**Ort dieser Datei:** `~/Projekte/pixelyard/claude/werkzeug_artikel.md` — neben `runbook_artikel_uebergabe_2026-08-29.md`
**Gleiche Fassung im Claude-Projekt Pixelyard** als `werkzeug_artikel.md` (Projektwissen)
**Entstanden:** 04./05.09.2026, Homelab-Projekt (Cowork)

> **Arbeitsteilung, damit nichts doppelt gepflegt wird:** Die **Bedienung** steht im Werkzeug selbst — `./werkzeuge/artikel`, Menüpunkt `h`, sieben Kapitel. **Diese Datei trägt den Entscheid und seinen Anlass.** Wer das vermischt, hat zwei Fassungen desselben Wissens.
>
> ➡️ **Fürs Runbook:** Der Inhalt hier gehört als **§10** in `claude/runbook_artikel_uebergabe_2026-08-29.md`, sobald jemand das Runbook ohnehin anfasst. Bis dahin steht er hier vollständig.

---

## Was das Werkzeug ist

**`werkzeuge/artikel`** — ein Bash-Menü, das den Weg aus Runbook §6 abbildet. **Committet am 05.09.2026 als `15b6c09`.**

**Anlass:** Der Livegang lief über die Shell und über Claude Code. Der Weg hat neun Schritte, drei davon sind still — der stillste ist der Entwurfsschalter (grüner Bau, fehlende Seite, 404). **Ein Menü kostet nichts und ersetzt das Erinnern.**

**Eigenschaften, die aus den bestehenden Entscheiden folgen:**

- **Bash, keine Abhängigkeiten**, bash-3.2-tauglich — die Version auf einem Mac ohne Homebrew. Passt zu `werkzeuge/anonymisierung-pruefen.sh`.
- **Kein Klarwert in der Ausgabe**, nur Datei und Zeilennummer — dieselbe Regel wie im Prüfskript. **Die Ausgabe darf man einem Assistenten zeigen.**
- **Jeder schreibende Schritt fragt vorher und zeigt vorher, was er tun würde.** Standardantwort ist Nein; Enter heisst abbrechen.
- **Der Übergabeordner bleibt unangetastet**, bis der Artikel live ist — es wird kopiert, nicht verschoben. Erst danach wandert die Fassung nach `erledigt/`.
- **Die Anleitung steckt im Werkzeug** (Menüpunkt `h`).

## Die Menüpunkte

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

## `erledigt/` — Entscheid 04.09.2026

**`~/Downloads/blogbeitraege/erledigt/`** nimmt die gelieferte Fassung auf, sobald der Artikel live ist.

**Warum überhaupt:** Die Auswahlliste im Werkzeug wächst sonst mit jedem Beitrag. **Irgendwann wählt man in einer Liste von zwanzig die falsche Zeile** — dieselbe Fehlerklasse wie der Koordinaten-Klick in einer umsortierten Portliste.

**Warum verschoben und nicht gelöscht:** Die Fassung, die ausgeliefert wurde, bleibt nachlesbar. **Sie ist ab dem Commit trotzdem nicht mehr die Quelle** — deshalb heisst der Ordner `erledigt` und nicht `archiv`.

**Die Bedingung fürs Verschieben ist gemessen, nicht angenommen:** Der Artikel muss im Repo liegen **und** dort `entwurf` auf etwas anderes als `true` haben. Alles andere bleibt liegen, mit Begründung in der Zeile.

🔑 **Nebenertrag, der wichtiger ist als das Aufräumen:** Der Vergleich zwischen `erledigt/<slug>.mdx` und der Fassung im Repo beantwortet die Frage *„wurde am Text vor dem Livegang noch etwas geändert?"* **als Messung statt aus der Erinnerung.** Am 05.09. so geprüft: bei `wlan-pro-stockwerk.mdx` war es genau eine Zeile — `entwurf: true` → `false`. Damit war nichts ans Homelab-Projekt zurückzutragen, und das war belegt statt vermutet.

⚠️ **Fürs Runbook §1 nachzutragen:** Der Übergabeordner hat jetzt einen Unterordner. **`.md`-Dateien dort werden vom Aufräumen nicht angefasst** — es bewegt nur `.mdx`.

## Die Prüfungen — und warum jede drin ist

| Prüfung | Anlass |
|---|---|
| **Entwurfsschalter, richtungsabhängig** — bei Übernahme muss er `true` sein, bei Freigabe `false` | Runbook §6, Lesefragen 3 und 4. **Sie sehen ähnlich aus und prüfen Gegenteiliges** — deshalb prüft das Werkzeug pro Schritt genau eine Richtung und nennt sie im Klartext |
| **Fehlt `entwurf` ganz → rot** | Schema-Standard ist `false`: ein Artikel ohne das Feld geht mit dem nächsten Push live |
| **Fremdfelder `title`, `description`, `pubDate`, `tags`, `draft`, `author`** | sehen richtig aus und sind es nicht — das Schema ist deutsch |
| **`paar` gegen Dateinamen** | daran hängt hreflang |
| **`<TLDR>` genau einmal und als erstes Element** · Zählung Erklärungen/Prompts/FAQ | Editorial |
| **Prompt-Box ohne „Lade keine …"** → rot | Editorial-Regel: ein Prompt, der den Leser implizit zum Hochladen zwingt, hält die Regel dem Wortlaut nach ein und bricht sie in der Sache |
| **`<Affiliatelink>`** → Warnung | nur mit Provisionskennung, sonst ist die Kennzeichnung selbst falsch |
| **Roher ```mermaid-Block** → rot | es gibt kein Mermaid-Plugin, und es kommt keines |
| **Absoluter interner Link** → Warnung | `rehype-external-links` unterscheidet nach Protokoll und gäbe ihm `_blank` |
| **`--py-line` im SVG** → rot | Kontrast 1.31/1.46, s. Runbook §8 |
| **Nach dem Bau:** liegt die Seite in `dist/`, und steht der Slug in Liste, `rss.xml`, `sitemap-0.xml`, `llms.txt`? | alle vier ziehen aus `alleArtikel()`; **fehlt einer, fehlen alle** |
| **Nachmessung mit Kontrollmessung** — ein erfundener Pfad muss 404 liefern | ohne sie beweist die 200 nichts (Soft-404, `a2ee9a9`) |

## 🔑 Was das Werkzeug ausdrücklich **nicht** kann

- **Es sieht nicht.** Sichtabnahme hell/dunkel, Desktop/Handy, Diagramm-Wirkung, Bildhintergründe.
- **Es liest keine Bedeutung.** Ortshinweise in Prosa, unbelegte Aussagen, die Kombination aus Anbieter und Zeitpunkt, doppelte Pointen aus früheren Artikeln.
- **Ein grüner Lauf ist kein Freibrief.** Das Werkzeug sagt das nach jedem sauberen Durchgang selbst.

> **Merksatz: Ein Werkzeug, das alle prüfbaren Schritte übernimmt, macht die unprüfbaren zur einzigen verbleibenden Arbeit — es muss sie deshalb benennen, sonst verschwinden sie hinter dem grünen Haken.**

## Betriebsregel: wo das Werkzeug läuft

**Im Terminal am Mac, nicht aus einer Cowork-Sitzung heraus.**

Am 04.09. blieben zwei Git-Sperrdateien im Repo liegen, weil eine Cowork-Sitzung `git status` im verbundenen Ordner ausführte — **und dort nicht löschen kann.** Sie mussten umbenannt statt entfernt werden; im Originalnamen hätten sie jedes Git-Kommando blockiert. ✅ **Am 05.09. von Cedric gelöscht.**

> **Merksatz: Ein Kanal, der schreiben darf, aber nicht aufräumen, hinterlässt genau die Reste, die er selbst erzeugt.** Aus Cowork wird im Repo gelesen, nicht gearbeitet.

## Stand und Offenes

| Punkt | Stand |
|---|---|
| `werkzeuge/artikel` committet | ✅ **05.09.2026, `15b6c09`** |
| Git-Sperrdateien entfernt | ✅ 05.09.2026 |
| `erledigt/` eingeführt und im Werkzeug automatisiert | ✅ 04.09.2026 |
| Erster echter Durchlauf | ✅ **05.09.2026, Beitrag 3 „WLAN pro Stockwerk" (`a68ed3f`)** — Freigabe, Push und Nachmessung liefen ohne Abweichung |
| **Runbook §6 ergänzen** | ⬜ **offen** — Schritt 1–6 sind ab jetzt Menüpunkte; die Tabelle bleibt die Begründung, das Werkzeug wird die Ausführung. **Dazu `erledigt/` in §1 nachtragen** |
| **Diese Datei als §10 ins Runbook einhängen** | ⬜ **offen** — bis dahin steht sie eigenständig daneben |
