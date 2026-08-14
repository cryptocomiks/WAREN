#!/usr/bin/env node
/* Test de fumée du dossier.
   Sert le site sur un port local, l'ouvre en grand et en petit écran, le
   déroule entièrement et vérifie qu'il tient debout.
   Usage : npm test                                                        */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.join(__dirname, '..');
const PORT = 8123;
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8'
};

function serve() {
  return new Promise(function (resolve) {
    var srv = http.createServer(function (req, res) {
      var rel = decodeURIComponent(req.url.split('?')[0]);
      if (rel === '/') rel = '/index.html';
      var file = path.join(ROOT, path.normalize(rel).replace(/^(\.\.[/\\])+/, ''));
      fs.readFile(file, function (err, buf) {
        if (err) { res.writeHead(404); res.end('not found'); return; }
        res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
        res.end(buf);
      });
    });
    srv.listen(PORT, function () { resolve(srv); });
  });
}

var failures = [];
function check(ok, label, detail) {
  console.log((ok ? '  ok   ' : '  ÉCHEC') + '  ' + label + (detail ? '  → ' + detail : ''));
  if (!ok) failures.push(label + (detail ? ' (' + detail + ')' : ''));
}

(async function () {
  var srv = await serve();
  var browser = await chromium.launch();

  var viewports = [
    { nom: 'grand écran', width: 1400, height: 1000 },
    { nom: 'téléphone', width: 390, height: 844 },
    { nom: 'petit téléphone', width: 320, height: 700 }
  ];

  for (var i = 0; i < viewports.length; i++) {
    var vp = viewports[i];
    console.log('\n▸ ' + vp.nom + ' (' + vp.width + '×' + vp.height + ')');

    var page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    var erreurs = [];
    page.on('pageerror', function (e) { erreurs.push(e.message); });
    page.on('console', function (m) { if (m.type() === 'error') erreurs.push('console: ' + m.text()); });
    page.on('requestfailed', function (r) { erreurs.push('requête échouée: ' + r.url()); });

    /* Le défilement fluide empêcherait le harnais d'atteindre ses positions. */
    await page.addInitScript(function () {
      document.addEventListener('DOMContentLoaded', function () {
        var st = document.createElement('style');
        st.textContent = 'html{scroll-behavior:auto !important}';
        document.head.appendChild(st);
      });
    });

    await page.goto('http://127.0.0.1:' + PORT + '/index.html', { waitUntil: 'networkidle' });

    /* Dérouler tout le document pour déclencher révélations et graphiques */
    await page.evaluate(async function () {
      var pas = window.innerHeight * 0.7;
      for (var y = 0; y < document.body.scrollHeight; y += pas) {
        window.scrollTo(0, y);
        await new Promise(function (r) { setTimeout(r, 110); });
      }
    });
    await page.evaluate(function () {
      document.querySelectorAll('[data-reveal-trigger]').forEach(function (b) { b.click(); });
    });
    await page.waitForTimeout(900);

    var etat = await page.evaluate(function () {
      return {
        titre: document.title,
        feuillets: document.querySelectorAll('main .sheet').length,
        graphiques: document.querySelectorAll('.chart svg').length,
        dessines: document.querySelectorAll('.chart svg.is-drawn').length,
        reveals: document.querySelectorAll('.reveal').length,
        cachés: [].filter.call(document.querySelectorAll('.reveal'), function (e) {
          return !e.classList.contains('is-in');
        }).length,
        enClair: document.querySelectorAll('.plain').length,
        glossaire: document.querySelectorAll('.gl').length,
        suivants: document.querySelectorAll('.sheet__next').length,
        debordement: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        fondBody: getComputedStyle(document.body).backgroundColor
      };
    });

    check(erreurs.length === 0, 'aucune erreur de page', erreurs.slice(0, 3).join(' | '));
    check(etat.debordement === 0, 'aucun débordement horizontal', etat.debordement + 'px');
    check(etat.feuillets === 10, '10 feuillets présents', String(etat.feuillets));
    check(etat.graphiques === 12, '12 graphiques montés', String(etat.graphiques));
    check(etat.dessines === etat.graphiques, 'tous les graphiques dessinés',
      etat.dessines + '/' + etat.graphiques);
    check(etat.cachés === 0, 'tous les blocs révélés', etat.cachés + ' restés cachés');
    check(etat.enClair >= 15, 'encadrés « en clair » présents', String(etat.enClair));
    check(etat.glossaire >= 20, 'termes de glossaire présents', String(etat.glossaire));
    check(etat.suivants === 10, 'renvois « feuillet suivant » montés', String(etat.suivants));
    check(etat.fondBody !== 'rgba(0, 0, 0, 0)', 'fond de page explicite', etat.fondBody);

    /* Navigation : panneau de sommaire sur les petits écrans */
    if (vp.width <= 880) {
      await page.evaluate(function () { window.scrollTo(0, 0); });
      await page.click('#navOpen');
      await page.waitForTimeout(350);
      var ouvert = await page.isVisible('#navPanel');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
      var ferme = !(await page.isVisible('#navPanel'));
      check(ouvert && ferme, 'panneau de sommaire : ouverture et fermeture par Échap');
    }

    await page.close();
  }

  /* La page 404 doit se charger seule, avec sa feuille de style */
  console.log('\n▸ page 404');
  var p404 = await browser.newPage({ viewport: { width: 900, height: 700 } });
  var err404 = [];
  p404.on('requestfailed', function (r) { err404.push(r.url()); });
  await p404.goto('http://127.0.0.1:' + PORT + '/404.html', { waitUntil: 'networkidle' });
  var ok404 = await p404.evaluate(function () {
    return getComputedStyle(document.querySelector('.sheet')).backgroundColor;
  });
  check(err404.length === 0, 'aucune ressource manquante', err404.join(' | '));
  check(ok404 !== 'rgba(0, 0, 0, 0)', 'feuille de style appliquée', ok404);
  await p404.close();

  /* L'image de partage doit exister et faire la bonne taille */
  console.log('\n▸ image de partage');
  var og = path.join(ROOT, 'og.png');
  var existe = fs.existsSync(og);
  check(existe, 'og.png présent');
  if (existe) {
    var buf = fs.readFileSync(og);
    var w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
    check(w === 1200 && h === 630, 'og.png en 1200×630', w + '×' + h);
  }

  await browser.close();
  srv.close();

  console.log('');
  if (failures.length) {
    console.error('✗ ' + failures.length + ' vérification(s) en échec :');
    failures.forEach(function (f) { console.error('  · ' + f); });
    process.exit(1);
  }
  console.log('✓ tout est vert.');
})().catch(function (e) {
  console.error(e);
  process.exit(1);
});
