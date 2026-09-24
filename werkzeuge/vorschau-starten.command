#!/bin/zsh -l
#
# vorschau-starten.command — die Seite lokal im Browser ansehen.
#
# Doppelklick im Finder, oder im Terminal: ./werkzeuge/vorschau-starten.command
#
# Warum .command und -l im Shebang: dieselbe Begründung wie bei
# claude-code-starten.command. Der Finder startet die Datei mit einem
# Doppelklick in einem Terminalfenster, und die Anmelde-Shell bringt denselben
# PATH mit wie ein normal geöffnetes Terminal — damit wird `npm` gefunden,
# ohne dass hier ein Pfad fest verdrahtet steht.
#
# 🔴 Was dieses Fenster ist und was nicht:
#   • Solange es offen ist, läuft der Vorschauserver. Schliessen = Server aus.
#   • Beenden mit Ctrl+C.
#   • Das ist NICHT die veröffentlichte Seite. Es ist der Stand auf DIESEM Mac,
#     inklusive allem, was noch nicht committet ist.
#   • Entwürfe (`entwurf: true`) sind hier SICHTBAR und im echten Bau nicht.
#     Wer hier einen Artikel sieht, hat ihn deshalb noch nicht veröffentlicht.

ORDNER="$HOME/Projekte/pixelyard"

abbruch() {
  echo
  echo "$1"
  [ -n "$2" ] && echo "   $2"
  echo
  read -r "?[Enter] schliessen "
  exit 1
}

[ -d "$ORDNER" ] || abbruch "🔴 Ordner nicht gefunden: $ORDNER" \
  "Liegt das Projekt woanders, diese Zeile im Skript anpassen."

cd "$ORDNER" || exit 1

command -v npm >/dev/null 2>&1 || abbruch "🔴 npm nicht gefunden." \
  "Node.js installieren oder im Terminal 'which npm' prüfen."

# node_modules fehlt nach einem frischen Klon. Einmalig nachinstallieren,
# statt mit einer Fehlermeldung abzubrechen, die niemand einordnen kann.
if [ ! -d node_modules ]; then
  echo "node_modules fehlt — einmalig 'npm install'. Das dauert ein bis zwei Minuten."
  echo
  npm install || abbruch "🔴 'npm install' ist fehlgeschlagen." \
    "Die Meldung oben sagt, woran es lag."
  echo
fi

echo "Projektordner: $ORDNER"
command -v git >/dev/null 2>&1 && echo "Zweig:         $(git rev-parse --abbrev-ref HEAD 2>/dev/null)"
echo
echo "Der Browser öffnet sich gleich von selbst."
echo "🔴 Beenden mit Ctrl+C. Fenster offen lassen, solange du schaust."
echo

# --open öffnet den Standardbrowser auf der Wurzel; die leitet auf /de/ weiter.
# exec, damit Ctrl+C direkt beim Server landet und nicht bei dieser Hülle.
exec npm run dev -- --open
