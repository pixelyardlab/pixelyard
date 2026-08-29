// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import rehypeExternalLinks from 'rehype-external-links';

/* Eigenes Farbschema fuer Code-Bloecke.
 *
 * Warum nicht das mitgelieferte `github-dark`: Dessen Kommentarfarbe #6A737D
 * ergibt auf unserem Terminal-Hintergrund 3.56:1 im hellen und 2.53:1 im
 * dunklen Modus — beides unter AA. Ausgerechnet die Kommentare, also die
 * Zeilen, die erklaeren, waeren am schlechtesten lesbar gewesen.
 *
 * Die Werte hier stammen aus derselben Palette wie der Rest der Seite und sind
 * gegen BEIDE Blockfarben gerechnet (#0D1F16 hell, #183C2D dunkel).
 * Der schlechteste Wert im Satz ist 5.46:1.
 *
 * Vier Rollen statt zwoelf. Ein Terminal-Block, der aussieht wie ein
 * Farbkasten, widerspricht der Leitidee. */
const terminalFarben = {
	name: 'pixelyard-terminal',
	type: 'dark',
	colors: { 'editor.background': '#0D1F16', 'editor.foreground': '#EDE7D8' },
	settings: [
		{ settings: { background: '#0D1F16', foreground: '#EDE7D8' } },
		// Kommentare — 7.69 / 5.46
		{
			scope: ['comment', 'punctuation.definition.comment'],
			settings: { foreground: '#9CB3A6', fontStyle: 'italic' },
		},
		// Schluesselwoerter, Operatoren — 8.11 / 5.76 (Camel)
		{
			scope: ['keyword', 'storage', 'storage.type', 'keyword.control', 'keyword.operator'],
			settings: { foreground: '#D2AC7C' },
		},
		// Zeichenketten — 8.61 / 6.12 (Racing-Green-Familie)
		{
			scope: ['string', 'string.quoted', 'constant.character', 'meta.string'],
			settings: { foreground: '#7FC79B' },
		},
		// Zahlen und Konstanten — 9.67 / 6.88
		{
			scope: ['constant.numeric', 'constant.language', 'support.constant', 'variable.other.constant'],
			settings: { foreground: '#A9C7D8' },
		},
		// Funktions- und Typnamen — 12.47 / 8.87
		{
			scope: ['entity.name.function', 'support.function', 'entity.name.type', 'support.type'],
			settings: { foreground: '#CFE0D5' },
		},
	],
};

// https://astro.build/config
export default defineConfig({
	// Kanonische Domain — Entscheid vom 26.08.2026, projektstart.md §7.
	// Sitemap, hreflang, Canonical und OG-Meta haengen daran.
	site: 'https://www.pixelyard.ch',

	integrations: [
		// MDX, weil <Erklaerung> und <Prompt> MITTEN im deutschen Fliesstext
		// stehen muessen (designbrief.md §8). Mit reinem Markdown ginge das nicht.
		mdx(),

		sitemap({
			// Was nicht indexiert werden soll, gehoert auch nicht in die Sitemap.
			// Sonst widersprechen sich zwei Signale, und Suchmaschinen entscheiden
			// selbst, welches gilt.
			filter: (seite) =>
				!seite.endsWith('/design/') &&
				new URL(seite).pathname !== '/',
			i18n: {
				defaultLocale: 'de',
				locales: { de: 'de-CH' },
			},
		}),
	],

	// Der Hintergrund des Blocks wird in basis.css ueberschrieben, damit er dem
	// Modus folgt; die Schriftfarben oben halten gegen beide Werte.
	markdown: {
		shikiConfig: { theme: terminalFarben },

		// 🔑 Externe Links oeffnen in einem neuen Fenster — Entscheid vom
		// 29.08.2026. `rel="noopener"` gehoert zwingend dazu: ohne es bekommt
		// die Zielseite ueber `window.opener` Zugriff auf diese hier.
		//
		// Das Plugin unterscheidet nach PROTOKOLL, nicht gegen `site`: Es fasst
		// Links mit absolutem http/https-Ziel an. Interne Links stehen im Blog
		// als relative Pfade (/de/...) und bleiben deshalb unberuehrt —
		// nachgeprueft im Bau, nicht angenommen.
		//
		// ⚠️ Folge davon: Wer einen INTERNEN Link ausnahmsweise absolut
		// schreibt (https://www.pixelyard.ch/...), bekommt target="_blank"
		// mit. Interne Ziele deshalb immer relativ schreiben.
		//
		// Wirkt nur auf Markdown und MDX. `<Affiliatelink>` bringt target und
		// rel selbst mit (rel="sponsored nofollow noopener") und liegt als
		// Komponente ausserhalb dieses Baums — das Plugin sieht ihn nicht.
		rehypePlugins: [[rehypeExternalLinks, { target: '_blank', rel: ['noopener'] }]],
	},
});
