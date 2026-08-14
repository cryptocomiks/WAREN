/* =========================================================================
   BERKSHIRE HATHAWAY — DOSSIER T2 2026
   Moteur du rapport : données, graphiques SVG, révélation progressive, quiz.
   Aucune dépendance externe.
   ========================================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------------------
     0. OUTILS
     --------------------------------------------------------------------- */
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function nf(v, d) {
    d = d == null ? 1 : d;
    return v.toLocaleString('fr-FR', { minimumFractionDigits: d, maximumFractionDigits: d });
  }
  function sgn(v, d) { return (v > 0 ? '+' : v < 0 ? '−' : '') + nf(Math.abs(v), d); }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function debounce(fn, ms) {
    var t; return function () { var a = arguments, c = this; clearTimeout(t); t = setTimeout(function () { fn.apply(c, a); }, ms); };
  }

  var C = {
    s1: '#127a46', s2: '#1a5fa8', s3: '#c0271a',
    warn: '#8a6300',
    seq: ['#d3e5d6', '#a9cdb2', '#74ad8b', '#3d8a63', '#14603c', '#0b3d27'],
    ink: '#1b1e14', ink2: '#4b5040', ink3: '#6f7561',
    rule: '#b7bda6', ruleSoft: '#cdd2bd', paper: '#f4f0e1', pencil: '#c0271a'
  };

  /* ---------------------------------------------------------------------
     1. DONNÉES
     --------------------------------------------------------------------- */
  var DATA = {
    flux: [
      { q: 'T1 2026', achats: 15938, ventes: 24087, net: -8149 },
      { q: 'T2 2026', achats: 23467, ventes: 3693,  net: 19774 }
    ],
    buyback: [
      { k: 'Année 2025', v: 0,    note: 'aucun rachat' },
      { k: 'T1 2026',    v: 235,  note: 'réouverture' },
      { k: 'T2 2026',    v: 4527, note: 'plein régime' }
    ],
    cash: [
      { d: '31 mars 2026', brut: 397.4, nonDenoue: 17.2, net: 380.2 },
      { d: '30 juin 2026', brut: 365.5, nonDenoue: 0.8,  net: 364.7 }
    ],
    perf: [
      { k: 'Valeur comptable / action', p: '1965–2025',         ps: '1965–25', brk: 18.1, sp: 10.5 },
      { k: 'Valeur comptable / action', p: 'dernière décennie',  ps: '10 ans',  brk: 12.4, sp: 14.8 },
      { k: 'Cours de bourse',           p: '1965–2025',         ps: '1965–25', brk: 19.8, sp: 10.5 },
      { k: 'Cours de bourse',           p: 'dernière décennie',  ps: '10 ans',  brk: 14.3, sp: 14.8 }
    ],
    blocks: [
      { k: 'Commercial, industriel et autres', d: 21.08 },
      { k: 'Banques, assurance, finance',      d: 1.04 },
      { k: 'Produits de consommation',         d: -0.20 }
    ],
    deploy: [
      { k: 'Alphabet — placement du 4 juin',             v: 10.0, c: C.s1, known: true },
      { k: 'Autres achats industriels / technologiques', v: 11.1, known: false },
      { k: 'Achats, bloc financier',                     v: 1.0,  known: false },
      { k: "Rachats d'actions Berkshire",                v: 4.5,  c: C.s2, known: true }
    ],
    /* Trois niveaux comparables — jamais un niveau et un incrément sur le
       même axe. Le placement de juin est intégré au troisième point.        */
    alphabet: [
      { d: '31 déc. 2025',      v: 5.5,  known: false, lab: '~5,5 Md$',  sub: 'rétro-calculé depuis le +203 % du T1' },
      { d: '31 mars 2026',      v: 16.6, known: true,  lab: '16,6 Md$',  sub: '13F — seule valeur déclarée' },
      { d: 'après le 4 juin',   v: 26.6, known: false, lab: '≥ 26,6 Md$', sub: '16,6 + 10,0 souscrits, hors variation de cours' }
    ],
    top5q1: [
      { k: 'Apple',            v: 58, out: false },
      { k: 'American Express', v: 46, out: false },
      { k: 'Coca-Cola',        v: 30, out: false },
      { k: 'Bank of America',  v: 25, out: false },
      { k: 'Chevron',          v: 18, out: true }
    ],
    top5q2: ['Alphabet', 'American Express', 'Apple', 'Bank of America', 'Coca-Cola'],
    /* 13F au 31 mars 2026 — 28 lignes déclarées, 263,1 Md$
       mv : mouvement du trimestre — new | up | down | flat                */
    pf: [
      { k: 'Apple',                w: 22.0, v: 58,    t: '228 M',  mv: 'flat', n: '—' },
      { k: 'American Express',     w: 17.4, v: 46,    t: '152 M',  mv: 'flat', n: '—' },
      { k: 'Coca-Cola',            w: 11.6, v: 30,    t: '400 M',  mv: 'flat', n: '—' },
      { k: 'Bank of America',      w: 9.5,  v: 25,    t: '514 M',  mv: 'flat', n: '—' },
      { k: 'Chevron',              w: 6.6,  v: 18,    t: '84 M',   mv: 'down', n: '−35 %' },
      { k: 'Occidental (commun)',  w: 6.5,  v: 17,    t: '265 M',  mv: 'flat', n: '—' },
      { k: 'Alphabet A + C',       w: 6.3,  v: 16.6,  t: '54 + 3,6 M', mv: 'up', n: '+203 %, classe C nouvelle' },
      { k: 'Chubb',                w: 4.2,  v: 11,    t: '34 M',   mv: 'flat', n: '—' },
      { k: "Moody's",              w: 4.1,  v: 11,    t: '25 M',   mv: 'flat', n: '—' },
      { k: 'Kraft Heinz',          w: 2.8,  v: 7.3,   t: '326 M',  mv: 'flat', n: '—' },
      { k: 'DaVita',               w: 1.8,  v: 4.6,   t: '30 M',   mv: 'down', n: '−5 %' },
      { k: 'Kroger',               w: 1.4,  v: 3.6,   t: '50 M',   mv: 'flat', n: '—' },
      { k: 'SiriusXM',             w: 1.1,  v: 2.9,   t: '125 M',  mv: 'flat', n: '—' },
      { k: 'Delta Air Lines',      w: 1.0,  v: 2.6,   t: '40 M',   mv: 'new',  n: 'NOUVEAU' },
      { k: 'VeriSign',             w: 0.8,  v: 2.2,   t: '9,0 M',  mv: 'flat', n: '—' },
      { k: 'Capital One',          w: 0.5,  v: 1.3,   t: '7,2 M',  mv: 'flat', n: '—' },
      { k: 'New York Times',       w: 0.5,  v: 1.3,   t: '15 M',   mv: 'up',   n: '+198 %' },
      { k: 'Ally Financial',       w: 0.4,  v: 1.1,   t: '29 M',   mv: 'flat', n: '—' },
      { k: 'Liberty Live C',       w: 0.4,  v: 0.996, t: '11 M',   mv: 'down', n: '−3 %' },
      { k: 'Lennar A',             w: 0.3,  v: 0.877, t: '10 M',   mv: 'up',   n: '+43 %' },
      { k: 'Nucor',                w: 0.3,  v: 0.661, t: '3,9 M',  mv: 'down', n: '−39 %' },
      { k: 'Liberty Live A',       w: 0.2,  v: 0.457, t: '5,0 M',  mv: 'flat', n: '—' },
      { k: 'Louisiana-Pacific',    w: 0.2,  v: 0.412, t: '5,7 M',  mv: 'flat', n: '—' },
      { k: 'Constellation Brands', w: 0.04, v: 0.095, t: '633 k',  mv: 'down', n: '−95 %' },
      { k: 'NVR',                  w: 0.03, v: 0.073, t: '11 k',   mv: 'flat', n: '—' },
      { k: "Macy's",               w: 0.02, v: 0.055, t: '3,0 M',  mv: 'new',  n: 'NOUVEAU' },
      { k: 'Lennar B',             w: 0.01, v: 0.020, t: '238 k',  mv: 'up',   n: '+31 %' },
      { k: 'Jefferies',            w: 0.01, v: 0.018, t: '434 k',  mv: 'flat', n: '—' }
    ]
  };

  /* Chaque définition est écrite pour quelqu'un qui n'a jamais lu un bilan. */
  var GLOSSARY = {
    '13F': ['Formulaire 13F', "La liste des actions américaines détenues par un gros investisseur, qu'il doit publier tous les trimestres. Elle donne les noms et les montants — mais uniquement pour les titres cotés aux États-Unis, et sans jamais dire à quelle date ni à quel prix les achats ont été faits."],
    '10Q': ['Formulaire 10-Q', "Le bulletin financier trimestriel d'une entreprise cotée : ce qu'elle possède, ce qu'elle doit, ce qu'elle a gagné. On y lit combien Berkshire a acheté et vendu d'actions au total, mais jamais le nom des sociétés concernées."],
    '424B5': ['Prospectus 424B5', "Le document déposé quand une entreprise émet de nouvelles actions. C'est lui qui donne les conditions exactes : combien de titres, à quel prix, par quel intermédiaire."],
    'droits': ["Droits d'enregistrement", "L'engagement pris par l'entreprise de faire officiellement enregistrer les actions vendues, ce qui permet à l'acheteur de les revendre librement plus tard. Sans cela, Berkshire se retrouverait avec des titres difficiles à céder."],
    'net': ['Acheteur net / vendeur net', "On additionne tous les achats du trimestre, on retire toutes les ventes. Si le solde est positif, on est « acheteur net » : on a mis plus d'argent sur le marché qu'on n'en a retiré. S'il est négatif, c'est l'inverse."],
    'pvr': ['Plus-value imposable', "Le gain réellement encaissé quand on vend un titre plus cher qu'on ne l'a payé. Contrairement au gain « sur le papier », celui-ci déclenche immédiatement l'impôt."],
    'pvl': ['Plus-value latente', "Le gain existe, mais seulement sur le papier : le titre vaut plus cher qu'à l'achat et on ne l'a pas vendu. Aucun impôt n'est dû tant qu'on ne vend pas — mais le gain peut aussi s'évaporer si le cours redescend."],
    'idiff': ['Impôt différé', "Une facture d'impôt déjà inscrite dans les comptes, mais pas encore payée, parce que l'événement qui la déclenche — la vente — n'a pas eu lieu. Berkshire en porte 90,2 milliards : c'est ce que coûterait, en gros, la sortie de ses positions."],
    'bt': ['Bon du Trésor', "Un prêt à très court terme consenti à l'État américain. C'est considéré comme le placement le plus sûr au monde ; en échange, il ne rapporte que le taux d'intérêt du moment, sans aucune croissance."],
    'cp': ['Capitaux propres', "Ce qui reste à l'entreprise une fois toutes ses dettes remboursées. C'est la mesure de ce qui appartient réellement aux actionnaires."],
    'bop': ['Bénéfice opérationnel', "Ce que gagnent vraiment les entreprises du groupe par leur activité : le chemin de fer, l'énergie, l'assurance, les usines. On en exclut la variation de valeur des actions détenues, qui n'est pas de l'argent encaissé."],
    'souscr': ['Résultat de souscription', "Le métier de base d'un assureur : les primes encaissées, moins les sinistres remboursés et les frais. C'est différent de ce que l'assureur gagne en plaçant l'argent qu'il détient en attendant."],
    'mee': ['Mise en équivalence', "Une façon de comptabiliser une participation quand on détient une part importante d'une société — en général plus de 20 % — sans la contrôler. Elle apparaît au bilan à une valeur calculée, et non à son cours de Bourse."],
    'shosha': ['Sogo shosha', "Les grandes maisons de négoce japonaises. Ce sont des conglomérats qui achètent, transportent et financent à peu près tout : matières premières, énergie, alimentation, industrie. Buffett les décrit comme « gérées d'une manière assez similaire à Berkshire elle-même »."],
    'pref': ['Action préférentielle', "Un titre à mi-chemin entre l'action et l'obligation : il verse un revenu fixe et garanti — ici 8 % par an — et passe avant les actions ordinaires en cas de problème, mais ne profite pas de la hausse du cours."],
    'warrant': ['Bon de souscription', "Le droit — jamais l'obligation — d'acheter une action à un prix fixé à l'avance. Si le cours dépasse ce prix, le bon devient rentable ; sinon on ne l'exerce pas et on ne perd rien de plus."],
    'pp': ['Placement privé', "Vendre des actions directement à un seul investisseur, sans passer par la Bourse. C'est beaucoup plus rapide et discret, mais l'acheteur exige généralement un rabais sur le cours du jour en échange."],
    'conglo': ['Conglomérat', "Un groupe qui rassemble des entreprises de métiers sans rapport entre eux. Berkshire possède à la fois un chemin de fer, des assureurs, des fabricants de meubles et une compagnie d'électricité."],
    'vi': ['Valeur intrinsèque', "Ce que l'entreprise vaut vraiment selon ses dirigeants, indépendamment de ce que le marché en dit un jour donné. La règle de Berkshire : ne racheter ses propres actions que si le cours est en dessous de cette valeur."],
    'deprec': ['Dépréciation', "Reconnaître comptablement qu'un actif vaut durablement moins que ce qu'on a payé, et inscrire la perte dans les comptes. Berkshire dit ne pas y être obligé pour Kraft Heinz — tout en laissant la porte ouverte."],
    'vcpa': ['Valeur comptable par action', "Ce que l'entreprise possède réellement, une fois ses dettes déduites, divisé par le nombre d'actions. C'est l'indicateur que Buffett a utilisé toute sa vie pour se comparer au marché."],
    'cout': ["Coût d'opportunité", "Ce que vous perdez en ne faisant pas autre chose. Laisser 325 milliards en placements sans risque ne coûte presque rien tant que les taux sont élevés ; dès qu'ils baissent, l'inaction devient une perte mesurable."]
  };
;

  /* ---------------------------------------------------------------------
     2. PRIMITIVES SVG
     --------------------------------------------------------------------- */
  function svgOpen(w, h) {
    /* role="group" et non "img" : les marques portent chacune leur propre
       étiquette et doivent rester atteignables au clavier. */
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h +
           '" role="group" xmlns="http://www.w3.org/2000/svg">';
  }
  function txt(x, y, s, o) {
    o = o || {};
    return '<text x="' + x + '" y="' + y + '"' +
      ' fill="' + (o.fill || C.ink2) + '"' +
      ' font-size="' + (o.size || 11) + '"' +
      ' font-family="' + (o.mono ? 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
                                 : '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif') + '"' +
      (o.weight ? ' font-weight="' + o.weight + '"' : '') +
      (o.anchor ? ' text-anchor="' + o.anchor + '"' : '') +
      (o.baseline ? ' dominant-baseline="' + o.baseline + '"' : '') +
      (o.ls ? ' letter-spacing="' + o.ls + '"' : '') +
      (o.cls ? ' class="' + o.cls + '"' : '') +
      (o.opacity ? ' opacity="' + o.opacity + '"' : '') +
      '>' + esc(s) + '</text>';
  }
  function rrect(x, y, w, h, r, fill, extra) {
    if (w < 0) { x += w; w = -w; }
    if (h < 0) { y += h; h = -h; }
    r = Math.max(0, Math.min(r, w / 2, h / 2));
    return '<rect x="' + x + '" y="' + y + '" width="' + Math.max(0, w) + '" height="' + Math.max(0, h) +
           '" rx="' + r + '" fill="' + fill + '"' + (extra || '') + '/>';
  }
  function tipAttr(title, lines) {
    return ' data-tip="' + esc(title + '||' + lines.join('|')) + '" tabindex="0" role="img"' +
           ' aria-label="' + esc(title + '. ' + lines.join('. ')) + '"';
  }
  function gridline(x1, y, x2) {
    return '<line x1="' + x1 + '" y1="' + y + '" x2="' + x2 + '" y2="' + y + '" stroke="' + C.ruleSoft +
           '" stroke-width="1" shape-rendering="crispEdges"/>';
  }
  function legend(items) {
    return '<div class="legend">' + items.map(function (i) {
      var bg = i.open
        ? 'background:rgba(192,39,26,.07);background-image:repeating-linear-gradient(45deg,' + i.c + ' 0 2px,transparent 2px 5px)'
        : 'background:' + i.c + (i.hatch ? ';background-image:repeating-linear-gradient(45deg,transparent 0 2px,' + C.paper + ' 2px 4px)' : '');
      return '<span class="legend__item"><span class="legend__swatch" style="' + bg +
        '"></span>' + esc(i.k) + '</span>';
    }).join('') + '</div>';
  }
  /* Hachure pleine : encodage secondaire obligatoire sur la paire rouge/vert (ΔE CVD 7,0) */
  function hatchDef(id, color) {
    return '<defs><pattern id="' + id + '" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">' +
      '<rect width="6" height="6" fill="' + color + '"/>' +
      '<line x1="0" y1="0" x2="0" y2="6" stroke="' + C.paper + '" stroke-width="2.2"/></pattern></defs>';
  }
  /* Hachure ouverte : réservée aux montants dérivés ou non déclarés — la forme
     reste lisible mais « vide », et un libellé sombre y garde son contraste. */
  function hatchOpen(id, color) {
    /* Le trait est centré dans la tuile : posé sur x=0 il serait écrêté de
       moitié par les bornes du motif, et la hachure deviendrait invisible. */
    return '<defs><pattern id="' + id + '" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">' +
      '<rect width="7" height="7" fill="rgba(192,39,26,.10)"/>' +
      '<line x1="3.5" y1="0" x2="3.5" y2="7" stroke="' + color + '" stroke-width="2.4"/></pattern></defs>';
  }
  var DASHED = ' stroke="' + C.pencil + '" stroke-width="1.5" stroke-dasharray="5 3"';

  /* ---------------------------------------------------------------------
     3. GRAPHIQUES
     Chaque fonction reçoit la largeur disponible et retourne du HTML.
     --------------------------------------------------------------------- */
  var CHARTS = {};

  /* 3.1 — Séquence des 14 trimestres -------------------------------------- */
  CHARTS.streak = function (W) {
    var H = 200, mid = 108, n = 15;
    var pad = 8, gap = 3;
    var bw = Math.max(6, (W - pad * 2 - gap * (n - 1)) / n);
    var s = svgOpen(W, H) + hatchDef('h-streak', C.s3);
    var heights = [34, 41, 30, 47, 38, 52, 33, 44, 58, 36, 49, 40, 55, 43];
    s += '<line x1="' + pad + '" y1="' + mid + '" x2="' + (W - pad) + '" y2="' + mid +
         '" stroke="' + C.ink + '" stroke-width="1.5" shape-rendering="crispEdges"/>';
    for (var i = 0; i < 14; i++) {
      var x = pad + i * (bw + gap);
      s += rrect(x, mid + 1, bw, heights[i], 3, 'url(#h-streak)',
        ' class="bar-v-d" style="transition-delay:' + (i * 42) + 'ms"' +
        tipAttr('Trimestre de ventes nettes', ['Sens du flux : sortie', 'Séquence — montant non détaillé ici']));
    }
    var lx = pad + 14 * (bw + gap);
    s += rrect(lx, mid - 84, bw, 84, 3, C.s1,
      ' class="bar-v" style="transition-delay:640ms"' +
      tipAttr('T2 2026', ['Achats nets : +19 774 M$', 'Premier trimestre acheteur depuis 14 trimestres']));
    s += txt(pad, mid + 76, '← 14 trimestres de ventes nettes', { size: 11, fill: C.s3, weight: 600, cls: 'fade' });
    s += txt(Math.min(lx + bw + 6, W - 4), mid - 92, '+19,8 Md$', { size: 13, fill: C.s1, weight: 700, mono: true, anchor: 'end', cls: 'fade' });
    /* Le libellé passe sous la ligne de base : au-dessus il tombait dans la barre. */
    s += txt(W - 2, mid + 18, 'T2 2026', { size: 10, weight: 700, fill: C.s1, anchor: 'end', cls: 'fade' });
    return s + '</svg>';
  };

  /* 3.2 — Achats / ventes ------------------------------------------------- */
  CHARTS.flux = function (W) {
    var H = 320, mT = 34, mB = 46, mL = 40, mR = 8;
    var ph = H - mT - mB, pw = W - mL - mR;
    var max = 26000;
    var y = function (v) { return mT + ph - (v / max) * ph; };
    var s = svgOpen(W, H) + hatchDef('h-flux', C.s3);
    [0, 5000, 10000, 15000, 20000, 25000].forEach(function (g) {
      s += gridline(mL, y(g), W - mR);
      s += txt(mL - 6, y(g) + 4, nf(g / 1000, 0), { size: 10, fill: C.ink3, anchor: 'end', mono: true });
    });
    s += txt(mL - 6, mT - 14, 'Md$', { size: 9, fill: C.ink3, anchor: 'end', ls: '.06em' });

    var gw = pw / 2, bw = Math.min(74, gw * 0.31), inner = Math.min(10, gw * 0.05);
    DATA.flux.forEach(function (d, i) {
      var cx = mL + gw * i + gw / 2;
      var xa = cx - bw - inner / 2, xv = cx + inner / 2;
      s += rrect(xa, y(d.achats), bw, mT + ph - y(d.achats), 4, C.s1,
        ' class="bar-v" style="transition-delay:' + (i * 130) + 'ms"' +
        tipAttr(d.q + ' — Achats', [nf(d.achats, 0) + ' M$']));
      s += rrect(xv, y(d.ventes), bw, mT + ph - y(d.ventes), 4, 'url(#h-flux)',
        ' class="bar-v" style="transition-delay:' + (i * 130 + 90) + 'ms"' +
        tipAttr(d.q + ' — Ventes', [nf(d.ventes, 0) + ' M$']));
      s += txt(xa + bw / 2, y(d.achats) - 7, nf(d.achats / 1000, 1), { size: 12, weight: 700, fill: C.s1, anchor: 'middle', mono: true, cls: 'fade' });
      s += txt(xv + bw / 2, y(d.ventes) - 7, nf(d.ventes / 1000, 1), { size: 12, weight: 700, fill: C.s3, anchor: 'middle', mono: true, cls: 'fade' });
      s += txt(cx, H - mB + 20, d.q, { size: 12, weight: 700, fill: C.ink, anchor: 'middle' });
      s += txt(cx, H - mB + 36, 'net ' + sgn(d.net / 1000, 1) + ' Md$', {
        size: 11, weight: 700, mono: true, anchor: 'middle', fill: d.net > 0 ? C.s1 : C.s3
      });
    });
    /* Annotation crayon : la division par 6,5 */
    var cx1 = mL + gw * 0.5 + (gw * 0.31 > 74 ? 74 : gw * 0.31) / 2 + 5;
    s += '<g class="fade" style="transition-delay:.7s">' +
      '<path d="M' + (mL + gw * 0.5 + 30) + ' ' + (y(24087) - 22) + ' Q ' + (mL + gw) + ' ' + (mT - 6) + ' ' +
      (mL + gw * 1.5 + 26) + ' ' + (y(3693) - 26) + '" fill="none" stroke="' + C.pencil +
      '" stroke-width="2" filter="url(#wobble-soft)" marker-end=""/>' +
      txt(mL + gw, mT - 12, '÷ 6,5 sur les ventes', { size: 12, weight: 700, fill: C.pencil, anchor: 'middle' }) +
      '</g>';
    void cx1;
    return s + '</svg>';
  };

  /* 3.3 — Rachats d'actions ---------------------------------------------- */
  CHARTS.buyback = function (W) {
    var H = 260, mT = 26, mB = 54, mL = 44, mR = 10;
    var ph = H - mT - mB, pw = W - mL - mR, max = 5000;
    var y = function (v) { return mT + ph - (v / max) * ph; };
    var s = svgOpen(W, H);
    [0, 1000, 2000, 3000, 4000, 5000].forEach(function (g) {
      s += gridline(mL, y(g), W - mR);
      s += txt(mL - 6, y(g) + 4, nf(g, 0), { size: 10, fill: C.ink3, anchor: 'end', mono: true });
    });
    s += txt(mL - 6, mT - 10, 'M$', { size: 9, fill: C.ink3, anchor: 'end', ls: '.06em' });
    var gw = pw / 3, bw = Math.min(88, gw * 0.5);
    DATA.buyback.forEach(function (d, i) {
      var cx = mL + gw * i + gw / 2, x = cx - bw / 2;
      var h = mT + ph - y(d.v);
      if (d.v === 0) {
        s += '<line x1="' + x + '" y1="' + (mT + ph) + '" x2="' + (x + bw) + '" y2="' + (mT + ph) +
             '" stroke="' + C.pencil + '" stroke-width="3.5" class="fade" filter="url(#wobble-soft)"/>';
        s += txt(cx, mT + ph - 12, 'ZÉRO', { size: 13, weight: 800, fill: C.pencil, anchor: 'middle', ls: '.14em', cls: 'fade' });
      } else {
        s += rrect(x, y(d.v), bw, h, 4, C.seq[3 + i],
          ' class="bar-v" style="transition-delay:' + (i * 140) + 'ms"' +
          tipAttr(d.k, [nf(d.v, 0) + ' M$', d.note]));
        s += txt(cx, y(d.v) - 8, nf(d.v, 0), { size: 13, weight: 700, fill: C.ink, anchor: 'middle', mono: true, cls: 'fade' });
      }
      s += txt(cx, H - mB + 20, d.k, { size: 11.5, weight: 700, fill: C.ink, anchor: 'middle' });
      s += txt(cx, H - mB + 35, d.note, { size: 10, fill: C.ink3, anchor: 'middle' });
    });
    return s + '</svg>';
  };

  /* 3.4 — Trésorerie brute vs ajustée ------------------------------------ */
  CHARTS.cash = function (W) {
    var narrow = W < 430;
    var H = 250, mT = 30, mB = 52, mL = narrow ? 34 : 46, mR = narrow ? 8 : 92;
    var ph = H - mT - mB, pw = W - mL - mR, max = 420;
    var y = function (v) { return mT + ph - (v / max) * ph; };
    var s = svgOpen(W, H) + hatchDef('h-cash', C.s3);
    [0, 100, 200, 300, 400].forEach(function (g) {
      s += gridline(mL, y(g), W - mR);
      s += txt(mL - 6, y(g) + 4, nf(g, 0), { size: 10, fill: C.ink3, anchor: 'end', mono: true });
    });
    s += txt(mL - 6, mT - 12, 'Md$', { size: 9, fill: C.ink3, anchor: 'end', ls: '.06em' });
    var gw = pw / 2, bw = Math.min(96, gw * 0.5);
    DATA.cash.forEach(function (d, i) {
      var cx = mL + gw * i + gw / 2, x = cx - bw / 2;
      /* Base = net réel (plein) ; segment supérieur = achats non dénoués (hachuré) */
      s += rrect(x, y(d.net), bw, mT + ph - y(d.net), 4, C.s1,
        ' class="bar-v" style="transition-delay:' + (i * 120) + 'ms"' +
        tipAttr(d.d + ' — trésorerie nette', [nf(d.net, 1) + ' Md$', 'à périmètre comparable']));
      var hSeg = y(d.net) - y(d.brut);
      s += rrect(x, y(d.brut), bw, hSeg - 2, 3, 'url(#h-cash)',
        ' class="fade" style="transition-delay:' + (i * 120 + 380) + 'ms"' +
        tipAttr(d.d + ' — bons du Trésor non dénoués', [nf(d.nonDenoue, 1) + ' Md$', 'achetés, pas encore payés']));
      s += txt(cx, y(d.brut) - 9, nf(d.brut, 1) + ' brut', { size: 11.5, weight: 700, fill: C.ink3, anchor: 'middle', mono: true, cls: 'fade' });
      s += txt(cx, y(d.net) + 18, nf(d.net, 1), { size: 13, weight: 700, fill: '#ffffff', anchor: 'middle', mono: true, cls: 'fade' });
      s += txt(cx, H - mB + 20, d.d, { size: 11.5, weight: 700, fill: C.ink, anchor: 'middle' });
      if (d.nonDenoue > 2) {
        s += txt(cx, H - mB + 35, 'dont ' + nf(d.nonDenoue, 1) + ' non dénoués', { size: 10, fill: C.s3, anchor: 'middle' });
      }
    });
    if (!narrow) {
      var xr = W - mR + 10;
      s += '<g class="fade" style="transition-delay:.75s">' +
        txt(xr, y(400) + 6, 'Variation', { size: 9, fill: C.ink3, ls: '.1em' }) +
        txt(xr, y(400) + 26, '−31,9', { size: 15, weight: 700, fill: C.ink3, mono: true }) +
        txt(xr, y(400) + 40, 'annoncé', { size: 9.5, fill: C.ink3 }) +
        txt(xr, y(400) + 68, '−15,5', { size: 18, weight: 700, fill: C.pencil, mono: true }) +
        txt(xr, y(400) + 82, 'réel', { size: 9.5, fill: C.pencil, weight: 700 }) +
        '</g>';
    }
    return s + '</svg>';
  };

  /* 3.5 — Coût / plus-values latentes ------------------------------------ */
  CHARTS.unrealized = function (W) {
    var H = 190, mL = 4, mR = 4, mT = 44;
    var pw = W - mL - mR, total = 323.8, bh = 54;
    var x = function (v) { return mL + (v / total) * pw; };
    var s = svgOpen(W, H);
    var wCost = x(106.5) - mL, wGain = pw - wCost;
    s += rrect(mL, mT, wCost - 2, bh, 3, C.seq[4],
      ' class="bar-h"' + tipAttr('Coût de revient', ['106,5 Md$', 'ce que Berkshire a effectivement payé']));
    s += rrect(mL + wCost, mT, wGain, bh, 3, C.seq[2],
      ' class="bar-h" style="transform-origin:0 50%;transition-delay:.2s"' +
      tipAttr('Plus-values latentes', ['217,3 Md$', 'gain non réalisé, donc non imposé']));
    s += txt(mL + 10, mT + bh / 2 + 5, '106,5', { size: 15, weight: 700, fill: '#ffffff', mono: true, cls: 'fade' });
    s += txt(mL + wCost + 12, mT + bh / 2 + 5, '217,3 Md$ de plus-values latentes', {
      size: 14, weight: 700, fill: C.seq[5], mono: false, cls: 'fade'
    });
    s += txt(mL, mT - 22, 'Juste valeur au 30 juin 2026 — 323,8 Md$', { size: 12, weight: 700, fill: C.ink });
    s += txt(mL, mT - 8, 'Coût de revient', { size: 10, fill: C.ink3 });
    /* Passif d'impôt, au crayon */
    var ty = mT + bh + 16;
    s += '<g class="fade" style="transition-delay:.55s">' +
      '<path d="M' + (mL + wCost) + ' ' + ty + ' L' + (mL + wCost) + ' ' + (ty + 9) +
      ' L' + (mL + wCost + x(90.2) - mL) + ' ' + (ty + 9) + ' L' + (mL + wCost + x(90.2) - mL) + ' ' + ty +
      '" fill="none" stroke="' + C.pencil + '" stroke-width="2" filter="url(#wobble-soft)"/>' +
      txt(mL + wCost + 8, ty + 26, "90,2 Md$ d'impôts, principalement différés — le prix de sortie", {
        size: 11.5, weight: 700, fill: C.pencil
      }) + '</g>';
    return s + '</svg>';
  };

  /* 3.6 — Portefeuille 13F ------------------------------------------------ */
  CHARTS.portfolio = function (W) {
    var lw = W < 520 ? 108 : 168, vw = W < 520 ? 44 : 62, rh = W < 520 ? 21 : 23;
    var mR = 4, pw = W - lw - vw - mR - 8;
    var H = DATA.pf.length * rh + 26;
    var max = DATA.pf[0].w;
    var s = svgOpen(W, H);
    s += txt(lw - 6, 12, 'Poids', { size: 9, fill: C.ink3, anchor: 'end', ls: '.08em' });
    s += txt(W - mR, 12, '%', { size: 9, fill: C.ink3, anchor: 'end', ls: '.08em' });
    DATA.pf.forEach(function (d, i) {
      var y0 = 22 + i * rh, bh = rh - 7;
      var bwid = Math.max(2, (d.w / max) * pw);
      var ci = d.w > 15 ? 5 : d.w > 8 ? 4 : d.w > 3 ? 3 : d.w > 0.8 ? 2 : 1;
      s += '<g class="pf-row" data-mv="' + d.mv + '"' +
        tipAttr(d.k, [nf(d.w, 1) + ' % du portefeuille', nf(d.v, d.v < 1 ? 3 : 1) + ' Md$', d.t + ' titres', 'T1 : ' + d.n]) + '>';
      s += '<rect x="0" y="' + (y0 - 3.5) + '" width="' + W + '" height="' + rh + '" fill="' +
           (i % 4 < 2 ? 'rgba(19,122,70,.07)' : 'transparent') + '"/>';
      s += txt(lw - 8, y0 + bh / 2 + 4, d.k, { size: W < 520 ? 10 : 11.5, fill: C.ink, anchor: 'end', weight: d.mv === 'new' ? 700 : 400 });
      s += rrect(lw, y0, bwid, bh, 3, C.seq[ci],
        ' class="bar-h" style="transition-delay:' + Math.min(i * 26, 600) + 'ms"');
      s += txt(W - mR, y0 + bh / 2 + 4, nf(d.w, 1), { size: 10.5, mono: true, fill: C.ink2, anchor: 'end', weight: 600 });
      if (d.mv === 'new') {
        s += txt(lw + bwid + 6, y0 + bh / 2 + 4, 'NOUVEAU', { size: 8.5, weight: 800, fill: C.s1, ls: '.1em', cls: 'fade' });
      } else if (d.mv === 'down' || d.mv === 'up') {
        s += txt(lw + bwid + 6, y0 + bh / 2 + 4, d.n, {
          size: 9, weight: 700, fill: d.mv === 'up' ? C.s1 : C.s3, cls: 'fade'
        });
      }
      s += '</g>';
    });
    return s + '</svg>';
  };

  /* 3.7 — Top 5 ----------------------------------------------------------- */
  CHARTS.top5 = function (W, state) {
    var d = (state && state.d) || 'q1';
    return d === 'q1' ? top5Q1(W) : top5Q2(W);
  };
  function top5Q1(W) {
    var lw = W < 480 ? 118 : 160, rh = 42, H = 5 * rh + 58;
    var pw = W - lw - 62, max = 58;
    var s = svgOpen(W, H);
    s += txt(0, 12, 'Valeur de marché au 31 mars 2026, en Md$ — classement déclaré', { size: 10.5, fill: C.ink3 });
    DATA.top5q1.forEach(function (d, i) {
      var y0 = 26 + i * rh, bh = 26;
      var bwid = Math.max(3, (d.v / max) * pw);
      s += '<g' + tipAttr(d.k, [nf(d.v, 0) + ' Md$', d.out ? 'sort du top 5 au 30 juin' : 'reste dans le top 5']) + '>';
      s += txt(lw - 10, y0 + bh / 2 + 5, d.k, { size: 13, weight: 700, fill: d.out ? C.s3 : C.ink, anchor: 'end' });
      s += rrect(lw, y0, bwid, bh, 3, d.out ? C.s3 : C.seq[4],
        ' class="bar-h" style="transition-delay:' + (i * 80) + 'ms"');
      s += txt(lw + bwid + 8, y0 + bh / 2 + 5, nf(d.v, 0), { size: 13, weight: 700, mono: true, fill: C.ink2, cls: 'fade' });
      if (d.out) {
        s += txt(lw + bwid + 34, y0 + bh / 2 + 5, '← sort', { size: 11, weight: 700, fill: C.s3, cls: 'fade' });
      }
      s += '</g>';
    });
    s += txt(0, H - 16, 'Concentration du top 5 : 61 % du portefeuille', { size: 11.5, weight: 700, fill: C.ink });
    return s + '</svg>';
  }
  function top5Q2(W) {
    var rh = 44, H = 5 * rh + 96;
    var s = svgOpen(W, H);
    s += txt(0, 12, 'Au 30 juin 2026 — le 10-Q liste les cinq lignes par ORDRE ALPHABÉTIQUE', {
      size: 10.5, weight: 700, fill: C.pencil
    });
    s += txt(0, 27, 'Aucun rang, aucun montant n’est déclaré. Les plaques ci-dessous ne sont pas un classement.', {
      size: 10, fill: C.ink3
    });
    DATA.top5q2.forEach(function (k, i) {
      var y0 = 40 + i * rh, isNew = k === 'Alphabet';
      s += '<g class="fade" style="transition-delay:' + (i * 90) + 'ms"' +
        tipAttr(k, ['Dans le top 5 au 30 juin 2026', isNew ? 'Entrée — après le placement du 4 juin' : 'Déjà présent au 31 mars']) + '>';
      s += rrect(0, y0, W, 34, 3, isNew ? 'rgba(19,122,70,.16)' : 'rgba(19,122,70,.06)');
      s += '<rect x="0" y="' + y0 + '" width="4" height="34" fill="' + (isNew ? C.s1 : C.rule) + '"/>';
      s += txt(16, y0 + 22, k, { size: 14, weight: 700, fill: C.ink });
      if (isNew) s += txt(W - 10, y0 + 22, 'ENTRÉE', { size: 9.5, weight: 800, fill: C.s1, anchor: 'end', ls: '.12em' });
      s += '</g>';
    });
    var yy = 40 + 5 * rh + 10;
    s += '<g class="fade" style="transition-delay:.55s">' +
      rrect(0, yy, W, 30, 3, 'rgba(192,39,26,.09)') +
      '<rect x="0" y="' + yy + '" width="4" height="30" fill="' + C.pencil + '"/>' +
      txt(16, yy + 20, 'Chevron', { size: 14, weight: 700, fill: C.ink3 }) +
      '<line x1="12" y1="' + (yy + 15) + '" x2="' + (16 + 68) + '" y2="' + (yy + 15) +
      '" stroke="' + C.pencil + '" stroke-width="2.4" filter="url(#wobble)"/>' +
      txt(W - 10, yy + 20, 'SORT DU TOP 5', { size: 9.5, weight: 800, fill: C.pencil, anchor: 'end', ls: '.12em' }) +
      '</g>';
    s += txt(0, H - 12, 'Concentration du top 5 : 66 % du portefeuille (contre 61 % au 31 mars)', {
      size: 11.5, weight: 700, fill: C.ink, cls: 'fade'
    });
    return s + '</svg>';
  }

  /* 3.8 — Montée d'Alphabet ---------------------------------------------- */
  CHARTS.alphabet = function (W) {
    var H = 280, mT = 34, mB = 62, mL = 40, mR = 10;
    var ph = H - mT - mB, pw = W - mL - mR, max = 30;
    var y = function (v) { return mT + ph - (v / max) * ph; };
    var s = svgOpen(W, H) + hatchOpen('h-abc', C.pencil);
    [0, 10, 20, 30].forEach(function (g) {
      s += gridline(mL, y(g), W - mR);
      s += txt(mL - 6, y(g) + 4, nf(g, 0), { size: 10, fill: C.ink3, anchor: 'end', mono: true });
    });
    s += txt(mL - 6, mT - 12, 'Md$', { size: 9, fill: C.ink3, anchor: 'end', ls: '.06em' });
    var gw = pw / DATA.alphabet.length, bw = Math.min(72, gw * 0.5);
    DATA.alphabet.forEach(function (d, i) {
      var cx = mL + gw * i + gw / 2, x = cx - bw / 2;
      s += rrect(x, y(d.v), bw, mT + ph - y(d.v), 4, d.known ? C.s1 : 'url(#h-abc)',
        ' class="bar-v" style="transition-delay:' + (i * 120) + 'ms"' + (d.known ? '' : DASHED) +
        tipAttr(d.d, [d.lab, d.sub]));
      s += txt(cx, y(d.v) - 8, d.lab, {
        size: 11, weight: 700, mono: true, anchor: 'middle', cls: 'fade',
        fill: d.known ? C.s1 : C.pencil
      });
      s += txt(cx, H - mB + 18, d.d, { size: 10.5, weight: 700, fill: C.ink, anchor: 'middle' });
      wrapLines(d.sub, W < 520 ? 18 : 26).forEach(function (ln, j) {
        s += txt(cx, H - mB + 32 + j * 12, ln, { size: 9, fill: C.ink3, anchor: 'middle' });
      });
    });
    s += txt(W - mR, mT - 12, 'Au 30 juin : dans le top 5, montant non déclaré', {
      size: 10.5, weight: 700, fill: C.pencil, anchor: 'end', cls: 'fade'
    });
    return s + '</svg>';
  };

  /* 3.9 — Plancher de trésorerie ----------------------------------------- */
  CHARTS.floor = function (W) {
    var H = 152, mL = 4, mR = 4, mT = 56, bh = 46;
    var pw = W - mL - mR, max = 364.7;
    var s = svgOpen(W, H);
    s += rrect(mL, mT, pw, bh, 3, C.seq[3], ' class="bar-h"' +
      tipAttr('Trésorerie nette', ['364,7 Md$ au 30 juin 2026']));
    var xf = mL + (30 / max) * pw;
    s += rrect(mL, mT, Math.max(3, xf - mL), bh, 3, C.pencil, ' class="bar-h" style="transition-delay:.35s"' +
      tipAttr('Plancher déclaré', ['30 Md$', 'Berkshire ne rachètera pas en deçà']));
    s += '<line x1="' + xf + '" y1="' + (mT - 12) + '" x2="' + xf + '" y2="' + (mT + bh + 12) +
      '" stroke="' + C.pencil + '" stroke-width="2" class="fade" style="transition-delay:.5s" filter="url(#wobble-soft)"/>';
    s += txt(mL, mT - 34, 'Trésorerie nette au 30 juin — 364,7 Md$', { size: 12, weight: 700, fill: C.ink });
    s += txt(Math.max(xf + 8, 40), mT - 12, 'plancher 30 Md$', { size: 10.5, weight: 700, fill: C.pencil, cls: 'fade' });
    s += txt(mL + pw, mT + bh + 26, 'marge de manœuvre théorique : 334,7 Md$', {
      size: 12, weight: 700, fill: C.s1, anchor: 'end', cls: 'fade'
    });
    return s + '</svg>';
  };

  /* 3.10 — Variation du coût par bloc ------------------------------------ */
  CHARTS.blocks = function (W) {
    var narrow = W < 520;
    var lw = narrow ? 0 : 190, rh = narrow ? 78 : 56;
    var H = DATA.blocks.length * rh + (narrow ? 62 : 44);
    /* Zéro décalé vers la gauche : une seule barre est négative, et il faut
       réserver la place du libellé chiffré à droite de la plus longue. */
    var zeroX = lw + (W - lw) * 0.11;
    var scale = Math.max(1, (W - zeroX - 62)) / 21.5;
    var s = svgOpen(W, H) + hatchDef('h-blk', C.s3);
    s += '<line x1="' + zeroX + '" y1="16" x2="' + zeroX + '" y2="' + (H - 26) +
      '" stroke="' + C.ink + '" stroke-width="1.5" shape-rendering="crispEdges"/>';
    s += txt(zeroX, H - 12, '0', { size: 10, fill: C.ink3, anchor: 'middle', mono: true });
    s += txt(zeroX + 6, 12, 'Md$', { size: 9, fill: C.ink3, ls: '.06em' });
    DATA.blocks.forEach(function (d, i) {
      var y0 = 24 + i * rh + (narrow ? 22 : 0), bh = 26;
      var wpx = Math.abs(d.d) * scale, pos = d.d >= 0;
      if (lw) {
        s += txt(lw - 10, y0 + bh / 2 + 4, d.k, { size: 11.5, fill: C.ink, anchor: 'end' });
      } else {
        s += txt(0, y0 - 8, d.k, { size: 11, weight: 700, fill: C.ink });
      }
      s += rrect(pos ? zeroX : zeroX - wpx, y0, wpx, bh, 3, pos ? C.s1 : 'url(#h-blk)',
        ' class="' + (pos ? 'bar-h' : 'bar-h-r') + '" style="transition-delay:' + (i * 110) + 'ms"' +
        tipAttr(d.k, ['Variation du coût de revient au T2', sgn(d.d, 2) + ' Md$']));
      s += txt(pos ? zeroX + wpx + 8 : zeroX - wpx - 8, y0 + bh / 2 + 5, sgn(d.d, 2), {
        size: 13, weight: 700, mono: true, cls: 'fade',
        fill: pos ? C.s1 : C.s3, anchor: pos ? 'start' : 'end'
      });
    });
    return s + '</svg>';
  };

  /* 3.11 — Ventilation du capital ---------------------------------------- */
  CHARTS.deploy = function (W) {
    var total = 26.6, bh = 56, mT = 46, H = mT + bh + 116;
    var s = svgOpen(W, H) + hatchOpen('h-dep', C.pencil);
    var x = 0;
    s += txt(0, 16, 'Capital engagé au T2 2026 — 26,6 Md$ identifiés', { size: 12, weight: 700, fill: C.ink });
    s += txt(0, 31, 'La barre hachurée est la seule inconnue du dossier.', { size: 10.5, fill: C.ink3 });
    DATA.deploy.forEach(function (d, i) {
      var wpx = (d.v / total) * W - 2;
      s += rrect(x, mT, wpx, bh, 3, d.known ? d.c : 'url(#h-dep)',
        ' class="bar-h" style="transform-origin:0 50%;transition-delay:' + (i * 130) + 'ms"' + (d.known ? '' : DASHED) +
        tipAttr(d.k, [nf(d.v, 1) + ' Md$', nf(d.v / total * 100, 0) + ' % du capital engagé',
          d.known ? 'destination connue' : 'destination non déclarée']));
      if (wpx > 46) {
        s += txt(x + wpx / 2, mT + bh / 2 + 6, nf(d.v, 1), {
          size: 16, weight: 700, mono: true, anchor: 'middle', cls: 'fade',
          fill: d.known ? '#ffffff' : C.ink
        });
      }
      x += wpx + 2;
    });
    /* Légende dépliée sous la barre */
    var ly = mT + bh + 22;
    DATA.deploy.forEach(function (d, i) {
      var yy = ly + i * 20;
      s += '<rect x="0" y="' + (yy - 9) + '" width="11" height="11" rx="2" fill="' +
        (d.known ? d.c : 'url(#h-dep)') + '" class="fade" style="transition-delay:' + (0.5 + i * 0.06) + 's"/>';
      s += txt(18, yy, d.k, { size: 11, fill: C.ink2, cls: 'fade' });
      s += txt(W, yy, nf(d.v, 1) + ' Md$', { size: 11, weight: 700, mono: true, fill: C.ink, anchor: 'end', cls: 'fade' });
    });
    return s + '</svg>';
  };

  /* 3.12 — Berkshire vs S&P 500 ------------------------------------------ */
  CHARTS.perf = function (W) {
    var narrow = W < 560;
    var H = narrow ? 400 : 320, mT = 30, mB = narrow ? 76 : 60, mL = 34, mR = 6;
    var ph = H - mT - mB, pw = W - mL - mR, max = 22;
    var y = function (v) { return mT + ph - (v / max) * ph; };
    var s = svgOpen(W, H);
    [0, 5, 10, 15, 20].forEach(function (g) {
      s += gridline(mL, y(g), W - mR);
      s += txt(mL - 6, y(g) + 4, nf(g, 0), { size: 10, fill: C.ink3, anchor: 'end', mono: true });
    });
    s += txt(mL - 6, mT - 12, '%/an', { size: 9, fill: C.ink3, anchor: 'end', ls: '.06em' });
    var gw = pw / 4, bw = Math.min(38, gw * 0.3), inner = 4;
    DATA.perf.forEach(function (d, i) {
      var cx = mL + gw * i + gw / 2;
      var xb = cx - bw - inner / 2, xs = cx + inner / 2;
      var beats = d.brk >= d.sp;
      s += rrect(xb, y(d.brk), bw, mT + ph - y(d.brk), 3, C.s1,
        ' class="bar-v" style="transition-delay:' + (i * 90) + 'ms"' +
        tipAttr('Berkshire — ' + d.k + ', ' + d.p, [nf(d.brk, 1) + ' %/an']));
      s += rrect(xs, y(d.sp), bw, mT + ph - y(d.sp), 3, C.s2,
        ' class="bar-v" style="transition-delay:' + (i * 90 + 60) + 'ms"' +
        tipAttr('S&P 500 TR — ' + d.k + ', ' + d.p, [nf(d.sp, 1) + ' %/an']));
      s += txt(xb + bw / 2, y(d.brk) - 6, nf(d.brk, 1), { size: 10.5, weight: 700, mono: true, fill: C.s1, anchor: 'middle', cls: 'fade' });
      s += txt(xs + bw / 2, y(d.sp) - 6, nf(d.sp, 1), { size: 10.5, weight: 700, mono: true, fill: C.s2, anchor: 'middle', cls: 'fade' });
      wrapLines(d.k, narrow ? 13 : 18).forEach(function (ln, j) {
        s += txt(cx, H - mB + 16 + j * 12, ln, { size: 9.5, fill: C.ink2, anchor: 'middle' });
      });
      s += txt(cx, H - mB + (narrow ? 52 : 42), narrow ? d.ps : d.p, {
        size: narrow ? 9.5 : 10, weight: 700, fill: C.ink, anchor: 'middle'
      });
      s += txt(cx, H - mB + (narrow ? 66 : 56), beats ? 'bat l’indice' : 'sous l’indice', {
        size: narrow ? 8.5 : 9.5, weight: 700, fill: beats ? C.s1 : C.s3, anchor: 'middle'
      });
    });
    return s + '</svg>';
  };

  function wrapLines(str, max) {
    var words = String(str).split(' '), out = [], cur = '';
    words.forEach(function (w) {
      if ((cur + ' ' + w).trim().length > max && cur) { out.push(cur); cur = w; }
      else { cur = (cur ? cur + ' ' : '') + w; }
    });
    if (cur) out.push(cur);
    return out;
  }

  var CHART_LEGENDS = {
    flux:   [{ k: 'Achats', c: C.s1 }, { k: 'Ventes', c: C.s3, hatch: true }],
    cash:   [{ k: 'Trésorerie nette réelle', c: C.s1 }, { k: 'Bons du Trésor achetés, non payés', c: C.s3, hatch: true }],
    unrealized: [{ k: 'Coût de revient', c: C.seq[4] }, { k: 'Plus-values latentes', c: C.seq[2] }],
    alphabet: [{ k: 'Montant déclaré', c: C.s1 }, { k: 'Dérivé ou non déclaré', c: C.pencil, open: true }],
    blocks: [{ k: 'Capital engagé', c: C.s1 }, { k: 'Capital retiré', c: C.s3, hatch: true }],
    perf:   [{ k: 'Berkshire Hathaway', c: C.s1 }, { k: 'S&P 500 (rendement total)', c: C.s2 }],
    streak: [{ k: 'Trimestre vendeur net', c: C.s3, hatch: true }, { k: 'Trimestre acheteur net', c: C.s1 }],
    floor:  [{ k: 'Trésorerie disponible', c: C.seq[3] }, { k: 'Plancher de 30 Md$', c: C.pencil }]
  };

  /* ---------------------------------------------------------------------
     4. MONTAGE DES FIGURES
     --------------------------------------------------------------------- */
  var mounted = [];

  function mountCharts() {
    $$('[data-chart]').forEach(function (fig) {
      var name = fig.getAttribute('data-chart');
      if (!CHARTS[name]) return;
      var host = $('.chart', fig);
      if (!host) return;
      if (CHART_LEGENDS[name]) {
        host.insertAdjacentHTML('beforebegin', legend(CHART_LEGENDS[name]));
      }
      var rec = { fig: fig, host: host, name: name, state: {}, drawn: false };
      mounted.push(rec);
      draw(rec);
    });
    window.addEventListener('resize', debounce(function () {
      mounted.forEach(function (r) { draw(r, true); });
    }, 180));
  }

  function draw(rec, keepDrawn) {
    var w = Math.max(240, Math.round(rec.host.clientWidth || rec.host.parentNode.clientWidth || 320));
    rec.host.innerHTML = CHARTS[rec.name](w, rec.state);
    var svg = rec.host.querySelector('svg');
    if (!svg) return;
    svg.removeAttribute('width'); svg.removeAttribute('height');
    svg.setAttribute('aria-label', (rec.fig.querySelector('.fig__title') || {}).textContent || rec.name);
    bindTips(svg);
    if (REDUCED || (keepDrawn && rec.drawn)) { svg.classList.add('is-drawn'); rec.drawn = true; }
    else if (isNear(rec.fig)) { requestAnimationFrame(function () { svg.classList.add('is-drawn'); rec.drawn = true; }); }
  }

  function isNear(el) {
    var r = el.getBoundingClientRect();
    return r.top < window.innerHeight * 0.92 && r.bottom > 0;
  }

  /* Infobulles ----------------------------------------------------------- */
  var tip = $('#tip');
  function showTip(el, ev) {
    var raw = el.getAttribute('data-tip'); if (!raw) return;
    var parts = raw.split('||');
    tip.innerHTML = '<span class="tip__k">' + esc(parts[0]) + '</span>' +
      parts[1].split('|').map(function (l, i) { return i === 0 ? '<b>' + esc(l) + '</b>' : esc(l); }).join('<br>');
    tip.classList.add('is-on');
    moveTip(ev, el);
  }
  function moveTip(ev, el) {
    var x, yv;
    if (ev && ev.clientX != null) { x = ev.clientX; yv = ev.clientY; }
    else { var r = el.getBoundingClientRect(); x = r.left + r.width / 2; yv = r.top; }
    var tw = tip.offsetWidth, th = tip.offsetHeight;
    tip.style.left = Math.max(8, Math.min(x + 14, window.innerWidth - tw - 8)) + 'px';
    tip.style.top = Math.max(8, yv - th - 12) + 'px';
  }
  function hideTip() { tip.classList.remove('is-on'); }
  function bindTips(root) {
    $$('[data-tip]', root).forEach(function (el) {
      el.addEventListener('mouseenter', function (e) { showTip(el, e); });
      el.addEventListener('mousemove', function (e) { moveTip(e, el); });
      el.addEventListener('mouseleave', hideTip);
      el.addEventListener('focus', function () { showTip(el, null); });
      el.addEventListener('blur', hideTip);
    });
  }

  /* ---------------------------------------------------------------------
     5. TABLEAU DE REPLI DU PORTEFEUILLE
     --------------------------------------------------------------------- */
  function buildPfTable() {
    var host = $('[data-pf-table]'); if (!host) return;
    var rows = DATA.pf.map(function (d) {
      return '<tr><th scope="row">' + esc(d.k) + '</th><td>' + nf(d.w, 1) + ' %</td><td>' +
        nf(d.v, d.v < 1 ? 3 : 1) + '</td><td>' + esc(d.t) + '</td><td class="' +
        (d.mv === 'new' ? 'flag' : d.mv === 'up' ? 'pos' : d.mv === 'down' ? 'neg' : '') + '">' +
        esc(d.n) + '</td></tr>';
    }).join('');
    host.innerHTML = '<div class="tablewrap"><table class="ledger">' +
      '<caption>13F au 31 mars 2026 — 28 lignes, 263,1 Md$</caption>' +
      '<thead><tr><th scope="col">Ligne</th><th scope="col">Poids</th><th scope="col">Md$</th>' +
      '<th scope="col">Titres</th><th scope="col">Mouvement T1</th></tr></thead><tbody>' +
      rows + '</tbody></table></div>';
  }

  /* ---------------------------------------------------------------------
     6. INTERACTIONS
     --------------------------------------------------------------------- */
  function initFilters() {
    var box = $('[data-pf-filter]'); if (!box) return;
    box.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      $$('button', box).forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
      var f = b.getAttribute('data-f');
      $$('.pf-row').forEach(function (g) {
        g.classList.toggle('is-dim', f !== 'all' && g.getAttribute('data-mv') !== f);
      });
    });
  }

  function initTop5() {
    var box = $('[data-top5]'); if (!box) return;
    var rec = null;
    box.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      $$('button', box).forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
      rec = rec || mounted.filter(function (r) { return r.name === 'top5'; })[0];
      if (!rec) return;
      rec.state.d = b.getAttribute('data-d');
      rec.drawn = false;
      draw(rec);
      var svg = rec.host.querySelector('svg');
      if (svg) requestAnimationFrame(function () { svg.classList.add('is-drawn'); });
    });
  }

  function initRevealBlocks() {
    $$('[data-reveal-block]').forEach(function (b) {
      var t = $('[data-reveal-trigger]', b); if (!t) return;
      t.addEventListener('click', function () {
        b.classList.add('is-open');
        t.style.display = 'none';
        mounted.filter(function (r) { return b.contains(r.fig); }).forEach(function (r) {
          draw(r);
          var svg = r.host.querySelector('svg');
          if (svg) requestAnimationFrame(function () { svg.classList.add('is-drawn'); });
        });
      });
    });
  }

  function initTraps() {
    $$('[data-trap]').forEach(function (t) {
      t.addEventListener('click', function () { t.classList.toggle('is-open'); });
    });
  }

  function initChecklist() {
    var l = $('[data-checklist]'); if (!l) return;
    l.addEventListener('click', function (e) {
      var li = e.target.closest('li'); if (!li) return;
      li.classList.toggle('is-done');
    });
    $$('li', l).forEach(function (li) {
      li.setAttribute('tabindex', '0');
      li.setAttribute('role', 'checkbox');
      li.setAttribute('aria-checked', 'false');
      li.addEventListener('keydown', function (e) {
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); li.classList.toggle('is-done'); }
        li.setAttribute('aria-checked', String(li.classList.contains('is-done')));
      });
      li.addEventListener('click', function () {
        li.setAttribute('aria-checked', String(li.classList.contains('is-done')));
      });
    });
  }

  function initGlossary() {
    var pop = $('#glpop'), open = null;
    function close() { pop.classList.remove('is-on'); open = null; }
    $$('.gl').forEach(function (b) {
      b.setAttribute('type', 'button');
      function show() {
        var g = GLOSSARY[b.getAttribute('data-gl')]; if (!g) return;
        pop.innerHTML = '<b>' + esc(g[0]) + '</b>' + esc(g[1]);
        pop.classList.add('is-on');
        var r = b.getBoundingClientRect();
        var w = pop.offsetWidth, h = pop.offsetHeight;
        var left = Math.max(10, Math.min(r.left, window.innerWidth - w - 10));
        var top = r.top - h - 10;
        if (top < 10) top = Math.min(r.bottom + 10, window.innerHeight - h - 10);
        pop.style.left = left + 'px'; pop.style.top = top + 'px';
        open = b;
      }
      b.addEventListener('click', function (e) { e.stopPropagation(); open === b ? close() : show(); });
      b.addEventListener('mouseenter', show);
      b.addEventListener('mouseleave', function () { if (open !== b) close(); });
      b.addEventListener('focus', show);
    });
    document.addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    window.addEventListener('scroll', function () { if (open) close(); }, { passive: true });
  }

  /* ---------------------------------------------------------------------
     7. RÉVÉLATION PROGRESSIVE, COMPTEURS, RAIL, SOMMAIRE
     --------------------------------------------------------------------- */
  function initReveal() {
    var els = $$('.reveal');
    if (!('IntersectionObserver' in window) || REDUCED) {
      els.forEach(function (e) { e.classList.add('is-in'); });
      mounted.forEach(function (r) {
        var s = r.host.querySelector('svg'); if (s) s.classList.add('is-drawn');
      });
      $$('[data-count]').forEach(function (e) { e.classList.add('counted'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0 });
    els.forEach(function (e) { io.observe(e); });

    /* Les graphiques se dessinent quand leur figure entre dans le champ */
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var rec = mounted.filter(function (r) { return r.fig === en.target; })[0];
        if (rec) {
          var svg = rec.host.querySelector('svg');
          if (svg) { svg.classList.add('is-drawn'); rec.drawn = true; }
        }
        io2.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0 });
    mounted.forEach(function (r) { io2.observe(r.fig); });

    /* Compteurs */
    var io3 = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        countUp(en.target); io3.unobserve(en.target);
      });
    }, { threshold: 0.25 });
    $$('[data-count]').forEach(function (e) { io3.observe(e); });
  }

  function countUp(el) {
    var to = parseFloat(el.getAttribute('data-count'));
    var d = parseInt(el.getAttribute('data-dec') || '0', 10);
    var pre = el.getAttribute('data-prefix') || '';
    var suf = el.getAttribute('data-suffix') || '';
    if (isNaN(to)) return;
    var start = null, dur = 1100;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + nf(to * e, d) + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function initRail() {
    var rail = $('#rail'); if (!rail) return;
    function upd() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      rail.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    }
    window.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
    upd();
  }

  /* Les onglets sont l'unique source de vérité : le panneau mobile et les
     renvois « feuillet suivant » en sont dérivés, jamais recopiés. */
  function sections() {
    return $$('#tabs a').map(function (a) {
      return {
        id: a.getAttribute('href').slice(1),
        num: ($('.t-num', a) || {}).textContent || '',
        titre: a.textContent.replace(($('.t-num', a) || {}).textContent || '', '').trim(),
        el: a
      };
    });
  }

  function initTabs() {
    var tabs = $('#tabs'); if (!tabs || !('IntersectionObserver' in window)) return;
    var secs = sections(), here = $('#navHere');
    var map = {};
    secs.forEach(function (s) { map[s.id] = s; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var s = map[en.target.id]; if (!s) return;
        secs.forEach(function (o) { o.el.removeAttribute('aria-current'); });
        s.el.setAttribute('aria-current', 'true');
        if (here) here.textContent = s.num + ' · ' + s.titre;
        $$('#navList a').forEach(function (a) {
          a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + s.id));
        });
        var r = s.el.getBoundingClientRect(), rr = tabs.getBoundingClientRect();
        if (r.left < rr.left + 8 || r.right > rr.right - 8) {
          tabs.scrollTo({ left: s.el.offsetLeft - 24, behavior: REDUCED ? 'auto' : 'smooth' });
        }
      });
    }, { rootMargin: '-18% 0px -62% 0px' });
    secs.forEach(function (s) {
      var sec = document.getElementById(s.id); if (sec) io.observe(sec);
    });
  }

  /* Panneau de sommaire pour petit écran ---------------------------------- */
  function initNav() {
    var bar = $('#navbar'), panel = $('#navPanel'), list = $('#navList');
    var open = $('#navOpen'), close = $('#navClose');
    if (!bar || !panel || !list) return;
    bar.removeAttribute('hidden');

    list.innerHTML = sections().map(function (s) {
      return '<a href="#' + s.id + '"><span class="n">' + esc(s.num) + '</span>' + esc(s.titre) + '</a>';
    }).join('') + '<a href="#contact"><span class="n">✉</span>Nous écrire</a>';

    var lastFocus = null;
    function show() {
      lastFocus = document.activeElement;
      panel.removeAttribute('hidden');
      open.setAttribute('aria-expanded', 'true');
      document.body.classList.add('nav-open');
      close.focus();
    }
    function hide() {
      panel.setAttribute('hidden', '');
      open.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    open.addEventListener('click', show);
    close.addEventListener('click', hide);
    panel.addEventListener('click', function (e) { if (e.target === panel) hide(); });
    list.addEventListener('click', function (e) { if (e.target.closest('a')) hide(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hasAttribute('hidden')) hide();
    });
  }

  /* Renvoi vers le feuillet suivant, au pied de chaque feuillet ------------ */
  function initNext() {
    var secs = sections();
    secs.forEach(function (s, i) {
      var sec = document.getElementById(s.id); if (!sec) return;
      var next = secs[i + 1];
      var href = next ? '#' + next.id : '#contact';
      var num = next ? next.num : '✉';
      var titre = next ? next.titre : 'Une question ? Écrivez-nous';
      var lab = next ? 'Feuillet suivant' : 'Pour finir';
      var a = document.createElement('a');
      a.className = 'sheet__next';
      a.href = href;
      a.innerHTML = '<span><span class="lab">' + lab + '</span><b>' +
        (next ? esc(num) + ' — ' : '') + esc(titre) + '</b></span>' +
        '<span class="arrow" aria-hidden="true">→</span>';
      sec.appendChild(a);
    });
  }

  /* Retour au sommaire ---------------------------------------------------- */
  function initTop() {
    var btn = $('#totop'); if (!btn) return;
    function upd() {
      var show = window.scrollY > window.innerHeight * 1.5;
      if (show) btn.removeAttribute('hidden'); else btn.setAttribute('hidden', '');
    }
    window.addEventListener('scroll', upd, { passive: true });
    btn.addEventListener('click', function () {
      var t = document.getElementById('sommaire') || document.body;
      t.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
    });
    upd();
  }

  /* ---------------------------------------------------------------------
     8. DÉMARRAGE
     --------------------------------------------------------------------- */
  function boot() {
    mountCharts();
    buildPfTable();
    initFilters();
    initTop5();
    initRevealBlocks();
    initTraps();
    initChecklist();
    initGlossary();
    initNext();
    initNav();
    initReveal();
    initRail();
    initTabs();
    initTop();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
