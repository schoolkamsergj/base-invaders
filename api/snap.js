/**
 * Vercel Serverless API: Farcaster Snap endpoint.
 * Повертає інтерактивну кнопку "Play Base Invaders" всередині Farcaster-касту.
 *
 * Docs: https://docs.farcaster.xyz/snap
 *
 * Як використати:
 * 1. Задеплой на Vercel (відбудеться автоматично при пуші в main)
 * 2. Зроби каст у Farcaster і додай embed: https://base-invaders.vercel.app/api/snap
 * 3. Farcaster розпізнає URL → покаже кнопку прямо в касті
 */

export default async function handler(req, res) {
  // CORS headers — дозволяємо Farcaster клієнтам звертатися до endpoint
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Підтримуємо як GET (перший рендер касту), так і POST (натискання кнопки)
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Витягуємо FID (Farcaster User ID) якщо є — передається при POST (взаємодія)
  let fid = null;
  if (req.method === 'POST' && req.body) {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { /* ignore */ }
    }
    fid = body?.untrustedData?.fid ?? null;
  }

  // URL гри — використовується як ціль кнопки
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://base-invaders.vercel.app';

  // Відповідь у форматі Farcaster Snap
  return res.status(200).json({
    type: 'snap',
    snap: {
      version: '1',
      components: [
        {
          // OG-зображення гри як превью у касті
          type: 'image',
          src: `${APP_URL}/og-image.png`,
          aspectRatio: '1.91:1',
        },
        {
          // Кнопка запуску гри — відкриває Base Invaders з FID якщо є
          type: 'button',
          label: fid ? `\u25B6 Play as FID ${fid}` : '\u25B6 Play Base Invaders',
          action: 'link',
          target: fid ? `${APP_URL}?fid=${fid}` : APP_URL,
        },
      ],
    },
  });
}
