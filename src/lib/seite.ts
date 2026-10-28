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
    /* Kontaktadresse fuer Impressum und Datenschutzerklaerung. */
    kontakt: 'cedric@pixelyard.ch',
  },

  /* --- Impressum ----------------------------------------------------
   * 🔴 Hier steht KEINE Postanschrift mehr — Entscheid 07.09.2026.
   *
   * Vom 28.08. bis zum 07.09.2026 stand sie hier, als die eine benannte
   * Ausnahme von der Anonymisierungsregel (CLAUDE.md), begruendet mit der
   * Impressumspflicht nach UWG Art. 3 Abs. 1 lit. s. Die Ausnahme ist
   * zurueckgenommen. Genannt werden Name und Mailadresse — beide stehen
   * oben unter `autor`, beide waren schon vorher oeffentlich.
   *
   * ⚠️ Wer hier wieder ein Adressfeld eintraegt, hebt nicht nur einen
   * Entscheid auf, sondern auch die Wirkung der Anonymisierungspruefung:
   * Sie nimmt genau diese Datei von der Suche aus (AUSNAHME in
   * werkzeuge/anonymisierung-pruefen.sh). Was hier steht, prueft niemand
   * mehr ausser dem Menschen, der es hinschreibt.
   */
} as const;

/* --- Was die Seite tatsaechlich tut --------------------------------------
 * Diese Schalter steuern, welche Abschnitte in Impressum und Datenschutz-
 * erklaerung erscheinen.
 *
 * 🔑 Der Punkt: Eine Datenschutzerklaerung, die etwas beschreibt, was gar
 * nicht passiert, ist genauso falsch wie eine, die etwas verschweigt. Sie
 * soll den IST-Zustand beschreiben, nicht die Absicht.
 *
 * Wer eines davon einschaltet, schaltet damit im selben Zug den zugehoerigen
 * Abschnitt in beiden Rechtstexten ein. Das ist der ganze Zweck. */
export const MERKMALE = {
  /** Cloudflare Web Analytics, eingeschaltet am 28.08.2026.
   *  Das Skript fuegt CLOUDFLARE beim Ausliefern ein (Pages → Metrics → Enable),
   *  es steht nicht in unserem Quelltext. Dieser Schalter steuert nur, ob die
   *  Datenschutzerklaerung den Dienst beschreibt — und das muss zusammenpassen. */
  analytics: true,
  /** Provisions- und Preisvergleichslinks im Bestand. */
  affiliate: false,
  /** Spendenmoeglichkeit („Kaffeekasse"). */
  kaffeekasse: false,
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

    /* --- Seitenleisten ------------------------------------------------ */
    alleArtikel: 'Alle Artikel',
    themen: 'Themen',
    thema: 'Thema',
    feed: 'Feed',
    rss: 'RSS-Feed',
    /* Rechte Leiste. Die Ueberschrift sagt „laeuft", nicht „empfehle ich" —
     * der Unterschied ist der ganze Punkt der Liste. */
    wasHierLaeuft: 'Was hier läuft',
    abgeloest: 'Abgelöst',
    nurBelegtes: 'Nur Geräte, die in einem Artikel vorkommen.',
    stehtImArtikel: 'steht im Artikel',
    /* Die Zahl wird GEZAEHLT und nicht hingeschrieben — „alle vier" waere beim
     * fuenften Eintrag still falsch geworden. */
    alleImArtikel: (n: number) => `Alle ${n} stehen in einem Artikel →`,
    keineProvision: 'Keine Provisionslinks — nichts davon bringt mir Geld.',
    linksGeprueft: 'Links geprüft',
    keinArtikelZumThema: 'Zu diesem Thema steht noch kein Artikel.',
    artikelZaehlung: (n: number) => (n === 1 ? '1 Artikel' : `${n} Artikel`),
    autorVon: 'Geschrieben von',
    impressum: 'Impressum',
    datenschutz: 'Datenschutz',
    werbung: 'Werbung',

    /* --- Bereichsleiste (24.09.2026) ---------------------------------- */
    bereiche: 'Bereiche',
    startseite: 'Startseite',
    duBistHier: 'Du bist hier:',
    leisteOeffnen: 'Bereiche anzeigen',
    /* Die Beschriftungen der drei Statusmarken. Sie stehen ZWEIMAL auf der
     * Seite: an jedem Eintrag (fuer den Screenreader) und einmal sichtbar in
     * der Legende. Deshalb genau ein Ort fuer den Wortlaut. */
    markeBelegt: 'belegt',
    markeTeilweise: 'läuft, Nachweis fehlt',
    markeGeplant: 'geplant',
    legende: 'Marken',

    /* --- Brotkrumen ---------------------------------------------------- */
    seitenpfad: 'Seitenpfad',

    /* --- Weiterlesen-Fuss ---------------------------------------------- */
    weiterlesen: 'Weiterlesen',
    platzAufbau: 'Der Aufbau dazu',
    platzBeitrag: 'Der Beitrag dazu',
    platzRegel: 'Die Regel dazu',
    /* Der leere Platz wird BENANNT. „Versteckt" hiesse: es sieht vollstaendig
     * aus, obwohl es das nicht ist — genau der stille Fehlermodus, gegen den
     * dieser Blog anschreibt. */
    nochKeiner: 'noch keiner — geplant',
    bistHier: 'du bist hier',
    /* Ein Platz, der leer bleibt, weil es dort nichts zu verweisen GIBT —
     * nicht, weil noch etwas fehlt. Anderer Satz als „noch keiner — geplant". */
    keineBewusst: 'keine — bewusst',

    /* --- Platzhalterseiten --------------------------------------------- */
    platzhalter: 'Platzhalter',
    nochNichtGeschrieben: 'Diese Seite ist angelegt, aber noch nicht geschrieben.',
  },
} as const;

export function texte(sprache: Sprache) {
  return TEXTE[sprache];
}
