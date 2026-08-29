# Runbook: Artikel vom Homelab-Projekt ins Repo

**29.08.2026** · Gilt für jeden Beitrag. Die Schemafelder in §2 sind **gelesen** (Bericht Claude Code, 29.08.), nicht aus dem Gedächtnis.

---

## 1. Adressaten

| Wer | Was |
|---|---|
| **Claude Cowork im Homelab-Projekt** | schreibt und anonymisiert den Artikel, liefert `.mdx` |
| **Cedric** | Download am Mac → `~/Downloads/blogbeitraege/` |
| **Claude Code**, `~/Projekte/pixelyard` | Kopie ins Repo, Angleichen, SVG, Prüfskript, Commit, Push |
| **Claude im Pixelyard-Projekt** | Entscheide, Runbook, Nachtragen |

**Übergabeordner:** `~/Downloads/blogbeitraege/` — ausserhalb des Repos, das Prüfskript läuft dort nicht. Original bleibt liegen, ins Repo wird kopiert.

---

## 2. Schema der Sammlung `artikel` — `src/content.config.ts`

Loader: `glob`, Basis `src/content/artikel`, Muster `**/*.{md,mdx}`. Die `id` ist `de/<name>`.

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

⚠️ **`paar`** ist in Artikel 1 gleich dem Dateinamen. Nach Feldname und Designbrief §6a der Schlüssel für das Sprachpaar (`hreflang`). **Ableitung, nicht gelesen** — mit `grep -rn paar src/` zu bestätigen.

Nicht vorhanden: `title`, `description`, `pubDate`, `tags`, `draft`.

---

## 3. Bauteile

`<TLDR>`, `<Erklaerung>`, `<Prompt>`, `<Affiliatelink>` — keine Import-Zeilen in der `.mdx`; `src/pages/[sprache]/artikel/[...slug].astro` reicht sie über `components={bausteine}` durch. Markdown im Inneren wird gerendert. `<TLDR>` als erstes Element.

⚠️ Nebenbefund: `Affiliatelink` fehlt in der Bauteil-Tabelle der `CLAUDE.md`. Nachzutragen.

---

## 4. Diagramme

`package.json`: nur `astro`, `@astrojs/mdx`, `@astrojs/rss`, `@astrojs/sitemap`. **Kein Mermaid-, remark- oder rehype-Paket.** Entscheid: keines hinzufügen. Mermaid → SVG im Repo, Farben über CSS-Variablen aus `tokens.css`, Mermaid-Quelle als Kommentar behalten. Zahlen stehen zusätzlich als Tabelle (Designbrief §6).

---

## 5. Entwürfe

`src/lib/artikel.ts` Z. 11/15: `zeigeEntwuerfe = import.meta.env.DEV` — Entwürfe erscheinen im Dev-Server, nie im Bau. **Gelesen, nicht gemessen:** Dev-Server wurde nicht gestartet.

---

## 6. Die Schritte

| # | Adressat | Schritt | Prüfpunkt |
|---|---|---|---|
| 0 | Cowork/Homelab | `.mdx` mit Schema aus §2, Bauteile, Mermaid-Quelle im Kommentar, Anonymisierung | Zählung TL;DR/Erklärung/Prompt geliefert |
| 1 | Cedric | Download → `~/Downloads/blogbeitraege/` | `ls -l`, `wc -w` |
| 2 | Claude Code | Kopie nach `src/content/artikel/de/<slug>.mdx`, Frontmatter gegen §2 | `npm run build` ohne Schemafehler |
| 3 | Claude Code | Mermaid → SVG | Sichtprüfung hell/dunkel, Tabelle vorhanden |
| 4 | Claude Code | `./werkzeuge/anonymisierung-pruefen.sh`, SVGs einzeln lesen | drei Abschnitte sauber, Teilwort-Hinweise gelesen |
| 5 | Claude Code + Cedric | `npm run dev`, Artikel im Browser | Screenshot zeigt CSS; `git diff` zeigt `entwurf: true` |
| 6 | Claude Code | Commit, Push | `curl -s https://www.pixelyard.ch/de/ \| grep -c <slug>` → `0` |
| 7 | Claude im Pixelyard-Projekt | Nachtragen, was abwich | diese Datei aktualisiert |

**Freigabe später:** `entwurf: false`, Commit, Push, derselbe `curl` mit Erwartung `≥ 1`. Bei Korrekturen `aktualisiert` setzen.

---

## 7. Offen

- `paar` bestätigen (§2)
- `Affiliatelink` in `CLAUDE.md` nachtragen (§3)
- Dev-Server-Verhalten einmal messen statt lesen (§5)
- Keine Serien-Nummerierung auf der Seite; falls gewünscht, Schemafeld `serie`/`teil` als eigener Entscheid
