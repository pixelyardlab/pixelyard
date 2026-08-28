# Herkunft der Schriftdateien

**Angelegt:** 28.08.2026 · gehört zu `src/styles/schriften.css`

Alle Schriften sind **self-hosted**. Kein Google-Fonts-CDN, keine externe
Einbindung — `designbrief.md` §3:

> Ein Blog, der Local-First predigt und die Schrift von einem CDN zieht, meldet
> jeden Leser bei einem Dritten an.

## Woher die Dateien stammen

Aus den npm-Paketen `@fontsource/*`, Version **5.3.0**, bezogen am 28.08.2026 über
die npm-Registry. `@fontsource` packt die Originaldateien der Schriftprojekte in
Subsets; es ist kein eigener Schriftschnitt und keine Neuinterpretation.

Kopiert wurden ausschliesslich die `.woff2`-Dateien der Subsets **`latin`** und
**`latin-ext`**. Nicht kopiert: `cyrillic`, `cyrillic-ext`, `greek`,
`vietnamese` — sie kosten Bytes für Zeichen, die in einem deutschsprachigen Blog
nicht vorkommen. Ebenfalls nicht kopiert: die `.woff`-Fassungen. Jeder Browser,
der heute noch bedient wird, kann `woff2`.

## Was hier liegt und wozu

| Ordner | Rolle | Gewichte |
|---|---|---|
| `ibm-plex-sans/` | Fliesstext und Oberfläche | 400, 400 kursiv, 600 |
| `ibm-plex-mono/` | Überschriften, Terminal, Meta-Zeilen | 400, 600 |

**12 Dateien, 212 KB.** Es liegt nichts hier, was nicht ausgeliefert wird.

## Wie der Entscheid gefallen ist

`designbrief.md` §3 nannte drei Paarungen und einen Favoriten. Statt den Favoriten zu
übernehmen, standen vom 28.08.2026 alle drei unter `/de/schriften` — **derselbe deutsche
Artikeltext, dieselbe Meta-Zeile, derselbe Terminal-Block**, mit Umlauten, `79'216` mit
Apostroph und `Zugriffsberechtigungskonzept`. Entschieden wurde am Bild, nicht am Papier:

> **Paarung A — IBM Plex Mono + IBM Plex Sans.** Eine Familie, gleiche Metriken.

Verworfen: **Space Mono + Inter** (markanter, aber die Überschrift wird laut neben dem
Fliesstext) und **Courier Prime + Inter** (am nächsten an der Schreibmaschine, kippt aber
ins Nostalgische). Die Vergleichsseite, `src/styles/schriften-vergleich.css` und die drei
nicht gewählten Familien sind noch am selben Tag entfernt worden — **eine Entscheidungshilfe,
die stehen bleibt, wird zur Altlast.**

## Lizenz

Alle fünf Familien stehen unter der **SIL Open Font License 1.1**. Der jeweilige
Lizenztext liegt als `LICENSE` im Ordner der Familie und **muss dort bleiben** —
die OFL verlangt, dass der Lizenztext mit den Dateien mitreist.

| Familie | Copyright |
|---|---|
| IBM Plex Sans, IBM Plex Mono | 2019 IBM Corp. |
| Inter | 2016 The Inter Project Authors |
| Space Mono | 2016 The Space Mono Project Authors |
| Courier Prime | 2015 The Courier Prime Project Authors |

## Wenn eine Schrift ersetzt oder ergänzt wird

1. Paket mit `npm pack @fontsource/<name>@5` holen, entpacken.
2. Nur `files/<name>-latin-*.woff2` und `files/<name>-latin-ext-*.woff2` kopieren.
3. `LICENSE` mitkopieren.
4. `src/styles/schriften.css` nachziehen — sie ist **erzeugt**, nicht von Hand
   geschrieben; die `unicode-range`-Werte stammen aus `unicode.json` des Pakets.
5. Diese Datei ergänzen. Eine Schriftdatei ohne Herkunft ist beim nächsten
   Lizenz- oder Aktualisierungsfrage genau die, die Arbeit macht.
