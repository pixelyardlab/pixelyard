/* content.config.ts — die Artikel-Sammlung.
 *
 * designbrief.md §6a / editorial.md §6: Das Sprachfeld steht ab Tag 1 hier,
 * auch wenn es vorerst nur einen Wert kennt. Beim Aufsetzen kostet es fast
 * nichts; nach zwanzig Artikeln nachzuruesten ist unangenehm.
 *
 * Ablage: src/content/artikel/<sprache>/<name>.mdx
 * Die id lautet dann z. B. `de/restore-test` — die Sprache steckt im Pfad UND
 * im Feld. Beides muss uebereinstimmen; die Pruefung dazu steht unten. */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const artikel = defineCollection({
  loader: glob({ base: './src/content/artikel', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    titel: z.string(),
    /* Wird zur <meta name="description"> und zur `description` im Schema.org.
     * Zwei Saetze, keine Ueberschrift in Prosa. */
    beschreibung: z.string(),

    datum: z.coerce.date(),
    /* Korrekturen sind hier Programm (CLAUDE.md, Inhaltliche Leitlinie 3).
     * Ein Blog, der sich korrigiert, braucht ein sichtbares Aenderungsdatum. */
    aktualisiert: z.coerce.date().optional(),

    schlagworte: z.array(z.string()).default([]),

    /* --- Mehrsprachigkeit -------------------------------------------- */
    sprache: z.enum(['de', 'en']).default('de'),
    /* Verbindet die Fassungen desselben Artikels ueber die Sprachen hinweg.
     * Daraus entstehen die hreflang-Angaben. Gleicher Wert = gleicher Artikel. */
    paar: z.string(),

    /* --- Zustand ------------------------------------------------------ */
    entwurf: z.boolean().default(false),

    /* --- E-E-A-T (designbrief §6) ------------------------------------- */
    autor: z.string().default('Cedric Graber'),
    /* Optionale FAQ-Sektion mit FAQPage-Schema. Nur wo sie wirklich Fragen
     * beantwortet — eine erfundene FAQ ist genau die Sorte Fuellmaterial,
     * die dieser Blog anderen vorwirft. */
    faq: z
      .array(z.object({ frage: z.string(), antwort: z.string() }))
      .optional(),
  }),
});

/* Die Kapitel der drei Bereiche — Umbau Schritt 3, 28.10.2026.
 *
 * Ablage: src/content/kapitel/<sprache>/<slug aus navigation.ts>.mdx
 *   z. B. kapitel/de/aufbau/hardware.mdx  → id `de/aufbau/hardware`
 *         kapitel/de/aufbau.mdx           → id `de/aufbau` (die Übersicht)
 *
 * 🔑 Titel, Kurzbeschreibung, Status und `entwurf` stehen NICHT hier, sondern
 * in navigation.ts. Die Datei liefert nur den Text. Zwei Orte für den Titel
 * wären die Doppelpflege, gegen die navigation.ts gebaut ist. */
const kapitel = defineCollection({
  loader: glob({ base: './src/content/kapitel', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    /* „Übersicht, keine Betriebsdokumentation": der Stand, den die Seite
     * beschreibt. Erscheint am Fuss und in der Meta-Zeile. */
    stand: z.coerce.date(),
    /* Ein Satz unter dem Titel — die Frage, die das Kapitel beantwortet. */
    einleitung: z.string(),
  }),
});

export const collections = { artikel, kapitel };
