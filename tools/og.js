#!/usr/bin/env node
/* Fabrique l'image de partage (og.png, 1200×630) dans le style du dossier.
   Usage : node tools/og.js
   Playwright doit être disponible (dépendance de développement uniquement —
   Vercel ne lance jamais ce script).                                       */
'use strict';
const path = require('path');
const { chromium } = require('playwright');

const CARD = `
<!doctype html><meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; }
  html, body { width: 1200px; height: 630px; }
  body {
    position: relative; overflow: hidden;
    background: #f4f0e1;
    font-family: "Iowan Old Style", Palatino, "Book Antiqua", Georgia, serif;
    color: #1b1e14;
    padding: 46px 60px;
    display: flex; flex-direction: column; justify-content: space-between;
  }
  /* Bandes vertes du listing */
  body::before {
    content: ""; position: absolute; inset: 0; z-index: 0;
    background: repeating-linear-gradient(180deg,
      transparent 0 42px, rgba(19,122,70,.075) 42px 84px);
  }
  /* Perforation latérale */
  body::after {
    content: ""; position: absolute; left: 20px; top: 40px; bottom: 40px; width: 14px; z-index: 0;
    background-image: radial-gradient(circle at 7px 7px, #cfc9b0 6px, transparent 6.5px);
    background-size: 14px 66px; opacity: .85;
  }
  .layer { position: relative; z-index: 1; }

  .kicker {
    font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 15px; font-weight: 700; letter-spacing: .3em;
    text-transform: uppercase; color: #127a46;
  }
  h1 { font-size: 68px; font-weight: 400; letter-spacing: -.025em; line-height: 1.02; margin-top: 26px; }
  h1 em { font-style: normal; display: block; color: #0d4a2c; }
  .sub {
    font-size: 22px; color: #4b5040; margin-top: 24px; max-width: 780px;
    border-left: 4px solid #c0271a; padding-left: 18px; line-height: 1.32;
  }
  .facts { display: flex; gap: 1px; background: #cdd2bd; border: 1px solid #b7bda6; }
  .facts div { background: #f4f0e1; padding: 13px 18px; flex: 1; }
  .facts dt {
    font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: #6f7561;
  }
  .facts dd {
    font-family: ui-monospace, "DejaVu Sans Mono", Menlo, Consolas, monospace;
    font-size: 24px; font-weight: 700; color: #0d4a2c; margin-top: 6px;
  }
  .foot {
    display: flex; justify-content: space-between; align-items: flex-end;
    margin-top: 16px;
    font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 15px; letter-spacing: .16em; text-transform: uppercase; color: #6f7561;
  }
  .foot b { color: #c0271a; font-weight: 700; }
  .warn {
    margin-top: 18px; padding: 10px 14px;
    border: 2px solid #8a6300; background: rgba(138,99,0,.10);
    font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 15px; font-weight: 700; letter-spacing: .05em; color: #6b4d00;
    text-align: center;
  }
  .stamp {
    position: absolute; top: 54px; right: 60px; z-index: 2;
    transform: rotate(11deg);
    font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 19px; font-weight: 800; letter-spacing: .22em; text-transform: uppercase;
    color: #c0271a; border: 4px solid #c0271a; padding: 12px 20px;
    box-shadow: inset 0 0 0 2px #f4f0e1; opacity: .93;
  }
</style>
<div class="stamp">Sur pièces · SEC</div>
<div class="layer">
  <p class="kicker">Dossier BRK-T2-2026 · Analyse sur documents</p>
  <h1>Berkshire Hathaway<em>l'année où l'on a cessé de vendre.</em></h1>
  <p class="sub">Après 14 trimestres consécutifs de ventes nettes, Greg Abel a rouvert le carnet d'achats.</p>
</div>
<div class="layer">
  <dl class="facts">
    <div><dt>Achats nets T2</dt><dd>+19,8 Md$</dd></div>
    <div><dt>Ventes T1 → T2</dt><dd>24,1 → 3,7</dd></div>
    <div><dt>Rachats d'actions</dt><dd>4,5 Md$</dd></div>
    <div><dt>Trésorerie 30 juin</dt><dd>364,7 Md$</dd></div>
  </dl>
  <p class="warn">⚠ Analyse pédagogique — ceci n'est pas un conseil en investissement. Faites vos propres recherches.</p>
  <p class="foot"><span>10 feuillets · graphiques · langage clair</span><b>@crypto_comiks</b></p>
</div>
`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1
  });
  await page.setContent(CARD, { waitUntil: 'load' });
  const out = path.join(__dirname, '..', 'og.png');
  await page.screenshot({ path: out });
  await browser.close();
  console.log('og.png écrit — 1200×630');
})();
