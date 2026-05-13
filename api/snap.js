/**
 * Vercel Serverless API: Farcaster Snap endpoint.
 * CommonJS format — required because package.json has "type": "module"
 * but Vercel Serverless Functions need .js files in CJS or explicit .mjs
 *
 * Endpoint: GET/POST /api/snap
 * Returns: Farcaster Frame HTML embed with Play button
 */

module.exports = async function handler(req, res) {
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
      try { body = JSON.parse(body); } catch (e) { /* ignore */ }
    }
    fid = body?.untrustedData?.fid ?? null;
  }

  const APP_URL = process.env.APP_URL || 'https://base-invaders.vercel.app';
  const OG_IMAGE = `${APP_URL}/og-image.png`;
  const GAME_TARGET = fid ? `${APP_URL}?fid=${fid}` : APP_URL;
  const BTN_LABEL = fid ? `\u25B6 Play as FID ${fid}` : '\u25B6 Play Base Invaders';

  // Return Farcaster Frame HTML — this is what Farcaster reads from the cast URL
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Base Invaders</title>
  <meta property="fc:frame" content="next" />
  <meta property="fc:frame:image" content="${OG_IMAGE}" />
  <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
  <meta property="fc:frame:button:1" content="${BTN_LABEL}" />
  <meta property="fc:frame:button:1:action" content="link" />
  <meta property="fc:frame:button:1:target" content="${GAME_TARGET}" />
  <meta property="og:title" content="Base Invaders" />
  <meta property="og:description" content="Shoot enemies, earn on-chain score on Base mainnet. Built with Phaser 3." />
  <meta property="og:image" content="${OG_IMAGE}" />
  <meta property="og:url" content="${APP_URL}" />
</head>
<body>
  <h1>Base Invaders \uD83D\uDE80</h1>
  <a href="${GAME_TARGET}">Play now</a>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(200).send(html);
};
