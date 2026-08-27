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
- **VLAN-IDs und Netz-Topologie** — welches Segment was enthält
- **Serien-, Beleg-, Bestell- und Kundennummern**
- **Wohnadresse** — auch auf Fotos und Screenshots

**Prüfbar statt vereinbart.** Vor jedem Commit über die vorgemerkten Änderungen:

```
git diff --cached | grep -nEi \
  '([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-f]{2}:){5}[0-9a-f]{2}|[a-z0-9-]+\.(local|arpa)\b|VLAN ?[0-9]+|(Beleg|Bestell|Kunden|Serien)\w*nummer'
```

**Kein Treffer = sauber. Treffer = anhalten**, nicht „ist ja nur ein Beispiel".

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

**Noch kein `package.json`.** Sobald das Astro-Gerüst steht, kommen die Befehle hierher.

⚠️ **Beim Aufsetzen, gemessen an `create-astro@5.2.4`:**

1. `CLAUDE.md` vorübergehend aus dem Ordner heraus verschieben — **nicht löschen**
2. `npm create astro` **ohne** `--yes` laufen lassen. Mit `--yes` weicht der Assistent bei einem nicht-leeren Ordner **still in einen Zufallsordner** aus, statt zu fragen
3. `CLAUDE.md` zurücklegen
4. `git check-ignore -v CLAUDE.md` — muss **nichts** ausgeben (seit der Aufteilung vom 26.08. reist `CLAUDE.md` mit). Dazu `cat .gitignore`: `/pixelyard-klarwerte.md` und `.DS_Store` müssen noch drinstehen — der Assistent kann die Datei überschrieben haben. Fehlt etwas, wieder eintragen, **bevor** irgendetwas committet wird
5. `node_modules/`, `dist/`, `.astro/` aus der **generierten** `.gitignore` übernehmen, nicht vorweg raten

> **Die Bedingung, die die Version überlebt:** Zum Zeitpunkt des Aufsetzens dürfen im Projektordner nur `.git` und `.gitignore` liegen. Alles andere lässt den Assistenten den Ordner als „nicht leer" behandeln.
