/* prompts.ts — alle Prompts der Bereiche, an genau einem Ort.
 *
 * 🔑 Die Prompt-Sammlung unter /de/prompts/ ist der kanonische Ort
 * (Seitenlandkarte, 06.09.2026): Die Fachseiten verlinken mit Anker hierher
 * (<PromptVerweis>), statt den Text zu wiederholen. Die Startseite zeigt den
 * ersten ausgeschrieben — aus DIESER Datei, nicht als Kopie.
 *
 * Die Prompts IN den Artikeln bleiben, wo sie sind: Sie gehören zum Text des
 * Beitrags und stehen dort im Zusammenhang. Diese Liste sammelt die sieben aus
 * dem Aufbau und dem Vorgehen.
 *
 * ⚠️ Eine Zeile pro Absatz bzw. Aufzählungspunkt, ohne harte Umbrüche: Der
 * Text wird vorformatiert gezeigt und so kopiert. Harte Umbrüche bei 65 Zeichen
 * zerfielen auf dem Handy in Treppen (gesehen am 28.10.2026, 420 px).
 *
 * Redaktionsregeln (editorial.md §4), die hier jeder Eintrag einhält:
 * Platzhalter in eckigen Klammern, keine echten Werte, und kein Prompt fordert
 * zum Hochladen auf. `hinweis` ist der Satz, der das sichtbar macht.
 *
 * ⚠️ Darf nichts aus `astro:content` importieren.
 */

export interface PromptEintrag {
  /** Anker auf /de/prompts/ — stabil halten, andere Seiten verlinken ihn. */
  id: string;
  titel: string;
  /** Wofür er gut ist, in einem Halbsatz. */
  wofuer: string;
  text: string;
  hinweis: string;
  /** Wo er herkommt — Pfad ohne Sprache. */
  herkunft: string;
}

export const PROMPTS: PromptEintrag[] = [
  {
    id: 'vorhaben-durchplanen',
    titel: 'Ein Vorhaben durchplanen, ohne Daten preiszugeben',
    wofuer: 'der Einstieg, wenn du vor einem leeren Blatt sitzt',
    herkunft: 'vorgehen/bevor-man-anfaengt',
    text: `Ich will [Vorhaben] bei mir zu Hause aufsetzen. Plane das mit mir durch, aber halte dich an diese Arbeitsweise:

- Frag mich nach Zuständen, nicht nach Werten. Ich nenne dir Formen und Platzhalter, keine echten Adressen, Namen oder Zugangsdaten — und du fragst auch nicht danach.
- Nenne mir zu jedem Schritt den RÜCKWEG, bevor wir ihn gehen.
- Kennzeichne jede deiner Aussagen als: gemessen / aus der Dokumentation / vermutet. Vermutungen sind erlaubt, aber sie müssen so heissen.
- Sage mir bei jedem Schritt, was du NICHT prüfen kannst und was ich deshalb selbst anschauen muss.
- Schlage mir am Ende die Reihenfolge vor und begründe, warum ein Schritt vor dem anderen kommt.

Bevor du anfängst: stell mir die fünf Fragen, deren Antworten den Plan am stärksten verändern würden.`,
    hinweis: 'Lade nichts hoch — keine Dateien, keine Zugangsdaten. Eine Beschreibung reicht.',
  },
  {
    id: 'ausloeser-statt-termine',
    titel: 'Auslöser statt Termine für die eigene Liste',
    wofuer: 'macht aus einer Wunschliste eine Liste, die von selbst fällig wird',
    herkunft: 'vorgehen/bevor-man-anfaengt',
    text: `Hier ist meine Liste geplanter Anschaffungen und Vorhaben.

Formuliere zu jedem Posten einen AUSLÖSER statt eines Termins. Ein Auslöser ist ein Zustand, den ich messen oder ablesen kann — kein Datum, kein Erscheinungstermin, kein "wenn ich Zeit habe".

Wo ich keinen messbaren Auslöser nennen kann, sag mir das deutlich: dann ist der Posten ein Wunsch, kein Plan.

Nenne mir ausserdem zu jedem Posten die eine Zahl, die ich vorher gemessen haben müsste — und wie ich sie messe.

Meine Liste: [hier einfügen]`,
    hinweis: 'Preise braucht das Modell nicht. Es geht um die Bedingung, nicht um den Betrag.',
  },
  {
    id: 'backup-pruefen',
    titel: 'Das eigene Backup gegen sechs Fragen prüfen',
    wofuer: 'findet vor allem den Fall „läuft grün, sichert nichts“',
    herkunft: 'aufbau/was-es-kann',
    text: `Ich beschreibe dir mein Backup. Prüfe es gegen genau diese sechs Fragen und antworte je Frage mit: erfüllt / nicht erfüllt / kann ich nicht beurteilen.

1. Bricht die Sicherung ab, wenn ein Glied der Kette scheitert — oder meldet sie Erfolg, weil nur das letzte Glied gelungen ist?
2. Wird die geschriebene Datei danach einmal gelesen, um zu prüfen, dass sie nicht halb ist?
3. Gibt es eine Mindestgrösse, gegen die geprüft wird?
4. Bekommt die Datei ihren endgültigen Namen erst, nachdem sie vollständig ist?
5. Ist für JEDEN Datenbereich eine Aufgabe angelegt — auch für die, die nach dem ersten Einrichten dazugekommen sind?
6. Wurde die Wiederherstellung mindestens einmal ausgeführt, und zwar so, dass danach eine echte Abfrage auf den Daten lief statt nur einer Zeilenzählung?

Sage mir am Ende, welche Punkte ich mit einem Befehl nachweisen kann und welche nur durch einen echten Versuch.

Mein Aufbau: [hier beschreiben]`,
    hinweis: 'Lade keine Dateien und keine Zugangsdaten hoch. Eine Beschreibung reicht.',
  },
  {
    id: 'netzschnitt-hinterfragen',
    titel: 'Den eigenen Netzschnitt hinterfragen',
    wofuer: 'findet Zonen, die es nur gibt, weil sie in einer Anleitung standen',
    herkunft: 'aufbau/hardware',
    text: `Ich beschreibe dir, wie ich mein Heimnetz in Zonen geschnitten habe. Deine Aufgabe ist NICHT, mir mehr Zonen vorzuschlagen.

Prüfe stattdessen:
- Für welche Zone kann ich keinen Satz formulieren, der ihren Zweck nennt, ohne die Technik zu erwähnen? Die ist verdächtig.
- Welche Verbindungen zwischen Zonen habe ich erlaubt, und welche davon würde ich schriftlich begründen wollen?
- Welche meiner Regeln setzt etwas voraus, das ich nie gemessen habe?
- Wo trennt mich nur eine Einstellung im Gerät und nicht die Firewall?

Frag zurück, bevor du bewertest, wenn dir etwas fehlt.

Mein Schnitt: [hier beschreiben]`,
    hinweis: 'Adressbereiche und Netzkennungen braucht es für die Beurteilung nicht.',
  },
  {
    id: 'modell-waehlen',
    titel: 'Ein lokales Modell für den vorhandenen Arbeitsspeicher wählen',
    wofuer: 'die Frage, die vor dem Hardwarekauf kommt — nicht danach',
    herkunft: 'aufbau/maschine-modelle',
    text: `Ich habe [X] GB Arbeitsspeicher zur Verfügung und will lokal ein Sprachmodell betreiben für: [Aufgabe möglichst konkret].

Beantworte in dieser Reihenfolge:
1. Welche Kontextlänge braucht meine Aufgabe realistisch?
2. Wieviel Speicher kostet mich allein diese Kontextlänge, zusätzlich zum Modell?
3. Welche Modellgrössen bleiben danach übrig — was fällt weg?
4. Welche meiner Aufgaben gehören inhaltlich NICHT auf ein lokales Modell, sondern brauchen ein grosses?

Sei bei Punkt 3 unbequem. Ich will wissen, was NICHT geht.`,
    hinweis: 'Punkt 2 vergisst man. Der Kontext kostet oft mehr Speicher als das Modell.',
  },
  {
    id: 'doku-drift',
    titel: 'Die eigene Dokumentation auf Drift prüfen',
    wofuer: 'findet die zweite Fassung, von der du nicht mehr weisst, dass es sie gibt',
    herkunft: 'vorgehen/dokumentieren',
    text: `Ich beschreibe dir, wie meine Projektdokumentation abgelegt ist. Suche nicht nach Rechtschreibfehlern, sondern nach DRIFT.

Prüfe:
1. Wo könnte derselbe Inhalt an zwei Orten stehen — und welcher davon würde beim Ändern vergessen?
2. Welche Verweise zeigen auf einen Pfad, den ich beim letzten Umbenennen vielleicht nicht mitgezogen habe?
3. Welche Zahl in meiner Doku steht ohne Messzeitpunkt und ist deshalb heute nicht mehr überprüfbar?
4. Welche Aussage stammt aus Recherche, wird aber wie eine eigene Messung gelesen?
5. Welches Dokument beschreibt einen Zustand, der sich seit dem Schreiben mit Sicherheit geändert hat?

Sag mir am Ende, welchen einen Ort ich zuerst aufräumen sollte und warum gerade den.

Meine Ablage: [hier beschreiben]`,
    hinweis: 'Es reicht die Struktur — Ordnernamen, keine Inhalte.',
  },
  {
    id: 'eigener-eingriff',
    titel: 'Den eigenen Eingriff als ersten Verdächtigen behandeln',
    wofuer: 'für den Moment, in dem etwas „plötzlich“ nicht mehr geht',
    herkunft: 'vorgehen/stolpersteine',
    text: `Etwas funktioniert nicht mehr. Bevor du Ursachen suchst, stelle mir Fragen zu dieser Reihenfolge:

1. Was habe ich in den letzten 14 Tagen selbst geändert — auch das, was nichts damit zu tun haben kann?
2. Welche dieser Änderungen war eine Sperre, ein Filter oder eine Regel, die etwas verbietet?
3. Welche davon wirkt breiter, als ich beim Setzen dachte?

Erst wenn wir das durch haben, suchen wir nach Defekten.

Begründung, warum ich das so will: Zwei getrennte Fehlersuchen in meinem Aufbau gingen auf selbst gesetzte Sperren zurück.

Symptom: [hier beschreiben]`,
    hinweis: 'Der eigene Eingriff ist der erste Verdächtige, nicht der letzte.',
  },
];

export function prompt(id: string): PromptEintrag {
  const treffer = PROMPTS.find((p) => p.id === id);
  if (!treffer) throw new Error(`prompts.ts: unbekannter Prompt "${id}"`);
  return treffer;
}
