/* „Als Markdown ansehen" (designbrief.md §7b).
 *
 * Liefert den Rohtext des Artikels als text/markdown — fuer KI-Agenten, fuer
 * Leser, die lieber selbst weiterverarbeiten, und weil es auf GEO einzahlt.
 *
 * Bewusst der ROHE Text mitsamt den <Erklaerung>- und <Prompt>-Bausteinen:
 * Wer die Quelle will, will die Quelle und nicht eine geglaettete Fassung. */
import type { APIRoute } from 'astro';
import { alleArtikel, slugVon, type Artikel } from '../../../lib/artikel';

export async function getStaticPaths() {
  const artikel = await alleArtikel();
  return artikel.map((eintrag: Artikel) => ({
    params: { sprache: eintrag.data.sprache, slug: slugVon(eintrag) },
    props: { eintrag },
  }));
}

export const GET: APIRoute = ({ props }) => {
  const eintrag = props.eintrag as Artikel;
  const d = eintrag.data;

  const kopf = [
    `# ${d.titel}`,
    '',
    d.beschreibung,
    '',
    `Veröffentlicht: ${d.datum.toISOString().slice(0, 10)}`,
    ...(d.aktualisiert ? [`Aktualisiert: ${d.aktualisiert.toISOString().slice(0, 10)}`] : []),
    `Autor: ${d.autor}`,
    ...(d.schlagworte.length ? [`Schlagworte: ${d.schlagworte.join(', ')}`] : []),
    '',
    '---',
    '',
  ].join('\n');

  return new Response(kopf + (eintrag.body ?? ''), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
