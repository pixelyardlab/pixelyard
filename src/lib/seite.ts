/* seite.ts — die wenigen Werte, die an mehreren Orten stehen muessten,
 * wenn sie nicht hier staenden.
 *
 * ⚠️ Alles in dieser Datei wird beim oeffentlichen Push (§6 Schritt 7)
 * sichtbar. Was hier steht, ist ein Entscheid — kein Platzhalter, der
 * spaeter noch jemandem auffaellt.
 */

export const SEITE = {
  /* Kanonisch, Entscheid 26.08.2026 (projektstart.md §7).
   * Identisch mit `site` in astro.config.mjs — dort ist die Quelle. */
  name: 'pixelyard',
  wortmarke: 'pixelyard',

  /* E-E-A-T (designbrief §6): Autor sichtbar, mit Kurzbio.
   * Der Name ist bereits oeffentlich (GitHub-Konto), also kein neuer Wert. */
  autor: {
    name: 'Cedric Graber',
    /* Die Kurzbio traegt die Glaubwuerdigkeit — sie sagt, WARUM jemand
     * diesem Text glauben soll, und sie sagt ausdruecklich, was er nicht ist. */
    kurzbio:
      'Baut ein privates Homelab auf — kein Administrator von Beruf, sondern jemand, ' +
      'der die Entscheidungswege mitschreibt: die Zahlen, die Irrtümer und das, was sie gekostet haben.',
    /* ⚠️ Kontaktadresse: bewusst noch leer. Sie gehoert zum Entscheid aus
     * projektstart.md §8 (Impressum, Adresse, Analytics), der aussteht. */
    kontakt: '',
  },
} as const;

/* --- Sprachen (designbrief §6a, editorial.md §6) ---------------------
 * Struktur ab Tag 1, Inhalt spaeter. Solange nur `de` hier steht, zeigt
 * der Sprachschalter eine Anzeige statt einer Auswahl — ohne Sonderfall
 * im Code und ohne CSS-Aenderung, wenn `en` dazukommt. */

export const SPRACHEN = ['de'] as const;
export type Sprache = (typeof SPRACHEN)[number];

/* Alle Sprachen, die der Aufbau bereits kennt. `SPRACHEN` ist die Teilmenge,
 * die tatsaechlich ausgeliefert wird. Die Trennung ist der Punkt: Englisch
 * ist eine Uebersetzungsentscheidung, keine Umbauentscheidung. */
export const SPRACHEN_BEKANNT = {
  de: { htmlLang: 'de-CH', ogLocale: 'de_CH', beschriftung: 'de', name: 'Deutsch' },
  en: { htmlLang: 'en',    ogLocale: 'en_US', beschriftung: 'en', name: 'English' },
} as const;

export const SPRACHE_STANDARD: Sprache = 'de';

export function istSprache(wert: string): wert is Sprache {
  return (SPRACHEN as readonly string[]).includes(wert);
}

/* --- Texte der Oberflaeche -------------------------------------------
 * Auch das ab Tag 1 getrennt: Was im Text steht, ist deutsch; was den Text
 * baut, ist englisch (editorial.md §3). Diese Tabelle ist die Naht. */

export const TEXTE = {
  de: {
    titelSuffix: 'pixelyard',
    beschreibungStandard:
      'Ein privates Homelab, Schritt für Schritt — mit Zahlen, Irrtümern und dem, was sie gekostet haben.',
    zumInhalt: 'Zum Inhalt springen',
    hell: 'hell',
    dunkel: 'dunkel',
    erklaerungen: 'erklärungen',
    ein: 'ein',
    aus: 'aus',
    farbschemaLabel: 'Farbschema',
    erklaerungenLabel: 'Erklärungen im Text',
    spracheLabel: 'Sprache',
    veroeffentlicht: 'published',
    aktualisiert: 'aktualisiert',
    minuten: 'min',
    kopieren: 'kopieren',
    kopiert: 'kopiert',
    kopierenFehlgeschlagen: 'nicht kopiert',
    fuerDeineKI: '$ für deine KI kopieren',
    keinUpload: 'Lade keine Dokumente hoch — dieser Prompt braucht sie nicht.',
    erklaerungMarke: 'Erklärung',
    tldrMarke: 'Kurz gesagt',
    alsMarkdown: 'Als Markdown ansehen',
    artikel: 'Artikel',
    entwurf: 'Entwurf',
    autorVon: 'Geschrieben von',
  },
} as const;

export function texte(sprache: Sprache) {
  return TEXTE[sprache];
}
