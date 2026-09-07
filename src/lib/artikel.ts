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

/** Alle Schlagworte einer Sprache mit ihrer Anzahl, haeufigstes zuerst,
 *  bei Gleichstand alphabetisch.
 *
 *  Steht hier und nicht in der Seitenleiste, weil die Themenseiten DIESELBE
 *  Auswahl treffen muessen wie die Leiste. Zwei Zaehlungen mit je eigener
 *  Filterregel driften — derselbe Grund wie oben bei `alleArtikel`. */
export async function schlagworte(sprache?: Sprache): Promise<{ wort: string; anzahl: number }[]> {
  const zaehler = new Map<string, number>();
  for (const a of await alleArtikel(sprache)) {
    for (const wort of a.data.schlagworte) {
      zaehler.set(wort, (zaehler.get(wort) ?? 0) + 1);
    }
  }
  return [...zaehler.entries()]
    .map(([wort, anzahl]) => ({ wort, anzahl }))
    .sort((a, b) => b.anzahl - a.anzahl || a.wort.localeCompare(b.wort, 'de'));
}

/** Die Artikel zu einem Schlagwort. Der Vergleich ist case-insensitiv, damit
 *  ein `#Homelab` im Frontmatter nicht still eine zweite Themenseite erzeugt. */
export async function artikelZuSchlagwort(wort: string, sprache?: Sprache): Promise<Artikel[]> {
  const gesucht = wort.toLowerCase();
  const alle = await alleArtikel(sprache);
  return alle.filter((a) => a.data.schlagworte.some((s) => s.toLowerCase() === gesucht));
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
