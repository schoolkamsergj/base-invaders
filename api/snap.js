/**
 * Vercel Serverless Function: Farcaster Frame (Snap) endpoint.
 * GET/POST /api/snap — returns HTML with fc:frame meta tags
 * Farcaster reads these tags and renders a Play button in the cast
 *
 * IMPORTANT: uses ES module syntax (export default) because
 * package.json has "type":"module" — CommonJS module.exports won't work.
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let fid = null;
  if (req.method === 'POST' && req.body) {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }
    fid = body?.untrustedData?.fid ?? null;
  }

  const APP_URL = 'https://base-invaders.vercel.app';
  const OG_IMAGE = `${APP_URL}/og-image.png`;
  const TARGET = fid ? `${APP_URL}?fid=${fid}` : APP_URL;
  const BTN = fid ? `\u25B6 Play as FID ${fid}` : '\u25B6 Play Base Invaders';

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Base Invaders</title>
  <meta property="fc:frame" content="next" />
  <meta property="fc:frame:image" content="${OG_IMAGE}" />
  <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
  <meta property="fc:frame:button:1" content="${BTN}" />
  <meta property="fc:frame:button:1:action" content="link" />
  <meta property="fc:frame:button:1:target" content="${TARGET}" />
  <meta property="og:title" content="Base Invaders" />
  <meta property="og:description" content="Shoot enemies, earn on-chain score on Base mainnet." />
  <meta property="og:image" content="${OG_IMAGE}" />
  <meta property="og:url" content="${APP_URL}" />
</head>
<body>
  <h1>Base Invaders \uD83D\uDE80</h1>
  <p><a href="${TARGET}">Play now</a></p>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(200).send(html);
}
