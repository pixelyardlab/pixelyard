# Runbook: Artikel vom Homelab-Projekt ins Repo

**29.08.2026, v2** · Gilt für jeden Beitrag. v1 entstand vor dem ersten Durchlauf; v2 trägt nach, was der Durchlauf mit „Mein Weg ins Homelab" gezeigt hat. Alle Werte in §2, §4, §5 und §8 sind **gelesen oder gemessen** (Claude Code, 29.08.), nicht aus dem Gedächtnis.

---

## 1. Adressaten

| Wer | Was |
|---|---|
| **Claude Cowork im Homelab-Projekt** | schreibt und anonymisiert den Artikel, liefert `.mdx` mit den Feldern aus §2 |
| **Cedric** | Download am Mac → `~/Downloads/blogbeitraege/` · Sichtabnahme hell/dunkel · Freigabe |
| **Claude Code**, `~/Projekte/pixelyard` | Kopie ins Repo, Angleichen, SVG, Kontrast, Prüfskript, Commits, Push, Nachmessung |
| **Claude im Pixelyard-Projekt** | Entscheide, Runbook, Nachtragen |

**Übergabeordner:** `~/Downloads/blogbeitraege/` — ausserhalb des Repos, das Prüfskript läuft dort nicht. Original bleibt liegen, ins Repo wird kopiert.

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

| # | Adressat | Schritt | Prüfpunkt |
|---|---|---|---|
| 0 | Cowork/Homelab | `.mdx` mit Schema §2, Bauteile, Mermaid-Quelle im Kommentar, Anonymisierung | Zählung TL;DR/Erklärung/Prompt geliefert |
| 1 | Cedric | Download → `~/Downloads/blogbeitraege/` | `ls -l`, `wc -w` |
| 2 | Claude Code | Kopie nach `src/content/artikel/de/<slug>.mdx`, Frontmatter gegen §2, `entwurf: true` | `npm run build` ohne Schemafehler |
| 3 | Claude Code | Mermaid → SVG mit Tokens aus §4, **Kontrast gerechnet**, Tabelle vorhanden | Werte hell/dunkel ≥ 3:1 bzw. 4.5:1 |
| 4 | Claude Code | `./werkzeuge/anonymisierung-pruefen.sh`, SVGs einzeln lesen, Text auf Ortshinweise und unbelegte Aussagen lesen | drei Abschnitte sauber; Funde als Entscheid melden, nicht selbst entscheiden |
| 5 | Claude Code + Cedric | `npm run dev`, Artikel hell **und** dunkel ansehen | Cedric sagt „gesehen, OK" — nach dem Ansehen, nicht davor |
| 6 | Claude Code | `git status`, nur die Artikeldatei gestaged, `entwurf: true` im Diff, Commit, Push | `curl -s https://www.pixelyard.ch/de/ \| grep -c <slug>` → `0` |
| 7 | Cedric → Homelab | Textänderungen zurückmelden | Zeile, alt, neu |
| 8 | Claude im Pixelyard-Projekt | Nachtragen, was abwich | diese Datei aktualisiert |

**Freigabe:** `entwurf: false`, `datum` prüfen, Bau (Seitenzahl +1, Artikel in `rss.xml`, `sitemap-0.xml`, `llms.txt`, `/de/`), Prüfskript, Commit, Push. Nach dem Deploy — **mehrfach probieren, der Bau dauert**:

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
| `.py-werbung` Camel auf `--py-bg`: hell 2.28 | Beheben — Kennzeichnung muss lesbar sein | offen |
| `.py-erklaerung` 3px-Balken Camel auf `--py-bg` | bleibt, reine Zier | — |
| Soft-404: jeder unbekannte Pfad lieferte 200 | `404.astro`, Pages antwortet 404 | `a2ee9a9` |
| Prüfstück `mustertext-design-system.mdx` | entfernt, bleibt in der Historie, enthielt nie Klarwerte | `92b7688` |

---

## 9. Offen

- `.py-werbung` Kontrast (§8)
- Zeitmessung `editorial.md` §7 — der zweite Artikel war der erste Messpunkt, nicht gemessen
- Keine Serien-Nummerierung auf der Seite; falls gewünscht, Schemafeld `serie`/`teil` als eigener Entscheid
- Dieses Runbook liegt in v1 im Repo (`b8fb13f`); v2 nachziehen
