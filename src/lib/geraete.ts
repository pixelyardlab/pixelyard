/* geraete.ts — der Inhalt der rechten Seitenleiste.
 *
 * Zwei Regeln, und die zweite ist die unangenehmere:
 *
 * 1. 🔑 Hier steht NUR, was in einem veroeffentlichten Artikel vorkommt.
 *    Jeder Eintrag traegt den Pfad des Artikels, der ihn nennt. Eine
 *    Geraeteliste ohne Beleg ist eine Empfehlung — und eine Empfehlung ohne
 *    Messung ist genau die Sorte Fuellmaterial, die dieser Blog anderen
 *    vorwirft.
 *
 * 2. Kein Provisionslink. Nicht „noch nicht", sondern hier nicht: Diese Datei
 *    kennt `<Affiliatelink>` nicht und schaltet nichts in den Rechtstexten.
 *    Wenn Provisionslinks kommen, laufen sie ueber MERKMALE.affiliate und
 *    ueber die Komponente — nicht ueber diese Liste.
 *
 * ⚠️ Was hier NICHT hingehoert: alles, was das Heimnetz beschreibt statt die
 * Geraete darin. Modellnamen sind zulaessig, Adressen, Namen und Topologie
 * nicht (CLAUDE.md, Anonymisierungsregel).
 *
 * ⚠️ Abgeloeste Geraete bekommen bewusst KEINEN Link. Die Modelle sind
 * jahrealt; ein Herstellerlink darauf ist in zwei Jahren ein 404 und sieht
 * bis dahin aus wie eine Kaufempfehlung.
 */

export interface Geraet {
  /** Wofuer das Geraet im Haus steht — kurz, klein gesetzt ueber dem Namen. */
  rolle: string;
  name: string;
  /** Herstellerseite. Fehlt absichtlich bei allem, was nicht mehr laeuft. */
  href?: string;
  /** Der Artikel, in dem es vorkommt. Ohne diesen Wert gehoert es nicht hierher. */
  beleg: string;
}

const BELEG_WEG = '/de/artikel/mein-weg-ins-homelab/';

export const GERAETE_IM_EINSATZ: readonly Geraet[] = [
  {
    rolle: 'Speicher',
    name: 'UGREEN NASync DXP4800 Plus',
    href: 'https://www.ugreen.com/products/usa-35260a',
    beleg: BELEG_WEG,
  },
  {
    rolle: 'Betriebssystem der NAS',
    name: 'TrueNAS',
    href: 'https://www.truenas.com/',
    beleg: BELEG_WEG,
  },
  {
    rolle: 'Lokale KI',
    name: 'Mac Mini',
    href: 'https://www.apple.com/chde/mac-mini/',
    beleg: BELEG_WEG,
  },
  {
    rolle: 'Anschluss',
    name: 'Init7',
    href: 'https://www.init7.net/',
    beleg: BELEG_WEG,
  },
] as const;

export const GERAETE_ABGELOEST: readonly Geraet[] = [
  { rolle: 'Speicher bis 2026', name: 'Synology DS212j', beleg: BELEG_WEG },
  { rolle: 'Netz bis 2026', name: 'UniFi Cloud Key Gen 1', beleg: BELEG_WEG },
  { rolle: 'Netz bis 2026', name: 'UniFi US-8-150W', beleg: BELEG_WEG },
] as const;

/* Herstellerlinks: geprueft am 07.09.2026, jeder einzeln aufgerufen.
 *
 * | Link | Befund |
 * |---|---|
 * | ugreen.com/products/usa-35260a | offizielle Produktseite DXP4800 Plus |
 * | truenas.com | offizielle Seite, iXsystems |
 * | apple.com/chde/mac-mini/ | „Mac mini - Apple (CH)" |
 * | init7.net | antwortet; Inhalt nur mit JavaScript, Seitentext NICHT gelesen |
 *
 * 🔑 Der Grund, warum diese Zeile bis heute leer stand, hat sich beim
 * Nachpruefen selbst bestaetigt: Eingetragen war `apple.com/ch/mac-mini/`
 * — das ist ein 404. Richtig ist `/chde/`. Ein Pruefdatum vom 30.08. haette
 * genau diesen toten Link als geprueft ausgewiesen.
 *
 * ⚠️ Was das Datum NICHT sagt: dass die Links heute noch stimmen. Es sagt,
 * wann jemand zuletzt hingesehen hat. */
export const GERAETE_GEPRUEFT: string | null = '2026-09-07';
