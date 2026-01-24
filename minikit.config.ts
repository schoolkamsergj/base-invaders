const ROOT_URL =
    process.env.ROOT_URL ||
    process.env.NEXT_PUBLIC_ROOT_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5173');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export const minikitConfig = {
    accountAssociation: {
        header: '',
        payload: '',
        signature: ''
    },
    miniapp: {
        version: '1',
        name: 'Base Invaders',
        subtitle: 'Cosmic Arcade Shooter',
        description: 'Cosmic Arcade Shooter on Base blockchain',
        screenshotUrls: [
            `${ROOT_URL}/assets/images/player.png`,
            `${ROOT_URL}/assets/images/enemy_boss.png`,
            `${ROOT_URL}/assets/images/base_cube.jpg`
        ],
        iconUrl: `${ROOT_URL}/icons/icon-512.png`,
        splashImageUrl: `${ROOT_URL}/icons/icon-192.png`,
        splashBackgroundColor: '#000000',
        homeUrl: ROOT_URL,
        primaryCategory: 'games',
        tags: ['arcade', 'shooter', 'space', 'base', 'blockchain'],
        heroImageUrl: `${ROOT_URL}/assets/images/base_cube.jpg`,
        tagline: 'Fight waves and bosses on Base',
        ogTitle: 'Base Invaders',
        ogDescription: 'Cosmic Arcade Shooter on Base blockchain',
        ogImageUrl: `${ROOT_URL}/assets/images/base_cube.jpg`,
        noindex: !IS_PRODUCTION
    }
} as const;
