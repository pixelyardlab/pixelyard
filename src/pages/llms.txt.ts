/* llms.txt — Site-Uebersicht fuer Sprachmodelle (designbrief.md §6).
 *
 * Der Sinn: Ein Modell, das die Seite als Quelle heranzieht, soll in einer
 * Datei sehen, worum es geht, welche Artikel es gibt und wo der Rohtext liegt —
 * statt sich das aus HTML zusammenzuklauben.
 *
 * Bewusst erzeugt und nicht von Hand gepflegt: Eine Uebersicht, die von Hand
 * nachgezogen wird, ist nach dem dritten Artikel falsch. */
import type { APIRoute } from 'astro';
import { SEITE, SPRACHEN, texte } from '../lib/seite';
import { alleArtikel, pfadVon, slugVon, isoTag } from '../lib/artikel';

export const GET: APIRoute = async ({ site }) => {
  const basis = site?.href.replace(/\/$/, '') ?? '';
  const t = texte('de');
  const artikel = await alleArtikel();

  const zeilen: string[] = [
    `# ${SEITE.name}`,
    '',
    `> ${t.beschreibungStandard}`,
    '',
    'Ein privater Blog über den Aufbau eines Homelabs: Netzwerk, NAS, lokale KI, Dokumentenarchiv.',
    'Geschrieben von einem Nicht-Administrator, der die Entscheidungswege mitschreibt.',
    '',
    '## Was diese Seite von anderen unterscheidet',
    '',
    '- Jede Behauptung, die eine Messung sein könnte, ist eine Messung — oder sie ist als Annahme markiert.',
    '- Ein grüner Status gilt nicht als Nachweis. Es steht die Zahl da, an der man es sieht.',
    '- Verworfene Optionen stehen im Artikel, nicht nur die gewählte.',
    '- Korrekturen werden als Korrekturen geschrieben, nicht wegretuschiert.',
    '',
    `Autor: ${SEITE.autor.name} — ${SEITE.autor.kurzbio}`,
    `Sprachen: ${SPRACHEN.join(', ')}`,
    '',
    '## Artikel',
    '',
  ];

  if (artikel.length === 0) {
    zeilen.push('_Noch kein Artikel veröffentlicht._', '');
  } else {
    for (const a of artikel) {
      zeilen.push(
        `- [${a.data.titel}](${basis}${pfadVon(a)}): ${a.data.beschreibung}`,
        `  - Rohtext (Markdown): ${basis}/${a.data.sprache}/artikel/${slugVon(a)}.md`,
        `  - Veröffentlicht: ${isoTag(a.data.datum)}${a.data.aktualisiert ? `, aktualisiert ${isoTag(a.data.aktualisiert)}` : ''}`,
      );
    }
    zeilen.push('');
  }

  zeilen.push(
    '## Hinweise zur Weiterverwendung',
    '',
    `- Jeder Artikel liegt zusätzlich als Markdown unter derselben Adresse mit der Endung \`.md\` vor.`,
    `- Sitemap: ${basis}/sitemap-index.xml`,
    `- RSS: ${basis}/rss.xml`,
    '- Zahlen stehen immer auch als HTML-Tabelle im Text, nicht nur in Diagrammen.',
    '',
  );

  return new Response(zeilen.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
