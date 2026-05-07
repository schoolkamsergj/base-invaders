# 🚀 Base Invaders

A space shooter game built as a **Base Mini App** on Base mainnet.
Destroy enemies, earn crypto rewards, and compete on an onchain leaderboard.

🎮 **Play now:** https://base-invaders.vercel.app

---

## Built on Base

This game is deployed on [Base](https://base.org) mainnet (Ethereum L2)
and built using the [Base Mini Apps SDK](https://github.com/coinbase/onchainkit).

| | |
|---|---|
| ⛓️ **Network** | Base Mainnet |
| 📜 **Leaderboard Contract** | [0xAC89DA9d8508d0865c55083552da91894537aC89](https://basescan.org/address/0xAC89DA9d8508d0865c55083552da91894537aC89) |
| ✅ **Check-In Contract** | [0x709Ef1bc52a302206E1244Df92Ae0329a9d3C736](https://basescan.org/address/0x709Ef1bc52a302206E1244Df92Ae0329a9d3C736) |
| 🎮 **Platform** | Base Mini App (Farcaster / Coinbase Wallet) |
| 🔧 **Engine** | Phaser 3 |

---

## Features

- **Onchain Leaderboard** — scores saved to Base mainnet smart contract (`BaseInvadersLeaderboardV2`)
- **Daily Check-in** — onchain check-in system via `BaseInvadersCheckIn` contract (resets at 00:00 UTC)
- **Mini App** — playable directly inside Farcaster / Coinbase Wallet
- **4 Enemy Types** — Hexagons, Base Cubes, Enemy Ships, Boss Motherships
- **Shop System** — 8 ships, weapons, power-ups, upgrades
- **3 Currencies** — Gold 🪙, Lightning ⚡, Diamonds 💎
- **Multilingual** — i18n support for multiple languages
- **Mobile + Desktop** — drag/touch + keyboard controls

---

## Tech Stack

- [Phaser 3](https://phaser.io) — game engine
- [Base Mini Apps SDK / MiniKit](https://github.com/coinbase/onchainkit) — wallet & onchain integration
- [Base Mainnet](https://github.com/base/base) — smart contract deployment
- [viem](https://viem.sh) — onchain interactions
- Solidity — `BaseInvadersLeaderboardV2.sol`, `BaseInvadersCheckIn.sol`

---

## How to Play

1. Open in [Base Mini App](https://base-invaders.vercel.app) or browser
2. Drag/swipe to move your spaceship
3. Auto-shoot enemies to earn rewards
4. Visit the shop to upgrade your arsenal
5. Submit your score to the onchain leaderboard!

## Controls

| Input | Action |
|---|---|
| Mouse/Touch drag | Move left/right |
| Arrow keys / WASD | Move |
| ESC | Pause |

---

## Smart Contracts

| Contract | Address | Description |
|---|---|---|
| `BaseInvadersLeaderboardV2` | [0xAC89DA9d...](https://basescan.org/address/0xAC89DA9d8508d0865c55083552da91894537aC89) | Onchain leaderboard — stores top 100 scores on Base |
| `BaseInvadersCheckIn` | [0x709Ef1bc...](https://basescan.org/address/0x709Ef1bc52a302206E1244Df92Ae0329a9d3C736) | Daily check-in (one per UTC day) |

---

## File Structure

```
base-invaders/
├── index.html          # Main HTML file
├── style.css           # Styling
├── game.js             # Core game loop
├── player.js           # Player ship logic
├── enemies.js          # All enemy types
├── shop.js             # Shop system
├── ui.js               # HUD and menus
├── miniapp.js          # Base Mini App / wallet integration
├── leaderboard.js      # Leaderboard UI
├── i18n.js             # Multilingual support
├── vibration.js        # Mobile haptics
├── minikit.config.ts   # MiniKit configuration
└── contracts/          # Solidity smart contracts
```

---

## Contributing

Issues and PRs welcome! If you find bugs or have ideas for new features,
open an issue — especially around Base Mini App integration or onchain mechanics.
<!-- GPG test -->
