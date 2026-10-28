/* kapitel.ts — der Text zu einem Eintrag aus navigation.ts.
 *
 * Steht hier und nicht in den Routen, damit Übersichten, Unterkapitel, Prompts
 * und Über DIESELBE Zuordnung benutzen: `<sprache>/<slug>`. */
import { getEntry, type CollectionEntry } from 'astro:content';
import type { Eintrag } from './navigation';
import type { Sprache } from './seite';

export type Kapitel = CollectionEntry<'kapitel'>;

export async function kapitelZu(eintrag: Eintrag, sprache: Sprache): Promise<Kapitel | undefined> {
  return getEntry('kapitel', `${sprache}/${eintrag.slug}`);
}
