// Copie de branding/geeko/geeko.ts (dépôt Geeks Code, source unique) : à changer là-bas, puis à recopier ici.
/* eslint-disable */
// @ts-nocheck
/*---------------------------------------------------------------------------------------------
 *  Geeko, la mascotte de Geeks Code (version kawaii validée par Elias le 28/10/2026).
 *  J21 : la grande bibliothèque d'animations (maquette validée par Elias le 29/10/2026).
 *  Moteur sans dépendance : pixel art calculé (formes rastérisées, contours, ombrage doux),
 *  une scène par activité de Claude, plusieurs variantes tirées sans répétition, continuité tant
 *  que l'activité dure, transitions douces, intensité (Geeko de profil qui tape comme un malade),
 *  easter eggs, trois tailles. Source unique : copié dans le cœur par apply-branding.ps1 (écran de
 *  connexion) et transpilé pour les webviews des extensions 3geeks.
 *
 *    const geeko = createGeeko(document, { activity: 'hello', size: 'grand' });
 *    parent.appendChild(geeko.element);
 *    geeko.setActivity('code', 'turbo');  // J20 et J19 : « Claude fait telle activité, avec telle intensité »
 *    geeko.setScene('think');             // ancienne API, toujours valable
 *    geeko.setVariant('pancarte');        // une scène précise, sans rotation (le site 3geeks.fr)
 *    geeko.dispose();
 *
 *  Règles décidées le 29/10 (PLAN.md, J21) : intensité calme, normale ou turbo (c'est l'appelant qui la choisit :
 *  turbo en Ultracode, sur Opus ou Fable en effort élevé, après 3 min de tour ou plus de 8 fichiers touchés ; calme
 *  pour un petit tour sur Haiku) ; easter eggs au plus un par quart d'heure, une chance sur trois quand le contexte
 *  s'y prête ; une autre variante toutes les 9 à 15 s tant que l'activité dure ; grand Geeko jusqu'à 4 fois sa
 *  taille de base ; « réduire les animations » : Geeko disparaît (la bulle et le minuteur des appelants restent).
 *--------------------------------------------------------------------------------------------*/

export type GeekoScene = 'intro' | 'hello' | 'wait' | 'think' | 'code' | 'type' | 'party' | 'oops' | 'sleep';
export type GeekoActivity = 'hello' | 'think' | 'talk' | 'read' | 'search' | 'code' | 'servers' | 'wait' | 'party' | 'oops' | 'sleep' | 'walk';
export type GeekoIntensity = 'calme' | 'normal' | 'turbo';
/** 'fort' : nom de l'intensité turbo dans la maquette, toujours accepté. */
export type GeekoIntensityInput = GeekoIntensity | 'fort';
export type GeekoSize = 'grand' | 'moyen' | 'petit';
export type GeekoEgg = 'nuit' | 'vendredi' | 'pizza' | 'fusee' | 'chatouille' | 'tourne' | 'legende';
/** J24 : 'ultra', Geeko en violet quand Claude est en Ultracode (lime → violet, menthe → orchidée, PC au « 3 » violet). */
export type GeekoPalette = 'normal' | 'ultra';

export interface GeekoInfo {
	activity: GeekoActivity;
	intensity: GeekoIntensity;
	variant: string;
	name: string;
	label: string;
	index: number;
	count: number;
	egg?: GeekoEgg;
}

export interface GeekoHandle {
	readonly element: HTMLElement;
	setScene(scene: GeekoScene): void;
	setActivity(activity: GeekoActivity, intensity?: GeekoIntensityInput): void;
	setVariant(id: string): void;
	setSize(size: GeekoSize | number): void;
	egg(name: GeekoEgg): void;
	/** J24 : change la palette (repeint la phase en cours, la scène continue). */
	setPalette(palette: GeekoPalette): void;
	readonly palette: GeekoPalette;
	readonly info: GeekoInfo | undefined;
	dispose(): void;
}

export interface GeekoOptions {
	scene?: GeekoScene;
	activity?: GeekoActivity;
	intensity?: GeekoIntensityInput;
	/** Un nom de taille, ou un facteur (1 = 80 × 72 px), plafonné à 4 (grand). */
	size?: GeekoSize | number;
	/** La scène autour de Geeko (serveurs, tableau…) : par défaut à partir de 1,5 (taille moyenne) ; false la retire (boîte de 80 × 72 × taille). */
	stage?: boolean;
	reduceMotion?: boolean;
	eggs?: boolean;
	/** J24 : 'ultra' pour le Geeko violet de l'Ultracode (par défaut 'normal'). */
	palette?: GeekoPalette;
	/** L'id d'une variante de LIBRARY à jouer seule : ni tirage, ni rotation, ni easter egg automatique (le site 3geeks.fr). */
	variant?: string;
	/** Ses textes pour un public hors équipe : reçoit la bulle ou la pancarte, et rend le texte à afficher (null retire la bulle). */
	say?: (text: string) => string | null;
	now?: () => Date;
	onChange?: (info: GeekoInfo) => void;
}

type Run = { x: number; y: number; w: number; c: string };
type Part = { box: number[]; test: (x: number, y: number) => boolean; shade: (x: number, y: number) => string; outline?: boolean; oc?: string };
type Frame = Run[];
interface Phase {
	view?: 'front' | 'profile';
	arms: Frame[]; armMs: number;
	over?: Frame[];
	eyes: string[]; eyeMs?: number;
	mouth: string[]; mouthMs?: number; blush?: boolean;
	bubble?: string; bubbleDots?: boolean;
	laptop?: 'enter' | 'on' | 'leave';
	wear?: string[]; front?: string[]; props?: string[]; fx?: string[];
	head?: string; body?: string; tail?: string; actor?: string;
	/** Les pieds en images, au rythme des bras (de profil) : ils remplacent les pieds fixes du corps. */
	legs?: Frame[];
}
interface Variant { id: string; name: string; label: string; seq: [string, number][]; laptop?: 'front' | 'profile'; noFetch?: boolean; in?: GeekoIntensity[]; egg?: GeekoEgg }

const W = 80, H = 72;
const SVG = 'http://www.w3.org/2000/svg';
const P = { O: '#2B4500', L: '#C3FB05', H: '#E9FFA6', S: '#A4D400', D: '#82A800', M: '#0AEFBB', m: '#08C99D', K: '#101624', I: '#26334D', W: '#FFFFFF', Pk: '#FF9EA8', T: '#FF6F7D', mug: '#F2F4F7', mugS: '#A3ACB9', cof: '#6B3E1F', X: '#05070A', G1: '#12161D', G2: '#1E242D', G3: '#2A313C', G4: '#3A414D', G5: '#4B5563', G6: '#8C96A4', G7: '#C9D0D9', R: '#FF5A5F', Rd: '#D8434A', Y: '#FCC200', Kr: '#C08A4B', Kd: '#9C6B35', Kl: '#D9A566', Wd: '#8A5A2B' };
// J24 : la palette Ultracode (maquette validée par Elias le 29/10). Les couleurs sont posées au rendu (svgEl, styles des
// décors) : les tracés mis en cache restent ceux de la palette normale, la clé de palette s'ajoute à leur sortie.
// Lime → violet, menthe → orchidée, vert du PC → prune ; le reste (gris, peau, café, rouge, or) ne change pas.
const ULTRA: Record<string, string> = {
	'#2B4500': '#2A0D52', '#C3FB05': '#B57BFF', '#E9FFA6': '#EBDDFF', '#A4D400': '#9259F0', '#82A800': '#7440D6',
	'#0AEFBB': '#F0ABFC', '#08C99D': '#D77CEB', '#5DF7D3': '#FBD3FF', '#B9F6E6': '#FBE3FF', '#0A5C4B': '#5B3A99',
	'#07463A': '#3B1F6E', '#0E7A63': '#6D3FC0', 'rgba(10,239,187,': 'rgba(240,171,252,', 'rgba(233,255,166,': 'rgba(235,221,255,',
	'#0A7827': '#5B21B6', '#047E3C': '#6D28D9', '#06734B': '#7C3AED', '#076A48': '#6B21A8', '#027956': '#86198F', '#01966D': '#A21CAF',
};
const ULTRA_RE = new RegExp(Object.keys(ULTRA).map(k => k.replace(/[()]/g, '\\$&')).join('|'), 'g');
const ultraInk = (s: string) => ULTRA[s] ?? (s.includes('#') || s.includes('rgba(') ? s.replace(ULTRA_RE, m => ULTRA[m]) : s);
const sameInk = (s: string) => s;
/** La palette du rendu en cours (le rendu est synchrone : posée par paint et geekoImage, remise ensuite). */
let ink = sameInk;

// Logo 3geeks officiel (charte, 02-logo/svg) : tracé du symbole et des deux plis.
// Symbole 3geeks (charte), aussi utilisé hors de Geeko (page Claude habillée).
export const LOGO = 'M103 80L311.75 80C318.49 80 325.47 81.4 331.5 84.36C337.63 87.37 343.99 90.86 348.39 96.25C371.14 124.14 351.62 162.43 317.75 172.04C313.33 173.3 308.64 174.5 304 174.5L185.75 174.5C182.62 174.5 179.54 175.3 176.5 175.88C154.18 180.11 135.33 195.11 124.7 215C120.87 222.17 118.16 230.19 116.97 238.25C116.52 241.3 115.61 245.82 119.5 247.06C122.75 248.1 132.78 247.25 136.75 247.25L300.75 247.47C314.28 247.47 327.97 246.54 341.5 247.47C347.55 247.89 353.8 247.54 359.5 250C364.27 252.06 369.87 254.81 373.75 258.3C390.75 273.6 389.66 300.21 376.46 317.5C365.06 332.43 344.9 341.25 326.25 341.25L78.75 341.25C74.78 341.25 70.63 342.17 66.75 342.87C41.2 347.5 18.88 365.95 7.87 389.25C4.12 397.2 3.25 402.8 0.68 410.75C-0.08 413.09 -1.02 417.85 1.03 419.74C4.03 422.51 7.96 421.75 11.75 421.75L364.5 421.73C366.33 421.59 368.15 420.97 370 420.8C374.09 420.42 378.18 420.33 382.25 419.64C408.54 415.14 433.08 400.75 450.36 380.5C457.15 372.54 463.2 363.76 467.62 354.25C474.86 338.68 477 327.13 479.67 310.5C480.81 303.39 479.35 291.65 478.12 284.5C477.84 282.85 477.92 281.14 477.57 279.5C472.99 257.52 463.21 236.72 448.68 219.5C443.1 212.89 436.78 207.03 430 201.7C428.47 200.49 421.85 196.4 421.38 194.98C420.99 193.83 424.95 187.71 425.64 186.25C429.42 178.3 432.52 170.23 434.8 161.75C440.71 139.76 439.33 117.32 433.51 95.5C430.1 82.71 423.97 70.01 416.28 59.25C396.12 31.01 365.56 9.92 331.25 3.28C307.99 -1.22 283.19 0 259.5 0L83.5 0.37C77.81 0.41 71.99 0 66.25 0C59.24 0 48.57 1.08 42.25 0.46C39.12 0.16 30.41 -0.26 28.02 1.83C25.8 3.77 26.64 7.63 26.96 10.25C27.88 17.82 30.54 25.92 33.9 32.75C45.74 56.8 67.83 74.77 94.5 78.87C97.33 79.3 100.12 80 103 80Z';
const PLI0 = 'M337.32 85.48C330.47 88.61 346.36 100.89 349.88 112.25C354.83 128.24 348.39 145.14 336.23 155.96C332.93 158.91 323.91 165.25 327.42 170.62C334.86 175.96 353.92 174.17 363 174.94C370.29 175.55 377.7 176.95 384.75 178.88C389.34 180.14 405.52 187.46 408.88 186.05C413 184.32 411.86 176.49 411.58 173C410.58 160.04 407.09 147.63 401.31 136C391.74 116.74 377.41 102.01 358.58 91.71C354.32 89.38 342.07 83.31 337.32 85.48Z';
const PLI1 = 'M366.32 251.48C359.91 254.44 375.03 268.56 377.5 274.26C382.85 286.62 379.16 302.48 373.84 314.24C372.64 316.89 371.18 320.69 373.58 323.07C375.05 323.73 376.73 323.52 378.19 324.22C380.97 325.55 382.31 329.02 384.87 330.79C387.78 332.78 391.19 333.8 394.21 335.59C412.32 346.34 404.22 342.49 423.75 346.72C436.63 349.51 436.73 342.64 436.75 331.75C436.77 317.14 432.77 303.45 425.57 290.75C416.66 275.02 402.03 263.35 386 255.58C381.82 253.56 370.83 249.38 366.32 251.48Z';
const SIZES: Record<GeekoSize, number> = { grand: 4, moyen: 1.6, petit: 0.8 };
// La scène autour de Geeko (serveurs, tableau, globe…) : seulement à partir de la taille moyenne.
const STAGE = { x: -18, y: -14, w: 116, h: 88 };
const BARE = { x: 0, y: 0, w: W, h: H };
const ALL: GeekoIntensity[] = ['calme', 'normal', 'turbo'];
const intensityOf = (i: GeekoIntensityInput | undefined): GeekoIntensity => (i === 'fort' ? 'turbo' : i === 'calme' || i === 'turbo' ? i : 'normal');

// Anciennes scènes (API setScene) : gardées telles quelles.
const SCENES: Record<GeekoScene, [string, number][]> = {
	intro: [['wave', 2200], ['fetch', 850], ['settle', 520], ['type', 0]],
	hello: [['wave', 0]],
	wait: [['wait', 0]],
	think: [['think', 0]],
	code: [['fetch', 850], ['settle', 520], ['type', 0]],
	type: [['type', 0]],
	party: [['party', 0]],
	oops: [['oops', 0]],
	sleep: [['sleep', 0]],
};

// ---- La bibliothèque : une scène par activité, plusieurs variantes ---------------------------

export const LIBRARY: Record<GeekoActivity, Variant[]> = {
	// J25 : de profil, tourné vers la droite ; l'appelant le déplace et le retourne pour aller à gauche.
	walk: [
		{ id: 'marche', name: 'marche', label: 'Geeko marche', seq: [['walk', 0]] },
	],
	hello: [
		{ id: 'coucou', name: 'coucou', label: 'Geeko te fait coucou', seq: [['wave', 0]] },
		{ id: 'yo', name: 'yo', label: 'Geeko saute de joie en te voyant', seq: [['yo', 0]] },
	],
	think: [
		{ id: 'menton', name: 'menton', label: 'Geeko réfléchit, la main sous le menton', seq: [['think', 0]] },
		{ id: 'ampoule', name: 'ampoule', label: "Geeko cherche l'idée, puis l'ampoule s'allume", seq: [['bulb', 0]] },
		{ id: 'engrenages', name: 'engrenages', label: 'Geeko se gratte la tête, les engrenages tournent', seq: [['gears', 0]] },
	],
	talk: [
		{ id: 'explique', name: 'explique', label: "Geeko t'explique, la bouche et les mains en mouvement", seq: [['explain', 0]] },
		{ id: 'tableau', name: 'tableau', label: 'Geeko dessine un schéma au tableau en parlant', seq: [['board', 0]] },
	],
	read: [
		{ id: 'livre', name: 'livre', label: 'Geeko lit ligne par ligne, lunettes sur le nez', seq: [['book', 0]] },
		{ id: 'fichiers', name: 'fichiers', label: 'Les fichiers défilent, Geeko les attrape et les lit', seq: [['files', 0]] },
	],
	search: [
		{ id: 'loupe', name: 'loupe', label: 'Geeko passe le code à la loupe', seq: [['loupe', 0]] },
		{ id: 'radar', name: 'radar', label: 'Geeko scrute le web, le radar tourne', seq: [['radar', 0]] },
		{ id: 'fouille', name: 'fouille', label: 'Geeko fouille le carton, les fichiers volent', seq: [['dig', 0]] },
	],
	code: [
		{ id: 'deux-doigts', name: 'deux doigts', label: 'Geeko code à deux doigts, la langue sortie', seq: [['type', 0]], laptop: 'front', in: ['calme', 'normal'] },
		{ id: 'casque', name: 'casque', label: 'Geeko code au casque, la tête qui suit le son', seq: [['music', 0]], laptop: 'front', in: ['calme', 'normal'] },
		{ id: 'pensif', name: 'pensif', label: "Geeko tape, s'arrête pour réfléchir, puis repart", seq: [['ponder', 0]], laptop: 'front', in: ['calme', 'normal'] },
		{ id: 'rafale', name: 'rafale', label: 'Geeko de profil tape comme un malade, les touches volent', seq: [['rush', 0]], laptop: 'profile', in: ['turbo'] },
		{ id: 'turbo', name: 'turbo', label: 'Geeko en bandeau, plein turbo, le bureau prend feu', seq: [['turbo', 0]], laptop: 'profile', in: ['turbo'] },
	],
	servers: [
		{ id: 'ronde', name: 'ronde', label: 'Geeko fait sa ronde entre les serveurs, à gauche, à droite', seq: [['patrol', 0]] },
		{ id: 'console', name: 'console', label: 'Geeko pilote les serveurs depuis la console', seq: [['console', 0]], in: ['calme', 'normal'] },
		{ id: 'surchauffe', name: 'surchauffe', label: 'Les serveurs chauffent, Geeko les ventile en urgence', seq: [['overheat', 0]], in: ['turbo'] },
	],
	wait: [
		{ id: 'cafe', name: 'café', label: 'Geeko attend ton accord en buvant un café', seq: [['wait', 0]] },
		{ id: 'pancarte', name: 'pancarte', label: 'Geeko brandit sa pancarte : ton OK ?', seq: [['sign', 0]] },
		{ id: 'montre', name: 'montre', label: 'Geeko regarde sa montre, puis te regarde', seq: [['watch', 0]] },
	],
	party: [
		{ id: 'confettis', name: 'confettis', label: 'Geeko fait la fête sous les confettis', seq: [['party', 0]] },
		{ id: 'disco', name: 'disco', label: 'Geeko danse sous la boule disco', seq: [['disco', 0]] },
	],
	oops: [
		{ id: 'aie', name: 'aïe', label: 'Geeko a vu une erreur', seq: [['oops', 0]] },
		{ id: 'fumee', name: 'fumée', label: 'Le PC fume, Geeko chasse la fumée', seq: [['smoke', 0]], laptop: 'front', noFetch: true },
	],
	sleep: [
		{ id: 'sieste', name: 'sieste', label: 'Geeko fait une sieste', seq: [['sleep', 0]] },
		{ id: 'couette', name: 'couette', label: 'Geeko dort sous sa couette, bonnet sur la tête', seq: [['blanket', 0]] },
	],
};

// Les easter eggs : rares (au plus un tous les quarts d'heure), jamais deux fois de suite.
export const EGGS: Record<GeekoEgg, Variant & { when: string; on?: GeekoActivity[]; ms?: number }> = {
	nuit: { id: 'nuit', name: 'nuit', egg: 'nuit', label: 'Après 23 h : bonnet de nuit, gros mug, un dernier commit et dodo', seq: [['night', 0]], laptop: 'front', when: 'après 23 h ou avant 5 h, en code ou en attente', on: ['code', 'wait'] },
	vendredi: { id: 'vendredi', name: 'vendredi', egg: 'vendredi', label: 'Vendredi après 16 h : lunettes de soleil devant les serveurs', seq: [['friday', 0]], when: 'le vendredi après 16 h, pendant les commandes', on: ['servers'] },
	pizza: { id: 'pizza', name: 'pizza', egg: 'pizza', label: 'Très long tour : Geeko se prend une pause pizza', seq: [['pizza', 0]], when: 'après 15 min de travail sans pause', on: ['code', 'wait', 'think'] },
	fusee: { id: 'fusee', name: 'fusée', egg: 'fusee', label: 'Déploiement réussi : la fusée 3Geeks décolle', seq: [['rocket', 0]], when: 'la fête juste après des commandes', on: ['party'], ms: 6400 },
	chatouille: { id: 'chatouille', name: 'chatouille', egg: 'chatouille', label: 'Trois clics sur Geeko : ça chatouille', seq: [['giggle', 0]], when: '3 clics rapides sur Geeko', ms: 2600 },
	tourne: { id: 'tourne', name: 'tourne', egg: 'tourne', label: 'Six clics : Geeko fait un tonneau et voit des spirales', seq: [['spin', 0]], when: '6 clics rapides sur Geeko', ms: 2800 },
	legende: { id: 'legende', name: 'légende', egg: 'legende', label: 'Code Konami : Geeko passe en mode légende, tout doré', seq: [['legend', 0]], when: '↑ ↑ ↓ ↓ ← → ← → B A au clavier', ms: 9000 },
};

const KEYFRAMES = Array.from({ length: 11 }, (_, i) => i + 2).map(n => `@keyframes gkf${n}{0%{opacity:1}${(100 / n).toFixed(3)}%{opacity:0}100%{opacity:0}}`).join('\n')
	+ '\n' + Array.from({ length: 6 }, (_, i) => `@keyframes gk-line${i}{0%,${i * 13}%{opacity:0}${i * 13 + 1}%,92%{opacity:1}100%{opacity:0}}`).join('\n');

const CSS = `
.gk-root{position:relative;display:inline-block;line-height:0;font-family:Inter,'Segoe UI',sans-serif;--u:2px}
.gk-root svg rect{shape-rendering:crispEdges}
.gk-layer{position:absolute;left:0;top:0;width:100%;height:100%;transform-origin:50% 100%}
.gk-actor,.gk-abs{position:absolute}
${KEYFRAMES}
.gk-in{animation:gk-in 340ms cubic-bezier(0.23,1,0.32,1) both}
@keyframes gk-in{from{opacity:0;transform:translateY(calc(var(--u)*1.5)) scale(0.985)}to{opacity:1;transform:none}}
.gk-out{animation:gk-out 240ms ease-in both;pointer-events:none}
@keyframes gk-out{to{opacity:0;transform:translateY(calc(var(--u)*-1))}}
.gk-blink{transform-box:fill-box;transform-origin:50% 55%;animation:gk-blink 4.4s infinite}
@keyframes gk-blink{0%,93%,100%{transform:scaleY(1)}96%{transform:scaleY(0.12)}}
.gk-bob{animation:gk-bob 260ms steps(1) infinite}
.gk-bob.fast{animation-duration:110ms}
@keyframes gk-bob{0%{transform:translateY(0)}50%{transform:translateY(1px)}}
.gk-beat{transform-box:fill-box;transform-origin:50% 100%;animation:gk-beat 480ms ease-in-out infinite}
@keyframes gk-beat{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-3deg) translateY(1px)}}
.gk-breathe{animation:gk-breathe 3.6s ease-in-out infinite}
@keyframes gk-breathe{0%,100%{transform:translateY(0)}50%{transform:translateY(0.6px)}}
.gk-nod{transform-box:fill-box;transform-origin:50% 100%;animation:gk-nod 3.2s ease-in-out infinite}
@keyframes gk-nod{0%,100%{transform:rotate(0deg) translateY(0)}50%{transform:rotate(4deg) translateY(1.5px)}}
.gk-jump{animation:gk-jump 520ms cubic-bezier(0.23,1,0.32,1) infinite alternate}
@keyframes gk-jump{from{transform:translateY(0)}to{transform:translateY(-5px)}}
.gk-hop{animation:gk-hop 700ms ease-in-out infinite alternate}
@keyframes gk-hop{from{transform:translateY(0)}to{transform:translateY(-2px)}}
.gk-sway{transform-box:view-box;transform-origin:40px 66px;animation:gk-sway 760ms ease-in-out infinite alternate}
@keyframes gk-sway{from{transform:rotate(-5deg)}to{transform:rotate(5deg)}}
.gk-shake{animation:gk-shake 420ms steps(2) infinite}
@keyframes gk-shake{0%{transform:translateX(0)}50%{transform:translateX(1px)}}
.gk-tail{transform-box:view-box;transform-origin:47px 60px;animation:gk-tail 2.8s ease-in-out infinite}
.gk-tail.fast{animation-duration:700ms}
.gk-ptail{transform-box:view-box;transform-origin:30px 59px;animation:gk-ptail 420ms ease-in-out infinite}
@keyframes gk-tail{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-6deg)}}
@keyframes gk-ptail{0%,100%{transform:rotate(0deg)}50%{transform:rotate(8deg)}}
.gk-tint,.gk-glow{animation:gk-glow 900ms ease-in-out infinite}
.gk-glow.fast{animation-duration:240ms}
@keyframes gk-glow{0%,100%{opacity:0.55}40%{opacity:1}70%{opacity:0.7}}
.gk-lap-enter{transform-origin:50% 100%;animation:gk-lap 820ms cubic-bezier(0.77,0,0.175,1) both}
@keyframes gk-lap{0%{opacity:0;transform:translateX(120%) translateY(-18%) rotateY(78deg)}25%{opacity:1}70%{transform:translateX(8%) translateY(-6%) rotateY(18deg)}100%{opacity:1;transform:none}}
.gk-lap-leave{transform-origin:50% 100%;animation:gk-lapout 520ms cubic-bezier(0.77,0,0.175,1) both}
@keyframes gk-lapout{from{opacity:1;transform:none}to{opacity:0;transform:translateX(120%) translateY(-18%) rotateY(78deg)}}
.gk-pop{opacity:0;animation:gk-pop 1.1s cubic-bezier(0.23,1,0.32,1) infinite}
@keyframes gk-pop{0%{opacity:0;transform:translateY(0) scale(0.8)}15%{opacity:1}100%{opacity:0;transform:translateY(-120%) scale(1.05)}}
.gk-bubble{animation:gk-bubble 360ms cubic-bezier(0.23,1,0.32,1) both;transform-origin:0% 100%}
@keyframes gk-bubble{from{opacity:0;transform:scale(0.85) translateY(4px)}to{opacity:1;transform:none}}
.gk-dot{display:inline-block;border-radius:50%;background:#08090D;animation:gk-dot 1.2s ease-in-out infinite}
@keyframes gk-dot{0%,100%{opacity:0.25;transform:translateY(0)}40%{opacity:1;transform:translateY(-25%)}}
.gk-bar{display:block;border-radius:99px;background:#2B4500;transform-origin:0 50%;animation:gk-bar 2.4s cubic-bezier(0.23,1,0.32,1) infinite}
@keyframes gk-bar{0%{transform:scaleX(0.1);opacity:0.3}35%,85%{transform:scaleX(1);opacity:1}100%{transform:scaleX(1);opacity:0}}
.gk-z{opacity:0;animation:gk-z 2.6s ease-in-out infinite}
@keyframes gk-z{0%{opacity:0;transform:translate(0,0) scale(0.7)}25%{opacity:1}100%{opacity:0;transform:translate(60%,-160%) scale(1.1)}}
.gk-drop{animation:gk-drop 1.5s ease-in infinite}
@keyframes gk-drop{0%{opacity:0;transform:translateY(0)}20%{opacity:1}100%{opacity:0;transform:translateY(160%)}}
.gk-conf{opacity:0;animation:gk-conf 1.6s linear infinite}
@keyframes gk-conf{0%{opacity:0;transform:translateY(-40%) rotate(0deg)}10%{opacity:1}100%{opacity:0;transform:translateY(340%) rotate(220deg)}}
.gk-steam{opacity:0;animation:gk-steam 2.2s ease-out infinite}
@keyframes gk-steam{0%{opacity:0;transform:translateY(0)}30%{opacity:0.7}100%{opacity:0;transform:translateY(-140%)}}
.gk-patrol{animation:gk-patrol 6s ease-in-out infinite}
@keyframes gk-patrol{0%,10%{transform:translateX(0)}18%,46%{transform:translateX(calc(var(--u)*-15))}52%,60%{transform:translateX(0)}68%,94%{transform:translateX(calc(var(--u)*15))}100%{transform:translateX(0)}}
.gk-patrol.fast{animation-duration:3.6s}
.gk-rumble{animation:gk-rumble 90ms steps(2) infinite}
@keyframes gk-rumble{0%{transform:translate(0,0)}50%{transform:translate(calc(var(--u)*0.5),calc(var(--u)*-0.4))}}
.gk-spin{transform-origin:50% 72%;animation:gk-spin 900ms cubic-bezier(0.65,0,0.35,1) infinite}
@keyframes gk-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
.gk-gold{filter:sepia(0.85) saturate(3.4) hue-rotate(4deg) brightness(1.08) drop-shadow(0 0 calc(var(--u)*3) rgba(252,194,0,0.55))}
.gk-led{animation:gk-led 1.7s steps(1) infinite}
.gk-led.hot{animation-duration:0.32s}
@keyframes gk-led{0%{opacity:1}50%{opacity:0.25}80%{opacity:1}}
.gk-key{opacity:0;animation:gk-key 720ms cubic-bezier(0.2,0.8,0.3,1) infinite}
@keyframes gk-key{0%{opacity:0;transform:translate(0,0) rotate(0deg)}12%{opacity:1}100%{opacity:0;transform:translate(calc(var(--dx)*var(--u)),calc(var(--u)*-17)) rotate(var(--r))}}
.gk-speed{opacity:0;animation:gk-speed 380ms linear infinite}
@keyframes gk-speed{0%{opacity:0;transform:translateX(0)}20%{opacity:0.9}100%{opacity:0;transform:translateX(calc(var(--u)*-14))}}
.gk-tac{opacity:0;animation:gk-tac 1.3s cubic-bezier(0.23,1,0.32,1) infinite}
@keyframes gk-tac{0%{opacity:0;transform:scale(0.4) rotate(var(--r))}14%{opacity:1;transform:scale(1.18) rotate(var(--r))}28%{transform:scale(1) rotate(var(--r))}60%{opacity:1}100%{opacity:0;transform:translateY(calc(var(--u)*-3)) rotate(var(--r))}}
.gk-fly{opacity:0;animation:gk-fly 760ms ease-out infinite}
@keyframes gk-fly{0%{opacity:0;transform:translate(0,0)}15%{opacity:1}100%{opacity:0;transform:translate(calc(var(--u)*-13),calc(var(--u)*6))}}
.gk-puff{opacity:0;animation:gk-puff 1.8s ease-out infinite}
@keyframes gk-puff{0%{opacity:0;transform:translate(0,0) scale(0.5)}20%{opacity:0.85}100%{opacity:0;transform:translate(calc(var(--dx)*var(--u)),calc(var(--u)*-15)) scale(1.9)}}
.gk-flame{transform-origin:50% 100%;animation:gk-flame 180ms steps(2) infinite}
@keyframes gk-flame{0%{transform:scaleY(1)}50%{transform:scaleY(0.7) scaleX(1.1)}}
.gk-term{opacity:1}
.gk-flip{opacity:0;transform-origin:0 50%;animation:gk-flip 3.2s ease-in-out infinite}
@keyframes gk-flip{0%,68%{opacity:0;transform:rotateY(0deg)}70%{opacity:1}92%{opacity:1;transform:rotateY(-180deg)}100%{opacity:0;transform:rotateY(-180deg)}}
.gk-card{opacity:0;animation:gk-card 6.4s cubic-bezier(0.23,1,0.32,1) infinite}
@keyframes gk-card{0%{opacity:0;transform:translateX(calc(var(--u)*18))}7%{opacity:1;transform:translateX(0)}21%{opacity:1;transform:translateX(0)}30%{opacity:0;transform:translate(calc(var(--u)*-62),calc(var(--u)*8)) scale(0.55)}100%{opacity:0;transform:translate(calc(var(--u)*-62),calc(var(--u)*8)) scale(0.55)}}
.gk-radar{opacity:0;border-radius:50%;animation:gk-radar 2.2s ease-out infinite}
@keyframes gk-radar{0%{opacity:0.9;transform:scale(0.3)}100%{opacity:0;transform:scale(1.7)}}
.gk-chip{opacity:0;animation:gk-chip 3.3s cubic-bezier(0.23,1,0.32,1) infinite}
@keyframes gk-chip{0%{opacity:0;transform:scale(0.6)}10%,70%{opacity:1;transform:none}100%{opacity:0;transform:translateY(calc(var(--u)*-3))}}
.gk-paper{opacity:0;animation:gk-paper 1.5s cubic-bezier(0.3,0.7,0.5,1) infinite}
@keyframes gk-paper{0%{opacity:0;transform:translate(0,0) rotate(0deg)}10%{opacity:1}50%{transform:translate(calc(var(--dx)*var(--u)*0.5),calc(var(--u)*-17)) rotate(180deg)}100%{opacity:0;transform:translate(calc(var(--dx)*var(--u)),calc(var(--u)*3)) rotate(360deg)}}
.gk-spark{opacity:0;animation:gk-spark 1.3s ease-in-out infinite}
@keyframes gk-spark{0%,100%{opacity:0;transform:scale(0.3)}50%{opacity:1;transform:scale(1)}}
.gk-spot{border-radius:50%;opacity:0.5;animation:gk-spot 2.6s ease-in-out infinite alternate}
@keyframes gk-spot{from{transform:translateX(calc(var(--u)*-22))}to{transform:translateX(calc(var(--u)*22))}}
.gk-bulb{animation:gk-bulb 4.8s steps(1) infinite}
@keyframes gk-bulb{0%,45%{opacity:0}47%{opacity:1}49%{opacity:0}51%{opacity:1}53%{opacity:0.2}56%,96%{opacity:1}100%{opacity:0}}
.gk-gear{animation:gk-gear 2.4s steps(12) infinite}
.gk-gear.rev{animation-direction:reverse;animation-duration:1.8s}
@keyframes gk-gear{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
.gk-snot{border-radius:50%;transform-origin:0 100%;animation:gk-snot 2.6s ease-in-out infinite}
@keyframes gk-snot{0%,100%{transform:scale(0.3)}50%{transform:scale(1)}}
.gk-rocket{animation:gk-rocket 3.2s cubic-bezier(0.5,0,0.9,0.6) infinite}
@keyframes gk-rocket{0%{opacity:0;transform:translateY(0)}8%{opacity:1;transform:translateY(0)}20%{transform:translateY(calc(var(--u)*-2))}100%{opacity:1;transform:translateY(calc(var(--u)*-80))}}
.gk-note{opacity:0;animation:gk-note 2.2s ease-out infinite}
@keyframes gk-note{0%{opacity:0;transform:translate(0,0) rotate(-8deg)}20%{opacity:1}100%{opacity:0;transform:translate(calc(var(--dx)*var(--u)),calc(var(--u)*-14)) rotate(10deg)}}
.gk-twinkle{animation:gk-twinkle 2.4s ease-in-out infinite}
@keyframes gk-twinkle{0%,100%{opacity:0.25}50%{opacity:1}}
.gk-draw{stroke-dasharray:40;animation:gk-draw 4.8s ease-in-out infinite}
@keyframes gk-draw{0%{stroke-dashoffset:40}40%,92%{stroke-dashoffset:0}100%{stroke-dashoffset:40}}
.gk-ultra .gk-bar{background:#2A0D52}
.gk-ultra .gk-tail{animation-duration:380ms!important}
.gk-ultra .gk-bob{animation-duration:140ms!important}
.gk-ultra .gk-jump{animation-duration:260ms!important}
.gk-root.gk-reduce *{animation:none!important}
.gk-root.gk-reduce .gk-rest,.gk-root.gk-reduce .gk-fxt{display:none}
@media (prefers-reduced-motion:reduce){.gk-root *{animation:none!important}.gk-rest,.gk-fxt{display:none}}
.gk-live.gk-reduce,.monaco-reduce-motion .gk-live,.vscode-reduce-motion .gk-live{display:none!important}
@media (prefers-reduced-motion:reduce){.gk-live{display:none!important}}
`;

// ---- Rastérisation --------------------------------------------------------------------------

const ell = (cx: number, cy: number, rx: number, ry: number) => (x: number, y: number) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1;
const rect = (x0: number, y0: number, x1: number, y1: number) => (x: number, y: number) => x >= x0 && x < x1 && y >= y0 && y < y1;
const tri = (ax: number, ay: number, bx: number, by: number, cx: number, cy: number) => (x: number, y: number) => {
	const s = (px: number, py: number, qx: number, qy: number, rx: number, ry: number) => (px - rx) * (qy - ry) - (qx - rx) * (py - ry);
	const d1 = s(x, y, ax, ay, bx, by), d2 = s(x, y, bx, by, cx, cy), d3 = s(x, y, cx, cy, ax, ay);
	return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0));
};
const cap = (ax: number, ay: number, bx: number, by: number, r: number) => (x: number, y: number) => {
	const dx = bx - ax, dy = by - ay, l = dx * dx + dy * dy || 1;
	const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / l));
	return (x - ax - t * dx) ** 2 + (y - ay - t * dy) ** 2 <= r * r;
};
// Ombrage doux : un reflet en haut à gauche, une seule ombre sur le bord bas.
const shadeEll = (cx: number, cy: number, rx: number, ry: number) => (x: number, y: number) => {
	const nx = (x - cx) / rx, ny = (y - cy) / ry, r = nx * nx + ny * ny;
	if (ny > 0.68 && r > 0.6) { return P.S; }
	if (nx < -0.2 && ny < -0.25 && r > 0.38 && r < 0.82) { return P.H; }
	return P.L;
};
const darker = (shade: (x: number, y: number) => string) => (x: number, y: number) => { const c = shade(x, y); return c === P.L ? P.S : c === P.H ? P.L : P.D; };
const dots = (list: number[][], color: string): Part => {
	const set = new Set(list.map(([x, y]) => x + ',' + y));
	const xs = list.map(d => d[0]), ys = list.map(d => d[1]);
	return { test: (x, y) => set.has(Math.floor(x) + ',' + Math.floor(y)), shade: () => color, box: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)], outline: false };
};
const solid = (box: number[], test: (x: number, y: number) => boolean, color: string, oc?: string): Part => ({ box, test, shade: () => color, outline: oc !== undefined, oc });

function raster(parts: Part[], w = W, h = H): Run[] {
	const px = new Map<number, string>();
	for (const part of parts) {
		const fill = new Map<number, string>();
		const [x0, y0, x1, y1] = part.box;
		for (let y = Math.max(0, Math.floor(y0)); y <= Math.min(h - 1, Math.ceil(y1)); y++) {
			for (let x = Math.max(0, Math.floor(x0)); x <= Math.min(w - 1, Math.ceil(x1)); x++) {
				if (part.test(x + 0.5, y + 0.5)) { fill.set(y * w + x, part.shade(x + 0.5, y + 0.5)); }
			}
		}
		if (part.outline !== false) {
			for (const k of fill.keys()) {
				const x = k % w, y = (k - x) / w;
				for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
					const nx = x + dx, ny = y + dy;
					if (nx >= 0 && ny >= 0 && nx < w && ny < h && !fill.has(ny * w + nx)) { px.set(ny * w + nx, part.oc ?? P.O); }
				}
			}
		}
		for (const [k, c] of fill) { px.set(k, c); }
	}
	const rows = new Map<number, [number, string][]>();
	for (const [k, c] of px) {
		const x = k % w, y = (k - x) / w;
		if (!rows.has(y)) { rows.set(y, []); }
		rows.get(y)!.push([x, c]);
	}
	const out: Run[] = [];
	for (const [y, row] of rows) {
		row.sort((a, b) => a[0] - b[0]);
		let s = row[0][0], c = row[0][1], prev = s;
		for (let i = 1; i <= row.length; i++) {
			const cur = row[i];
			if (cur && cur[0] === prev + 1 && cur[1] === c) { prev = cur[0]; continue; }
			out.push({ x: s, y, w: prev - s + 1.04, c });
			if (cur) { s = cur[0]; prev = cur[0]; c = cur[1]; }
		}
	}
	return out;
}

const cache = new Map<string, Run[]>();
const memo = (key: string, fn: () => Run[]) => {
	if (!cache.has(key)) { cache.set(key, fn()); }
	return cache.get(key)!;
};

// ---- Geeko de face ------------------------------------------------------------------------------

const headTest = (x: number, y: number) => ell(40, 30, 19.6, 16.4)(x, y) || ell(40, 35, 20.4, 11.2)(x, y);

function curve(C: number[][], r0: number, r1: number, tip: number[], stripes: number[], box: number[]): Run[] {
	const pts: number[][] = [];
	for (let i = 0; i <= 28; i++) {
		const t = i / 28, u = 1 - t;
		const x = u * u * u * C[0][0] + 3 * u * u * t * C[1][0] + 3 * u * t * t * C[2][0] + t * t * t * C[3][0];
		const y = u * u * u * C[0][1] + 3 * u * u * t * C[1][1] + 3 * u * t * t * C[2][1] + t * t * t * C[3][1];
		pts.push([x, y, r0 - t * (r0 - r1), i]);
	}
	pts.push([tip[0], tip[1], r1, 40]);
	const find = (x: number, y: number) => pts.find(q => (x - q[0]) ** 2 + (y - q[1]) ** 2 <= q[2] * q[2]);
	return raster([{ box, test: (x, y) => !!find(x, y), shade: (x, y) => { const q = find(x, y)!; return stripes.includes(q[3]) ? P.D : (y > q[1] + q[2] * 0.45 ? P.S : P.L); } }]);
}

const tailRuns = () => memo('tail', () => curve([[47, 60], [59, 66], [67, 56], [60, 50]], 3.9, 1.9, [59.4, 52.4], [9, 10, 18, 19], [42, 45, 72, 70]));

function bodyRuns(): Run[] {
	return memo('body', () => raster([
		{ box: [28, 44, 52, 64], test: ell(40, 55, 10.5, 8.8), shade: shadeEll(40, 55, 10.5, 8.8) },
		{ box: [33, 49, 47, 63], test: ell(40, 57, 6.4, 5.6), shade: (x, y) => (x < 38 && y < 55.5) ? '#5DF7D3' : (y > 60.5 ? P.m : P.M), outline: false },
		{ box: [27, 59, 38, 66], test: ell(33, 63, 4.6, 2.8), shade: shadeEll(33, 63, 4.6, 2.8) },
		{ box: [42, 59, 53, 66], test: ell(47, 63, 4.6, 2.8), shade: shadeEll(47, 63, 4.6, 2.8) },
		dots([[31, 64], [33, 64], [35, 64], [45, 64], [47, 64], [49, 64]], P.H),
	]));
}

function headRuns(): Run[] {
	return memo('head', () => raster([
		{ box: [19, 12, 61, 48], test: headTest, shade: shadeEll(40, 30, 19.6, 16.4) },
		dots([[27, 19], [28, 19], [26, 20], [26, 21]], '#FFFFFF'),
	]));
}

function tintRuns(): Run[] {
	return memo('tint', () => raster([{ box: [20, 33, 61, 47], test: (x, y) => headTest(x, y) && y > 34, shade: () => 'rgba(10,239,187,0.22)', outline: false }]));
}

function eyeRuns(kind: string): Run[] {
	return memo('eye-' + kind, () => {
		const parts: Part[] = [];
		for (const cx of [31, 49]) {
			const cy = 33;
			const open = (gx: number, gy: number) => {
				const ex = cx + gx, ey = cy + gy;
				parts.push({ box: [ex - 6, ey - 7, ex + 6, ey + 7], test: ell(ex, ey, 4.4, 5.1), shade: (_x, y) => (y > ey + 1.6 ? P.I : P.K), outline: false });
				parts.push(dots([[ex - 2, ey - 3], [ex - 1, ey - 3], [ex - 3, ey - 2], [ex - 2, ey - 2], [ex - 1, ey - 2], [ex - 2, ey - 1]], P.W));
				parts.push(dots([[ex + 1, ey + 2], [ex + 2, ey + 2]], P.W));
			};
			const lid = (line: number) => {
				parts.push({ box: [cx - 6, cy - 7, cx + 6, cy + 2], test: (x, y) => ell(cx, cy + 1, 4.4, 5.1)(x, y) && y < line + 0.5, shade: () => P.L, outline: false });
				parts.push(dots([-4, -3, -2, -1, 0, 1, 2, 3, 4].map(t => [cx + t, line]), P.O));
			};
			if (kind === 'open') { open(0, 0); }
			if (kind === 'left') { open(-1, 0); }
			if (kind === 'right') { open(1, 0); }
			if (kind === 'down') { open(0, 1); }
			if (kind === 'dl') { open(-1, 1); }
			if (kind === 'dr') { open(1, 1); }
			if (kind === 'up') { open(1, -1); }
			if (kind === 'ul') { open(-1, -1); }
			if (kind === 'focus') { open(0, 1); lid(cy - 1); }
			if (kind === 'half') { open(0, 1); lid(cy + 1); }
			if (kind === 'sparkle') {
				open(0, 0);
				parts.push(dots([[cx + 2, cy - 4], [cx + 1, cy - 3], [cx + 2, cy - 3], [cx + 3, cy - 3], [cx + 2, cy - 2]], P.H));
			}
			if (kind === 'happy') { parts.push({ box: [cx - 6, cy - 6, cx + 6, cy + 3], test: (x, y) => { const d = Math.hypot(x - cx, y - cy - 1.5); return d > 2.6 && d < 4.2 && y < cy + 1.5; }, shade: () => P.K, outline: false }); }
			if (kind === 'closed') { parts.push(dots([[cx - 4, cy], [cx - 3, cy + 1], [cx - 2, cy + 2], [cx - 1, cy + 2], [cx, cy + 2], [cx + 1, cy + 2], [cx + 2, cy + 2], [cx + 3, cy + 1], [cx + 4, cy]], P.K)); }
			if (kind === 'x') { parts.push(dots([-3, -2, -1, 0, 1, 2, 3].flatMap(t => [[cx + t, cy + t], [cx + t, cy - t]]), P.K)); }
			if (kind === 'swirl') {
				const sp: number[][] = [];
				for (let a = 0; a < 15; a += 0.35) { const r = 0.35 * a; sp.push([Math.round(cx + Math.cos(a) * r), Math.round(cy + Math.sin(a) * r * 1.1)]); }
				parts.push(dots(sp, P.K));
			}
		}
		return raster(parts);
	});
}

const MOUTHS: Record<string, number[][]> = {
	smile: [[37, 38], [38, 39], [39, 39], [40, 38], [41, 39], [42, 39], [43, 38]],
	flat: [[39, 39], [40, 39], [41, 39]],
	small: [[40, 39]],
	o: [[39, 38], [40, 38], [41, 38], [38, 39], [42, 39], [39, 40], [40, 40], [41, 40]],
	open: [[37, 38], [38, 38], [39, 38], [40, 38], [41, 38], [42, 38], [43, 38], [37, 39], [43, 39], [38, 40], [42, 40], [39, 41], [40, 41], [41, 41]],
	tongue: [[37, 38], [38, 39], [39, 39], [40, 38], [41, 39], [42, 39], [43, 38]],
	yawn: [[38, 37], [39, 37], [40, 37], [41, 37], [42, 37], [37, 38], [43, 38], [37, 39], [43, 39], [37, 40], [43, 40], [38, 41], [39, 41], [40, 41], [41, 41], [42, 41]],
	chew: [[38, 39], [39, 38], [40, 39], [41, 38], [42, 39]],
};

function faceRuns(mouth: string, blush: boolean): Run[] {
	return memo('face-' + mouth + blush, () => {
		const parts: Part[] = [];
		if (blush) {
			parts.push({ box: [21, 38, 30, 43], test: ell(25.4, 40.6, 2.7, 1.3), shade: () => P.Pk, outline: false });
			parts.push({ box: [50, 38, 59, 43], test: ell(54.6, 40.6, 2.7, 1.3), shade: () => P.Pk, outline: false });
		}
		parts.push(dots(MOUTHS[mouth] ?? MOUTHS.smile, P.O));
		if (mouth === 'open') { parts.push(dots([[38, 39], [39, 39], [40, 39], [41, 39], [42, 39], [39, 40], [41, 40]], '#5A1F2A'), dots([[40, 40]], P.T)); }
		if (mouth === 'o') { parts.push(dots([[39, 39], [40, 39], [41, 39]], '#5A1F2A')); }
		if (mouth === 'yawn') { parts.push(dots([[38, 38], [39, 38], [40, 38], [41, 38], [42, 38], [38, 39], [39, 39], [40, 39], [41, 39], [42, 39], [38, 40], [39, 40], [41, 40], [42, 40]], '#5A1F2A'), dots([[40, 40]], P.T)); }
		if (mouth === 'tongue') { parts.push(dots([[41, 40], [42, 40]], P.T)); }
		return raster(parts);
	});
}

interface ArmOptions { fingerDir?: number[]; point?: boolean; noFingers?: boolean; mug?: boolean; loupe?: boolean; stick?: boolean; paper?: boolean; pizza?: boolean; watch?: boolean; far?: boolean }

function limb(sx: number, sy: number, hx: number, hy: number, flip: number, opts: ArmOptions = {}): Part[] {
	let dx = hx - sx, dy = hy - sy;
	const len = Math.hypot(dx, dy) || 1;
	dx /= len; dy /= len;
	const fdx = opts.fingerDir ? opts.fingerDir[0] : dx, fdy = opts.fingerDir ? opts.fingerDir[1] : dy;
	const base = opts.far ? P.S : P.L, low = opts.far ? P.D : P.S;
	const parts: Part[] = [{ box: [Math.min(sx, hx) - 4, Math.min(sy, hy) - 4, Math.max(sx, hx) + 4, Math.max(sy, hy) + 4], test: cap(sx, sy, hx, hy, 2.4), shade: (x, y) => ((x - sx) * -dy + (y - sy) * dx) * flip > 1.3 ? low : base }];
	if (opts.watch) {
		const wx = sx + (hx - sx) * 0.78, wy = sy + (hy - sy) * 0.78;
		parts.push(solid([wx - 3, wy - 3, wx + 3, wy + 3], ell(wx, wy, 1.6, 2.6), P.G2, P.X), dots([[Math.floor(wx), Math.floor(wy)]], P.M));
	}
	if (opts.mug) {
		const mx = hx + (flip < 0 ? 1 : -4), my = hy - 5;
		parts.push({ box: [mx - 1, my - 1, mx + 5, my + 6], test: (x, y) => x >= mx && x < mx + 4 && y >= my && y < my + 5, shade: (x, y) => y < my + 1 ? P.cof : (x > mx + 3 ? P.mugS : P.mug) });
		parts.push({ box: [mx + 3, my, mx + 7, my + 5], test: (x, y) => { const d = Math.hypot(x - (mx + 4.4), y - (my + 2.5)); return d > 0.9 && d < 2 && x > mx + 4; }, shade: () => P.mug });
		parts.push(dots([[mx + 1, my + 2], [mx + 2, my + 2], [mx + 1, my + 3]], P.L));
	}
	if (opts.loupe) {
		const lx = hx + fdx * 6.2, ly = hy + fdy * 6.2;
		parts.push(solid([hx - 6, hy - 6, hx + 6, hy + 6], cap(hx, hy, hx + fdx * 3, hy + fdy * 3, 1), P.G3, P.X));
		parts.push({ box: [lx - 5, ly - 5, lx + 5, ly + 5], test: (x, y) => { const d = Math.hypot(x - lx, y - ly); return d <= 4.3; }, shade: (x, y) => { const d = Math.hypot(x - lx, y - ly); return d > 3.1 ? P.G4 : ((x < lx - 0.5 && y < ly - 0.5 && d > 1.4) ? 'rgba(255,255,255,0.65)' : 'rgba(10,239,187,0.28)'); }, oc: P.X });
	}
	if (opts.stick) {
		parts.push(solid([hx - 14, hy - 14, hx + 14, hy + 14], cap(hx, hy, hx + fdx * 12, hy + fdy * 12, 0.6), P.mug, P.X));
		parts.push(dots([[Math.floor(hx + fdx * 12), Math.floor(hy + fdy * 12)]], P.R));
	}
	if (opts.paper) {
		parts.push(solid([hx - 1, hy - 9, hx + 7, hy + 1], rect(hx, hy - 8, hx + 6, hy), P.mug, P.X), dots([[hx + 1, hy - 6], [hx + 2, hy - 6], [hx + 3, hy - 6], [hx + 1, hy - 4], [hx + 2, hy - 4], [hx + 3, hy - 4], [hx + 4, hy - 4]], P.mugS));
	}
	if (opts.pizza) {
		parts.push({ box: [hx - 2, hy - 9, hx + 8, hy + 1], test: tri(hx, hy - 1, hx + 7, hy - 3, hx + 2, hy - 9), shade: (x, y) => (y > hy - 2.6 && x > hx + 1) || x > hx + 5.6 ? '#E2A33B' : '#FFD45C', oc: P.X });
		parts.push(dots([[hx + 3, hy - 4], [hx + 2, hy - 6], [hx + 4, hy - 3]], '#E5484D'));
	}
	parts.push({ box: [hx - 4, hy - 4, hx + 4, hy + 4], test: ell(hx, hy, 2.9, 2.8), shade: opts.far ? darker(shadeEll(hx, hy, 2.9, 2.8)) : shadeEll(hx, hy, 2.9, 2.8) });
	if (opts.point) {
		parts.push({ box: [hx - 6, hy - 6, hx + 6, hy + 6], test: cap(hx + fdx * 1.8, hy + fdy * 1.8, hx + fdx * 4.4, hy + fdy * 4.4, 1.1), shade: () => base });
		parts.push(dots([[Math.floor(hx + fdx * 4.6), Math.floor(hy + fdy * 4.6)]], P.H));
	} else if (!opts.noFingers && !opts.loupe && !opts.stick) {
		const px = -fdy, py = fdx;
		parts.push(dots([-1.3, 1.3].map(k => [Math.floor(hx + fdx * 1.6 + px * k), Math.floor(hy + fdy * 1.6 + py * k)]), opts.far ? P.L : P.H));
	}
	return parts;
}

const arm = (side: 'L' | 'R', hx: number, hy: number, opts: ArmOptions = {}): Part[] => limb(side === 'L' ? 32 : 48, 49, hx, hy, side === 'L' ? -1 : 1, opts);
const hand = (hx: number, hy: number): Part => ({ box: [hx - 4, hy - 4, hx + 4, hy + 4], test: ell(hx, hy, 2.9, 2.8), shade: shadeEll(hx, hy, 2.9, 2.8) });
const armRuns = (key: string, parts: () => Part[]) => memo('arm-' + key, () => raster(parts()));

// ---- Geeko de profil (il regarde vers la droite) ---------------------------------------------

const pHeadTest = (x: number, y: number) => ell(38, 30, 18.4, 16)(x, y) || ell(43, 35, 17.4, 11)(x, y);
const pTailRuns = () => memo('ptail', () => curve([[30, 59], [18, 65], [10, 56], [16, 50]], 3.9, 1.9, [16.6, 52.4], [9, 10, 18, 19], [6, 45, 36, 70]));

// Le corps de profil sans ses pieds, et une paire de pieds posée n'importe où (la marche, J25).
function pTorsoRuns(): Run[] {
	return memo('ptorso', () => raster([
		{ box: [27, 44, 50, 64], test: ell(38, 55, 10, 8.8), shade: shadeEll(38, 55, 10, 8.8) },
		{ box: [37, 49, 49, 63], test: (x, y) => ell(43, 57, 5, 5.6)(x, y) && ell(38, 55, 9.4, 8.2)(x, y) && x > 38, shade: (x, y) => (y > 60.5 ? P.m : P.M), outline: false },
	]));
}
function pFeetRuns(far: number[], near: number[]): Run[] {
	return memo(`pfeet${far}|${near}`, () => raster([
		{ box: [far[0] - 7, far[1] - 5, far[0] + 7, far[1] + 5], test: ell(far[0], far[1], 4.4, 2.6), shade: darker(shadeEll(far[0], far[1], 4.4, 2.6)) },
		{ box: [near[0] - 7, near[1] - 5, near[0] + 7, near[1] + 5], test: ell(near[0], near[1], 5, 2.7), shade: shadeEll(near[0], near[1], 5, 2.7) },
	]));
}

function pBodyRuns(): Run[] {
	return memo('pbody', () => raster([
		{ box: [27, 59, 38, 66], test: ell(32, 63, 4.4, 2.6), shade: darker(shadeEll(32, 63, 4.4, 2.6)) },
		{ box: [27, 44, 50, 64], test: ell(38, 55, 10, 8.8), shade: shadeEll(38, 55, 10, 8.8) },
		{ box: [37, 49, 49, 63], test: (x, y) => ell(43, 57, 5, 5.6)(x, y) && ell(38, 55, 9.4, 8.2)(x, y) && x > 38, shade: (x, y) => (y > 60.5 ? P.m : P.M), outline: false },
		{ box: [38, 59, 50, 67], test: ell(44, 63.4, 5, 2.7), shade: shadeEll(44, 63.4, 5, 2.7) },
		dots([[42, 64], [44, 64], [46, 64]], P.H),
	]));
}

function pHeadRuns(): Run[] {
	return memo('phead', () => raster([
		{ box: [18, 12, 62, 48], test: pHeadTest, shade: shadeEll(39, 30, 19, 16) },
		dots([[25, 19], [26, 19], [24, 20], [24, 21]], '#FFFFFF'),
	]));
}

const pTintRuns = () => memo('ptint', () => raster([{ box: [44, 18, 62, 47], test: (x, y) => pHeadTest(x, y) && x > 46, shade: () => 'rgba(10,239,187,0.26)', outline: false }]));

function pEyeRuns(kind: string): Run[] {
	return memo('peye-' + kind, () => {
		const cx = 51, cy = 32, parts: Part[] = [];
		const rx = kind === 'wide' ? 3.9 : 3.4, ry = kind === 'wide' ? 5.4 : 4.8;
		if (kind === 'happy') {
			parts.push({ box: [cx - 5, cy - 5, cx + 5, cy + 3], test: (x, y) => { const d = Math.hypot(x - cx, y - cy - 1.5); return d > 2.2 && d < 3.7 && y < cy + 1.5; }, shade: () => P.K, outline: false });
		} else if (kind === 'closed') {
			parts.push(dots([[cx - 3, cy], [cx - 2, cy + 1], [cx - 1, cy + 1], [cx, cy + 1], [cx + 1, cy + 1], [cx + 2, cy]], P.K));
		} else {
			parts.push({ box: [cx - 5, cy - 6, cx + 5, cy + 6], test: ell(cx, cy, rx, ry), shade: (_x, y) => (y > cy + 1.4 ? P.I : P.K), outline: false });
			parts.push(dots([[cx - 1, cy - 3], [cx, cy - 3], [cx - 1, cy - 2], [cx, cy - 2], [cx - 2, cy - 2], [cx - 1, cy - 1]], P.W), dots([[cx + 1, cy + 2]], P.W));
			if (kind === 'focus') {
				parts.push({ box: [cx - 5, cy - 6, cx + 5, cy], test: (x, y) => ell(cx, cy, rx, ry)(x, y) && y < cy - 0.6, shade: () => P.L, outline: false });
				parts.push(dots([-3, -2, -1, 0, 1, 2, 3].map(t => [cx + t, cy - 1]), P.O));
			}
		}
		return raster(parts);
	});
}

const P_MOUTHS: Record<string, number[][]> = {
	tongue: [[54, 39], [55, 40], [56, 40], [57, 39]],
	smile: [[54, 39], [55, 40], [56, 40], [57, 39]],
	open: [[54, 38], [55, 38], [56, 38], [57, 38], [53, 39], [58, 39], [54, 40], [55, 40], [56, 40], [57, 40]],
};

function pFaceRuns(mouth: string): Run[] {
	return memo('pface-' + mouth, () => {
		const parts: Part[] = [{ box: [46, 38, 55, 43], test: ell(49.6, 40.4, 2.3, 1.2), shade: () => P.Pk, outline: false }, dots(P_MOUTHS[mouth] ?? P_MOUTHS.smile, P.O)];
		if (mouth === 'tongue') { parts.push(dots([[56, 41]], P.T)); }
		if (mouth === 'open') { parts.push(dots([[54, 39], [55, 39], [56, 39], [57, 39]], '#5A1F2A'), dots([[55, 39]], P.T)); }
		return raster(parts);
	});
}

const pArm = (hx: number, hy: number, far: boolean) => limb(far ? 41 : 37, far ? 49 : 50, hx, hy, 1, { far, fingerDir: [0.4, 1] });
const ties = (f: number): Part[] => [
	solid([4, 10, 24, 26], cap(21, 18, f ? 10 : 11, f ? 16 : 13.6, 1), P.R, P.X),
	solid([4, 10, 24, 26], cap(21, 19.4, f ? 11 : 10, f ? 23.4 : 21.4, 1), P.Rd, P.X),
	solid([18, 15, 25, 22], ell(21.2, 18.6, 1.9, 1.7), P.R, P.X),
];

// ---- Accessoires portés (dans le groupe de la tête, ils suivent ses mouvements) -------------

function wearRuns(name: string): Run[] {
	return memo('wear-' + name, () => {
		const parts: Part[] = [];
		if (name === 'glasses' || name === 'sunglasses') {
			for (const cx of [31, 49]) {
				if (name === 'glasses') {
					parts.push(solid([cx - 7, 26, cx + 7, 40], (x, y) => ell(cx, 33, 6.2, 6.6)(x, y) && !ell(cx, 33, 5, 5.4)(x, y), P.G1));
					parts.push(solid([cx - 6, 27, cx + 6, 39], ell(cx, 33, 5, 5.4), 'rgba(233,255,166,0.16)'), dots([[cx + 2, 29], [cx + 3, 30]], 'rgba(255,255,255,0.8)'));
				} else {
					parts.push({ box: [cx - 6, 28, cx + 6, 39], test: ell(cx, 33.5, 5.6, 4.6), shade: (x, y) => (Math.floor(x - y) === cx - 31 ? P.G5 : P.X), outline: false });
				}
			}
			parts.push(dots([[37, 32], [38, 32], [39, 32], [40, 32], [41, 32], [42, 32], [43, 32], [23, 32], [24, 32], [56, 32], [57, 32]], name === 'glasses' ? P.G1 : P.X));
		}
		if (name === 'headphones' || name === 'headset') {
			parts.push({ box: [16, 9, 64, 30], test: (x, y) => ell(40, 30, 23, 19.4)(x, y) && !ell(40, 30, 21.4, 17.8)(x, y) && y < 30, shade: (_x, y) => (y < 13 ? P.G5 : P.G3), oc: P.X });
			const cups = name === 'headset' ? [60] : [20, 60];
			for (const cx of cups) { parts.push({ box: [cx - 4, 26, cx + 4, 40], test: ell(cx, 33, 3.2, 5.4), shade: (x) => (Math.abs(x - cx) < 1 ? P.M : P.G2), oc: P.X }); }
			if (name === 'headset') {
				parts.push(solid([46, 35, 62, 44], cap(59, 38, 49, 42, 0.7), P.G3, P.X), solid([46, 40, 51, 44], ell(48.6, 42, 1.3, 1.3), P.M, P.X));
			}
		}
		if (name === 'nightcap') {
			parts.push({ box: [22, 2, 66, 22], test: tri(23, 21, 56, 16, 63, 4), shade: (x, y) => (Math.floor((x + y) / 3) % 2 ? P.M : '#B9F6E6'), oc: P.O });
			parts.push({ box: [19, 12, 61, 26], test: (x, y) => headTest(x, y) && !headTest(x, y - 3.4) && y < 24, shade: (_x, y) => (y > 18.5 ? '#DCE3EA' : P.mug), oc: P.O });
			parts.push({ box: [59, 0, 68, 9], test: ell(63.6, 4, 2.7, 2.7), shade: (x, y) => (x < 63 && y < 3.6 ? '#FFFFFF' : P.mug), oc: P.O });
		}
		if (name === 'headbandP') {
			parts.push({ box: [18, 15, 62, 22], test: (x, y) => pHeadTest(x, y) && y > 16.5 && y < 20.5, shade: (_x, y) => (y > 19.4 ? P.Rd : P.R), outline: false });
			parts.push(dots([[36, 18], [37, 18], [38, 18]], P.mug));
		}
		return raster(parts);
	});
}

// ---- Objets devant Geeko (repère du personnage) -----------------------------------------------

function frontRuns(name: string): Run[] {
	return memo('front-' + name, () => {
		const parts: Part[] = [];
		if (name === 'book') {
			parts.push({ box: [26, 51, 54, 55], test: rect(26.5, 52, 53.5, 54.5), shade: () => '#0A5C4B', oc: P.X });
			parts.push({ box: [27, 43, 53, 53], test: rect(27.5, 44, 52.5, 53), shade: (x) => (x > 38.5 && x < 41.5 ? '#D5DBE3' : P.mug), oc: P.X });
			const lines: number[][] = [];
			for (const y of [46, 48, 50]) { for (let x = 29; x <= 37; x++) { lines.push([x, y]); } for (let x = 42; x <= 50; x++) { lines.push([x, y]); } }
			parts.push(dots(lines, P.mugS), dots([[40, 44], [40, 45], [40, 46], [40, 47], [40, 48], [40, 49], [40, 50], [40, 51], [40, 52]], P.G6));
		}
		if (name === 'box') {
			parts.push({ box: [20, 49, 31, 54], test: tri(25, 53.6, 20.5, 49.5, 30, 53.6), shade: () => P.Kl, oc: P.X });
			parts.push({ box: [49, 49, 60, 54], test: tri(50, 53.6, 59.5, 49.5, 55, 53.6), shade: () => P.Kl, oc: P.X });
			parts.push({ box: [24, 52, 56, 67], test: rect(25, 53, 55, 66.5), shade: (x, y) => (y < 55 ? P.Kd : (x > 38.8 && x < 41.2 ? '#E8D3A8' : P.Kr)), oc: P.X });
			parts.push(dots([[28, 59], [29, 59], [30, 59], [28, 61], [29, 61]], P.Kd));
		}
		if (name === 'sign') {
			parts.push(solid([19, 9, 25, 28], cap(22, 11, 22, 25, 0.9), P.Wd, P.X), solid([55, 9, 61, 28], cap(58, 11, 58, 25, 0.9), P.Wd, P.X));
			parts.push({ box: [13, 0, 67, 13], test: rect(14, 1, 66, 12), shade: (_x, y) => (y > 10.6 ? '#DCE3EA' : P.mug), oc: P.O });
		}
		if (name === 'blanket') {
			parts.push({ box: [23, 47, 57, 69], test: (x, y) => ell(40, 59.5, 16, 9)(x, y) && y > 49.5, shade: (x, y) => (y < 52 ? '#5DF7D3' : ((Math.floor(x) + Math.floor(y) * 2) % 6 === 0 ? P.L : (y > 64.5 ? P.m : P.M))), oc: P.O });
		}
		if (name === 'sideDesk') {
			parts.push({ box: [49, 56, 78, 67], test: rect(50, 57, 77, 66.5), shade: (x, y) => (y < 58.4 ? P.G3 : (Math.floor(y) === 61 ? P.G1 : (x > 61 && x < 66 && y > 59.5 && y < 64 ? P.L : P.G2))), oc: P.X });
			parts.push(dots([[62, 60], [63, 60], [64, 60], [64, 61], [63, 62], [64, 62], [64, 63], [62, 63], [63, 63]], P.O));
			parts.push({ box: [51, 53, 74, 58], test: rect(52, 54.5, 72.5, 56.8), shade: (_x, y) => (y < 55.4 ? P.G6 : P.G4), oc: P.X });
			parts.push({ box: [64, 32, 75, 58], test: cap(71.6, 55.2, 67.2, 35, 1.25), shade: () => P.G3, oc: P.X });
			parts.push(dots([[69, 44], [69, 45], [70, 46]], P.L));
		}
		return raster(parts);
	});
}

// ---- Décors autour de Geeko (repère de la scène, au-delà du cadre du personnage) --------------

function propRuns(name: string, f = 0): { w: number; h: number; runs: Run[] } {
	const def: Record<string, [number, number, () => Part[]]> = {
		rack: [16, 48, () => {
			const parts: Part[] = [{ box: [0, 0, 16, 48], test: rect(1, 1, 15, 47), shade: (x, y) => (x < 2.5 || x > 13.5 || y < 2.5 || y > 45.5 ? P.G2 : P.G1), oc: P.X }];
			for (let i = 0; i < 6; i++) {
				const y0 = 4 + i * 7;
				parts.push({ box: [2, y0, 14, y0 + 6], test: rect(3, y0, 13, y0 + 5), shade: (x, y) => (y < y0 + 1 ? '#3A4250' : (x > 11 ? P.G2 : P.G3)), outline: false });
				parts.push(dots([[9, y0 + 2], [11, y0 + 2], [10, y0 + 3], [12, y0 + 3]], P.G1));
			}
			return parts;
		}],
		globe: [22, 22, () => {
			const blobs = [[3, 6, 4, 3], [9, 12, 3, 4.5], [17, 7, 4.5, 2.6], [22, 14, 3.4, 3], [14, 17, 2.6, 1.8]];
			const land = (x: number, y: number) => blobs.some(([bx, by, rx, ry]) => { const cx = ((bx + f * 5) % 26) - 2; return ell(cx, by, rx, ry)(x, y) || ell(cx - 26, by, rx, ry)(x, y); });
			return [{ box: [0, 0, 22, 22], test: ell(11, 11, 9.6, 9.6), shade: (x, y) => { const hi = (x - 11) ** 2 + (y - 11) ** 2 > 60 && x > 11 && y > 11; return land(x, y) ? (hi ? P.S : P.L) : (hi ? '#07463A' : (x < 8 && y < 8 ? '#0E7A63' : '#0A5C4B')); }, oc: P.X }];
		}],
		disco: [12, 12, () => [{ box: [0, 0, 12, 12], test: ell(6, 6, 5.4, 5.4), shade: (x, y) => { const t = (Math.floor(x) + Math.floor(y) + f) % 2; if ((Math.floor(x) * 3 + Math.floor(y) + f * 2) % 7 === 0) { return t ? P.M : P.L; } return t ? P.G7 : P.G6; }, oc: P.X }]],
		bulbOff: [10, 14, () => [{ box: [0, 0, 10, 10], test: (x, y) => ell(5, 5, 4.4, 4.8)(x, y) && y < 9.6, shade: () => P.G4, oc: P.X }, { box: [2, 9, 8, 14], test: rect(3, 9.6, 7, 13), shade: (_x, y) => (Math.floor(y) % 2 ? P.G6 : P.mugS), oc: P.X }, dots([[4, 6], [5, 5], [6, 6]], P.G6)]],
		bulbOn: [10, 14, () => [{ box: [0, 0, 10, 10], test: (x, y) => ell(5, 5, 4.4, 4.8)(x, y) && y < 9.6, shade: (x, y) => (x < 4 && y < 4 ? '#FFF6B8' : '#FFE45C'), oc: P.X }, { box: [2, 9, 8, 14], test: rect(3, 9.6, 7, 13), shade: (_x, y) => (Math.floor(y) % 2 ? P.G6 : P.mugS), oc: P.X }, dots([[4, 6], [5, 5], [6, 6]], '#E09B00')]],
		gear: [13, 13, () => [{ box: [0, 0, 13, 13], test: (x, y) => { const r = Math.hypot(x - 6.5, y - 6.5), a = Math.atan2(y - 6.5, x - 6.5); return r > 1.7 && (r <= 4.4 || (r <= 6.1 && Math.cos(a * 8) > 0.2)); }, shade: (x, y) => (Math.hypot(x - 6.5, y - 6.5) < 3 ? (f ? P.H : P.G7) : (f ? P.L : P.mugS)), oc: P.X }]],
		board: [34, 36, () => [
			solid([0, 18, 34, 36], (x, y) => cap(7, 21, 3, 35, 1)(x, y) || cap(27, 21, 31, 35, 1)(x, y) || cap(17, 21, 17, 35, 0.9)(x, y), P.Wd, P.X),
			{ box: [0, 0, 34, 23], test: rect(1, 1, 33, 22), shade: (x, y) => (x < 2 || x > 32 || y < 2 || y > 21 ? P.G2 : P.mug), oc: P.X },
			solid([3, 21, 31, 25], rect(4, 22, 30, 23.4), P.G3, P.X),
		]],
		pizzaBox: [26, 14, () => [
			{ box: [1, 0, 25, 7], test: rect(3, 1, 23, 6), shade: (_x, y) => (y < 2 ? P.Kd : P.Kl), oc: P.X },
			{ box: [0, 5, 26, 14], test: rect(1, 6, 25, 13), shade: () => P.Kr, oc: P.X },
			{ box: [2, 5, 24, 13], test: (x, y) => ell(13, 9, 9, 3)(x, y) && !(x > 13 && y < 9), shade: (x, y) => (ell(13, 9, 7.4, 2.2)(x, y) ? ((Math.floor(x) * 5 + Math.floor(y) * 3) % 11 === 0 ? '#E5484D' : '#FFD45C') : '#E2A33B'), outline: false },
		]],
		rocket: [10, 22, () => [
			{ box: [0, 10, 10, 20], test: (x, y) => tri(1, 18.5, 3.2, 11, 3.2, 17)(x, y) || tri(9, 18.5, 6.8, 11, 6.8, 17)(x, y), shade: (x) => (x < 5 ? P.L : P.S), oc: P.X },
			{ box: [0, 0, 10, 18], test: (x, y) => ell(5, 9, 3.6, 8)(x, y) && y < 16.4, shade: (x, y) => (y < 4.6 ? P.L : (x > 6.4 ? P.G7 : P.mug)), oc: P.X },
			solid([2, 6, 8, 11], ell(5, 8.4, 1.6, 1.6), P.M, P.O),
			solid([2, 15, 8, 19], rect(3.5, 16.4, 6.5, 17.8), P.G5, P.X),
		]],
		moon: [10, 10, () => [{ box: [0, 0, 10, 10], test: (x, y) => ell(5, 5, 4.5, 4.5)(x, y) && !ell(7.2, 3.4, 3.7, 3.7)(x, y), shade: (x) => (x < 2.6 ? '#FFF6D6' : '#FFE9A8'), oc: P.X }]],
	};
	const [w, h, parts] = def[name];
	return { w, h, runs: memo(`prop-${name}-${f}`, () => raster(parts(), w, h)) };
}

// ---- Les phases ---------------------------------------------------------------------------------

function phase(name: string, k = 1): Phase {
	const both = (key: string, l: () => Part[], r: () => Part[]) => armRuns(key, () => [...l(), ...r()]);
	const restL = () => arm('L', 35, 56), restR = () => arm('R', 45, 56);
	const ms = (n: number) => Math.round(n * k);
	const upL = () => arm('L', 34, 47, { point: true, fingerDir: [0.15, 1] }), upR = () => arm('R', 46, 47, { point: true, fingerDir: [-0.15, 1] });
	const typeA = both('typeA', upL, () => arm('R', 47, 56, { noFingers: true })), typeB = both('typeB', () => arm('L', 33, 56, { noFingers: true }), upR);
	const overA = armRuns('typeOverA', upL), overB = armRuns('typeOverB', upR);
	const talk = ['open', 'smile', 'o', 'small', 'open', 'flat', 'o', 'smile'];
	const fortFx = k < 0.8 ? ['sweat'] : [];
	const rush = (turbo: boolean): Phase => {
		const NEAR = [[58, 53], [63, 52], [56, 52], [65, 53]], FAR = [[61, 52], [57, 53], [66, 52], [59, 52]];
		return {
			view: 'profile',
			arms: FAR.map((p, i) => armRuns(`pfar${i}${turbo ? 't' : ''}`, () => [...pArm(p[0], p[1], true), ...(turbo ? ties(i % 2) : [])])), armMs: 55,
			over: NEAR.map((p, i) => armRuns('pnear' + i, () => pArm(p[0], p[1], false))),
			eyes: [turbo ? 'wide' : 'focus'], mouth: turbo ? ['open', 'tongue'] : ['tongue'], mouthMs: 220, blush: true,
			wear: turbo ? ['headbandP'] : [], front: ['sideDesk'], head: 'gk-bob fast', tail: 'gk-ptail', actor: 'gk-rumble',
			fx: turbo ? ['screenglow', 'speedlines', 'keys', 'flames', 'wpm', 'steamhead'] : ['screenglow', 'speedlines', 'keys', 'tac', 'sweatback'],
		};
	};
	switch (name) {
		case 'wave': return { arms: [both('wave1', restL, () => arm('R', 61, 34, { fingerDir: [0.3, -1] })), both('wave2', restL, () => arm('R', 64, 38, { fingerDir: [0.7, -0.7] }))], armMs: ms(230), eyes: ['happy'], mouth: ['open'], blush: true, bubble: 'Salut !', tail: 'gk-tail fast' };
		case 'yo': return { arms: [both('yo1', () => arm('L', 22, 34, { fingerDir: [-0.4, -1] }), () => arm('R', 58, 34, { fingerDir: [0.4, -1] })), both('yo2', () => arm('L', 24, 28, { fingerDir: [-0.2, -1] }), () => arm('R', 56, 28, { fingerDir: [0.2, -1] }))], armMs: ms(260), eyes: ['sparkle', 'happy'], eyeMs: 520, mouth: ['open'], blush: true, body: 'gk-jump', bubble: 'Yo le boss !', tail: 'gk-tail fast', fx: ['sparks'] };
		case 'fetch': return { arms: [both('reach', restL, () => arm('R', 67, 55, { fingerDir: [1, 0.2] }))], armMs: 1, eyes: ['right'], mouth: ['smile'], blush: true, laptop: 'enter' };
		case 'stow': return { arms: [both('reach', restL, () => arm('R', 67, 55, { fingerDir: [1, 0.2] }))], armMs: 1, eyes: ['right'], mouth: ['smile'], blush: true, laptop: 'leave' };
		case 'settle': {
			const lid = () => [...arm('L', 33, 50, { fingerDir: [0.1, 1] }), ...arm('R', 47, 50, { fingerDir: [-0.1, 1] })];
			return { arms: [armRuns('lid', lid)], armMs: 1, over: [armRuns('lid', lid)], eyes: ['down'], mouth: ['smile'], blush: true, laptop: 'on' };
		}
		case 'type': return { arms: [typeA, typeB], armMs: ms(120), over: [overA, overB], eyes: ['focus'], mouth: ['tongue'], blush: true, laptop: 'on', head: 'gk-bob', fx: ['glow', 'tint', 'particles', ...fortFx] };
		case 'music': return { arms: [typeA, typeB], armMs: ms(170), over: [overA, overB], eyes: ['focus', 'focus', 'happy', 'focus'], eyeMs: 960, mouth: ['smile'], blush: true, laptop: 'on', wear: ['headphones'], head: 'gk-beat', tail: 'gk-tail fast', fx: ['glow', 'notes', ...fortFx] };
		case 'ponder': {
			const chin = both('ponderChin', () => arm('L', 33, 56, { noFingers: true }), () => arm('R', 43, 45, { fingerDir: [-0.4, -1] }));
			return { arms: [typeA, typeB, typeA, typeB, typeA, typeB, typeA, typeB, chin, chin, chin, chin], armMs: ms(200), over: [overA, overB, overA, overB, overA, overB, overA, overB, [], [], [], []], eyes: ['focus', 'focus', 'focus', 'focus', 'focus', 'focus', 'focus', 'focus', 'up', 'up', 'ul', 'up'], eyeMs: ms(200), mouth: ['tongue', 'tongue', 'tongue', 'tongue', 'flat', 'flat'], mouthMs: ms(400), blush: true, laptop: 'on', fx: ['glow', ...fortFx] };
		}
		case 'walk': {
			// Un pas complet en 4 images : pied arrière / pied avant au sol, puis l'autre passe en se levant.
			const FEET = [[[31, 63.4], [45, 63.4]], [[37, 61.6], [41, 63.4]], [[45, 63.4], [31, 63.4]], [[41, 63.4], [37, 61.6]]];
			const HANDS = [[34, 58], [41, 60], [47, 58], [41, 60]];
			return {
				view: 'profile',
				arms: HANDS.map((p, i) => armRuns('pwalk' + i, () => pArm(p[0], p[1], false))), armMs: 130,
				legs: FEET.map(([far, near]) => pFeetRuns(far, near)),
				eyes: ['open'], mouth: ['smile'], blush: true, body: 'gk-bob', tail: 'gk-ptail',
			};
		}
		case 'rush': return rush(false);
		case 'turbo': return rush(true);
		case 'wait': {
			const mug = both('mug', () => arm('L', 33, 55, { mug: true }), restR), sip = both('sip', () => arm('L', 37, 44, { mug: true, noFingers: true }), restR);
			return { arms: [mug, mug, mug, mug, sip, sip], armMs: ms(900), eyes: ['open', 'open', 'left', 'open', 'right', 'open'], eyeMs: ms(900), mouth: ['smile'], blush: true, body: 'gk-breathe', fx: ['steam'] };
		}
		case 'sign': return { arms: [both('sign', () => arm('L', 22, 27, { fingerDir: [0, -1] }), () => arm('R', 58, 27, { fingerDir: [0, -1] }))], armMs: 1, eyes: ['open', 'sparkle'], eyeMs: 900, mouth: ['smile', 'open'], mouthMs: 900, blush: true, body: 'gk-hop', front: ['sign'], fx: ['signText'] };
		case 'watch': {
			const a = both('watchA', () => arm('L', 42, 50, { watch: true, noFingers: true }), () => arm('R', 44, 46, { point: true, fingerDir: [-0.3, 1] }));
			const b = both('watchB', () => arm('L', 42, 50, { watch: true, noFingers: true }), () => arm('R', 45, 48, { point: true, fingerDir: [-0.3, 1] }));
			return { arms: [a, b], armMs: ms(300), eyes: ['down', 'down', 'open', 'open', 'sparkle', 'open'], eyeMs: ms(800), mouth: ['flat', 'flat', 'small', 'smile', 'smile', 'flat'], mouthMs: ms(800), blush: true, bubble: 'Tu valides ?', tail: 'gk-tail fast' };
		}
		case 'think': return { arms: [both('chin', restL, () => arm('R', 43, 45, { fingerDir: [-0.4, -1] }))], armMs: 1, eyes: ['up', 'up', 'up', 'open'], eyeMs: ms(1100), mouth: ['flat'], blush: true, bubbleDots: true, tail: 'gk-tail', fx: fortFx.length ? ['steamhead'] : [] };
		case 'bulb': return { arms: [both('bulb', restL, () => arm('R', 57, 34, { point: true, fingerDir: [0.2, -1] }))], armMs: 1, eyes: ['up', 'up', 'up', 'sparkle', 'sparkle', 'sparkle'], eyeMs: 800, mouth: ['flat', 'flat', 'flat', 'o', 'smile', 'smile'], mouthMs: 800, blush: true, props: ['bulb'], tail: 'gk-tail' };
		case 'gears': return { arms: [both('scr1', restL, () => arm('R', 55, 25, { fingerDir: [-0.5, -1] })), both('scr2', restL, () => arm('R', 57, 27, { fingerDir: [-0.4, -1] }))], armMs: ms(260), eyes: ['ul', 'ul', 'up', 'up'], eyeMs: ms(900), mouth: ['flat', 'small'], mouthMs: ms(1800), blush: true, props: ['gears'], tail: 'gk-tail', fx: fortFx };
		case 'explain': return {
			arms: [both('ex1', restL, () => arm('R', 60, 44, { fingerDir: [1, -0.4] })), both('ex2', () => arm('L', 21, 45, { fingerDir: [-1, -0.3] }), restR), both('ex3', () => arm('L', 23, 43, { fingerDir: [-1, -0.5] }), () => arm('R', 57, 43, { fingerDir: [1, -0.5] })), both('ex4', restL, () => arm('R', 58, 37, { point: true, fingerDir: [0.3, -1] }))],
			armMs: ms(560), eyes: ['open', 'open', 'happy', 'open'], eyeMs: ms(1300), mouth: talk, mouthMs: ms(140), blush: true, fx: ['speech'], tail: 'gk-tail',
		};
		case 'board': return {
			arms: [both('bd1', restL, () => arm('R', 58, 38, { stick: true, fingerDir: [0.7, -0.7] })), both('bd2', restL, () => arm('R', 59, 40, { stick: true, fingerDir: [0.85, -0.5] })), both('bd3', () => arm('L', 25, 44, { fingerDir: [-1, -0.4] }), () => arm('R', 58, 38, { stick: true, fingerDir: [0.7, -0.7] }))],
			armMs: ms(800), eyes: ['right', 'right', 'open', 'right', 'happy', 'right'], eyeMs: ms(800), mouth: talk, mouthMs: ms(150), blush: true, props: ['board'],
		};
		case 'book': return { arms: [both('book', () => arm('L', 28, 49), () => arm('R', 52, 49))], armMs: 1, over: [armRuns('bookHands', () => [hand(27.5, 49), hand(52.5, 49)])], eyes: ['dl', 'down', 'dr', 'dl', 'down', 'dr'], eyeMs: ms(620), mouth: ['small'], blush: true, wear: ['glasses'], front: ['book'], fx: ['flip', ...fortFx] };
		case 'files': return { arms: [both('files', restL, () => arm('R', 60, 40, { fingerDir: [1, -0.6] }))], armMs: 1, eyes: ['right', 'right', 'down'], eyeMs: ms(533), mouth: ['o', 'smile', 'small'], mouthMs: 533, blush: true, wear: ['glasses'], fx: ['cards', ...fortFx] };
		case 'loupe': return {
			arms: [[54, 42, 0.4, -1], [60, 46, 0.2, -1], [50, 48, 0.6, -0.8], [58, 38, 0.3, -1]].map((p, i) => both('lp' + i, restL, () => arm('R', p[0], p[1], { loupe: true, fingerDir: [p[2], p[3]] }))),
			armMs: ms(720), eyes: ['right', 'right', 'down', 'up'], eyeMs: ms(720), mouth: ['o', 'flat', 'o', 'small'], mouthMs: ms(720), blush: true, fx: ['qmarks', ...fortFx], tail: 'gk-tail',
		};
		case 'radar': return { arms: [both('brow', restL, () => arm('R', 49, 24, { fingerDir: [-1, 0.1] }))], armMs: 1, eyes: ['ul', 'ul', 'left', 'ul'], eyeMs: ms(900), mouth: ['o', 'small'], mouthMs: ms(1800), blush: true, props: ['globe'], fx: ['radar', ...fortFx], tail: 'gk-tail' };
		case 'dig': return { arms: [both('dig1', () => arm('L', 34, 58), () => arm('R', 46, 54)), both('dig2', () => arm('L', 33, 54), () => arm('R', 47, 58))], armMs: ms(240), eyes: ['down'], mouth: ['tongue'], blush: true, front: ['box'], head: 'gk-bob', fx: ['papers', ...fortFx] };
		case 'patrol': case 'friday': {
			const center = both('pc', restL, restR), left = both('pl', () => arm('L', 16, 44, { fingerDir: [-1, -0.2] }), restR), right = both('pr', restL, () => arm('R', 64, 44, { fingerDir: [1, -0.2] }));
			const fri = name === 'friday';
			return { arms: [center, left, left, center, right, right], armMs: ms(1000), eyes: fri ? ['open'] : ['open', 'left', 'left', 'open', 'right', 'right'], eyeMs: ms(1000), mouth: ['smile', 'o', 'smile', 'smile', 'o', 'smile'], mouthMs: ms(1000), blush: true, wear: [fri ? 'sunglasses' : 'headset'], props: ['racks'], actor: k < 0.8 ? 'gk-patrol fast' : 'gk-patrol', bubble: fri ? 'Vendredi 16 h… on déploie vraiment ?' : undefined, fx: fortFx };
		}
		case 'console': return { arms: [both('cs1', () => arm('L', 30, 47, { point: true, fingerDir: [0.2, 1] }), () => arm('R', 58, 37, { point: true, fingerDir: [0.7, -0.7] })), both('cs2', () => arm('L', 33, 48, { point: true, fingerDir: [0, 1] }), () => arm('R', 59, 36, { point: true, fingerDir: [0.8, -0.6] }))], armMs: ms(380), eyes: ['right', 'up', 'right', 'right'], eyeMs: ms(900), mouth: ['smile', 'small'], mouthMs: ms(1200), blush: true, wear: ['headset'], props: ['racks', 'terminal'], tail: 'gk-tail' };
		case 'overheat': return { arms: [both('oh1', restL, () => arm('R', 62, 40, { paper: true })), both('oh2', restL, () => arm('R', 60, 48, { paper: true }))], armMs: ms(150), eyes: ['right', 'x'], eyeMs: 700, mouth: ['o'], body: 'gk-shake', wear: ['headset'], props: ['racksHot'], fx: ['drop', 'rackSteam'] };
		case 'party': return { arms: [both('up1', () => arm('L', 23, 30, { fingerDir: [-0.3, -1] }), () => arm('R', 57, 30, { fingerDir: [0.3, -1] })), both('up2', () => arm('L', 26, 25, { fingerDir: [0, -1] }), () => arm('R', 54, 25, { fingerDir: [0, -1] }))], armMs: ms(260), eyes: ['happy'], mouth: ['open'], blush: true, body: 'gk-jump', tail: 'gk-tail fast', fx: ['confetti'] };
		case 'disco': return { arms: [both('dc1', () => arm('L', 22, 30, { point: true, fingerDir: [-0.4, -1] }), restR), both('dc2', restL, () => arm('R', 58, 30, { point: true, fingerDir: [0.4, -1] }))], armMs: ms(380), eyes: ['happy', 'happy', 'sparkle', 'happy'], eyeMs: 760, mouth: ['open', 'smile'], mouthMs: 380, blush: true, body: 'gk-sway', tail: 'gk-tail fast', props: ['disco'], fx: ['spots', 'sparks'] };
		case 'rocket': return { arms: [both('up1', () => arm('L', 23, 30, { fingerDir: [-0.3, -1] }), () => arm('R', 57, 30, { fingerDir: [0.3, -1] })), both('up2', () => arm('L', 26, 25, { fingerDir: [0, -1] }), () => arm('R', 54, 25, { fingerDir: [0, -1] }))], armMs: 260, eyes: ['up', 'sparkle'], eyeMs: 520, mouth: ['open'], blush: true, body: 'gk-hop', tail: 'gk-tail fast', props: ['rocket'], fx: ['stars'], bubble: 'Déployé !' };
		case 'oops': return { arms: [both('cheeks', () => arm('L', 24, 40, { fingerDir: [0.3, -1] }), () => arm('R', 56, 40, { fingerDir: [-0.3, -1] }))], armMs: 1, eyes: ['x'], mouth: ['o'], body: 'gk-shake', fx: ['drop'] };
		case 'smoke': return { arms: [both('sm1', () => arm('L', 24, 40, { fingerDir: [0.3, -1] }), () => arm('R', 58, 40, { fingerDir: [0.6, -1] })), both('sm2', () => arm('L', 24, 40, { fingerDir: [0.3, -1] }), () => arm('R', 63, 35, { fingerDir: [0.9, -0.5] }))], armMs: ms(180), eyes: ['x', 'swirl'], eyeMs: 900, mouth: ['o'], laptop: 'on', body: 'gk-shake', fx: ['puffs', 'drop'] };
		case 'sleep': return { arms: [both('rest', restL, restR)], armMs: 1, eyes: ['closed'], mouth: ['small'], blush: true, head: 'gk-nod', body: 'gk-breathe', fx: ['zzz'] };
		case 'blanket': return { arms: [both('rest', restL, restR)], armMs: 1, eyes: ['closed'], mouth: ['small'], blush: true, head: 'gk-nod', body: 'gk-breathe', wear: ['nightcap'], front: ['blanket'], fx: ['zzz', 'snot'] };
		case 'night': {
			const nA = both('nightA', () => arm('L', 19, 52, { mug: true }), upR), nB = both('nightB', () => arm('L', 19, 52, { mug: true }), () => arm('R', 47, 56, { noFingers: true })), sip = both('nightSip', () => arm('L', 37, 44, { mug: true, noFingers: true }), () => arm('R', 47, 56, { noFingers: true }));
			return { arms: [nA, nB, nA, nB, nA, nB, sip, sip], armMs: ms(300), over: [overB, [], overB, [], overB, [], [], []], eyes: ['half'], mouth: ['flat', 'flat', 'flat', 'flat', 'yawn', 'yawn', 'small', 'flat'], mouthMs: ms(300), blush: true, laptop: 'on', wear: ['nightcap'], props: ['moon'], fx: ['glow', 'stars'], bubble: 'Un dernier commit et dodo…' };
		}
		case 'pizza': return { arms: [both('pz1', restL, () => arm('R', 43, 42, { pizza: true })), both('pz2', restL, () => arm('R', 52, 51, { pizza: true }))], armMs: ms(760), eyes: ['happy', 'happy', 'open', 'happy'], eyeMs: 760, mouth: ['chew', 'o', 'chew', 'smile'], mouthMs: ms(380), blush: true, props: ['pizzaBox'], bubble: 'Pause pizza !', tail: 'gk-tail fast' };
		case 'giggle': return { arms: [both('hug', () => arm('L', 37, 55), () => arm('R', 43, 55))], armMs: 1, eyes: ['happy'], mouth: ['open'], blush: true, body: 'gk-shake', bubble: 'Hihi, ça chatouille !', tail: 'gk-tail fast' };
		case 'spin': return { arms: [both('spin', () => arm('L', 22, 40, { fingerDir: [-1, -0.3] }), () => arm('R', 58, 40, { fingerDir: [1, -0.3] }))], armMs: 1, eyes: ['swirl'], mouth: ['o'], actor: 'gk-spin', bubble: 'Ça tourne…' };
		case 'legend': return { arms: [both('up1', () => arm('L', 23, 30, { fingerDir: [-0.3, -1] }), () => arm('R', 57, 30, { fingerDir: [0.3, -1] })), both('up2', () => arm('L', 26, 25, { fingerDir: [0, -1] }), () => arm('R', 54, 25, { fingerDir: [0, -1] }))], armMs: 300, eyes: ['sparkle', 'happy'], eyeMs: 600, mouth: ['open'], blush: true, body: 'gk-hop', actor: 'gk-gold', bubble: 'Mode légende', fx: ['sparks', 'stars'] };
		default: return { arms: [both('rest', restL, restR)], armMs: 1, eyes: ['closed'], mouth: ['small'], blush: true, head: 'gk-nod', body: 'gk-breathe', fx: ['zzz'] };
	}
}

// ---- Rendu DOM -----------------------------------------------------------------------------

function ensureStyle(doc: Document) {
	if (!doc.getElementById('geeko-style')) {
		const style = doc.createElement('style');
		style.id = 'geeko-style';
		style.textContent = CSS;
		doc.head.appendChild(style);
	}
}

function svgEl(doc: Document, tag: string, attrs: Record<string, string | number>): SVGElement {
	const el = doc.createElementNS(SVG, tag) as SVGElement;
	for (const [k, v] of Object.entries(attrs)) { el.setAttribute(k, typeof v === 'string' ? ink(v) : String(v)); }
	return el;
}

function runsGroup(doc: Document, runs: Run[], cls = '', style = ''): SVGElement {
	const g = svgEl(doc, 'g', {});
	if (cls) { g.setAttribute('class', cls); }
	if (style) { g.setAttribute('style', style); }
	for (const r of runs) { g.appendChild(svgEl(doc, 'rect', { x: r.x, y: r.y, width: r.w, height: 1.04, fill: r.c })); }
	return g;
}

function framesGroup(doc: Document, frames: Frame[], ms: number, inner = ''): SVGElement {
	const g = svgEl(doc, 'g', {});
	const n = frames.length;
	frames.forEach((runs, i) => {
		const style = n === 1 ? '' : `animation:gkf${n} ${n * ms}ms step-end infinite;animation-delay:-${((n - i) % n) * ms}ms`;
		const frame = runsGroup(doc, [], i === 0 ? '' : 'gk-rest', style);
		frame.appendChild(runsGroup(doc, runs, inner));
		g.appendChild(frame);
	});
	return g;
}

function laptop(doc: Document, size: number, mode: 'enter' | 'on' | 'leave'): HTMLElement {
	const u = (n: number) => (n * size).toFixed(2) + 'px';
	const wrap = doc.createElement('div');
	wrap.className = mode === 'enter' ? 'gk-lap-enter' : mode === 'leave' ? 'gk-lap-leave' : '';
	wrap.style.cssText = `position:absolute;left:${u(24)};top:${u(48.6)};width:${u(32)};height:${u(21)}`;
	const svg = svgEl(doc, 'svg', { viewBox: '-1 0 32 21', width: '100%', height: '100%', 'aria-hidden': 'true' });
	svg.setAttribute('style', 'display:block;overflow:visible');
	const id = 'gkl' + Math.random().toString(36).slice(2, 8);
	const defs = svgEl(doc, 'defs', {});
	const grad = (gid: string, attrs: Record<string, string | number>, stops: [number, string][]) => {
		const lg = svgEl(doc, 'linearGradient', { id: gid, ...attrs });
		for (const [o, c] of stops) { lg.appendChild(svgEl(doc, 'stop', { offset: o, 'stop-color': c })); }
		defs.appendChild(lg);
	};
	grad(id + 'b', { x1: 0, y1: 0, x2: 0, y2: 422, gradientUnits: 'userSpaceOnUse' }, [[0, '#C3FB05'], [0.5, '#C3FB05'], [0.86, '#0AEFBB'], [1, '#0AEFBB']]);
	grad(id + 'p0', { x1: 0, y1: 85, x2: 0, y2: 187, gradientUnits: 'userSpaceOnUse' }, [[0, '#0A7827'], [0.5, '#047E3C'], [1, '#06734B']]);
	grad(id + 'p1', { x1: 0, y1: 251, x2: 0, y2: 348, gradientUnits: 'userSpaceOnUse' }, [[0, '#076A48'], [0.5, '#027956'], [1, '#01966D']]);
	grad(id + 'm', { x1: 0, y1: 0, x2: 1, y2: 1 }, [[0, '#3A414D'], [0.45, '#2A2F38'], [1, '#1A1F27']]);
	const clip = svgEl(doc, 'clipPath', { id: id + 'c' });
	clip.appendChild(svgEl(doc, 'path', { d: LOGO }));
	defs.appendChild(clip);
	const filter = svgEl(doc, 'filter', { id: id + 'f', x: '-20%', y: '-20%', width: '140%', height: '140%' });
	filter.appendChild(svgEl(doc, 'feGaussianBlur', { stdDeviation: 8 }));
	defs.appendChild(filter);
	svg.appendChild(defs);
	svg.appendChild(svgEl(doc, 'rect', { x: 0, y: 0, width: 30, height: 18, rx: 1, fill: '#05070A' }));
	svg.appendChild(svgEl(doc, 'rect', { x: 0.7, y: 0.7, width: 28.6, height: 16.6, rx: 0.6, fill: `url(#${id}m)` }));
	svg.appendChild(svgEl(doc, 'rect', { x: 1, y: 0.8, width: 28, height: 0.7, fill: '#4B5563', opacity: 0.8 }));
	svg.appendChild(svgEl(doc, 'path', { d: 'M3 2.2 L8 2.2 L4.5 9 L1.4 9 Z', fill: '#FFFFFF', opacity: 0.05 }));
	const logo = svgEl(doc, 'g', { transform: 'translate(9.3 3.7) scale(0.0236)' });
	logo.appendChild(svgEl(doc, 'path', { d: LOGO, fill: `url(#${id}b)` }));
	const folds = svgEl(doc, 'g', { 'clip-path': `url(#${id}c)` });
	const blur = svgEl(doc, 'g', { filter: `url(#${id}f)` });
	blur.appendChild(svgEl(doc, 'path', { d: PLI0, fill: `url(#${id}p0)` }));
	blur.appendChild(svgEl(doc, 'path', { d: PLI1, fill: `url(#${id}p1)` }));
	folds.appendChild(blur);
	logo.appendChild(folds);
	svg.appendChild(logo);
	svg.appendChild(svgEl(doc, 'rect', { x: -1, y: 18, width: 32, height: 2.2, rx: 0.6, fill: '#05070A' }));
	svg.appendChild(svgEl(doc, 'rect', { x: -0.4, y: 18.3, width: 30.8, height: 1.4, fill: '#4B5563' }));
	svg.appendChild(svgEl(doc, 'rect', { x: -0.4, y: 18.3, width: 30.8, height: 0.45, fill: '#8C96A4', opacity: 0.7 }));
	svg.appendChild(svgEl(doc, 'rect', { x: 1.5, y: 20.1, width: 3, height: 0.8, fill: '#05070A' }));
	svg.appendChild(svgEl(doc, 'rect', { x: 25.5, y: 20.1, width: 3, height: 0.8, fill: '#05070A' }));
	wrap.appendChild(svg);
	return wrap;
}

interface RenderOpts { size: number; k: number; compact: boolean; label: string; track: (id: ReturnType<typeof setInterval>) => void; say?: (text: string) => string | null }

function render(doc: Document, layer: HTMLElement, name: string, o: RenderOpts) {
	const ph = phase(name, o.k);
	if (ph.bubble && o.say) { ph.bubble = o.say(ph.bubble) ?? undefined; }
	const { size, compact } = o;
	const S = compact ? BARE : STAGE;
	const u = (n: number) => (n * size).toFixed(2) + 'px';
	const X = (x: number) => u(x - S.x), Y = (y: number) => u(y - S.y);
	const fx = ph.fx ?? [];
	const has = (f: string) => fx.includes(f);
	const profile = ph.view === 'profile';
	layer.replaceChildren();

	const el = (parent: HTMLElement, cls: string, css: string, text = '') => {
		const span = doc.createElement('span');
		span.className = cls;
		span.style.cssText = ink('position:absolute;line-height:1;' + css);
		span.textContent = text;
		parent.appendChild(span);
		return span;
	};
	const place = (svg: SVGElement, x: number, y: number, w: number, h: number, extra = '') => {
		svg.setAttribute('style', `position:absolute;left:${X(x)};top:${Y(y)};width:${u(w)};height:${u(h)};overflow:visible;${extra}`);
		layer.appendChild(svg);
		return svg;
	};
	const prop = (pname: string, x: number, y: number, cls = '', frames = 1, ms = 300, f0 = 0) => {
		const first = propRuns(pname, f0);
		const svg = svgEl(doc, 'svg', { viewBox: `0 0 ${first.w} ${first.h}`, 'aria-hidden': 'true' });
		if (cls) { svg.setAttribute('class', cls); }
		svg.appendChild(frames > 1 ? framesGroup(doc, Array.from({ length: frames }, (_, f) => propRuns(pname, f).runs), ms) : runsGroup(doc, first.runs));
		return place(svg, x, y, first.w, first.h);
	};

	// Décors de fond (seulement quand Geeko a la place : tailles grande et moyenne).
	if (!compact) {
		for (const p of ph.props ?? []) {
			if (p === 'racks' || p === 'racksHot') {
				const hot = p === 'racksHot';
				for (const [rx, side] of [[-16, 0], [80, 1]]) {
					const svg = prop('rack', rx, 18);
					for (let i = 0; i < 6; i++) {
						for (let j = 0; j < 2; j++) {
							const colors = hot ? [P.R, P.Y] : [P.M, P.L, P.Y];
							const led = svgEl(doc, 'rect', { x: 4 + j * 2, y: 6 + i * 7, width: 1, height: 1, fill: colors[(i + j + side) % colors.length], class: 'gk-led' + (hot ? ' hot' : '') });
							led.setAttribute('style', `animation-delay:-${(i * 370 + j * 530 + side * 250) % 1700}ms`);
							svg.appendChild(led);
						}
					}
				}
			}
			if (p === 'terminal') {
				const term = doc.createElement('div');
				term.className = 'gk-abs';
				term.style.cssText = ink(`left:${X(57)};top:${Y(-12)};width:${u(39)};padding:${u(1.6)} ${u(2)};background:#05070A;border:${u(0.5)} solid #0A5C4B;border-radius:${u(1.6)};box-shadow:0 0 ${u(6)} rgba(10,239,187,0.18);font:500 ${u(2.3)}/1.55 'JetBrains Mono',ui-monospace,monospace;color:#C9D0D9;white-space:nowrap`);
				const lines: [string, string][] = [['$ npm run build', '#C3FB05'], ['✓ 42 modules en 8,1 s', '#0AEFBB'], ['$ git push forge main', '#C3FB05'], ['→ coolify : déploiement', '#C9D0D9'], ['$ curl -sk …/health', '#C3FB05'], ['200 OK · 92 ms', '#0AEFBB']];
				lines.forEach(([t, c], i) => {
					const line = doc.createElement('div');
					line.className = 'gk-term';
					line.style.cssText = ink(`color:${c};animation:gk-line${i} 6s steps(1) infinite`);
					line.textContent = t;
					term.appendChild(line);
				});
				layer.appendChild(term);
			}
			if (p === 'globe') { prop('globe', -12, -8, '', 3, 420); }
			if (p === 'disco') {
				const string = doc.createElement('div');
				string.className = 'gk-abs';
				string.style.cssText = ink(`left:${X(39.6)};top:${Y(-14)};width:${u(0.6)};height:${u(4)};background:#4B5563`);
				layer.appendChild(string);
				prop('disco', 34, -10.5, '', 2, 300);
			}
			if (p === 'bulb') {
				prop('bulbOff', 62, -10);
				prop('bulbOn', 62, -10, 'gk-bulb');
				const rays = el(layer, 'gk-bulb', `left:${X(58)};top:${Y(-14)};width:${u(18)};height:${u(18)};border-radius:50%;background:radial-gradient(circle, rgba(255,228,92,0.45), rgba(255,228,92,0) 65%)`);
				rays.setAttribute('aria-hidden', 'true');
			}
			if (p === 'gears') { prop('gear', 6, -6, 'gk-gear'); prop('gear', 15.5, -12, 'gk-gear rev', 1, 300, 1); }
			if (p === 'board') {
				const svg = prop('board', 63, 8);
				[['M5 5h8v5h-8z', '#0A5C4B', 0], ['M13 7.5h6', '#2B4500', 600], ['M19 5h8v5h-8z', '#0A5C4B', 1100], ['M23 10v4', '#2B4500', 1700], ['M17 14h11v4h-11z', '#E5484D', 2100]].forEach(([d, c, delay]) => {
					const path = svgEl(doc, 'path', { d: String(d), fill: 'none', stroke: String(c), 'stroke-width': 0.9, pathLength: 40, class: 'gk-draw', 'shape-rendering': 'crispEdges' });
					path.setAttribute('style', `animation-delay:${delay}ms`);
					svg.appendChild(path);
				});
			}
			if (p === 'pizzaBox') { prop('pizzaBox', 62, 54); }
			if (p === 'rocket') {
				const wrap = doc.createElement('div');
				wrap.className = 'gk-abs gk-rocket';
				wrap.style.cssText = `left:${X(72)};top:${Y(34)};width:${u(10)};height:${u(28)}`;
				const svg = svgEl(doc, 'svg', { viewBox: '0 0 10 22', 'aria-hidden': 'true' });
				svg.setAttribute('style', `display:block;width:${u(10)};height:${u(22)};overflow:visible`);
				svg.appendChild(runsGroup(doc, propRuns('rocket').runs));
				wrap.appendChild(svg);
				el(wrap, 'gk-flame', `left:${u(3.2)};top:${u(18)};width:${u(3.6)};height:${u(6)};border-radius:50% 50% 50% 50% / 30% 30% 70% 70%;background:linear-gradient(#FCC200,#FF5A1F)`);
				layer.appendChild(wrap);
			}
			if (p === 'moon') { prop('moon', 74, -10); }
		}
		if (has('stars')) { [[-10, -6], [6, -12], [22, -4], [86, 2], [94, -8], [60, -12]].forEach(([x, y], i) => el(layer, 'gk-twinkle', `left:${X(x)};top:${Y(y)};width:${u(1)};height:${u(1)};background:#FFE9A8;box-shadow:0 0 ${u(1.2)} #FFE9A8;animation-delay:-${i * 410}ms`)); }
		if (has('spots')) { [['#C3FB05', 10, 0], ['#0AEFBB', 46, 900], ['#B9A7FF', 28, 1600]].forEach(([c, x, d]) => el(layer, 'gk-spot', `left:${X(Number(x))};top:${Y(64)};width:${u(16)};height:${u(4)};background:${c};filter:blur(${u(1)});animation-delay:-${d}ms`)); }
		if (has('radar')) {
			[0, 730, 1460].forEach(d => el(layer, 'gk-radar gk-fxt', `left:${X(-14)};top:${Y(-10)};width:${u(26)};height:${u(26)};border:${u(0.5)} solid rgba(10,239,187,0.7);animation-delay:-${d}ms`));
			[['MDN', 12, -10, 0], ['npm', 16, -2, 1100], ['forum', 10, 6, 2200]].forEach(([t, x, y, d]) => el(layer, 'gk-chip gk-fxt', `left:${X(Number(x))};top:${Y(Number(y))};padding:${u(0.8)} ${u(1.4)};border-radius:${u(2)};background:#12161D;border:${u(0.4)} solid #0A5C4B;color:#0AEFBB;font:500 ${u(2.2)} 'JetBrains Mono',monospace;animation-delay:-${d}ms`, String(t)));
		}
		if (has('rackSteam')) { [[-10, 0], [-4, 700], [86, 350], [92, 1050]].forEach(([x, d]) => el(layer, 'gk-steam gk-fxt', `left:${X(x)};top:${Y(14)};width:${u(1.4)};height:${u(4)};border-radius:${u(1)};background:rgba(255,90,95,0.55);animation-delay:${d}ms`)); }
		if (has('cards')) {
			['PLAN.md', 'geeko.ts', 'extension.js', 'package.json'].forEach((t, i) => {
				const card = el(layer, 'gk-card gk-fxt', `left:${X(62)};top:${Y(24 + (i % 2) * 5)};padding:${u(1.2)} ${u(1.8)};border-radius:${u(1)};background:#F2F4F7;color:#08090D;border:${u(0.5)} solid #2B4500;box-shadow:0 ${u(0.6)} 0 #2B4500;font:600 ${u(2.4)} 'JetBrains Mono',monospace;animation-delay:-${(4 - i) * 1600}ms`, t);
				card.style.whiteSpace = 'nowrap';
			});
		}
	}

	// Geeko lui-même, dans son repère 80 × 72.
	const actor = doc.createElement('div');
	actor.className = 'gk-actor ' + (ph.actor ?? '');
	actor.style.cssText = `left:${X(0)};top:${Y(0)};width:${u(W)};height:${u(H)}`;
	layer.appendChild(actor);

	const char = svgEl(doc, 'svg', { viewBox: `0 0 ${W} ${H}`, width: Math.round(W * size), height: Math.round(H * size) });
	char.setAttribute('style', 'position:absolute;left:0;top:0;overflow:visible');
	char.appendChild(svgEl(doc, 'ellipse', { cx: profile ? 46 : 40, cy: 66.4, rx: profile ? 26 : 17, ry: 2, fill: 'rgba(0,0,0,0.45)' }));
	const body = runsGroup(doc, [], ph.body ?? '');
	body.appendChild(runsGroup(doc, profile ? pTailRuns() : tailRuns(), ph.tail ?? (profile ? 'gk-ptail' : 'gk-tail')));
	if (ph.legs) { body.appendChild(framesGroup(doc, ph.legs, ph.armMs)); }
	body.appendChild(runsGroup(doc, ph.legs ? pTorsoRuns() : profile ? pBodyRuns() : bodyRuns()));
	const head = runsGroup(doc, profile ? pHeadRuns() : headRuns(), ph.head ?? '');
	if (has('tint') || profile) { head.appendChild(runsGroup(doc, profile ? pTintRuns() : tintRuns(), 'gk-tint')); }
	const eyeFn = profile ? pEyeRuns : eyeRuns;
	const blink = ['open', 'left', 'right', 'down', 'dl', 'dr', 'up', 'ul', 'focus', 'sparkle', 'half', 'wide'].includes(ph.eyes[0]) ? 'gk-blink' : '';
	head.appendChild(framesGroup(doc, ph.eyes.map(eyeFn), ph.eyeMs ?? 1000, blink));
	head.appendChild(framesGroup(doc, ph.mouth.map(m => (profile ? pFaceRuns(m) : faceRuns(m, !!ph.blush))), ph.mouthMs ?? 1000));
	for (const w of ph.wear ?? []) { head.appendChild(runsGroup(doc, wearRuns(w))); }
	body.appendChild(head);
	body.appendChild(framesGroup(doc, ph.arms, ph.armMs));
	for (const f of ph.front ?? []) { body.appendChild(runsGroup(doc, frontRuns(f))); }
	char.appendChild(body);
	actor.appendChild(char);

	const glow = (css: string, fast = false) => { const g = doc.createElement('div'); g.className = 'gk-glow' + (fast ? ' fast' : ''); g.style.cssText = ink('position:absolute;pointer-events:none;' + css); actor.appendChild(g); };
	if (has('glow')) { glow(`left:${u(25)};top:${u(38)};width:${u(30)};height:${u(12)};background:radial-gradient(ellipse at 50% 100%, rgba(10,239,187,0.42), rgba(10,239,187,0) 70%)`); }
	if (has('screenglow')) { glow(`left:${u(46)};top:${u(26)};width:${u(24)};height:${u(30)};background:radial-gradient(ellipse at 90% 60%, rgba(10,239,187,0.5), rgba(10,239,187,0) 70%)`, true); }
	if (ph.laptop) { actor.appendChild(laptop(doc, size, ph.laptop)); }
	if (ph.over) {
		const over = svgEl(doc, 'svg', { viewBox: `0 0 ${W} ${H}`, width: Math.round(W * size), height: Math.round(H * size), 'aria-hidden': 'true' });
		over.setAttribute('style', 'position:absolute;left:0;top:0;overflow:visible;pointer-events:none');
		over.appendChild(framesGroup(doc, ph.over, ph.armMs));
		actor.appendChild(over);
	}

	// Effets attachés à Geeko (repère du personnage).
	const mono = `font-family:'JetBrains Mono',ui-monospace,monospace;font-weight:500`;
	if (has('particles') && size >= 1) { ['{', '}', ';', '</>', '=>', '01', '()', '[]'].forEach((t, i) => el(actor, 'gk-pop gk-fxt', `left:${u(28 + (i * 3.4) % 24)};top:${u(41 + (i % 3))};${mono};font-size:${u(3.2)};color:${i % 2 ? '#0AEFBB' : '#C3FB05'};animation-delay:${i * 140}ms`, t)); }
	if (has('notes') && size >= 1) { ['♪', '♫', '♪', '♬'].forEach((t, i) => el(actor, 'gk-note gk-fxt', `left:${u(i % 2 ? 62 : 14)};top:${u(26 + i * 2)};--dx:${i % 2 ? 5 : -5};font-size:${u(4.4)};color:${i % 2 ? '#0AEFBB' : '#C3FB05'};animation-delay:-${i * 550}ms`, t)); }
	if (has('confetti')) { ['#C3FB05', '#0AEFBB', '#FCC200', '#B9A7FF', '#FF8A80', '#C3FB05', '#0AEFBB', '#FCC200', '#C3FB05', '#0AEFBB', '#B9A7FF', '#FCC200'].forEach((c, i) => el(actor, 'gk-conf gk-fxt', `left:${u(10 + (i * 5.7) % 62)};top:${u(2 + (i * 3) % 10)};width:${u(1.6)};height:${u(i % 3 ? 1 : 2.2)};background:${c};animation-delay:${i * 130}ms`)); }
	if (has('zzz')) { ['z', 'Z', 'z'].forEach((t, i) => el(actor, 'gk-z gk-fxt', `left:${u(57 + i * 3)};top:${u(12 - i * 3)};font-weight:600;font-size:${u(3 + i)};color:#A3ACB9;animation-delay:${i * 800}ms`, t)); }
	if (has('drop')) { el(actor, 'gk-drop gk-fxt', `left:${u(58)};top:${u(18)};width:${u(2)};height:${u(3)};border-radius:50% 50% 50% 50% / 60% 60% 40% 40%;background:#7DD3FC`); }
	if (has('sweat')) { [0, 600].forEach((d, i) => el(actor, 'gk-drop gk-fxt', `left:${u(i ? 20 : 59)};top:${u(20)};width:${u(1.6)};height:${u(2.4)};border-radius:50% 50% 50% 50% / 60% 60% 40% 40%;background:#7DD3FC;animation-delay:-${d}ms`)); }
	if (has('steam')) { [0, 1].forEach(i => el(actor, 'gk-steam gk-fxt', `left:${u(35 + i * 2)};top:${u(46.5)};width:${u(0.8)};height:${u(2.4)};border-radius:2px;background:rgba(163,172,185,0.6);animation-delay:${i * 1100}ms`)); }
	if (has('steamhead')) { [0, 1, 2].forEach(i => el(actor, 'gk-puff gk-fxt', `left:${u(34 + i * 5)};top:${u(12)};--dx:${(i - 1) * 3};width:${u(3)};height:${u(3)};border-radius:50%;background:rgba(201,208,217,0.55);animation-delay:-${i * 600}ms`)); }
	if (has('puffs')) { [0, 1, 2, 3].forEach(i => el(actor, 'gk-puff gk-fxt', `left:${u(32 + i * 5)};top:${u(50)};--dx:${(i - 1.5) * 4};width:${u(4)};height:${u(4)};border-radius:50%;background:rgba(140,150,164,0.7);animation-delay:-${i * 450}ms`)); }
	if (has('qmarks')) { [['?', 60, 10, 0], ['?', 66, 18, 500], ['!', 63, 6, 900]].forEach(([t, x, y, d]) => el(actor, 'gk-pop gk-fxt', `left:${u(Number(x))};top:${u(Number(y))};font:700 ${u(5)} Poppins,'Segoe UI',sans-serif;color:${t === '!' ? '#C3FB05' : '#0AEFBB'};animation-delay:${d}ms`, String(t))); }
	if (has('sparks')) { [[8, 14], [70, 10], [14, 40], [72, 44], [40, 2]].forEach(([x, y], i) => el(actor, 'gk-spark gk-fxt', `left:${u(x)};top:${u(y)};font-size:${u(4)};color:${i % 2 ? '#0AEFBB' : '#FCC200'};animation-delay:-${i * 260}ms`, '✦')); }
	if (has('papers')) { [-26, 22, -14, 30, 8].forEach((dx, i) => el(actor, 'gk-paper gk-fxt', `left:${u(38)};top:${u(52)};--dx:${dx};width:${u(4)};height:${u(5)};background:#F2F4F7;border:${u(0.4)} solid #2B4500;animation-delay:-${i * 300}ms`)); }
	if (has('snot')) { el(actor, 'gk-snot', `left:${u(43)};top:${u(36)};width:${u(4)};height:${u(4)};background:rgba(125,211,252,0.45);border:${u(0.4)} solid rgba(186,230,253,0.9)`); }
	if (has('flip')) { el(actor, 'gk-flip gk-fxt', `left:${u(40)};top:${u(44)};width:${u(12.5)};height:${u(9)};background:#E3E8EE;border:${u(0.4)} solid #05070A`); }
	if (has('signText')) { el(actor, '', `left:${u(14)};top:${u(1)};width:${u(52)};height:${u(11)};display:flex;align-items:center;justify-content:center;font:700 ${u(4.6)} Poppins,'Segoe UI',sans-serif;color:#08090D;letter-spacing:0.02em`, o.say?.('TON OK ?') ?? 'TON OK ?'); }
	if (has('speedlines')) { [[8, 30], [2, 38], [10, 46], [4, 54], [12, 24]].forEach(([x, y], i) => el(actor, 'gk-speed gk-fxt', `left:${u(x)};top:${u(y)};width:${u(10)};height:${u(0.7)};background:${i % 2 ? '#0AEFBB' : '#C3FB05'};animation-delay:-${i * 75}ms`)); }
	if (has('keys')) { ['A', '{', ';', 'K', '0', '}', 'F', '⏎'].forEach((t, i) => el(actor, 'gk-key gk-fxt', `left:${u(58 + (i % 4) * 2)};top:${u(50)};--dx:${[4, 10, -3, 14, 7, -6, 12, 2][i]};--r:${(i % 2 ? 1 : -1) * (90 + i * 30)}deg;padding:${u(0.5)} ${u(0.8)};border-radius:${u(0.6)};background:#F2F4F7;color:#08090D;box-shadow:0 ${u(0.5)} 0 #8C96A4;${mono};font-size:${u(2.4)};animation-delay:-${i * 90}ms`, t)); }
	if (has('tac')) { [['tac', 64, 26, -12, 0], ['TAC !', 70, 36, 8, 430], ['tac tac', 56, 16, -6, 860]].forEach(([t, x, y, r, d]) => el(actor, 'gk-tac gk-fxt', `left:${u(Number(x))};top:${u(Number(y))};--r:${r}deg;font:800 ${u(4.2)} Poppins,'Segoe UI',sans-serif;color:#C3FB05;text-shadow:${u(0.5)} ${u(0.5)} 0 #2B4500;white-space:nowrap;animation-delay:-${d}ms`, String(t))); }
	if (has('sweatback')) { [0, 260, 520].forEach((d, i) => el(actor, 'gk-fly gk-fxt', `left:${u(24 + i * 3)};top:${u(18 + i * 4)};width:${u(1.6)};height:${u(2.2)};border-radius:50%;background:#7DD3FC;animation-delay:-${d}ms`)); }
	if (has('flames')) { [52, 57, 62, 67, 72].forEach((x, i) => el(actor, 'gk-flame', `left:${u(x)};top:${u(63.5 - (i % 2) * 1.5)};width:${u(3.6)};height:${u(4 + (i % 2) * 1.5)};border-radius:50% 50% 50% 50% / 70% 70% 30% 30%;background:linear-gradient(#FCC200,#FF5A1F);animation-delay:-${i * 60}ms`)); }
	if (has('wpm')) {
		const meter = el(actor, '', `left:${u(56)};top:${u(68)};padding:${u(0.6)} ${u(1.2)};border-radius:${u(1)};background:#05070A;border:${u(0.4)} solid #C3FB05;color:#C3FB05;${mono};font-size:${u(2.4)};white-space:nowrap;font-variant-numeric:tabular-nums`, '312 mots/min');
		o.track(setInterval(() => { meter.textContent = (290 + Math.floor(Math.random() * 140)) + ' mots/min'; }, 260));
	}
	if (has('speech')) {
		const b = doc.createElement('div');
		b.className = 'gk-bubble';
		b.style.cssText = ink(`position:absolute;left:${u(57)};top:${u(2)};display:flex;flex-direction:column;gap:${u(1)};padding:${u(1.8)} ${u(2.2)};background:#F2F4F7;border:${u(0.5)} solid #2B4500;border-radius:${u(2.6)};box-shadow:0 ${u(0.8)} 0 #2B4500`);
		[14, 10, 12].forEach((w, i) => { const bar = doc.createElement('span'); bar.className = 'gk-bar'; bar.style.cssText = `width:${u(w)};height:${u(1.2)};animation-delay:-${(3 - i) * 300}ms`; b.appendChild(bar); });
		actor.appendChild(b);
	}

	if (ph.bubble || ph.bubbleDots) {
		const bubble = doc.createElement('div');
		bubble.className = 'gk-bubble';
		bubble.style.cssText = ink(`position:absolute;display:flex;align-items:center;justify-content:center;white-space:nowrap;background:#F2F4F7;color:#08090D;border:${u(0.5)} solid #2B4500;border-radius:${u(2.6)};box-shadow:0 ${u(0.8)} 0 #2B4500;font-weight:600;line-height:1;`
			+ (ph.bubble ? `left:${u(Math.max(compact ? 20 : 10, Math.min(57, (compact ? 96 : S.x + S.w - 2) - (ph.bubble.length * 1.95 + 5))))};top:${u(3)};padding:${u(1.6)} ${u(2.4)};font-size:${u(3.4)}` : `left:${u(55)};top:${u(3)};padding:${u(1.8)} ${u(2.4)};gap:${u(1)}`));
		if (ph.bubble) {
			// J24 : le Geeko violet dit « ULTRA ! » au lieu de « Salut ! ».
			bubble.textContent = ink === ultraInk && ph.bubble === 'Salut !' ? 'ULTRA !' : ph.bubble;
		} else {
			[0, 180, 360].forEach(d => {
				const dot = doc.createElement('span');
				dot.className = 'gk-dot';
				dot.style.cssText = `width:${u(1.6)};height:${u(1.6)};animation-delay:${d}ms`;
				bubble.appendChild(dot);
			});
		}
		actor.appendChild(bubble);
	}
}

// Geeko en image SVG autonome (data: URI), pour une page où notre code ne s'exécute pas (la page de Claude Code) :
// la dernière phase de la scène, avec ses animations CSS, dans un foreignObject. Pas de fonte externe dans une image :
// les petits textes (particules, bulle) prennent la police système.
export function geekoImage(doc: Document, scene: GeekoScene, size = 2, palette: GeekoPalette = 'normal'): string {
	const root = doc.createElement('div');
	root.setAttribute('class', 'gk-root');
	const width = Math.round(W * size), height = Math.round(H * size);
	root.setAttribute('style', `position:relative;width:${width}px;height:${height}px;perspective:${Math.round(160 * size)}px;--u:${size}px`);
	const seq = SCENES[scene] ?? SCENES.intro;
	const layer = doc.createElement('div');
	layer.className = 'gk-layer';
	root.appendChild(layer);
	if (palette === 'ultra') { root.classList.add('gk-ultra'); }
	ink = palette === 'ultra' ? ultraInk : sameInk;
	try {
		render(doc, layer, seq[seq.length - 1][0], { size, k: 1, compact: true, label: '', track: () => undefined });
	} finally {
		ink = sameInk;
	}
	const style = doc.createElement('style');
	style.textContent = CSS;
	const wrap = doc.createElement('div');
	wrap.append(style, root);
	const html = new XMLSerializer().serializeToString(wrap);
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><foreignObject x="0" y="0" width="${width}" height="${height}">${html}</foreignObject></svg>`;
	return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const EGG_GAP_MS = 15 * 60000;
const EGG_CHANCE = 1 / 3;
// La fusée : la fête arrive moins de 30 s après des commandes (Claude finit presque toujours par quelques mots, qui
// passent avant la fête : la seule activité précédente ne suffit pas).
const ROCKET_AFTER_MS = 30_000;
const MAX_SIZE = 4;
// Partagé par tous les Geeko d'une même page : jamais deux easter eggs dans le même quart d'heure.
let lastEggAt = -Infinity;

const SCENE_ACTIVITY: Record<GeekoScene, GeekoActivity> = { intro: 'hello', hello: 'hello', wait: 'wait', think: 'think', code: 'code', type: 'code', party: 'party', oops: 'oops', sleep: 'sleep' };
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

export function createGeeko(doc: Document, options: GeekoOptions = {}): GeekoHandle {
	ensureStyle(doc);
	const sizeOf = (s: GeekoSize | number | undefined) => Math.min(MAX_SIZE, Math.max(0.5, typeof s === 'number' && s > 0 ? s : SIZES[s as GeekoSize] ?? SIZES.moyen));
	let size = sizeOf(options.size);
	let palette: GeekoPalette = options.palette === 'ultra' ? 'ultra' : 'normal';
	const root = doc.createElement('div');
	// gk-live : un Geeko animé, qui disparaît avec « réduire les animations » (geekoImage, figé, reste).
	root.className = 'gk-root gk-live' + (palette === 'ultra' ? ' gk-ultra' : '');
	root.setAttribute('role', 'img');
	const reduce = options.reduceMotion ?? (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches);
	if (reduce) { root.classList.add('gk-reduce'); }
	const now = options.now ?? (() => new Date());
	let timers: ReturnType<typeof setTimeout>[] = [];
	let intervals: ReturnType<typeof setInterval>[] = [];
	let layer: HTMLElement | undefined;
	let activity: GeekoActivity = options.activity ?? SCENE_ACTIVITY[options.scene ?? 'intro'];
	let intensity: GeekoIntensity = intensityOf(options.intensity);
	let current: Variant | undefined;
	let currentPhase = 'wave';
	let info: GeekoInfo | undefined;
	// serversAt : la dernière fois qu'il pilotait les serveurs (la fusée sort à la fête qui suit de près des commandes).
	let workSince = 0, serversAt = -Infinity;
	const lastByActivity = new Map<GeekoActivity, string>();
	const findVariant = (id?: string) => (Object.keys(LIBRARY) as GeekoActivity[]).map(a => ({ a, v: LIBRARY[a].find(x => x.id === id) })).find(f => f.v);
	const first = findVariant(options.variant);
	let pinned = first?.v;
	if (first) { activity = first.a; }

	const compact = () => options.stage === false || (options.stage !== true && size < 1.5);
	const k = () => (intensity === 'turbo' ? 0.6 : intensity === 'calme' ? 1.5 : 1);
	const resize = () => {
		const S = compact() ? BARE : STAGE;
		root.style.width = Math.round(S.w * size) + 'px';
		root.style.height = Math.round(S.h * size) + 'px';
		root.style.perspective = Math.round(160 * size) + 'px';
		root.style.setProperty('--u', size + 'px');
	};
	const clear = () => {
		timers.forEach(t => clearTimeout(t));
		intervals.forEach(t => clearInterval(t));
		timers = []; intervals = [];
	};
	const later = (fn: () => void, ms: number) => { timers.push(setTimeout(fn, ms)); };
	const paint = (name: string, smooth: boolean) => {
		intervals.forEach(t => clearInterval(t));
		intervals = [];
		currentPhase = name;
		const old = layer;
		const next = doc.createElement('div');
		next.className = 'gk-layer' + (smooth && old && !reduce ? ' gk-in' : '');
		root.appendChild(next);
		layer = next;
		ink = palette === 'ultra' ? ultraInk : sameInk;
		try {
			render(doc, next, name, { size, k: k(), compact: compact(), label: info?.label ?? 'Geeko', track: id => intervals.push(id), say: options.say });
		} finally {
			ink = sameInk;
		}
		if (old) {
			if (smooth && !reduce) { old.classList.add('gk-out'); setTimeout(() => old.remove(), 260); } else { old.remove(); }
		}
	};

	const pool = (a: GeekoActivity, i: GeekoIntensity) => LIBRARY[a].filter(v => (v.in ?? ALL).includes(i));
	const eggFits = (e: (typeof EGGS)[GeekoEgg], a: GeekoActivity) => {
		const d = now(), h = d.getHours(), t = Date.now();
		if (!e.on?.includes(a)) { return false; }
		if (e.egg === 'nuit') { return h >= 23 || h < 5; }
		if (e.egg === 'vendredi') { return d.getDay() === 5 && h >= 16; }
		if (e.egg === 'pizza') { return workSince > 0 && t - workSince > 15 * 60000; }
		if (e.egg === 'fusee') { return t - serversAt < ROCKET_AFTER_MS; }
		return false;
	};
	const pick = (a: GeekoActivity, i: GeekoIntensity, avoid?: string): Variant => {
		if (pinned) { return pinned; }
		if (options.eggs !== false && Date.now() - lastEggAt > EGG_GAP_MS && Math.random() < EGG_CHANCE) {
			const egg = Object.values(EGGS).find(e => e.id !== avoid && eggFits(e, a));
			if (egg) { lastEggAt = Date.now(); return egg; }
		}
		const list = pool(a, i);
		const last = avoid ?? lastByActivity.get(a);
		const choices = list.length > 1 ? list.filter(v => v.id !== last) : list;
		return choices[Math.floor(Math.random() * choices.length)];
	};

	const announce = (v: Variant) => {
		const list = pool(activity, intensity);
		const index = list.findIndex(x => x.id === v.id);
		info = { activity, intensity, variant: v.id, name: v.name, label: v.label, index: index + 1, count: list.length, egg: v.egg };
		root.setAttribute('aria-label', v.label);
		options.onChange?.(info);
	};

	const play = (v: Variant, smooth: boolean, then?: () => void) => {
		clear();
		const prev = current;
		current = v;
		lastByActivity.set(activity, v.id);
		announce(v);
		let seq = v.seq.slice();
		// Continuité : le PC n'est sorti qu'en arrivant d'une scène sans PC ; il est rangé en partant vers une scène sans PC.
		if (v.laptop === 'front' && !prev?.laptop && !v.noFetch) { seq = [['fetch', 850], ['settle', 520], ...seq]; }
		if (prev?.laptop === 'front' && v.laptop !== 'front' && v.laptop !== 'profile') { seq = [['stow', 480], ...seq]; }
		const step = (i: number) => {
			paint(seq[i][0], i === 0 && smooth);
			const ms = seq[i][1];
			if (ms && i < seq.length - 1) { later(() => step(i + 1), ms); return; }
			if (then) { later(then, (v as { ms?: number }).ms ?? 6000); return; }
			// Jamais répétitif : une autre variante de la même activité toutes les 9 à 15 s, tant qu'elle dure.
			if (!reduce && !pinned && pool(activity, intensity).length > 1) { later(rotate, 9000 + Math.random() * 6000); }
		};
		step(reduce ? seq.length - 1 : 0);
	};
	const rotate = () => {
		// Geeko caché (bande au repos, écran de connexion passé, onglet masqué) : pas de repeinture, on repasse plus tard.
		// Ses compteurs (mots/min du turbo…) s'arrêtent aussi ; la repeinture suivante, une fois visible, les relance.
		if (typeof root.getClientRects === 'function' && !root.getClientRects().length) {
			intervals.forEach(t => clearInterval(t));
			intervals = []; timers = [];
			later(rotate, 9000 + Math.random() * 6000);
			return;
		}
		play(pick(activity, intensity, current?.id), true);
	};

	const setActivity = (a: GeekoActivity, wanted?: GeekoIntensityInput) => {
		const i = wanted === undefined ? intensity : intensityOf(wanted);
		if (!LIBRARY[a]) { return; }
		if (a === activity && i === intensity && current) { return; }
		const working = !['hello', 'sleep', 'party', 'oops'].includes(a);
		if (working && !workSince) { workSince = Date.now(); }
		if (!working) { workSince = 0; }
		if (activity === 'servers') { serversAt = Date.now(); }
		activity = a;
		intensity = i;
		play(pick(a, i), true);
	};

	const egg = (name: GeekoEgg) => {
		const e = EGGS[name];
		if (!e) { return; }
		lastEggAt = Date.now();
		const interrupt = !!e.ms;
		play(e, true, interrupt ? () => play(pick(activity, intensity), true) : undefined);
	};

	// Easter eggs déclenchés par l'utilisateur : clics répétés, code Konami.
	let clicks: number[] = [];
	const onClick = () => {
		const t = Date.now();
		clicks = clicks.filter(c => t - c < 1600).concat(t);
		if (clicks.length === 3) { egg('chatouille'); }
		if (clicks.length >= 6) { clicks = []; egg('tourne'); }
	};
	let konami = 0;
	const onKey = (e: KeyboardEvent) => {
		const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
		konami = key === KONAMI[konami] ? konami + 1 : (key === KONAMI[0] ? 1 : 0);
		if (konami === KONAMI.length) { konami = 0; egg('legende'); }
	};
	if (options.eggs !== false) {
		root.addEventListener('click', onClick);
		doc.addEventListener('keydown', onKey);
	}

	resize();
	if (!pinned && (options.scene === 'intro' || (!options.activity && !options.scene))) {
		const intro: Variant = { id: 'intro', name: 'intro', label: 'Geeko te fait coucou puis sort son PC', seq: SCENES.intro, laptop: 'front', noFetch: true };
		play(intro, false);
	} else {
		play(pick(activity, intensity), false);
	}

	return {
		element: root,
		get info() { return info; },
		get palette() { return palette; },
		setScene: (scene: GeekoScene) => {
			if (scene === 'intro' || scene === 'code') { activity = 'code'; play({ id: scene, name: scene, label: 'Geeko sort son PC et code', seq: SCENES[scene], laptop: 'front', noFetch: true }, true); return; }
			setActivity(SCENE_ACTIVITY[scene] ?? 'hello');
		},
		setActivity,
		setVariant: (id: string) => {
			const f = findVariant(id);
			if (!f?.v || f.v === pinned) { return; }
			pinned = f.v;
			activity = f.a;
			play(f.v, true);
		},
		setSize: (s: GeekoSize | number) => {
			size = sizeOf(s);
			resize();
			paint(currentPhase, false);
		},
		egg,
		setPalette: (p: GeekoPalette) => {
			const next: GeekoPalette = p === 'ultra' ? 'ultra' : 'normal';
			if (next === palette) { return; }
			palette = next;
			root.classList.toggle('gk-ultra', palette === 'ultra');
			if (layer) { paint(currentPhase, true); }
		},
		dispose: () => {
			clear();
			root.removeEventListener('click', onClick);
			doc.removeEventListener('keydown', onKey);
			root.remove();
		},
	};
}
