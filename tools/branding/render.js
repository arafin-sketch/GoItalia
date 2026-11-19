const { chromium } = require('playwright'); const S = process.argv[2];
(async () => {
  const b = await chromium.launch();
  // OG image 1200x630, exact pixels
  const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await p.goto('file://' + S + '/og.html');
  try { await p.evaluate(() => document.fonts.ready); } catch {}
  await p.waitForTimeout(1200);
  await p.screenshot({ path: S + '/og.png' });
  // 512 maskable/app icon from the icon.svg on brand bg
  const svg = require('fs').readFileSync('/home/user/GoItalia/preview/icon.svg', 'utf8');
  const q = await b.newPage({ viewport: { width: 512, height: 512 }, deviceScaleFactor: 1 });
  await q.setContent('<style>html,body{margin:0}</style>' + svg.replace('<svg ', '<svg width="512" height="512" '));
  await q.waitForTimeout(200); await q.screenshot({ path: S + '/icon-512.png' });
  const a = await b.newPage({ viewport: { width: 180, height: 180 }, deviceScaleFactor: 1 });
  await a.setContent('<style>html,body{margin:0}</style>' + svg.replace('<svg ', '<svg width="180" height="180" '));
  await a.waitForTimeout(200); await a.screenshot({ path: S + '/apple-touch-icon.png' });
  await b.close();
})();
