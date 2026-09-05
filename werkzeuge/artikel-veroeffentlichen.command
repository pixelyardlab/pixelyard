#!/bin/zsh -l
#
# artikel-veroeffentlichen.command — das Veröffentlichungs-Menü per Doppelklick starten.
#
# Doppelklick im Finder, oder im Terminal: ./werkzeuge/artikel-veroeffentlichen.command
#
# Das eigentliche Werkzeug ist `werkzeuge/artikel`; diese Datei ist nur der
# Türöffner für den Finder. Die Endung .command sorgt dafür, dass ein
# Doppelklick ein Terminalfenster öffnet, statt die Datei im Editor anzuzeigen.
#
# Das -l im Shebang macht daraus eine Anmelde-Shell. Das ist hier keine
# Kosmetik: Das Menü ruft git, npm und curl auf — ohne den vollen Suchpfad
# würde es sie nicht finden und stattdessen "nicht gefunden" melden.

ORDNER="$HOME/Projekte/pixelyard"
WERKZEUG="$ORDNER/werkzeuge/artikel"

if [ ! -x "$WERKZEUG" ]; then
  echo "🔴 Werkzeug nicht gefunden oder nicht ausführbar:"
  echo "   $WERKZEUG"
  echo
  echo "   Falls es da ist, aber nicht startet:  chmod +x \"$WERKZEUG\""
  echo
  read -r "?[Enter] schliessen "
  exit 1
fi

cd "$ORDNER" || exit 1
exec "$WERKZEUG" "$@"
