/* navigation.ts — die Seitenstruktur als Datenmodell.
 *
 * 🔑 EINE Quelle. Seitenleiste, Brotkrumen, Weiterlesen-Fuss und der
 * Sitemap-Filter in astro.config.mjs ziehen alle aus dieser Datei. Zwei
 * Fassungen derselben Struktur driften auseinander — derselbe Grund, aus dem
 * `artikel.ts` existiert.
 *
 * ⚠️ Diese Datei wird von `astro.config.mjs` importiert. Sie darf deshalb
 * NICHTS aus `astro:content` holen: zum Zeitpunkt, an dem die Konfiguration
 * geladen wird, gibt es die Sammlung noch nicht. Die Beiträge kommen zur
 * Bauzeit aus `alleArtikel()` — hier steht bewusst keine zweite Artikelliste.
 *
 * Die Titel stehen auf Deutsch hier und nicht in `seite.ts`: Sie sind Inhalt,
 * kein Oberflächentext. Käme Englisch dazu, bekäme diese Tabelle eine zweite
 * Fassung — dieselbe Entscheidung wie bei den Artikeln.
 */

import { SPRACHE_STANDARD, type Sprache } from './seite';

/** `beitrag` umfasst die Artikel UND alles, was auf sie zeigt (Themenseiten). */
export type Bereich = 'aufbau' | 'beitrag' | 'vorgehen' | 'einzeln';

/* Drei Zustände, und der mittlere ist der wichtigste: Er sagt, dass etwas
 * läuft, der Nachweis aber fehlt. Ein Projekt ohne diesen Zustand behauptet
 * mehr, als es gemessen hat (CLAUDE.md, Leitlinie 2). */
export type Status = 'belegt' | 'teilweise' | 'geplant';

export interface Eintrag {
  /** Pfad ohne Sprachpräfix und ohne Schrägstriche aussen: `aufbau/hardware`. */
  slug: string;
  titel: string;
  bereich: Bereich;
  status: Status;
  /** true → noindex, nicht in der Sitemap. Wird in Basis.astro abgeleitet. */
  entwurf: boolean;
  kurzbeschreibung: string;
  /** Verbindet je einen Eintrag aus Aufbau, Beiträgen und Vorgehen.
   *  Daraus entstehen die drei Plätze im Weiterlesen-Fuss — ohne dass
   *  irgendwo eine Zuordnung von Hand gepflegt wird. */
  bund?: string;
  /** Der erste Eintrag einer Gruppe: die Bereichsübersicht. */
  uebersicht?: boolean;
}

/* --- Status: was er hier heisst (Umbau Schritt 3, 28.10.2026) ----------
 * Der Status sagt, wie weit die Aussagen DER SEITE belegt sind — nicht, ob
 * die Seite geschrieben ist (das sagt `entwurf`).
 *   belegt     jede Zahl gemessen, jeder Ablauf einmal wirklich durchgeführt
 *   teilweise  die Seite enthält Teile, deren Nachweis fehlt oder die nur
 *              gerechnet sind (Situationen 3–5, die Modell-Leiter, die nicht
 *              gebauten Möglichkeiten) — und sagt das an der Stelle selbst
 *   geplant    die Seite beschreibt, was noch nicht existiert („Offen")
 * ⚠️ Vorschlag von Claude, 28.10.2026 — von Cedric gegenzulesen. */

/* --- Die Struktur ------------------------------------------------------
 * ⚠️ Die Kurzbeschreibungen sind VORSCHLÄGE vom 24.09.2026. Sie sagen, was
 * dort hinkommt — sie behaupten nichts über das, was gebaut wurde. Wer sie
 * ersetzt, ersetzt sie hier und nirgends sonst. */
export const EINTRAEGE: Eintrag[] = [
  /* ---- Der Aufbau — was gebaut wurde ---- */
  {
    slug: 'aufbau', titel: 'Der Aufbau', bereich: 'aufbau', uebersicht: true,
    status: 'teilweise', entwurf: true,
    kurzbeschreibung: 'Was zuhause steht, in Teilen — und warum jedes Teil so und nicht anders ausfiel.',
  },
  {
    slug: 'aufbau/was-es-kann', titel: 'Was es kann', bereich: 'aufbau', bund: 'nachweis',
    status: 'teilweise', entwurf: true,
    kurzbeschreibung: 'Was der Aufbau im Alltag leistet, und woran du das ablesen kannst.',
  },
  {
    slug: 'aufbau/hardware', titel: 'Hardware', bereich: 'aufbau', bund: 'hardware',
    status: 'belegt', entwurf: true,
    kurzbeschreibung: 'Die Geräte, die laufen — mit dem, was sie abgelöst haben.',
  },
  {
    slug: 'aufbau/software', titel: 'Software', bereich: 'aufbau', bund: 'software',
    status: 'belegt', entwurf: true,
    kurzbeschreibung: 'Was auf den Geräten läuft, wofür — und was wieder herunterflog.',
  },
  {
    slug: 'aufbau/maschine-modelle', titel: 'Maschine und Modelle', bereich: 'aufbau', bund: 'modelle',
    status: 'teilweise', entwurf: true,
    kurzbeschreibung: 'Die Maschine für die lokale KI und die Modelle, die darauf laufen.',
  },
  {
    slug: 'aufbau/reihenfolge', titel: 'Die Reihenfolge', bereich: 'aufbau', bund: 'anfang',
    status: 'belegt', entwurf: true,
    kurzbeschreibung: 'In welcher Reihenfolge die Teile entstanden sind — und welche Reihenfolge du dir sparen kannst.',
  },
  {
    slug: 'aufbau/moeglichkeiten', titel: 'Möglichkeiten', bereich: 'aufbau', bund: 'moeglichkeiten',
    status: 'teilweise', entwurf: true,
    kurzbeschreibung: 'Was der Aufbau noch hergibt, ohne dass du etwas dazukaufst.',
  },
  {
    slug: 'aufbau/offen', titel: 'Offen', bereich: 'aufbau', bund: 'offen',
    status: 'geplant', entwurf: true,
    kurzbeschreibung: 'Was nicht läuft, was ungeklärt ist und was ich schlicht noch nicht weiss.',
  },

  /* ---- Die Beiträge — wie es gelaufen ist ----
   * Nur die Übersicht steht hier. Die Beiträge selbst kommen aus
   * `alleArtikel()`; eine zweite Liste an dieser Stelle wäre genau die
   * Doppelpflege, gegen die diese Datei gebaut ist. */
  {
    slug: 'artikel', titel: 'Die Beiträge', bereich: 'beitrag', uebersicht: true,
    status: 'teilweise', entwurf: true,
    kurzbeschreibung: 'Alle Beiträge, neueste zuerst — wie es gelaufen ist, samt dem, was schiefging.',
  },

  /* ---- Das Vorgehen — wie man so etwas angeht ---- */
  {
    slug: 'vorgehen', titel: 'Das Vorgehen', bereich: 'vorgehen', uebersicht: true,
    status: 'belegt', entwurf: true,
    kurzbeschreibung: 'Wie du so etwas angehst, ohne dieselben Umwege zu gehen.',
  },
  {
    slug: 'vorgehen/bevor-man-anfaengt', titel: 'Bevor du anfängst', bereich: 'vorgehen', bund: 'anfang',
    status: 'belegt', entwurf: true,
    kurzbeschreibung: 'Was du klären solltest, bevor du das erste Gerät bestellst.',
  },
  {
    slug: 'vorgehen/mit-einer-ki', titel: 'Mit einer KI', bereich: 'vorgehen', bund: 'software',
    status: 'belegt', entwurf: true,
    kurzbeschreibung: 'Wie eine KI beim Bauen hilft — und wo sie dir zuverlässig nicht hilft.',
  },
  {
    slug: 'vorgehen/dokumentieren', titel: 'Dokumentieren', bereich: 'vorgehen', bund: 'hardware',
    status: 'belegt', entwurf: true,
    kurzbeschreibung: 'Warum das Mitschreiben zum Bauen gehört und nicht zur Nacharbeit.',
  },
  {
    slug: 'vorgehen/stolpersteine', titel: 'Stolpersteine', bereich: 'vorgehen', bund: 'nachweis',
    status: 'belegt', entwurf: true,
    kurzbeschreibung: 'Fehler, die sich nicht melden, weil sie Erfolg zurückmelden.',
  },
  {
    slug: 'vorgehen/anders-machen', titel: 'Anders machen', bereich: 'vorgehen', bund: 'moeglichkeiten',
    status: 'belegt', entwurf: true,
    kurzbeschreibung: 'Was ich heute anders bauen würde, und woran ich das gemerkt habe.',
  },
  {
    slug: 'vorgehen/ohne-daten', titel: 'Ohne Daten', bereich: 'vorgehen', bund: 'modelle',
    status: 'belegt', entwurf: true,
    kurzbeschreibung: 'Wie du Werkzeuge nutzt, ohne deine Unterlagen aus dem Haus zu geben.',
  },

  /* ---- Ausserhalb der Gruppen ---- */
  {
    slug: 'prompts', titel: 'Alle Prompts', bereich: 'einzeln',
    status: 'geplant', entwurf: true,
    kurzbeschreibung: 'Alle Prompts aus den Beiträgen an einem Ort, zum Kopieren.',
  },
  {
    slug: 'ueber', titel: 'Über', bereich: 'einzeln',
    status: 'geplant', entwurf: true,
    kurzbeschreibung: 'Wer hier schreibt, warum — und was hier bewusst nicht steht.',
  },
];

/* --- Geplante Beiträge ------------------------------------------------
 * Beiträge, die es noch nicht als Datei gibt. Sie stehen kursiv und blass in
 * der Seitenleiste, tragen keinen Link und erzeugen keine Route.
 *
 * Derzeit leer — Entscheid vom 24.09.2026: erst der Rahmen, die Titel später.
 * Der Gruppenzähler zeigt deshalb `3` und nicht `3 + 4`. */
export const GEPLANTE_BEITRAEGE: Eintrag[] = [];

/* --- Bündel: welcher Beitrag gehört zu welchem Zusammenhang ------------
 * Der Gegenpart zum Feld `bund` oben. Er steht hier und nicht im Frontmatter
 * der Artikel, weil die drei vorhandenen Artikel unverändert bleiben.
 *
 * ⚠️ Schlüssel ist der Artikel-Slug OHNE Sprache. Ein Tippfehler fällt nicht
 * auf — der Platz bleibt dann einfach leer. `bekannteBuendel()` unten ist die
 * Gegenprobe. */
export const BUND_JE_BEITRAG: Record<string, string> = {
  'mein-weg-ins-homelab': 'anfang',
  'wlan-pro-stockwerk': 'hardware',
  'drei-stille-fehler-an-einem-tag': 'nachweis',
};

/* --- Seiten ohne Seitenleiste ------------------------------------------
 * Rechtstexte und die Design-Seite. Sie sind keine Inhaltsseiten des Blogs:
 * eine Bereichsnavigation daneben würde behaupten, sie gehörten in die
 * Struktur. Die 404-Seite ebenfalls — sie soll zurückführen, nicht weiter. */
export const OHNE_LEISTE = ['impressum', 'datenschutz', 'design'] as const;

/* --- Sichtbarkeit -------------------------------------------------------
 * 🔑 Dasselbe Muster wie in artikel.ts, mit Absicht kein zweites: Entwürfe
 * erscheinen im Dev-Server und nie im Bau.
 *
 * Der Unterschied zu den Artikeln ist, dass eine Entwurfsseite hier trotzdem
 * GEBAUT wird — sie soll per Adresse erreichbar bleiben, damit man sie ansehen
 * kann. Verlinkt wird sie nicht: nicht in der Leiste, nicht im Weiterlesen-
 * Fuss, nicht in den Brotkrumen. Erreichbar und auffindbar sind zwei Dinge.
 *
 * ⚠️ `entwurfsPfade()` unten benutzt das NICHT. Die Sitemap muss jeden Entwurf
 * kennen, gerade weil sie im Bau läuft — sie soll ihn ja ausschliessen. */
/* ⚠️ `?.` mit Absicht (Nacharbeit aus Schritt 1): Ausserhalb von Vite — etwa
 * mit blossem `node` oder `tsx` in einem Hilfsskript — gibt es `import.meta.env`
 * nicht, und die Datei liess sich gar nicht erst laden. Ohne Vite gilt: kein
 * Entwicklungsserver, also keine Entwürfe zeigen. */
export const zeigeEntwuerfe: boolean = import.meta.env?.DEV ?? false;

/** Darf dieser Eintrag verlinkt werden? */
export function sichtbar(eintrag: Eintrag): boolean {
  return zeigeEntwuerfe || !eintrag.entwurf;
}

/* --- Ableitungen ------------------------------------------------------- */

export function pfadVon(eintrag: Eintrag, sprache: Sprache = SPRACHE_STANDARD): string {
  return `/${sprache}/${eintrag.slug}/`;
}

/** Ein Pfad in seine Bestandteile: `/de/aufbau/hardware/` → `aufbau/hardware`. */
function slugAusPfad(pfad: string): { sprache: string; slug: string } | null {
  const teile = pfad.split('/').filter(Boolean);
  if (teile.length === 0) return null;
  return { sprache: teile[0], slug: teile.slice(1).join('/') };
}

export function eintragZuPfad(pfad: string): Eintrag | undefined {
  const zerlegt = slugAusPfad(pfad);
  if (!zerlegt) return undefined;
  return EINTRAEGE.find((e) => e.slug === zerlegt.slug);
}

/** Der Bereich einer Seite — auch für Seiten, die nicht in EINTRAEGE stehen:
 *  ein Artikel und eine Themenseite gehören zu den Beiträgen. */
export function bereichZuPfad(pfad: string): Bereich | undefined {
  const zerlegt = slugAusPfad(pfad);
  if (!zerlegt || zerlegt.slug === '') return undefined;
  const treffer = eintragZuPfad(pfad);
  if (treffer) return treffer.bereich;
  if (zerlegt.slug.startsWith('artikel/') || zerlegt.slug.startsWith('thema/')) return 'beitrag';
  return undefined;
}

/** Die Bereichsübersicht eines Bereichs — der erste Eintrag der Gruppe. */
export function uebersichtVon(bereich: Bereich): Eintrag | undefined {
  return EINTRAEGE.find((e) => e.bereich === bereich && e.uebersicht);
}

/** Die Unterkapitel eines Bereichs, ohne die Übersicht.
 *
 *  ⚠️ UNGEFILTERT — hieran hängen die Routen (`getStaticPaths`). Ein Entwurf
 *  soll gebaut werden; er soll nur nicht verlinkt werden. Wer eine Liste zum
 *  ANZEIGEN braucht, nimmt `sichtbareKapitelVon()`. */
export function kapitelVon(bereich: Bereich): Eintrag[] {
  return EINTRAEGE.filter((e) => e.bereich === bereich && !e.uebersicht);
}

/** Dieselbe Liste, aber nur das, was verlinkt werden darf. */
export function sichtbareKapitelVon(bereich: Bereich): Eintrag[] {
  return kapitelVon(bereich).filter(sichtbar);
}

/** Alle Pfade, die `entwurf: true` tragen — je Sprache.
 *
 *  🔑 Genau diese Liste schliesst der Sitemap-Filter aus. Der Filter arbeitet
 *  über Pfade und kennt `entwurf` nicht; würde er eine eigene Liste führen,
 *  hätte man zwei Wahrheiten und eine davon wäre irgendwann alt. */
export function entwurfsPfade(sprachen: readonly string[]): string[] {
  const pfade: string[] = [];
  for (const sprache of sprachen) {
    for (const e of EINTRAEGE) {
      if (e.entwurf) pfade.push(`/${sprache}/${e.slug}/`);
    }
  }
  return pfade;
}

/** Trägt diese Seite die Bereichsleiste? */
export function zeigtLeiste(pfad: string, sprachen: readonly string[]): boolean {
  const zerlegt = slugAusPfad(pfad);
  if (!zerlegt) return false;
  if (!sprachen.includes(zerlegt.sprache)) return false;
  return !(OHNE_LEISTE as readonly string[]).includes(zerlegt.slug);
}

/** Alle Bündelschlüssel, die in EINTRAEGE tatsächlich vorkommen.
 *  Gegenprobe gegen Tippfehler in BUND_JE_BEITRAG. */
export function bekannteBuendel(): Set<string> {
  return new Set(EINTRAEGE.map((e) => e.bund).filter((b): b is string => Boolean(b)));
}

/** Der Eintrag eines Bündels in einem bestimmten Bereich — oder nichts.
 *  „Oder nichts" ist der Normalfall und kein Fehler: nicht jeder Zusammenhang
 *  hat alle drei Seiten. Der leere Platz wird benannt, nicht versteckt. */
export function eintragImBund(bund: string, bereich: Bereich): Eintrag | undefined {
  return EINTRAEGE.find((e) => e.bund === bund && e.bereich === bereich);
}
