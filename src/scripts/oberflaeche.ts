/* oberflaeche.ts — das bisschen Verhalten, das die Seite braucht.
 *
 * Grundsatz: Ohne JavaScript bleibt die Seite vollstaendig lesbar. Die
 * Erklaerungen sind dann sichtbar (Voreinstellung), das Farbschema folgt dem
 * System, und der Prompt-Text laesst sich von Hand markieren. Was ohne
 * JavaScript nicht funktionieren kann — die Knoepfe — wird per CSS
 * ausgeblendet, statt folgenlos dazustehen (html:not(.py-js)).
 *
 * Der ZUSTAND wird nicht hier gesetzt, sondern im Inline-Skript im <head>
 * (Basis.astro). Sonst blitzt die Seite im falschen Modus auf, bevor dieses
 * Modul geladen ist. Hier steht nur, was auf einen Klick hin passiert. */

const SCHLUESSEL_THEMA = 'py-thema';
const SCHLUESSEL_ERKLAERUNGEN = 'py-erklaerungen';

const wurzel = document.documentElement;

/** localStorage kann werfen — privates Fenster, gesperrte Website-Daten.
 *  Ein Schalter, der die Seite mitreisst, weil er sich nichts merken darf,
 *  waere schlechter als einer, der sich nichts merkt. */
function merke(schluessel: string, wert: string): void {
  try { localStorage.setItem(schluessel, wert); } catch { /* dann eben nur diese Sitzung */ }
}

/* ---- Farbschema ---------------------------------------------------- */

function wirksamesThema(): 'light' | 'dark' {
  const gesetzt = wurzel.dataset.theme;
  if (gesetzt === 'light' || gesetzt === 'dark') return gesetzt;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function zeigeThema(): void {
  const jetzt = wirksamesThema();
  for (const knopf of document.querySelectorAll<HTMLButtonElement>('[data-py-thema]')) {
    const seins = knopf.dataset.pyThema === jetzt;
    knopf.classList.toggle('py-schalter__aktiv', seins);
    knopf.setAttribute('aria-pressed', String(seins));
  }
}

function setzeThema(wert: 'light' | 'dark'): void {
  wurzel.dataset.theme = wert;
  merke(SCHLUESSEL_THEMA, wert);
  zeigeThema();
}

/* ---- Erklaerungen --------------------------------------------------- */

function zeigeErklaerungen(): void {
  const ein = wurzel.dataset.erklaerungen !== 'aus';
  for (const knopf of document.querySelectorAll<HTMLButtonElement>('[data-py-erklaerungen]')) {
    knopf.setAttribute('aria-pressed', String(ein));
    const feld = knopf.querySelector('[data-py-erklaerungen-text]');
    if (feld) feld.textContent = ein ? 'ein' : 'aus';
  }
}

function schalteErklaerungen(): void {
  const ein = wurzel.dataset.erklaerungen !== 'aus';
  if (ein) wurzel.dataset.erklaerungen = 'aus';
  else delete wurzel.dataset.erklaerungen;
  merke(SCHLUESSEL_ERKLAERUNGEN, ein ? 'aus' : 'ein');
  zeigeErklaerungen();
}

/* ---- Prompt kopieren ------------------------------------------------ */

async function inZwischenablage(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    /* Kein sicherer Kontext oder verweigert. Der Text bleibt markierbar —
     * deshalb meldet der Knopf „nicht kopiert" und tut nicht so, als haette
     * es geklappt. Ein gruener Status ohne Nachweis ist genau das, wovon
     * dieser Blog handelt. */
    return false;
  }
}

async function kopiere(knopf: HTMLButtonElement): Promise<void> {
  const block = knopf.closest('.py-prompt');
  const quelle = block?.querySelector<HTMLElement>('[data-py-quelle]');
  if (!quelle) return;

  const text = (quelle.innerText ?? quelle.textContent ?? '').trim();
  if (!text) return;

  const geklappt = await inZwischenablage(text);
  const ruhe = knopf.dataset.pyText ?? 'kopieren';
  knopf.textContent = geklappt
    ? (knopf.dataset.pyFertig ?? 'kopiert')
    : (knopf.dataset.pyFehler ?? 'nicht kopiert');
  knopf.dataset.zustand = geklappt ? 'fertig' : 'fehler';

  window.setTimeout(() => {
    knopf.textContent = ruhe;
    delete knopf.dataset.zustand;
  }, 2000);
}

/* ---- Diagramm vergroessern (29.10.2026) -----------------------------
 * Ein <dialog>, einmal angelegt und wiederverwendet. Darin eine KOPIE des
 * SVG — das Original bleibt an seinem Platz, und Schliessen heisst nur,
 * den Dialog zu schliessen. Escape erledigt der Browser selbst.
 *
 * ⚠️ Die Kopie traegt dieselben Marker-IDs wie das Original. Das ist hier
 * harmlos: `url(#…)` findet das erste Element dieses Namens, und das ist
 * derselbe Pfeil. Wuerde ein Diagramm je Kopie eigene Marker brauchen,
 * muessten die IDs beim Klonen umbenannt werden. */

let zoomDialog: HTMLDialogElement | null = null;

function zoomFenster(): HTMLDialogElement {
  if (zoomDialog) return zoomDialog;
  const d = document.createElement('dialog');
  d.className = 'py-zoom';
  d.setAttribute('aria-label', 'Diagramm vergrössert');
  d.innerHTML =
    '<div class="py-zoom__kopf"><span>Escape oder Klick schliesst</span>' +
    '<button type="button" class="py-zoom__zu" data-py-zoom-zu>schliessen</button></div>' +
    '<div class="py-zoom__bild" data-py-zoom-zu></div>';
  /* Klick auf den abgedunkelten Rand: Ziel ist der Dialog selbst. */
  d.addEventListener('click', (e) => {
    if (e.target === d || (e.target instanceof Element && e.target.closest('[data-py-zoom-zu]'))) d.close();
  });
  document.body.append(d);
  zoomDialog = d;
  return d;
}

function vergroessere(rolle: HTMLElement): void {
  const svg = rolle.querySelector('svg');
  if (!svg) return;
  const d = zoomFenster();
  const flaeche = d.querySelector<HTMLElement>('.py-zoom__bild')!;
  flaeche.replaceChildren(svg.cloneNode(true));
  d.showModal();
}

/* Tastatur: Die Bildflaeche wird zum Knopf — sonst erreicht nur die Maus
 * die Vergroesserung. */
for (const rolle of document.querySelectorAll<HTMLElement>('[data-py-zoom]')) {
  rolle.tabIndex = 0;
  rolle.setAttribute('role', 'button');
  rolle.setAttribute('aria-label', 'Diagramm vergrössern');
  rolle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); vergroessere(rolle); }
  });
}

/* ---- Verdrahtung ----------------------------------------------------
 * Ein einziger Zuhoerer am Dokument statt einer pro Knopf. Dadurch
 * funktionieren auch Bloecke, die erst spaeter im DOM landen. */

document.addEventListener('click', (ereignis) => {
  const ziel = ereignis.target;
  if (!(ziel instanceof Element)) return;

  const thema = ziel.closest<HTMLButtonElement>('[data-py-thema]');
  if (thema) {
    const wert = thema.dataset.pyThema;
    if (wert === 'light' || wert === 'dark') setzeThema(wert);
    return;
  }

  if (ziel.closest('[data-py-erklaerungen]')) {
    schalteErklaerungen();
    return;
  }

  const zoom = ziel.closest<HTMLElement>('[data-py-zoom]');
  if (zoom) { vergroessere(zoom); return; }

  const kopierKnopf = ziel.closest<HTMLButtonElement>('[data-py-kopieren]');
  if (kopierKnopf) void kopiere(kopierKnopf);
});

/* Solange der Leser NICHT selbst gewaehlt hat, folgt die Seite dem System —
 * auch wenn es waehrend des Lesens umschaltet. */
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (!wurzel.dataset.theme) zeigeThema();
});

zeigeThema();
zeigeErklaerungen();
