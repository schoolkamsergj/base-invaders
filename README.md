# Base Invaders - Space Shooter Game

A space shooter game with Base blockchain theme, featuring multiple enemy types, shop system, and progression mechanics.

## Features

- **Player Spaceship**: Auto-shooting green lasers, drag to move (mobile + desktop)
- **4 Enemy Types**:
  - Hexagon Enemies: Numbers show hits needed, drop gold
  - Base Cubes: Blue cubic obstacles with Base logo, drop lightning bolts
  - Enemy Spaceships: Red/orange ships that shoot back, drop gold and diamonds
  - Boss Enemies: Huge motherships every 10 stages with massive rewards

- **Shop System**:
  - Spaceships: 8 different ships with unique stats
  - Weapons: Fire rate, damage, multi-shot upgrades
  - Power-ups: Shields, bombs, score multipliers
  - Upgrades: HP, regeneration, movement speed

- **Progression**:
  - Score system with multipliers
  - Stage progression (increases difficulty)
  - Level system with XP
  - 3 currencies: Gold 🪙, Lightning ⚡, Diamonds 💎

## How to Play

1. Open `index.html` in a web browser
2. Drag left/right to move your spaceship
3. Your ship auto-shoots green lasers upward
4. Destroy enemies to earn rewards
5. Collect coins, lightning bolts, and diamonds
6. Visit the shop to upgrade your ship and weapons
7. Survive as long as possible and reach higher stages!

## Controls

- **Mouse/Touch**: Drag to move left/right
- **Keyboard**: Arrow keys or WASD to move
- **ESC**: Pause game
- **Shop Button**: Bottom-left corner to open shop

## Technical Details

- Built with Phaser.js 3 game engine
- Responsive design (mobile + desktop)
- LocalStorage for saving progress
- No external assets required (all graphics generated programmatically)

## File Structure

```
base-invaders/
├── index.html      # Main HTML file
├── style.css       # Styling
├── game.js         # Core game loop
├── player.js       # Player ship logic
├── enemies.js      # All enemy types
├── shop.js         # Shop system
├── ui.js           # HUD and menus
└── assets/         # Folder for future images
```

## Future Enhancements

- Sound effects and background music
- More enemy types and patterns
- Achievement system
- Leaderboard
- More power-ups and upgrades

Enjoy the game!
