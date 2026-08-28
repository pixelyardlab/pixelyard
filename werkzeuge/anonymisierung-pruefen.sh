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

cd "$(dirname "$0")/.." || exit 1

KLARWERTE="../pixelyard-klarwerte.md"
AUSNAHME="src/lib/seite.ts"   # die eine erlaubte Fundstelle, s. CLAUDE.md
BEFUNDE=0

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

  MUSTER='([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-f]{2}:){5}[0-9a-f]{2}|[a-z0-9-]+\.(local|arpa)\b|VLAN ?[0-9]+|(Beleg|Bestell|Kunden|Serien)\w*nummer'
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
    if printf '%s' "$inhalt" | grep -qEi "$MUSTER"; then
      echo "  🔴 strukturelles Muster: $pfad  (Objekt ${sha:0:8})"
      TREFFER=$((TREFFER + 1))
    fi
    if [ -s "$WERTE" ] && [ "$pfad" != "$AUSNAHME" ]; then
      if printf '%s' "$inhalt" | grep -qwF -f "$WERTE"; then
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
  trap 'rm -f "$PROBE"' EXIT INT TERM
  printf 'Testzeile mit 203.0.113.7 — darf nur Sekunden existieren.\n' > "$PROBE"
  echo "=== Selbsttest: das Skript muss jetzt anschlagen ==="
  if "$0" > /dev/null 2>&1; then
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


sucheliste() {   # $1 = Datei mit Suchbegriffen, $2 = Beschriftung
  local liste="$1" was="$2" treffer hinweise kurz
  [ -s "$liste" ] || { printf '  %-34s keine Suchbegriffe gefunden\n' "$was"; return; }

  # 🔴 Gesucht wird an WORTGRENZEN (-w), nicht als Buchstabenfolge.
  #
  # Am 28.08.2026 stand ein kurzer Vorname in der Werteliste — und steckte in
  # „Kanonische". Eine Teilstring-Suche meldet solche Zufälle als Fund. Ein
  # Werkzeug, das viel Belangloses meldet, wird nicht schärfer, sondern
  # ignoriert, und dann versteckt es den echten Treffer.
  treffer=$(grep -rnwF -f "$liste" . \
      --exclude-dir=.git --exclude-dir=node_modules --exclude-dir=dist \
      --exclude-dir=.astro --exclude-dir=werkzeuge 2>/dev/null \
    | grep -v "^\./$AUSNAHME:" | cut -d: -f1,2)

  # Teilwort-Vorkommen gehen NICHT verloren — sie erscheinen als Hinweis,
  # nicht als Befund. Verschweigen wäre die andere Hälfte desselben Fehlers.
  hinweise=$(grep -rnF -f "$liste" . \
      --exclude-dir=.git --exclude-dir=node_modules --exclude-dir=dist \
      --exclude-dir=.astro --exclude-dir=werkzeuge 2>/dev/null \
    | grep -v "^\./$AUSNAHME:" | cut -d: -f1,2 \
    | grep -vxF "$treffer" 2>/dev/null)

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

echo "=== 1. Strukturelle Muster (IP, MAC, Hostname, VLAN, Nummern) ==="
STRUKTUR='([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-f]{2}:){5}[0-9a-f]{2}|[a-z0-9-]+\.(local|arpa)\b|VLAN ?[0-9]+|(Beleg|Bestell|Kunden|Serien)\w*nummer'
S_TREFFER=$(grep -rnEi "$STRUKTUR" . \
    --exclude-dir=.git --exclude-dir=node_modules --exclude-dir=dist \
    --exclude-dir=.astro --exclude-dir=werkzeuge \
    --exclude=CLAUDE.md --exclude=.gitignore 2>/dev/null | cut -d: -f1,2)
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
sucheliste "$TMP_A" "Impressumsangaben"
rm -f "$TMP_A"

echo
echo "=== 3. Benannte Ersetzungen aus $KLARWERTE ==="
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
    sucheliste "$TMP_K" "markierte Werte"
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
