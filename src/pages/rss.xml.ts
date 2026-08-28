/* RSS — designbrief.md §7, „Kandidaten": prominent platzieren, weil sowohl die
 * Zielgruppe als auch KI-Crawler danach greifen. */
import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { SEITE, texte } from '../lib/seite';
import { alleArtikel, pfadVon } from '../lib/artikel';

export const GET: APIRoute = async (context) => {
  const artikel = await alleArtikel();
  return rss({
    title: SEITE.name,
    description: texte('de').beschreibungStandard,
    site: context.site!,
    items: artikel.map((a) => ({
      title: a.data.titel,
      description: a.data.beschreibung,
      pubDate: a.data.datum,
      link: pfadVon(a),
      categories: a.data.schlagworte,
    })),
    customData: '<language>de-ch</language>',
  });
};
