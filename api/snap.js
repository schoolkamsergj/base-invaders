/**
 * Farcaster Snap endpoint для Base Invaders
 * 
 * Цей файл — Vercel Serverless Function.
 * URL після деплою: https://your-app.vercel.app/api/snap
 * 
 * Як використовувати:
 * 1. Задеплой на Vercel (автоматично, якщо вже підключено GitHub)
 * 2. В Farcaster зроби каст з посиланням: https://your-app.vercel.app/api/snap
 * 3. Farcaster відобразить кнопку "🎮 Play Base Invaders" прямо в стрічці
 */

const GAME_URL = process.env.GAME_URL || 'https://base-invaders.vercel.app';
const ICON_URL = process.env.ICON_URL || `${GAME_URL}/icon.png`;
const OG_IMAGE_URL = process.env.OG_IMAGE_URL || `${GAME_URL}/og-image.png`;

export default function handler(req, res) {
  // Дозволяємо CORS для Farcaster
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Farcaster Snap відповідь
  return res.status(200).json({
    type: 'snap',
    name: 'Base Invaders',
    iconUrl: ICON_URL,
    homeUrl: GAME_URL,
    imageUrl: OG_IMAGE_URL,
    description: '🚀 Shoot enemies, earn rewards on Base blockchain!',
    primaryCategory: 'games',
    tags: ['game', 'base', 'blockchain', 'shoot'],
    // Кнопка, яку побачить користувач у Farcaster
    button: {
      title: '🎮 Play Base Invaders',
      action: {
        type: 'launch_frame',
        name: 'Base Invaders',
        url: GAME_URL,
        splashImageUrl: `${GAME_URL}/splash.png`,
        splashBackgroundColor: '#0d0d1a'
      }
    }
  });
}
