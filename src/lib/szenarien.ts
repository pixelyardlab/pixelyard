/* szenarien.ts — die acht Alltagssituationen aus „Was es kann".
 *
 * 🔑 EINE Quelle für Titel, Status und Verzahnung. Die Situationsseite
 * (src/content/kapitel/de/aufbau/was-es-kann.mdx) nennt nur die `id`; Titel und
 * Statusmarke kommen von hier. Dieselben Einträge benutzen die Beitrags-
 * übersicht (Gruppierung nach Szenario) und der Artikelkopf (Rückverweis,
 * Vorlage D). Drei Orte mit je eigenem Titel würden auseinanderlaufen.
 *
 * Grundlage: die Verzahnungsmatrix der Seitenlandkarte (06.09.2026).
 *
 * ⚠️ Darf nichts aus `astro:content` importieren — dieselbe Regel wie
 * navigation.ts, damit auch Hilfsskripte die Datei laden können.
 */
import type { Status } from './navigation';

export interface Verweis {
  titel: string;
  /** Pfad ohne Sprachpräfix, z. B. `vorgehen/stolpersteine/#typ-1`. */
  ziel: string;
}

export interface Szenario {
  /** Anker auf der Seite „Was es kann": `#s-<id>`. */
  id: string;
  titel: string;
  status: Status;
  /** Zusatz hinter der Statusmarke, wenn der Status allein zu knapp ist. */
  zusatz?: string;
  /** Artikel-Slugs ohne Sprache. Leer heisst: noch keiner — und so steht es da. */
  beitraege: string[];
  /** Die Regel dazu. `null` heisst: bewusst keine. */
  regel: Verweis | null;
}

export const SZENARIEN: Szenario[] = [
  {
    id: 'foto',
    titel: 'Jemand kommt nach Hause, das Handy lädt die Fotos ab',
    status: 'belegt',
    beitraege: [],
    regel: { titel: 'Alles muss ohne das Werkzeug lesbar sein', ziel: 'vorgehen/dokumentieren/#regel-07' },
  },
  {
    id: 'brief',
    titel: 'Ein Brief kommt an und ist zwei Minuten später auffindbar',
    status: 'belegt',
    beitraege: [],
    regel: { titel: 'Vor der Masse ein Einzelfall', ziel: 'vorgehen/mit-einer-ki/#regel-04' },
  },
  {
    id: 'frage',
    titel: 'Eine Frage an die eigenen Unterlagen — die das Haus nicht verlässt',
    status: 'teilweise',
    beitraege: [],
    regel: { titel: 'Der einzige Kanal, bei dem der Inhalt bleibt', ziel: 'vorgehen/mit-einer-ki/#kanaele' },
  },
  {
    id: 'verlust',
    titel: 'Eine Datei ist weg — und es gibt vier Rückwege',
    status: 'teilweise',
    zusatz: 'ein Nachweis fehlt',
    beitraege: [],
    regel: { titel: 'Stolperstein 1: der stille Fehlermodus', ziel: 'vorgehen/stolpersteine/#typ-1' },
  },
  {
    id: 'geraet',
    titel: 'Ein neues Gerät kommt ins Haus',
    status: 'teilweise',
    beitraege: ['wlan-pro-stockwerk'],
    regel: { titel: 'Stolperstein 2: der eigene Eingriff', ziel: 'vorgehen/stolpersteine/#typ-2' },
  },
  {
    id: 'besuch',
    titel: 'Besuch kommt und fragt nach dem WLAN',
    status: 'belegt',
    beitraege: ['wlan-pro-stockwerk'],
    regel: null,
  },
  {
    id: 'strom',
    titel: 'Der Strom fällt aus',
    status: 'belegt',
    zusatz: 'belegt und entschieden',
    beitraege: [],
    regel: { titel: 'Rückwege benennen, bevor der Eingriff läuft', ziel: 'vorgehen/mit-einer-ki/#regel-05' },
  },
  {
    id: 'artikel',
    titel: 'Ein Artikel für diese Seite entsteht',
    status: 'belegt',
    zusatz: 'belegt · diese Website',
    beitraege: ['drei-stille-fehler-an-einem-tag'],
    regel: { titel: 'Stolperstein 1 und 6: stiller Fehlermodus, falscher Kanal', ziel: 'vorgehen/stolpersteine/#typ-1' },
  },
];

export function szenario(id: string): Szenario {
  const treffer = SZENARIEN.find((s) => s.id === id);
  /* Ein Tippfehler in der MDX-Datei soll den Bau anhalten, nicht eine Seite
   * mit leerem Titel erzeugen. */
  if (!treffer) throw new Error(`szenarien.ts: unbekanntes Szenario "${id}"`);
  return treffer;
}

/** Die Szenarien, in denen ein Artikel vorkommt. */
export function szenarienZuBeitrag(slug: string): Szenario[] {
  return SZENARIEN.filter((s) => s.beitraege.includes(slug));
}

export const SZENARIO_SEITE = 'aufbau/was-es-kann';
