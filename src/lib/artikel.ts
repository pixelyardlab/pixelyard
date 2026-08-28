/* artikel.ts — Auswahl und Ableitungen ueber der Sammlung.
 * Steht hier und nicht in den Seiten, damit Liste, RSS, Sitemap und llms.txt
 * DIESELBE Auswahl treffen. Vier Orte mit je eigener Filterregel driften. */
import { getCollection, type CollectionEntry } from 'astro:content';
import { SPRACHEN, type Sprache } from './seite';

export type Artikel = CollectionEntry<'artikel'>;

/** Entwuerfe erscheinen im Dev-Server, aber nie im Bau.
 *  Ein Entwurf, der versehentlich live geht, meldet sich nicht von selbst. */
const zeigeEntwuerfe = import.meta.env.DEV;

export async function alleArtikel(sprache?: Sprache): Promise<Artikel[]> {
  const alle = await getCollection('artikel', ({ data }: Artikel) => {
    if (!zeigeEntwuerfe && data.entwurf) return false;
    return (SPRACHEN as readonly string[]).includes(data.sprache);
  });

  return alle
    .filter((a: Artikel) => (sprache ? a.data.sprache === sprache : true))
    .sort((a: Artikel, b: Artikel) => b.data.datum.valueOf() - a.data.datum.valueOf());
}

/** `de/restore-test` → `restore-test`. Die Sprache steht schon in der Route. */
export function slugVon(eintrag: Artikel): string {
  const teile = eintrag.id.split('/');
  return teile.length > 1 ? teile.slice(1).join('/') : eintrag.id;
}

export function pfadVon(eintrag: Artikel): string {
  return `/${eintrag.data.sprache}/artikel/${slugVon(eintrag)}/`;
}

/** Die Pfade aller Fassungen desselben Artikels — Grundlage der hreflang-Angaben. */
export async function uebersetzungenVon(eintrag: Artikel): Promise<Partial<Record<Sprache, string>>> {
  const alle = await alleArtikel();
  const treffer: Partial<Record<Sprache, string>> = {};
  for (const a of alle) {
    if (a.data.paar === eintrag.data.paar) treffer[a.data.sprache as Sprache] = pfadVon(a);
  }
  return treffer;
}

/** Lesezeit aus dem Rohtext. 200 Woerter pro Minute ist eine ANNAHME —
 *  gemessen ist sie nicht, und deshalb steht sie hier und nicht als Zahl
 *  in einer Vorlage, wo sie wie ein Messwert aussaehe. */
export function lesezeit(rohtext: string | undefined): number {
  if (!rohtext) return 1;
  const woerter = rohtext.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(woerter / 200));
}

/** ISO-Datum ohne Zeitzone — `2026-08-28`. Fuer die Meta-Zeile und <time>. */
export function isoTag(datum: Date): string {
  return datum.toISOString().slice(0, 10);
}
