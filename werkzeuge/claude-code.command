#!/bin/zsh -l
#
# claude-code.command — Claude Code im Projektordner pixelyard starten.
#
# Doppelklick im Finder, oder im Terminal: ./werkzeuge/claude-code.command
#
# Warum eine .command-Datei: Der Finder startet sie mit einem Doppelklick in
# einem Terminalfenster. Das -l im Shebang macht daraus eine Anmelde-Shell —
# damit gilt derselbe PATH wie in einem normal geöffneten Terminal, und
# `claude` wird gefunden, ohne dass hier ein Pfad fest verdrahtet steht.
#
# Argumente werden durchgereicht: ./werkzeuge/claude-code.command "Bitte ..."
# startet Claude Code direkt mit diesem Auftrag.

ORDNER="$HOME/Projekte/pixelyard"

if [ ! -d "$ORDNER" ]; then
  echo "🔴 Ordner nicht gefunden: $ORDNER"
  echo "   Liegt das Projekt woanders, diese Zeile im Skript anpassen."
  echo
  read -r "?[Enter] schliessen "
  exit 1
fi

cd "$ORDNER" || exit 1

# claude finden: erst im PATH, dann an den üblichen Stellen.
CLAUDE=""
if command -v claude >/dev/null 2>&1; then
  CLAUDE="$(command -v claude)"
else
  for p in "$HOME/.local/bin/claude" /usr/local/bin/claude /opt/homebrew/bin/claude; do
    if [ -x "$p" ]; then CLAUDE="$p"; break; fi
  done
fi

if [ -z "$CLAUDE" ]; then
  echo "🔴 Claude Code nicht gefunden."
  echo "   Weder im PATH noch unter ~/.local/bin, /usr/local/bin, /opt/homebrew/bin."
  echo "   Im Terminal 'which claude' ausführen und den Pfad hier eintragen."
  echo
  read -r "?[Enter] schliessen "
  exit 1
fi

echo "Projektordner: $ORDNER"
echo "Claude Code:   $CLAUDE"
command -v git >/dev/null 2>&1 && echo "Zweig:         $(git rev-parse --abbrev-ref HEAD 2>/dev/null)"
echo

exec "$CLAUDE" "$@"
