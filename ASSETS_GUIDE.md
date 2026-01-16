# Assets Guide - Adding Real Graphics

## Current Status
The game uses high-quality programmatically generated graphics with 3D effects, shadows, glows, and parallax scrolling. All visuals are created in real-time with Phaser.js.

## Adding Real Graphics

### Option 1: Use Free Assets from Online Sources

1. **OpenGameArt.org** (https://opengameart.org)
   - Search for "spaceship", "enemy ship", "explosion", "space background"
   - Download PNG files
   - Host them online or use direct URLs

2. **Kenney.nl** (https://kenney.nl/assets)
   - Free game assets
   - Space Shooter Redux pack recommended
   - Download and extract to `assets/` folder

3. **itch.io** (https://itch.io/game-assets/free)
   - Many free space-themed assets
   - Search for "space shooter", "spaceship", "explosion"

### Option 2: Add Assets to Your Project

1. Place image files in the `assets/` folder:
   ```
   assets/
   ├── player.png
   ├── enemy_small.png
   ├── enemy_medium.png
   ├── enemy_large.png
   ├── base_cube.png
   ├── explosion.png (sprite sheet)
   ├── bg_stars.png
   └── bg_nebula.png
   ```

2. Update `game.js` preload() function:
   ```javascript
   preload() {
       // Load your assets
       this.load.image('player', 'assets/player.png');
       this.load.image('enemy_ship_small', 'assets/enemy_small.png');
       this.load.image('enemy_ship_medium', 'assets/enemy_medium.png');
       this.load.image('enemy_ship_large', 'assets/enemy_large.png');
       this.load.image('base_cube', 'assets/base_cube.png');
       
       // Explosion sprite sheet (if animated)
       this.load.spritesheet('explosion', 'assets/explosion.png', {
           frameWidth: 64,
           frameHeight: 64
       });
       
       // Backgrounds
       this.load.image('bg_stars', 'assets/bg_stars.png');
       this.load.image('bg_nebula', 'assets/bg_nebula.png');
   }
   ```

3. Update player.js to use the sprite:
   ```javascript
   // In Player constructor, replace createPlayerSprite with:
   if (scene.textures.exists('player')) {
       this.sprite = scene.add.image(x, y, 'player');
       this.sprite.setScale(0.5);
   } else {
       this.createPlayerSprite(scene, x, y); // Fallback
   }
   ```

### Recommended Asset Specifications

- **Player Spaceship**: 64x64 to 128x128 pixels, PNG with transparency
- **Enemy Ships**: 48x48 to 96x96 pixels, PNG with transparency
- **Base Cube**: 64x64 pixels, PNG with transparency
- **Explosion**: Sprite sheet, 64x64 per frame, 8-16 frames
- **Backgrounds**: 1920x1080 or larger, can be tiled

### Current Visual Features (Work Without Assets)

✅ 3D-style graphics with gradients
✅ Parallax scrolling (3 layers)
✅ Glow effects (HDR bloom)
✅ Shadows and depth
✅ Particle effects
✅ Smooth animations
✅ Professional UI with gradients
✅ Screen shake and camera effects

All these features work with the generated graphics and will enhance any real assets you add!
