# CLAUDE.md — Pixelyard Blog

Regeln für die Arbeit in diesem Repo. **Diese Datei ist committet und reist mit.**
**Klarwerte stehen bewusst nicht hier** — siehe Abschnitt „Anonymisierung".

---

## Was hier gebaut wird

Ein statischer Blog über den Aufbau eines privaten Homelabs — Netz, NAS, lokale KI, Dokumentenarchiv.

**Stack:** Astro → Cloudflare Pages. **Bewusst nicht auf der NAS**: die Architektur des Heimnetzes ist „inbound = nichts", und ein selbst gehosteter Blog wäre das erste Loch darin.

---

## Sprache

Deutsch, **Schweizer Schreibweise** — kein `ß`, immer `ss`. Zahlen mit Apostroph als Tausendertrennzeichen (`79'216`).

Nüchtern, erste Person, keine Marketingsprache. Der Blog lebt davon, dass ein Nicht-Admin ehrlich berichtet — nicht davon, dass er kompetent klingt.

---

## Inhaltliche Leitlinie

**Nicht** „so klickst du X zusammen", sondern **Entscheidungswege mit Zahlen** — einschliesslich dem, was schiefging und was es gekostet hat. Das Verworfene gehört in den Artikel, nicht nur das Gewählte.

Drei Regeln, die aus der Praxis kommen und die Qualität tragen:

1. **Jede Behauptung, die eine Messung sein könnte, ist eine Messung — oder sie wird als Annahme markiert.** „Vermutlich", „sollte", „dürfte" sind erlaubt, aber sie müssen dastehen.
2. **Ein grüner Status ist kein Nachweis.** Wenn ein Artikel behauptet, etwas funktioniere, nennt er die Zahl oder das Protokoll, an dem man es sieht.
3. **Ein Irrtum, der korrigiert wurde, ist wertvoller als ein Ergebnis, das immer schon stimmte.** Korrekturen werden nicht wegretuschiert, sondern als solche geschrieben.

---

## Git

- **Zweistufige Identität:** global die private Adresse, **lokal in diesem Repo die Projektadresse**.
- ⚠️ Die lokale Einstellung **niemals** global überschreiben.
- Die Werte stehen in der Git-Konfiguration (`git config user.email` bzw. `--global user.email`). **Sie gehören nicht in diese Datei.**
- **Vor jedem Umschreiben von Historie:** `git remote -v` prüfen und eine Sicherungs-Ref anlegen —
  `git update-ref refs/backup/<name> HEAD`
- Historie umzuschreiben ist unproblematisch, **solange kein Remote sie kennt**. Ab dem ersten Push nie wieder ganz.
- ⚠️ **Eine Sicherungs-Ref bewahrt genau das auf, was entfernt werden soll.** Nach der Abnahme löschen, sonst ist die Entfernung Theater.

---

## 🔴 Anonymisierung — die härteste Regel im Repo

Sie hat **zwei Hälften**, und die liegen bewusst an verschiedenen Orten.

### Hälfte 1 — strukturelle Muster. Stehen hier, weil sie keine Werte sind.

Nie in Artikeln, Code, Commit-Nachrichten, Dateinamen oder Bildern:

- **IP-Adressen** jeder Art
- **MAC-Adressen**
- **Hostnamen**, insbesondere `.local`- und `.arpa`-Namen
- **VLAN-IDs** jeder Art
- **Netz-Topologie im Konkreten** — welche **Geräte, Namen oder Adressen** in welchem
  Segment liegen. ⚠️ **Nicht** die Zonenstruktur als solche: Segmente und
  Gerätegattungen ohne Werte („Familie", „Server", „Firmenlaptop") sind erlaubt und
  ausdrücklich Inhalt des Blogs — `designbrief.md` §5a. Verboten ist die Verengung auf
  das *Wo*, nicht die Struktur, die das *Was* erklärt.
- **Serien-, Beleg-, Bestell- und Kundennummern**
- **Wohnadresse** — auch auf Fotos und Screenshots. **Ohne Ausnahme, seit 07.09.2026.**
  Die frühere Ausnahme fürs Impressum ist zurückgenommen, s. unten.

### 🔴 ZURÜCKGENOMMEN am 07.09.2026: die Adresse im Impressum

> **Diese Ausnahme gilt nicht mehr.** Der Abschnitt bleibt stehen, weil das, was an ihm
> schiefging, mehr wert ist als der Entscheid selbst. Was hier eingerückt folgt, ist
> **Vergangenheit** — Regel ist der Text darunter.

> **Entscheid vom 28.08.2026** (`claude/entscheid_impressum_datenschutz.md`): Die
> Wohnadresse wird im **Impressum** genannt, weil der Blog mit Preisvergleichs-Links
> unter die Impressumspflicht nach UWG Art. 3 Abs. 1 lit. s fällt. Ausgenommen war
> **genau eine Datei**: `src/lib/seite.ts` — nicht die Impressumsseite, die die Werte
> nur liest. Begründet wurde die enge Fassung damit, dass ein Wert an *einer*
> kontrollierten Stelle zurücknehmbar bleibt.

**Was jetzt gilt:** Die Postanschrift steht nirgends im Repo. Das Impressum nennt Vor- und
Nachnamen und die Mailadresse auf der eigenen Domain; beide waren schon vorher öffentlich.
`src/lib/seite.ts` hat **keinen Sonderstatus mehr** — für die Klarwerte-Suche ist sie eine
Datei wie jede andere.

**Der Grund für die Rücknahme:** `MERKMALE.affiliate` steht auf `false`. Es fliesst kein
Geld, also greift die Begründung nicht, die die Adresse dorthin gebracht hat. ⚠️ **Wer
`affiliate` wieder einschaltet, holt sich die Frage zurück** — und zwar als Rechtsfrage,
nicht als Codefrage.

### 🔴 Was daran schiefging — der eigentliche Grund, warum das hier stehen bleibt

Die Adresse stand vom **28.08. bis zum 07.09.2026** in einer committeten Datei. **Zehn
Tage, 32 von 38 Commits, ein öffentliches Repo, alles gepusht.** Das Prüfwerkzeug hat sie
in dieser Zeit **kein einziges Mal gemeldet**. Drei Ursachen, gleichzeitig wirksam:

1. **Das Skript kannte kein Adressmuster.** Es suchte IP, MAC, Hostname, VLAN und
   Nummern — Strasse, PLZ und Ort waren für Abschnitt 1 schlicht nicht vorhanden. Es
   hätte eine Anschrift in **jeder** Datei übersehen, nicht nur in der ausgenommenen.
2. **Die Ausnahme war eine Datei-Ausnahme statt einer Wert-Ausnahme.** Abschnitt 3
   filterte `grep -v "^\./src/lib/seite.ts:"` — und damit war die einzige Datei, in der
   der Wert lag, für die Klarwerte-Suche **ganz** blind. Nicht nur für die Adresse: für
   **jeden** Klarwert.
3. **Der Hook kam zu spät und hätte auch nichts geändert.** `core.hooksPath` ist eine
   lokale Einstellung; der Hook wurde erst am 05.09.2026 committet, acht Tage und 31
   Commits nach dem Eintritt der Adresse. Und er hätte durchgewunken — das Skript
   meldete sauber.

🔑 **Der Befund, der über den Einzelfall hinausgeht:** `--historie` meldete
**„✅ Kein Befund" über 291 Objekte**, während die Adresse in 32 Commits stand. Das ist
die eigene Regel „ein grüner Status ist kein Nachweis", angewandt auf das Werkzeug, das
den Nachweis liefern soll. **Ein Wächter, der den offensichtlichsten Wert übersieht, ist
gefährlicher als gar keiner — weil man ihm vertraut.**

**Was daraus folgt, als Regel:**

> **Eine Ausnahme wird auf den WERT gesetzt, nie auf die DATEI.** Der Wert wird aus der
> Fundzeile gestrichen, die Zeile danach **erneut** geprüft. Steht dort noch etwas
> anderes, schlägt es weiterhin an. Eine Datei-Ausnahme kann das nicht: Sie nimmt nicht
> einen Wert aus, sondern alle künftigen dazu.

Die Bauform steht im Skript bei `127.0.0.1` und bei den Doku-Platzhaltern
(`Musterstrasse`, `1234 Mbit`, `2016 The`) — **nicht neu erfinden, dort abschauen.**

⚠️ **Die einzige verbliebene Datei-Ausnahme ist Abschnitt 2**, und sie ist richtig: Er
sucht Werte, die **aus** `src/lib/seite.ts` stammen, und fände sonst bei jedem Lauf die
Quelle selbst.

### 🔴 Entscheid vom 07.09.2026: die Historie bleibt, wie sie ist

**Kein Rewrite, kein Force-Push, das Repo bleibt öffentlich.** Die Adresse bleibt in den
32 Commits stehen, in denen sie steht.

**Begründung:** Der Wert war öffentlich und ist über andere Wege ohnehin auffindbar. Ein
Rewrite eines **gepushten** Standes erreicht Forks, vorhandene Klone und GitHubs eigene
Objektaufbewahrung nicht mehr — er erzeugt die Gewissheit, die er nicht deckt. Genau davor
warnt die Regel weiter oben: *„Ab dem ersten Push nie wieder ganz."*

⚠️ **Das ist ein Entscheid und kein Versäumnis.** Wer in drei Monaten über die Fundstellen
stolpert, hat nichts entdeckt, was hier nicht schon stünde.

🔑 **Die Historie ist ab jetzt der Regressionstest für das Prüfskript.** Sie enthält einen
bekannten, echten Klarwert an bekannter Stelle:

```
./werkzeuge/anonymisierung-pruefen.sh --historie
→ muss 6 Fundstellen in 3 Objekten melden, EXIT 1
  (3 Blob-Fassungen von src/lib/seite.ts = 1 + 23 + 8 = 32 Commits)
```

**Meldet dieser Lauf eines Tages wieder grün, ist nicht der Bestand sauber geworden,
sondern das Skript kaputt.** Das ist der einzige Test im Projekt, der einen echten
Klarwert benutzt — und der einzige, der beweist, dass Abschnitt 1 und Abschnitt 3
tatsächlich greifen.

**Prüfbar statt vereinbart.** Vor jedem Commit über die vorgemerkten Änderungen:

```
git diff --cached | grep -nEi \
  '([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-f]{2}:){5}[0-9a-f]{2}|[a-z0-9-]+\.(local|arpa)\b|VLAN ?[0-9]+|(Beleg|Bestell|Kunden|Serien)\w*nummer'
git diff --cached | grep -nE \
  '[A-ZÄÖÜ][a-zäöü-]{2,}(strasse|str\.|weg|gasse|platz|wies)[ ]+[0-9]{1,4}[a-z]?\b|\b(CH-)?[1-9][0-9]{3}[ ]+[A-ZÄÖÜ][a-zäöü]{2,}'
```

⚠️ **Zwei Zeilen, und die zweite ohne `-i`.** Ein Ortsname beginnt gross; mit `-i` meldet
jede Messtabelle `1012 mbit/s` als Postleitzahl, und ein Werkzeug, das immer rot ist, wird
weggeklickt. **Die zweite Zeile fehlte bis zum 07.09.2026 ganz** — das ist der Grund,
warum die Adresse zehn Tage lang durchkam.

**Kein Treffer = sauber. Treffer = anhalten**, nicht „ist ja nur ein Beispiel".

> 🔑 Beide Zeilen zusammen sind trotzdem nur die halbe Prüfung: Sie sehen den
> **vorgemerkten Diff**, nicht den Bestand und nicht die Historie. Der ganze Lauf ist
> `./werkzeuge/anonymisierung-pruefen.sh`, und er hängt als pre-commit-Hook davor.
> ⚠️ `core.hooksPath` ist **lokal** und wandert nicht mit — nach einem frischen Klon
> einmal `git config core.hooksPath werkzeuge/git-hooks` setzen, sonst läuft gar nichts.

> Diese Zeile ist der eigentliche Schutz. **Eine Regel, deren Einhaltung man prüfen kann, ist mehr wert als zehn, die man vorsorglich hinschreibt.**

### Hälfte 2 — die benannten Ersetzungen. Stehen ausdrücklich NICHT hier.

Regionalversorger, Standortangaben und Mailadressen sind **identifizierend**. Eine Liste dieser Werte wäre die dichteste Sammlung von Klardaten im ganzen Projekt — ausgerechnet die in eine Datei zu legen, die für ein öffentliches Repo bestimmt ist, kehrt ihren Zweck um.

➡️ **Sie stehen in `../pixelyard-klarwerte.md` — eine Ebene über dem Repo, ausserhalb des Arbeitsbaums.**

⚠️ **Vor jeder Veröffentlichung diese Datei lesen und die dort gelisteten Zeichenketten ersetzen.**

**Warum ausserhalb des Repos und nicht per `.gitignore`:** Eine Datei, die nicht im Repo liegt, **kann** nicht committet werden. Eine gitignorierte kann — mit `git add -f`, oder wenn die Zeile bei einem Rewrite verlorengeht. **Eine Regel, die durchgesetzt ist, schlägt eine, die vereinbart ist.**

*(`/pixelyard-klarwerte.md` steht zusätzlich in der `.gitignore` — als Notbremse für den Fall, dass doch einmal eine Kopie im Repo landet. Die Notbremse ersetzt den Ort nicht.)*

### Das Kriterium, wenn ein Fall in keiner Liste steht

> **Veröffentlichbar ist, *was* gebaut wurde. Nicht veröffentlichbar ist, *wo* es steht und *wie* man hinkommt.**

Damit ist „Mirror statt RAIDZ", „32 statt 24 GB", „kein inbound" **kein** Konflikt, sondern genau der Inhalt des Blogs — die Entscheidungslogik ist das Produkt. Adresse, Regionalversorger, Netzsegment und Hostname fallen auf die geschützte Seite, weil sie ausschliesslich das *Wo* verengen und zur Sache nichts beitragen.

### ⚠️ Die Reihenfolge, die schon einmal Geld gekostet hat

Eine Anonymisierungsregel gilt **nicht** erst ab ihrer Einführung. **Beim Aufstellen oder Ändern gehört der erste Lauf rückwärts über den Bestand**, nicht vorwärts über das Neue. Genau das wurde am 24.08.2026 versäumt — und am 25.08. lag eine Heimnetz-IP in der Git-Historie.

---

## Was Claude in diesem Repo nicht tut

- **Kennwörter, Tokens oder Schlüssel** entgegennehmen, hinschreiben oder eintippen
- **Klarwerte aus `pixelyard-klarwerte.md` in eine Datei im Repo kopieren** — auch nicht „als Beispiel"
- **`git push`, bevor der Anonymisierungs-Check gelaufen ist**
- **Behauptungen als Messungen ausgeben.** Was nicht geprüft wurde, wird als ungeprüft benannt
- In Terminals oder IDEs tippen; Zahlungen auslösen; Bedingungen akzeptieren; Konten anlegen

---

## Build & Dev

**Astro-Gerüst steht seit 28.08.2026.** Vorlage `examples/minimal`, Astro `7.2.9`.
**Dazugekommen am 28.08.2026 mit dem Design-System:** `@astrojs/mdx` (die Bauteile stehen
mitten im Fliesstext, das geht mit reinem Markdown nicht), `@astrojs/sitemap`, `@astrojs/rss`.

### Was auf dem Mac vorausgesetzt wird — und am 28.08.2026 dort eingerichtet wurde

Der Mac hatte **kein Node**. Das stand in keinem Dokument und ist der Grund, warum es jetzt hier steht.

| Werkzeug | Stand, gemessen |
|---|---|
| Homebrew | 6.0.20, in `/opt/homebrew`. `PATH` über `~/.zprofile`, Zeile aus der Installationsausgabe |
| Node | `brew install node@24` → **v24.20.0** (LTS), keg-only. `PATH` über `~/.zshrc`: `/opt/homebrew/opt/node@24/bin` |
| npm | 11.19.0, mit Node mitgeliefert |

🔑 **Bewusst LTS und nicht die aktuelle Hauptversion.** `brew install node` hätte 26.x gebracht. Zwei Gründe: `sharp` — Astros Bildoptimierung, im Baum vorhanden — hinkt mit fertigen Binärpaketen bei neuen Node-Hauptversionen hinterher, und **lokal soll dieselbe Hauptversion laufen wie später im Cloudflare-Bau.** Ein Unterschied dort fällt erst im Deploy auf.

⚠️ **npm meldet beim Installieren, dass 12.0.2 verfügbar sei. Nicht global aktualisieren.** Das npm gehört zur keg-only Node-Installation; ein globales Update daneben erzeugt zwei npm im Zugriff und eine Fehlersuche, die niemand braucht.

| Befehl | Wirkung |
|---|---|
| `npm install` | Abhängigkeiten. **Nur auf dem Mac** — der Baum enthält plattformabhängige Binärteile (`@rollup/rollup-darwin-arm64`, `sharp`). Eine Linux-Installation ist hier unbrauchbar und umgekehrt |
| `npm run dev` | Entwicklungsserver |
| `npm run build` | statische Ausgabe nach `dist/` |
| `npm run preview` | `dist/` lokal ausliefern |

🔑 **`astro.config.mjs` trägt `site: 'https://www.pixelyard.ch'`** — Entscheid vom 26.08.2026. Sitemap, `hreflang`, Canonical und OG-Meta hängen daran. **Nicht anfassen, ohne den Entscheid selbst zu ändern.**

### Die Prüfungen aus dem Aufsetzen — gelaufen am 28.08.2026, alle sauber

1. `git check-ignore -v CLAUDE.md` → keine Ausgabe. `CLAUDE.md` reist mit.
2. `/pixelyard-klarwerte.md` und `.DS_Store` stehen weiterhin in der `.gitignore` — die Astro-Einträge wurden **angehängt**, die Datei nicht ersetzt.
3. `dist/`, `.astro/`, `node_modules/` aus der Vorlage übernommen, nicht geraten.
4. Anonymisierungs-`grep` über die vorgemerkten Änderungen → kein Treffer.

⚠️ **Wiederholen, sobald der Assistent noch einmal über den Ordner läuft** — etwa bei `astro add`. Er kann die `.gitignore` ersetzen.

### Design-System — steht seit 28.08.2026

Aufbau, damit klar ist, wo etwas hingehört:

| Ort | Rolle |
|---|---|
| `src/styles/tokens.css` | **Einzige Quelle für Farbwerte.** Ausserhalb dieser Datei steht kein Hex-Wert |
| `src/styles/schriften.css` | `@font-face`, **erzeugt** — nicht von Hand ändern, s. `public/fonts/HERKUNFT.md` |
| `src/styles/basis.css` | Grundelemente, Fliesstext, Tabellen, Seitenraster |
| `src/styles/bausteine.css` | die Bauteile aus `designbrief.md` §4 |
| `src/components/` | `Erklaerung`, `Prompt`, `TLDR`, `Affiliatelink`, `Schalter`, `Wortmarke`, `Kopf`, `Fuss` |
| `src/lib/seite.ts` | Sprachen, Oberflächentexte, Autorangaben. **Wird beim Push öffentlich** |
| `src/lib/artikel.ts` | Auswahl über der Sammlung — Liste, RSS, `llms.txt` benutzen dieselbe |
| `src/scripts/oberflaeche.ts` | die drei Schalter und der Kopieren-Knopf |

⚠️ **Kein `margin`-Kurzschreiben in Bauteilen, die im Lesestrom stehen — nur `margin-block`.**
Das Kurzschreiben setzt auch die seitlichen Abstände auf `0` und schlägt damit das
`margin-inline: auto` aus `basis.css`. Der Bau bleibt grün, die Seite steht schief.
**Am 28.08.2026 genau so passiert** und erst im Screenshot aufgefallen.

⚠️ **Endet eine Zeile in einer `.astro`-Datei mit `</em>`, `</code>`, `</strong>` oder
`</a>` und geht der Satz in der nächsten Zeile weiter, verschwindet das Leerzeichen.**
Ergebnis: `Data Privacy Frameworkeinen angemessenen Schutz`. Der Bau bleibt grün.
Abhilfe: `{' '}` ans Zeilenende. Prüfbar mit

```
grep -nE "</(em|strong|code|a)>$" src/pages/**/*.astro src/**/*.astro
```

und dann durchsehen, ob der Satz weitergeht. **Am 28.08.2026 zweimal passiert** — beide
Male erst im gerenderten Bild aufgefallen, nie im Bau.

⚠️ **`<Erklaerung>`, `<Prompt>` und `<TLDR>` werden dem MDX von der Artikelseite
übergeben** (`src/pages/[sprache]/artikel/[...slug].astro`), nicht im Artikel importiert.
Ein Import, den man vergessen kann, wird vergessen.

🔑 **`<Affiliatelink>` nur, wenn Geld fliesst.** Ein Produkt- oder Shop-Link wird genau
dann als Bauteil gesetzt, wenn er eine Provisionskennung trägt und daraus eine Vergütung
entsteht. Jeder andere externe Link — auch der auf einen Händlerblog oder eine
Produktseite — bleibt gewöhnlicher Markdown-Link. Die Kennzeichnung „Werbung" ist sonst
selbst eine Falschangabe, und `MERKMALE.affiliate` schaltet Abschnitte in Impressum und
Datenschutzerklärung mit, die dann etwas behaupten, was nicht stattfindet.

**Schriftpaarung entschieden am 28.08.2026: IBM Plex Mono + IBM Plex Sans**
(`designbrief.md` §3, Paarung A) — am Vergleich mit echtem Artikeltext, nicht am Brief.
Die Vergleichsseite und die drei anderen Familien sind im selben Zug entfernt worden.
**Es liegen nur noch die Schriften im Repo, die auch ausgeliefert werden** — 212 KB, 12 Dateien.

### 🔑 `package-lock.json` gehört ins Repo

Sie ist der einzige Beleg dafür, **welche Versionen tatsächlich installiert wurden** — `^7.2.9` in der `package.json` ist ein Bereich, die Lockfile ist die Zahl. Cloudflare Pages baut daraus; fehlt sie, löst der Bau die Bereiche neu auf und kann andere Versionen erwischen als der Mac. **Der Fehler zeigt sich dann im Deploy und nicht lokal.**

`node_modules/` dagegen **nie** — 141 MB, plattformgebunden, und aus der Lockfile jederzeit reproduzierbar.

⚠️ **`README.md` ist noch die Astro-Vorlage.** Sie wird beim ersten Push öffentlich sichtbar und gehört vorher ersetzt.

