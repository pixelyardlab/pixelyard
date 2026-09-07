#!/usr/bin/env bash
#
# anonymisierung-pruefen.sh — der Check aus CLAUDE.md als ein Befehl.
#
#   ./werkzeuge/anonymisierung-pruefen.sh              prüft den Arbeitsbaum
#   ./werkzeuge/anonymisierung-pruefen.sh --historie    prüft ALLE Commits, nicht
#                                                       nur den Arbeitsbaum
#   ./werkzeuge/anonymisierung-pruefen.sh --selbsttest  prüft, ob dieses Skript
#                                                       überhaupt anschlägt
#
# Warum es das gibt: Der Check lief bisher von Hand. Ein Befehl mit einer Stelle
# zum Ausfüllen ist eine mögliche stille Fehlmessung — am 28.08.2026 wurde nach
# dem Beispielwert aus der Anleitung gesucht statt nach dem echten. Es kam
# nichts zurück, und das sah aus wie eine Freigabe.
#
# 🔑 Dieses Skript gibt NIE einen Klarwert aus, nur Datei und Zeilennummer.
#    Seine Ausgabe lässt sich gefahrlos weitergeben — auch an einen Assistenten.
#
set -u

# --- Welcher Ordner geprüft wird -----------------------------------------
# Ohne Angabe: der Projektordner dieses Skripts (der Blog).
# Mit --ordner <pfad>: irgendein anderer Ordner auf demselben Mac.
#
# Warum parametrierbar statt kopiert: Eine zweite Fassung derselben Prüfung
# läuft irgendwann auseinander — und dann schützt die eine, was die andere
# längst durchlässt. Die Musterliste steht deshalb genau einmal, hier.
SELBST="$(cd "$(dirname "$0")" && pwd)/$(basename "$0")"
EIGENER_ORDNER="$(cd "$(dirname "$0")/.." && pwd)"
ZIEL="$EIGENER_ORDNER"
FREMD=0

if [ "${1:-}" = "--ordner" ]; then
  [ -n "${2:-}" ] || { echo "🔴 --ordner braucht einen Pfad."; exit 1; }
  [ -d "$2" ]     || { echo "🔴 Ordner nicht gefunden: $2"; exit 1; }
  ZIEL="$(cd "$2" && pwd)"
  [ "$ZIEL" = "$EIGENER_ORDNER" ] || FREMD=1
  shift 2
fi

cd "$ZIEL" || exit 1
[ "$FREMD" -eq 1 ] && { echo "Geprüft wird: $ZIEL"; echo; }

# Die Klarwerte-Datei liegt eine Ebene über dem BLOG-Ordner — unabhängig
# davon, welcher Ordner gerade geprüft wird. Deshalb absolut, nicht relativ:
# ein relativer Pfad hätte beim Prüfen eines fremden Ordners still ins Leere
# gezeigt, und der Lauf wäre zur halben Prüfung geworden, ohne es zu sagen.
KLARWERTE="$(dirname "$EIGENER_ORDNER")/pixelyard-klarwerte.md"
AUSNAHME="src/lib/seite.ts"   # nur noch fuer Abschnitt 2, s. dort
BEFUNDE=0

# --- Die Musterliste, ab jetzt genau einmal -------------------------------
# Sie stand bis zum 07.09.2026 ZWEIMAL im Skript: einmal fuer den Arbeitsbaum,
# einmal fuer --historie. Zwei Fassungen derselben Liste laufen auseinander,
# und dann schuetzt die eine, was die andere laengst durchlaesst.
STRUKTUR='([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-f]{2}:){5}[0-9a-f]{2}|[a-z0-9-]+\.(local|arpa)\b|VLAN ?[0-9]+|(Beleg|Bestell|Kunden|Serien)\w*nummer'

# 🔴 Adressmuster — neu am 07.09.2026, und der Grund fuer diesen Commit.
#
# Bis dahin kannte dieses Skript KEIN Adressmuster. Strasse, PLZ und Ort waren
# fuer Abschnitt 1 schlicht nicht vorhanden: Es haette eine Postanschrift in
# jeder Datei uebersehen, nicht nur in der einen, die ausgenommen war.
# Genau so ist es zehn Tage lang gelaufen — s. CLAUDE.md, Abschnitt
# „Die zurueckgenommene Ausnahme".
#
# Die Wortliste ist bewusst kurz gehalten (Strasse/Weg/Gasse/Platz/Wies).
# ⚠️ Sie wird zwingend OHNE -i gesucht: Die Grossschreibung am Wortanfang ist
# der halbe Filter. Mit -i meldete „1012 mbit" eine Postleitzahl.
ADRESSE='[A-ZÄÖÜ][a-zäöü-]{2,}(strasse|str\.|weg|gasse|platz|wies)[ ]+[0-9]{1,4}[a-z]?\b|\b(CH-)?[1-9][0-9]{3}[ ]+[A-ZÄÖÜ][a-zäöü]{2,}'

# --- Wert-Ausnahmen. Ausdruecklich KEINE Datei-Ausnahmen ------------------
# Bauform wie bei 127.0.0.1: Der WERT wird aus der Fundzeile gestrichen, und
# die Zeile wird danach ERNEUT geprueft. Steht dort noch eine echte Adresse,
# schlaegt sie weiterhin an. Eine Datei-Ausnahme kann das nicht — sie macht
# die ganze Datei blind, und genau daran ist die Adresse zehn Tage lang
# vorbeigekommen.
#
#   127.0.0.1        bedeutet „dieser Rechner", auf jedem Geraet dasselbe.
#   Musterstrasse …  Doku-Platzhalter, wie 203.0.113.0/24 bei den Adressen.
#                    Steht so im Artikel drei-stille-fehler-an-einem-tag.
#   1234 Mbit …      Messwert mit Einheit, keine Postleitzahl.
#   2016 The …       englische Lizenzzeile in public/fonts, kein Ortsname.
#
# ⚠️ Die letzten beiden sind WORTGENAU ausgenommen. „4106 The" wird NICHT
# gestrichen, weil dort „Therwil" weitergeht — eine unsaubere Ausnahme haette
# eine echte Adresse still verschwinden lassen.
entwerten() {
  sed -E -e 's/127\.0\.0\.1//g' \
         -e 's/[Mm]uster(strasse|weg|gasse|platz|wies) [0-9]{1,4}//g' \
         -e 's/[0-9]{4} *(Mbit|Gbit|Kbit|Mio|Mrd|The)([^a-zA-ZäöüÄÖÜß]|$)/\2/g'
}

# --- Werte, die im Repo stehen DUERFEN ------------------------------------
# Name und Mailadresse auf der eigenen Domain sind Autorangaben; sie stehen
# oeffentlich auf jeder Seite und sind kein Klarwert im Sinne der Regel.
#
# Sie werden aus seite.ts GELESEN, nicht hier hingeschrieben: Eine zweite
# Liste, die man von Hand nachfuehren muss, wird nicht nachgefuehrt — und ein
# Werkzeug, das dann bei sauberem Bestand Alarm schlaegt, versteckt den echten
# Treffer.
#
# Absolut aufgeloest, aus demselben Grund wie bei KLARWERTE: Beim Pruefen
# eines fremden Ordners haette ein relativer Pfad still ins Leere gezeigt.
ERLAUBT=$(mktemp)
trap 'rm -f "$ERLAUBT"' EXIT INT TERM
grep -E "^[[:space:]]+(name|kontakt): '" "$EIGENER_ORDNER/$AUSNAHME" 2>/dev/null \
  | cut -d"'" -f2 | grep -v '^$' | grep -v '^PLATZHALTER' | sort -u > "$ERLAUBT"

# Streicht die erlaubten Werte BUCHSTAEBLICH aus stdin — ueber index(), nicht
# ueber einen regulaeren Ausdruck: Ein Wert mit Punkt oder Klammer haette sonst
# als Muster gewirkt und mehr weggestrichen, als er soll.
ohne_erlaubte() {
  [ -s "$ERLAUBT" ] || { cat; return; }
  awk -v datei="$ERLAUBT" '
    BEGIN { n = 0; while ((getline z < datei) > 0) if (z != "") w[++n] = z }
    {
      for (i = 1; i <= n; i++) {
        p = index($0, w[i])
        while (p > 0) {
          $0 = substr($0, 1, p - 1) substr($0, p + length(w[i]))
          p = index($0, w[i])
        }
      }
      print
    }
  '
}

# --- Selbsttest -----------------------------------------------------------
# „Ein Test, der nie rot war, hat seine Nützlichkeit nie belegt."
# Legt kurz eine Datei mit einem Muster an, das anschlagen MUSS, ruft das
# Skript normal auf und prüft, ob es rot wird. Danach wird die Datei gelöscht.
#
# Der verwendete Wert stammt aus 203.0.113.0/24 — ein Bereich, den RFC 5737
# ausdrücklich für Dokumentation reserviert. Kein Heimnetzwert, nirgends
# geroutet. Die Datei steht zusätzlich in der .gitignore.
# --- Historie ---------------------------------------------------------------
# Der normale Lauf prüft den ARBEITSBAUM. Beim Öffentlichschalten des Repos
# wird aber die HISTORIE öffentlich — jeder je committete Stand, auch der
# gelöschte. Am 25.08.2026 lag genau so eine Heimnetz-IP im Repo: aus dem
# Arbeitsbaum entfernt, in der Geschichte noch da.
#
# Dieser Lauf geht über jeden Blob in jedem Commit — jeden genau einmal.
if [ "${1:-}" = "--historie" ]; then
  echo "=== Anonymisierung über die GESAMTE Git-Historie ==="
  echo "    (jeder je committete Stand, nicht nur der aktuelle)"
  echo

  # Kein eigenes MUSTER mehr — STRUKTUR und ADRESSE stehen oben, einmal.
  WERTE=$(mktemp)
  if [ -f "$KLARWERTE" ]; then
    sed -n "/pixelyard:werte:anfang/,/pixelyard:werte:ende/p" "$KLARWERTE" 2>/dev/null \
      | grep -v "pixelyard:werte:" | sed "s/^[[:space:]]*//;s/[[:space:]]*$//" \
      | grep -v "^$" | grep -v "^#" | sort -u > "$WERTE"
  fi

  TREFFER=0
  GEPRUEFT=0
  git rev-list --objects --all | while read -r sha pfad; do
    [ -n "$pfad" ] || continue
    case "$pfad" in
      *.woff2|*.woff|*.ico|*.png|*.jpg|*.webp|*.pdf) continue ;;
      CLAUDE.md|.gitignore|werkzeuge/*) continue ;;   # Regeltexte, s. oben
      # README.md ist bewusst NICHT ausgenommen: Sie wird gelesen, sie wächst,
      # und jede Ausnahme ist ein blinder Fleck. Wo ihr Text ein Muster treffen
      # würde, wird der Text umformuliert — nicht die Prüfung abgeschaltet.
    esac
    inhalt=$(git cat-file blob "$sha" 2>/dev/null) || continue
    GEPRUEFT=$((GEPRUEFT + 1))
    # Zwei Laeufe, weil nur STRUKTUR ohne Ruecksicht auf Gross-/Kleinschreibung
    # gesucht werden darf. ADRESSE mit -i meldete jeden Messwert als Adresse.
    if printf '%s' "$inhalt" | entwerten | grep -qEi "$STRUKTUR" \
    || printf '%s' "$inhalt" | entwerten | grep -qE  "$ADRESSE"; then
      echo "  🔴 strukturelles Muster: $pfad  (Objekt ${sha:0:8})"
      TREFFER=$((TREFFER + 1))
    fi
    # 🔴 Ohne Datei-Ausnahme, seit 07.09.2026. Vorher stand hier
    # `&& [ "$pfad" != "$AUSNAHME" ]` — und damit war die eine Datei, in der
    # die Adresse tatsaechlich lag, ueber die ganze Historie hinweg blind.
    # Der Lauf meldete „✅ Kein Befund" ueber 291 Objekte, waehrend die
    # Adresse in 32 Commits stand.
    if [ -s "$WERTE" ]; then
      if printf '%s' "$inhalt" | ohne_erlaubte | grep -qwF -f "$WERTE"; then
        echo "  🔴 benannter Wert:      $pfad  (Objekt ${sha:0:8})"
        TREFFER=$((TREFFER + 1))
      fi
    fi
  done > "$WERTE.aus"

  cat "$WERTE.aus"
  # grep -c liefert bei null Treffern Status 1; ein "|| echo 0" hängt dann eine
  # ZWEITE Null an und macht aus der Zahl den String "0\n0". Deshalb getrennt.
  ANZAHL=$(grep -c '🔴' "$WERTE.aus" 2>/dev/null) || ANZAHL=0
  echo "  Objekte geprüft: $(git rev-list --objects --all | grep -c . )"
  [ -s "$WERTE" ] || echo "  ⚠️  Kein Werteblock gefunden — nur die strukturellen Muster geprüft."
  echo
  if [ "$ANZAHL" -eq 0 ]; then
    echo "✅ Kein Befund in der Historie."
    echo "   ⚠️  Commit-NACHRICHTEN sind hiervon nicht erfasst — sie liegen nicht in Blobs."
    echo "      Dafür: git log --all --format='%s%n%b' | grep -Ei '<muster>'"
    rm -f "$WERTE" "$WERTE.aus"; exit 0
  else
    echo "🔴 $ANZAHL Fundstelle(n) in der Historie."
    echo "   ⚠️  Aus der Historie entfernt man Werte NICHT durch einen weiteren Commit."
    echo "      Vor jedem Umschreiben: git remote -v prüfen, Sicherungs-Ref anlegen."
    rm -f "$WERTE" "$WERTE.aus"; exit 1
  fi
fi

if [ "${1:-}" = "--selbsttest" ]; then
  PROBE=".anon-selbsttest.tmp"
  trap 'rm -f "$PROBE" "$ERLAUBT"' EXIT INT TERM
  printf 'Testzeile mit 203.0.113.7 — darf nur Sekunden existieren.\n' > "$PROBE"
  echo "=== Selbsttest: das Skript muss jetzt anschlagen ==="
  if "$SELBST" --ordner "$ZIEL" > /dev/null 2>&1; then
    echo "🔴 FEHLGESCHLAGEN: Das Skript meldete sauber, obwohl eine Testadresse dalag."
    echo "   Es prüft also nichts. Nicht benutzen, bis das geklärt ist."
    exit 1
  else
    echo "✅ Bestanden: Das Skript hat die eingebaute Testadresse gefunden."
    echo "   Damit bedeutet ein sauberer Lauf in Abschnitt 1 etwas."
    echo
    echo "⚠️  Was dieser Selbsttest NICHT prüft: Abschnitt 2, 3 und --historie. Er schiebt"
    echo "   ein strukturelles Muster unter, keinen benannten Wert — dafür müsste er die"
    echo "   Klarwerte-Datei anfassen. Ein Test, der mehr zu belegen scheint als er"
    echo "   belegt, ist genau die Sorte Befund, um die es hier geht."
    exit 0
  fi
fi


sucheliste() {   # $1 = Liste, $2 = Beschriftung, $3 = datei|wert
  #
  # $3 entscheidet, WIE ausgenommen wird — und das ist der Kern der Korrektur
  # vom 07.09.2026:
  #
  #   datei  Abschnitt 2. Er sucht Werte, die AUS src/lib/seite.ts stammen;
  #          ohne diese Ausnahme faende er bei jedem Lauf die Quelle selbst.
  #          Das ist richtig so und bleibt.
  #   wert   Abschnitt 3. Er sucht verbotene Klarwerte UEBERALL, auch in
  #          seite.ts. Nur die Autorangaben werden aus der Fundzeile
  #          gestrichen, danach wird die Zeile erneut geprueft.
  #
  # Bis zum 07.09.2026 benutzten beide Abschnitte die Datei-Ausnahme. Damit
  # war seite.ts die einzige Datei im Repo, in der ein beliebiger Klarwert
  # unbemerkt stehen konnte — ausgerechnet die, die beim Push oeffentlich wird.
  local liste="$1" was="$2" art="${3:-datei}" treffer hinweise kurz roh rohteil
  [ -s "$liste" ] || { printf '  %-34s keine Suchbegriffe gefunden\n' "$was"; return; }

  # 🔴 Gesucht wird an WORTGRENZEN (-w), nicht als Buchstabenfolge.
  #
  # Am 28.08.2026 stand ein kurzer Vorname in der Werteliste — und steckte in
  # „Kanonische". Eine Teilstring-Suche meldet solche Zufälle als Fund. Ein
  # Werkzeug, das viel Belangloses meldet, wird nicht schärfer, sondern
  # ignoriert, und dann versteckt es den echten Treffer.
  roh=$(grep -rnwF -f "$liste" . \
      --exclude-dir=.git --exclude-dir=node_modules --exclude-dir=dist \
      --exclude-dir=.astro --exclude-dir=werkzeuge 2>/dev/null)

  # Teilwort-Vorkommen gehen NICHT verloren — sie erscheinen als Hinweis,
  # nicht als Befund. Verschweigen wäre die andere Hälfte desselben Fehlers.
  rohteil=$(grep -rnF -f "$liste" . \
      --exclude-dir=.git --exclude-dir=node_modules --exclude-dir=dist \
      --exclude-dir=.astro --exclude-dir=werkzeuge 2>/dev/null)

  if [ "$art" = "wert" ]; then
    treffer=$(printf '%s\n' "$roh"     | ohne_erlaubte | grep -wF -f "$liste" | cut -d: -f1,2)
    hinweise=$(printf '%s\n' "$rohteil" | ohne_erlaubte | grep -F  -f "$liste" | cut -d: -f1,2)
  else
    treffer=$(printf '%s\n' "$roh"     | grep -v "^\./$AUSNAHME:" | cut -d: -f1,2)
    hinweise=$(printf '%s\n' "$rohteil" | grep -v "^\./$AUSNAHME:" | cut -d: -f1,2)
  fi
  hinweise=$(printf '%s\n' "$hinweise" | grep -vxF "$treffer" 2>/dev/null)

  if [ -z "$treffer" ]; then
    printf '  %-34s sauber (%s Begriffe geprüft)\n' "$was" "$(wc -l < "$liste" | tr -d ' ')"
  else
    printf '  %-34s 🔴 FUNDSTELLEN:\n' "$was"
    printf '%s\n' "$treffer" | sed 's/^/      /'
    BEFUNDE=$((BEFUNDE + 1))
  fi

  if [ -n "$hinweise" ]; then
    echo "     ℹ️  Zusätzlich als Teil längerer Wörter gefunden — meist Zufall,"
    echo "        gilt nicht als Befund. Einmal ansehen, dann vergessen:"
    printf '%s\n' "$hinweise" | sed 's/^/        /'
  fi

  # Sehr kurze Begriffe sind auch mit Wortgrenzen unzuverlässig.
  kurz=$(awk 'length($0) < 4' "$liste")
  if [ -n "$kurz" ]; then
    echo "     ⚠️  $(printf '%s\n' "$kurz" | wc -l | tr -d ' ') Begriff(e) im Block sind kürzer als"
    echo "        vier Zeichen. Solche Werte melden Zufälle statt Funde — besser in der"
    echo "        Form eintragen, in der sie tatsächlich in einem Artikel stünden."
  fi
}

echo "=== 1. Strukturelle Muster (IP, MAC, Hostname, VLAN, Nummern, Adresse) ==="
# Muster und Wert-Ausnahmen stehen oben, einmal — s. STRUKTUR, ADRESSE,
# entwerten(). Hier steht nur noch, WIE gesucht wird.
#
# ⚠️ Zwei getrennte Läufe, und das ist kein Schönheitsfehler:
#   STRUKTUR  ohne Rücksicht auf Gross-/Kleinschreibung (-i) — MAC-Adressen
#             und Hostnamen kommen in beiden Schreibungen vor.
#   ADRESSE   ausdrücklich MIT Rücksicht darauf. Ein Ortsname beginnt gross;
#             mit -i meldete „1012 mbit/s" eine Postleitzahl, und ein
#             Werkzeug, das bei jeder Messtabelle rot wird, wird weggeklickt.
S_ROH_S=$(grep -rnEi "$STRUKTUR" . \
    --exclude-dir=.git --exclude-dir=node_modules --exclude-dir=dist \
    --exclude-dir=.astro --exclude-dir=werkzeuge --exclude-dir='*.app' \
    --exclude=CLAUDE.md --exclude=.gitignore 2>/dev/null)
S_ROH_A=$(grep -rnE "$ADRESSE" . \
    --exclude-dir=.git --exclude-dir=node_modules --exclude-dir=dist \
    --exclude-dir=.astro --exclude-dir=werkzeuge --exclude-dir='*.app' \
    --exclude=CLAUDE.md --exclude=.gitignore 2>/dev/null)
S_TREFFER=$( { printf '%s\n' "$S_ROH_S" | entwerten | grep -Ei "$STRUKTUR"
                printf '%s\n' "$S_ROH_A" | entwerten | grep -E  "$ADRESSE"; } \
    | cut -d: -f1,2 | sort -u)
if [ -z "$S_TREFFER" ]; then
  echo "  sauber"
else
  echo "  🔴 FUNDSTELLEN:"; printf '%s\n' "$S_TREFFER" | sed 's/^/      /'
  BEFUNDE=$((BEFUNDE + 1))
fi
echo "  (CLAUDE.md und .gitignore ausgenommen — beide beschreiben die Muster selbst"
echo "   und schlagen sonst bei jedem Lauf an. Beide sind kurz und von Hand lesbar.)"

echo
echo "=== 2. Werte aus $AUSNAHME, ausserhalb davon gesucht ==="
TMP_A=$(mktemp)
grep -E "^[[:space:]]+(strasse|ort|kontakt):" "$AUSNAHME" 2>/dev/null \
  | cut -d"'" -f2 | grep -v '^$' | grep -v '^PLATZHALTER' > "$TMP_A"
sucheliste "$TMP_A" "Impressumsangaben" datei
rm -f "$TMP_A"
if [ "$FREMD" -eq 1 ] && [ ! -f "$AUSNAHME" ]; then
  echo "     ℹ️  Diese Datei gibt es nur im Blog-Ordner. Die Werte, um die es hier"
  echo "        geht, stehen zusätzlich im markierten Block der Klarwerte-Datei —"
  echo "        Abschnitt 3 sucht sie also trotzdem. Fällt der Block weg, fällt"
  echo "        dieser Schutz hier ganz weg, und Abschnitt 3 sagt das dann laut."
fi

echo
echo "=== 3. Benannte Ersetzungen aus $KLARWERTE ==="
echo "  (sucht ÜBERALL, auch in $AUSNAHME — keine Datei ist mehr ausgenommen.)"
if [ ! -f "$KLARWERTE" ]; then
  echo "  ⚠️  Datei nicht gefunden — dieser Teil ist NICHT gelaufen."
  echo "     Sie liegt bewusst ausserhalb des Repos. Ohne sie ist die Prüfung halb."
  BEFUNDE=$((BEFUNDE + 1))
else
  TMP_K=$(mktemp)
  # Gelesen wird NUR ein ausdrücklich markierter Block. Kein Erraten.
  #
  # 🔴 Der erste Anlauf am 28.08.2026 hat geraten: alles in Backticks, alle
  # Mailadressen, alle langen Zahlen. Ergebnis waren 15 Fundstellen, alle
  # Fehlalarm — die Klarwerte-Datei ist ein Dokument mit Fliesstext, und in
  # Backticks stehen dort auch Dateinamen wie `CLAUDE.md`.
  #
  # Ein Test, der bei sauberem Bestand Alarm schlägt, versteckt den echten
  # Treffer. Deshalb ist die Heuristik ersatzlos entfallen: Entweder die
  # Quelle sagt eindeutig, was ein Wert ist, oder dieser Teil läuft nicht.
  sed -n "/pixelyard:werte:anfang/,/pixelyard:werte:ende/p" "$KLARWERTE" 2>/dev/null \
    | grep -v "pixelyard:werte:" | sed "s/^[[:space:]]*//;s/[[:space:]]*$//" \
    | grep -v "^$" | grep -v "^#" | grep -v "^-\{2,\}$" | sort -u > "$TMP_K"

  if [ ! -s "$TMP_K" ]; then
    echo "  ⚠️  Kein markierter Werteblock in der Datei — dieser Teil ist NICHT gelaufen."
    echo
    echo "     Trag in $KLARWERTE einen Abschnitt ein, der genau so aussieht:"
    echo
    echo "       <!-- pixelyard:werte:anfang -->"
    echo "       Ein Wert pro Zeile, ohne Anführungszeichen"
    echo "       Zeilen mit # sind Kommentare und werden übersprungen"
    echo "       <!-- pixelyard:werte:ende -->"
    echo
    echo "     Nur was zwischen den Markern steht, wird gesucht. Damit rät dieses"
    echo "     Skript nichts mehr — und ein sauberer Lauf bedeutet wieder etwas."
    BEFUNDE=$((BEFUNDE + 1))
  else
    sucheliste "$TMP_K" "markierte Werte" wert
  fi
  rm -f "$TMP_K"
fi

echo
if [ "$BEFUNDE" -eq 0 ]; then
  echo "✅ Kein Befund. Bilder gehören trotzdem einzeln angesehen — dieses Skript"
  echo "   liest keinen Bildinhalt (editorial.md §9 Punkt 5)."
  exit 0
else
  echo "🔴 $BEFUNDE Abschnitt(e) mit Befund. Anhalten, nicht „ist ja nur ein Beispiel\"."
  exit 1
fi
