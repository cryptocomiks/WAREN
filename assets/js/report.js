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

  var GLOSSARY = {
    '13F': ['Formulaire 13F', "Déclaration trimestrielle obligatoire pour tout gérant américain détenant plus de 100 M$ de titres cotés aux États-Unis, à déposer dans les 45 jours suivant la clôture du trimestre. Il donne les positions ligne par ligne — mais uniquement les titres américains, et sans jamais indiquer la date ni le prix des transactions."],
    '10Q': ['Formulaire 10-Q', "Rapport financier trimestriel déposé auprès de la SEC. Contrairement au 13F, il fournit bilan, compte de résultat et flux de trésorerie : on y lit donc les montants agrégés d'achats et de ventes de titres, mais jamais le nom des sociétés concernées."],
    '424B5': ['Prospectus 424B5', "Supplément de prospectus déposé lors d'une émission de titres. C'est le document qui donne les termes exacts d'un placement : nombre d'actions, prix unitaire, identité de l'agent placeur."],
    '4a2': ['Section 4(a)(2)', "Exemption d'enregistrement du Securities Act de 1933 réservée aux placements privés. Elle permet de vendre des titres à un investisseur qualifié sans passer par une offre publique — d'où la rapidité d'exécution de l'opération Alphabet–Berkshire."],
    'droits': ["Droits d'enregistrement", "Engagement pris par l'émetteur de faire enregistrer les titres auprès de la SEC, ce qui les rend librement négociables. Sans cet engagement, Berkshire resterait porteur de titres difficilement cessibles."],
    'mee': ['Mise en équivalence', "Méthode comptable appliquée lorsqu'on détient une influence notable — en général au-delà de 20 % du capital — sans contrôler la société. La participation figure au bilan à sa valeur comptable ajustée de la quote-part de résultat, et non à sa valeur de marché."],
    'cout': ["Coût d'opportunité", "Ce que rapporterait le meilleur emploi alternatif du même capital. Garder 325 Md$ en bons du Trésor ne coûte presque rien tant que les taux courts sont élevés ; cela devient une perte relative mesurable dès qu'ils baissent."]
  };

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

  function initTabs() {
    var tabs = $('#tabs'); if (!tabs || !('IntersectionObserver' in window)) return;
    var links = $$('a', tabs);
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute('aria-current'); });
        var a = map[en.target.id];
        if (a) {
          a.setAttribute('aria-current', 'true');
          var r = a.getBoundingClientRect(), rr = tabs.getBoundingClientRect();
          if (r.left < rr.left + 8 || r.right > rr.right - 8) {
            tabs.scrollTo({ left: a.offsetLeft - 24, behavior: REDUCED ? 'auto' : 'smooth' });
          }
        }
      });
    }, { rootMargin: '-18% 0px -62% 0px' });
    Object.keys(map).forEach(function (id) {
      var sec = document.getElementById(id); if (sec) io.observe(sec);
    });
  }

  /* ---------------------------------------------------------------------
     8. QUIZ
     --------------------------------------------------------------------- */
  var QUIZ = [
    {
      q: "Combien de trimestres consécutifs de ventes nettes ont précédé le retournement du T2 2026 ?",
      o: ["6 trimestres", "10 trimestres", "14 trimestres", "20 trimestres"],
      a: 2, ref: "Feuillet 01",
      e: "Quatorze — soit trois ans et demi de retrait continu du marché actions. C'est ce qui rend le T2 2026 remarquable : ce n'est pas un achat isolé, c'est une rupture de séquence."
    },
    {
      q: "Selon ce dossier, quel est le fait le plus révélateur du deuxième trimestre ?",
      o: ["Les 23,5 Md$ d'achats", "L'effondrement des ventes, de 24,1 à 3,7 Md$", "La baisse de la trésorerie", "Le résultat net de 25,7 Md$"],
      a: 1, ref: "Feuillets 01 et 08",
      e: "Un gérant qui achète peut simplement placer du cash. Un gérant qui divise ses ventes par 6,5 change de posture. Le grand nettoyage — les 16 sorties — était un événement du T1, pas une politique continue."
    },
    {
      q: "La presse annonce une baisse de trésorerie de 31,9 Md$. Quel est le chiffre à périmètre comparable ?",
      o: ["Environ 15,5 Md$", "Environ 25 Md$", "Exactement 31,9 Md$", "Environ 40 Md$"],
      a: 0, ref: "Feuillet 02.3",
      e: "380,2 → 364,7 Md$, soit −15,5 Md$. La ponction réelle est deux fois plus faible que le chiffre repris partout."
    },
    {
      q: "Pourquoi le « record historique » de 397,4 Md$ au 31 mars était-il gonflé ?",
      o: ["Il incluait la trésorerie de BNSF", "Il incluait 17,2 Md$ de bons du Trésor achetés mais pas encore payés", "Il était exprimé avant impôts", "Il incluait les warrants Occidental"],
      a: 1, ref: "Feuillet 02.3",
      e: "Les notes du bilan sont explicites : ces montants figurent aussi au passif et ont été payés peu après la clôture. Un pur artefact de règlement-livraison — que CNBC neutralise d'ailleurs de la même façon sur le T4 2025."
    },
    {
      q: "Combien Berkshire a-t-il consacré aux rachats de ses propres actions sur l'ensemble de l'année 2025 ?",
      o: ["Environ 4,5 Md$", "Environ 2 Md$", "235 M$", "Zéro"],
      a: 3, ref: "Feuillet 02.2",
      e: "Zéro sur toute l'année 2025, puis 235 M$ au T1 et 4 527 M$ au T2. Ce n'est pas une accélération : c'est un robinet resté fermé un an, puis rouvert."
    },
    {
      q: "Quelle décote Berkshire a-t-il obtenue sur le placement privé Alphabet du 4 juin ?",
      o: ["Aucune : prix de marché", "6,5 %", "15 %", "25 %"],
      a: 1, ref: "Feuillet 04.1",
      e: "351,81 $ en classe A et 348,20 $ en classe C, contre des clôtures de la veille à 376,37 $ et 372,58 $. Sur 10 Md$, cette décote vaut environ 650 M$ à la signature."
    },
    {
      q: "Que se passe-t-il dans le top 5 entre le 31 mars et le 30 juin 2026 ?",
      o: ["Apple sort, Alphabet entre", "Chevron sort, Alphabet entre", "Rien ne change", "Coca-Cola sort, Chevron entre"],
      a: 1, ref: "Feuillet 03.2",
      e: "Chevron sort, Alphabet entre, et la concentration passe de 61 % à 66 %. Attention : le 10-Q liste les cinq lignes par ordre alphabétique — on sait qu'Alphabet est dans le top 5, pas à quel rang."
    },
    {
      q: "Quelle contrainte explique le mieux qu'Abel ne vende ni Apple ni Coca-Cola ?",
      o: ["Une clause statutaire de Berkshire", "217,3 Md$ de plus-values latentes, donc une facture fiscale massive", "Un engagement pris envers Buffett", "Le manque de liquidité sur ces titres"],
      a: 1, ref: "Feuillet 06.2",
      e: "Vendre déclenche 21 % d'impôt fédéral sur des gains accumulés depuis des décennies. Abel liquide les positions récentes — Visa, Mastercard, Amazon — à faible base de coût. Le noyau historique est en partie prisonnier de sa propre performance."
    },
    {
      q: "Laquelle de ces deux acquisitions a pesé sur la trésorerie du T2 2026 ?",
      o: ["OxyChem seulement", "Taylor Morrison seulement", "Les deux", "Aucune des deux"],
      a: 3, ref: "Feuillet 08, piège 2",
      e: "OxyChem a été clôturé le 2 janvier 2026 — donc au T1. Taylor Morrison le 24 juillet 2026 — donc au T3. Ni l'une ni l'autre n'a touché la trésorerie du deuxième trimestre, contrairement à ce qu'écrivent plusieurs médias."
    },
    {
      q: "Que faut-il conclure de la présence de Macy's, Jefferies ou NVR dans le portefeuille ?",
      o: ["Qu'Abel parie sur le retail et la finance", "Que ces lignes relèvent probablement de Ted Weschler, pas d'Abel", "Que ce sont les prochaines grosses positions", "Qu'il s'agit d'erreurs de déclaration"],
      a: 1, ref: "Feuillet 05.4",
      e: "Abel a confirmé que Weschler continue de gérer une partie du portefeuille. Les très petites lignes relèvent historiquement de son périmètre et de celui de Todd Combs. Sont attribuables à Abel avec certitude : Alphabet, la coupe dans Chevron, les 16 sorties, OxyChem, Taylor Morrison et les rachats."
    },
    {
      q: "Quel plancher de trésorerie la politique de rachat inscrit-elle noir sur blanc ?",
      o: ["30 Md$", "100 Md$", "150 Md$", "Aucun plancher n'est déclaré"],
      a: 0, ref: "Feuillet 05.2",
      e: "30 Md$ — soit, avec 364,7 Md$ au 30 juin, une marge de manœuvre théorique de plus de 330 Md$. Le même texte précise que le directeur général décide « après consultation du président du conseil » : Buffett garde un droit de regard codifié."
    },
    {
      q: "Sur la dernière décennie, la valeur comptable par action de Berkshire progresse de 12,4 %/an. Et le S&P 500 ?",
      o: ["8,2 %/an — Berkshire domine", "10,5 %/an — Berkshire domine", "14,8 %/an — Berkshire sous-performe", "12,4 %/an — égalité parfaite"],
      a: 2, ref: "Feuillet 07.2",
      e: "C'est le vrai cadre du mandat d'Abel : il n'hérite pas d'une machine invaincue, mais d'une machine qui a cessé de battre l'indice depuis dix ans. Le déploiement de capital n'est pas un caprice, c'est une nécessité."
    }
  ];

  function initQuiz() {
    var list = $('#qlist'); if (!list) return;
    var score = 0, done = 0;
    list.innerHTML = QUIZ.map(function (q, i) {
      return '<article class="q" id="q' + i + '">' +
        '<div class="q__head"><span class="q__n">' + (i + 1) + '</span><p class="q__text">' + esc(q.q) + '</p></div>' +
        '<ul class="q__opts">' + q.o.map(function (o, j) {
          return '<li><button class="opt" type="button" data-q="' + i + '" data-o="' + j + '">' +
            '<span class="opt__k">' + 'ABCD'[j] + '</span><span>' + esc(o) + '</span></button></li>';
        }).join('') + '</ul>' +
        '<div class="q__fb"><div class="q__fb-in"><span class="verdict"></span>' +
        '<span class="q__exp">' + esc(q.e) + '</span>' +
        '<p class="q__ref">Référence — ' + esc(q.ref) + '</p></div></div>' +
        '</article>';
    }).join('');

    list.addEventListener('click', function (e) {
      var btn = e.target.closest('.opt'); if (!btn) return;
      var qi = +btn.getAttribute('data-q'), oi = +btn.getAttribute('data-o');
      var card = document.getElementById('q' + qi);
      if (card.classList.contains('is-answered')) return;

      var right = QUIZ[qi].a;
      var ok = oi === right;
      if (ok) score++;
      done++;

      $$('.opt', card).forEach(function (b) {
        var j = +b.getAttribute('data-o');
        b.disabled = true;
        if (j === right) b.classList.add('is-right');
        else if (j === oi) b.classList.add('is-wrong');
      });
      var v = $('.verdict', card);
      v.textContent = ok ? '✓ Exact.' : '✗ Non — la bonne réponse est ' + 'ABCD'[right] + '.';
      v.classList.toggle('ok', ok);
      card.classList.add('is-answered');

      $('#qscore').textContent = score + ' / ' + QUIZ.length;
      $('#qbar').style.width = (done / QUIZ.length * 100) + '%';
      if (done === QUIZ.length) finish(score);
    });
  }

  function finish(score) {
    var n = QUIZ.length, pct = score / n;
    var g;
    if (pct === 1)        g = ['Mention d’honneur', 'Sans faute. Vous pouvez dépouiller le 13F ce soir sans filet — et corriger les articles qui sortiront demain.'];
    else if (pct >= 0.83) g = ['Très bien', 'Vous maîtrisez le dossier, pièges compris. Relisez le feuillet correspondant à votre erreur et c’est réglé.'];
    else if (pct >= 0.66) g = ['Bien', 'La structure est acquise. Ce sont les détails de méthode — trésorerie ajustée, attribution des lignes — qui vous ont coûté des points.'];
    else if (pct >= 0.5)  g = ['Passable', 'Vous avez retenu le récit, pas encore les chiffres. Reprenez les feuillets 02 et 06 : tout s’y joue.'];
    else if (pct >= 0.33) g = ['Insuffisant', 'Le dossier mérite une seconde lecture. Commencez par les quatre pièges du feuillet 08 : ils font la moitié des questions.'];
    else                  g = ['Ajourné', 'Pas de panique. Reprenez le dossier depuis le feuillet 01 — il est fait pour être lu deux fois.'];

    var box = $('#qresult');
    box.innerHTML =
      '<p class="result__grade">' + score + '<span style="font-size:.45em;color:var(--ink-3)"> / ' + n + '</span></p>' +
      '<p class="result__label">' + esc(g[0]) + '</p>' +
      '<p class="result__body">' + esc(g[1]) + '</p>' +
      '<span class="stamp stamp--big' + (pct >= 0.66 ? ' stamp--ok' : '') + '">' +
      (pct >= 0.66 ? 'Dossier maîtrisé' : 'À reprendre') + '</span>' +
      '<p style="margin-top:1.4rem"><button class="btn btn--pencil" type="button" id="qagain">Recommencer l’épreuve</button></p>';
    box.classList.add('is-on');
    box.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'nearest' });
    $('#qagain').addEventListener('click', function () {
      box.classList.remove('is-on');
      $('#qscore').textContent = '0 / ' + n;
      $('#qbar').style.width = '0%';
      initQuiz();
      document.getElementById('quiz').scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' });
    });
  }

  /* ---------------------------------------------------------------------
     9. DÉMARRAGE
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
    initQuiz();
    initReveal();
    initRail();
    initTabs();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
