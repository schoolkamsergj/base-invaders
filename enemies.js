// Enemy Classes

class HexagonEnemy {
    constructor(scene, x, y, hp) {
        this.scene = scene;
        this.type = 'hexagon';
        this.hp = hp;
        this.maxHP = hp;
        
        // Create hexagon shape with 3D effect
        const radius = 30;
        this.sprite = scene.add.graphics();
        
        // Shadow for depth
        this.shadow = scene.add.ellipse(x, y + 20, radius * 1.5, radius * 0.5, 0x000000, 0.4);
        this.shadow.setDepth(4);
        this.shadow.setBlendMode(Phaser.BlendModes.MULTIPLY);
        
        // Outer glow
        this.glow = scene.add.graphics();
        this.glow.lineStyle(5, 0x00ffff, 0.5);
        this.glow.strokeCircle(0, 0, radius + 5);
        this.glow.x = x;
        this.glow.y = y;
        this.glow.setDepth(4);
        this.glow.setBlendMode(Phaser.BlendModes.ADD);
        
        // Main hexagon with gradient
        this.sprite.lineStyle(4, 0x00ffff, 1);
        this.sprite.fillGradientStyle(0x444444, 0x444444, 0x222222, 0x222222, 1);
        
        // Draw hexagon
        this.sprite.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 2;
            const px = radius * Math.cos(angle);
            const py = radius * Math.sin(angle);
            if (i === 0) {
                this.sprite.moveTo(px, py);
            } else {
                this.sprite.lineTo(px, py);
            }
        }
        this.sprite.closePath();
        this.sprite.fillPath();
        this.sprite.strokePath();
        
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.setDepth(5);
        
        // Add number text with glow
        this.numberText = scene.add.text(x, y, hp.toString(), {
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#ffffff',
            align: 'center',
            stroke: '#00ffff',
            strokeThickness: 3
        });
        this.numberText.setOrigin(0.5);
        this.numberText.setDepth(6);
        this.numberText.setShadow(2, 2, '#00ffff', 2, true);
        
        // Pulsing glow animation
        scene.tweens.add({
            targets: this.glow,
            alpha: { from: 0.3, to: 0.7 },
            scale: { from: 0.9, to: 1.1 },
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
        
        // Physics
        scene.physics.add.existing(this.sprite);
        this.sprite.body.setVelocity(0, 50 + scene.gameState.stage * 5);
        
        // Rewards
        this.rewards = {
            gold: hp * 2,
            score: hp * 10,
            xp: hp
        };
    }

    takeDamage(amount) {
        this.hp -= amount;
        if (this.numberText) {
            this.numberText.setText(Math.max(0, this.hp));
        }
        
        // Flash on hit
        if (this.sprite && this.numberText) {
            this.scene.tweens.add({
                targets: [this.sprite, this.numberText],
                tint: 0xff0000,
                duration: 100,
                yoyo: true
            });
        }
        
        // Return true if destroyed (sprite will be destroyed in game.js)
        if (this.hp <= 0) {
            return true;
        }
        return false;
    }

    update() {
        this.numberText.x = this.sprite.x;
        this.numberText.y = this.sprite.y;
        if (this.shadow) {
            this.shadow.x = this.sprite.x;
            this.shadow.y = this.sprite.y + 20;
        }
        if (this.glow) {
            this.glow.x = this.sprite.x;
            this.glow.y = this.sprite.y;
        }
    }
}

class BaseCubeEnemy {
    constructor(scene, x, y, hp) {
        this.scene = scene;
        this.type = 'baseCube';
        this.hp = hp;
        this.maxHP = hp;
        this.hits = 0;
        
        const size = 40; // Slightly larger for better visibility
        
        // Shadow
        this.shadow = scene.add.ellipse(x, y + 25, size * 1.2, size * 0.4, 0x0000ff, 0.3);
        this.shadow.setDepth(4);
        this.shadow.setBlendMode(Phaser.BlendModes.MULTIPLY);
        
        // PRIMARY: Original design (blue square with "B" letter)
        // Only use image if it loads successfully
        if (scene.textures.exists('baseCube')) {
            // Image loaded successfully - use it
            // CRITICAL: Scale down to match original size (40x40 pixels)
            this.sprite = scene.add.image(x, y, 'baseCube');
            this.sprite.setDisplaySize(40, 40); // Fixed size: 40x40 pixels
            this.sprite.setOrigin(0.5);
            this.letterB = null; // No letter needed with image
        } else {
            // ORIGINAL DESIGN: Blue square with "B" letter (PRIMARY)
            console.warn('Base Cube image not loaded! Using original design with "B" letter.');
            
            // Create cube with blue gradient
            this.sprite = scene.add.graphics();
            this.sprite.fillGradientStyle(0x0052FF, 0x0033cc, 0x0088ff, 0x0052FF, 1);
            this.sprite.fillRect(-size/2, -size/2, size, size);
            this.sprite.lineStyle(3, 0x00ffff, 1);
            this.sprite.strokeRect(-size/2, -size/2, size, size);
            
            // 3D face effect (top face)
            this.sprite.fillStyle(0x0066ff, 0.8);
            this.sprite.fillRect(-size/2, -size/2, size, size/3);
            
            this.sprite.x = x;
            this.sprite.y = y;
            
            // Base "B" letter text (big, bold, visible, always centered)
            this.letterB = scene.add.text(x, y, 'B', {
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#ffffff',
                stroke: '#00ffff',
                strokeThickness: 3
            });
            this.letterB.setOrigin(0.5);
            this.letterB.setDepth(6);
            this.letterB.setShadow(2, 2, '#00ffff', 5, true, true);
        }
        
        this.sprite.setDepth(5);
        
        // Cyan glow circle with ADD blend mode (pulsing)
        this.glow = scene.add.graphics();
        this.glow.fillStyle(0x00ffff, 0.5);
        this.glow.fillCircle(x, y, size + 10);
        this.glow.setDepth(4);
        this.glow.setBlendMode(Phaser.BlendModes.ADD);
        
        // Rotation animation: 360° in 2 seconds, infinite
        scene.tweens.add({
            targets: this.sprite,
            rotation: Math.PI * 2,
            duration: 2000,
            repeat: -1,
            ease: 'Linear'
        });
        
        // Scale pulse: 0.95 to 1.05 (as requested, not 0.9-1.1)
        scene.tweens.add({
            targets: this.sprite,
            scale: { from: 0.95, to: 1.05 },
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Glow pulse: cyan glow expanding/contracting
        scene.tweens.add({
            targets: this.glow,
            alpha: { from: 0.3, to: 0.7 },
            scale: { from: 0.9, to: 1.1 },
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Shadow animation
        scene.tweens.add({
            targets: this.shadow,
            alpha: { from: 0.2, to: 0.4 },
            scaleX: { from: 0.9, to: 1.1 },
            duration: 1500,
            yoyo: true,
            repeat: -1
        });
        
        // Physics
        scene.physics.add.existing(this.sprite);
        this.sprite.body.setVelocity(0, 60 + scene.gameState.stage * 5);
        
        // Rewards
        this.rewards = {
            lightning: 1,
            gold: 20,
            score: 50,
            xp: 15
        };
    }

    takeDamage(amount) {
        this.hp -= amount;
        this.hits++;
        
        // Flash on hit
        this.scene.tweens.add({
            targets: this.sprite,
            tint: 0xffffff,
            duration: 100,
            yoyo: true
        });
        
        // Glow flash
        if (this.glow) {
            this.scene.tweens.add({
                targets: this.glow,
                alpha: { from: 1, to: 0.3 },
                duration: 100,
                yoyo: true
            });
        }
        
        // Pulse effect
        this.scene.tweens.add({
            targets: this.sprite,
            scale: { from: this.sprite.scaleX, to: this.sprite.scaleX * 1.2 },
            duration: 150,
            yoyo: true
        });
        
        // Return true if destroyed (sprite will be destroyed in game.js)
        if (this.hp <= 0) {
            return true;
        }
        return false;
    }

    update() {
        // Update glow position
        if (this.glow) {
            this.glow.x = this.sprite.x;
            this.glow.y = this.sprite.y;
        }
        if (this.shadow) {
            this.shadow.x = this.sprite.x;
            this.shadow.y = this.sprite.y + 25;
        }
        // Update "B" letter position (if using original design)
        if (this.letterB) {
            this.letterB.x = this.sprite.x;
            this.letterB.y = this.sprite.y;
        }
    }
}

class SpaceshipEnemy {
    constructor(scene, x, y, hp, isBoss = false) {
        this.scene = scene;
        this.type = 'spaceship';
        this.hp = hp;
        this.maxHP = hp;
        this.isBoss = isBoss;
        this.shootTimer = 0;
        this.moveDirection = Phaser.Math.RND.pick([-1, 1]);
        this.moveSpeed = isBoss ? 50 : 100;
        
        // Use sprite image or create fallback
        // FIXED: Enemy ships are now same size as player (scale 0.6 for player)
        // Reduced enemy scales to match player size: boss 0.5, weak 0.4
        const spriteKey = isBoss ? 'enemyBoss' : 'enemyWeak';
        if (scene.textures.exists(spriteKey)) {
            console.log('Using', spriteKey, 'sprite');
            this.sprite = scene.add.sprite(x, y, spriteKey);
            this.sprite.setScale(isBoss ? 0.3 : 0.25);  // Reduced from 0.8/0.5 to match player size
        } else {
            console.log(spriteKey, 'sprite not found, creating canvas-drawn enemy');
            this.createRealisticEnemySprite(scene, x, y, isBoss);
        }
        this.sprite.setDepth(5);
        // Add shadow for depth
        this.shadow = scene.add.ellipse(x, y + 30, 40, 15, 0x000000, 0.4);
        this.shadow.setDepth(4);
        this.shadow.setBlendMode(Phaser.BlendModes.MULTIPLY);
        
        // Red engine glow behind enemy
        this.engineGlow = scene.add.graphics();
        this.engineGlow.fillStyle(0xff0000, 0.6);
        this.engineGlow.fillCircle(0, 0, 0);
        this.engineGlow.x = x;
        this.engineGlow.y = y + 25;
        this.engineGlow.setDepth(4);
        this.engineGlow.setBlendMode(Phaser.BlendModes.ADD);
        
        // Smooth rotation animation
        scene.tweens.add({
            targets: this.sprite,
            rotation: { from: -0.1, to: 0.1 },
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Pulsing engine glow
        scene.tweens.add({
            targets: this.engineGlow,
            alpha: { from: 0.4, to: 0.8 },
            scale: { from: 0.9, to: 1.1 },
            duration: 500,
            yoyo: true,
            repeat: -1
        });
        
        // Physics
        scene.physics.add.existing(this.sprite);
        this.sprite.body.setVelocity(0, 40 + scene.gameState.stage * 3);
        
        // Rewards
        this.rewards = {
            gold: hp * (isBoss ? 5 : 3),
            diamonds: isBoss ? Phaser.Math.Between(2, 4) : (Math.random() < 0.3 ? 1 : 0),
            score: hp * (isBoss ? 25 : 15),
            xp: hp * (isBoss ? 5 : 2)
        };
    }

    update(time, delta) {
        // Side-to-side movement
        this.sprite.x += this.moveDirection * this.moveSpeed * (delta / 1000);
        
        if (this.sprite.x < 30 || this.sprite.x > this.scene.scale.width - 30) {
            this.moveDirection *= -1;
        }
        
        // Update shadow and engine glow positions
        if (this.shadow) {
            this.shadow.x = this.sprite.x;
            this.shadow.y = this.sprite.y + 30;
        }
        if (this.engineGlow) {
            this.engineGlow.x = this.sprite.x;
            this.engineGlow.y = this.sprite.y + 25;
        }
        
        // Shoot at player
        if (time > this.shootTimer && this.scene.player) {
            this.shoot();
            this.shootTimer = time + (this.isBoss ? 1000 : 2000) + Math.random() * 1000;
        }
    }

    shoot() {
        const bullet = this.scene.add.rectangle(this.sprite.x, this.sprite.y + 20, 4, 12, 0xff0000);
        bullet.setDepth(10);
        this.scene.physics.add.existing(bullet);
        bullet.body.setVelocity(0, 300);
        this.scene.enemyBullets.add(bullet);
    }

    createRealisticEnemySprite(scene, x, y, isBoss) {
        try {
            // Create detailed enemy spaceship with 3D effect
            // FIXED: Reduced enemy ship size to match player (player is ~60px at scale 0.6)
            const g = scene.add.graphics();
            const width = isBoss ? 60 : 45;  // Reduced from 80/50 to match player size
            const height = isBoss ? 75 : 55;  // Reduced from 100/70 to match player size
            const color = isBoss ? 0xff4400 : 0x00ff00; // Red for boss, green for weak
            const darkColor = isBoss ? 0xcc2200 : 0x00cc00;
        
        // Shadow layer
        g.fillStyle(0x000033, 0.5);
        g.fillEllipse(0, height/2 + 5, width * 1.2, height * 0.3);
        
        // Main body - gradient
        g.fillGradientStyle(color, color, darkColor, darkColor, 1);
        g.fillRoundedRect(-width/2, -height/2, width, height, 5);
        
        // Top section
        g.fillStyle(isBoss ? 0xff6600 : 0x00ff88, 1);
        g.fillRoundedRect(-width/2 + 5, -height/2, width - 10, height/3, 3);
        
        // Cockpit/canopy
        g.fillStyle(isBoss ? 0xff8800 : 0x00ffaa, 0.7);
        g.fillEllipse(0, -height/3, width/2, height/4);
        g.lineStyle(2, isBoss ? 0xff2200 : 0x00cc00, 1);
        g.strokeEllipse(0, -height/3, width/2, height/4);
        
        // Wings (pointing down for enemy)
        g.fillStyle(darkColor, 1);
        g.fillTriangle(-width/2 - 12, height/4, -width/2, height/2, -width/2, 0);
        g.fillTriangle(width/2 + 12, height/4, width/2, height/2, width/2, 0);
        
        // Engine nozzles
        g.fillStyle(isBoss ? 0xaa0000 : 0x008800, 1);
        g.fillRect(-width/4, height/2 - 10, width/6, 15);
        g.fillRect(width/4 - width/6, height/2 - 10, width/6, 15);
        
        // Engine glow (red for all enemies)
        g.fillStyle(0xff0000, 0.6);
        g.fillRect(-width/4, height/2, width/6, 8);
        g.fillRect(width/4 - width/6, height/2, width/6, 8);
        
        // Details
        g.lineStyle(2, color, 0.8);
        g.strokeRoundedRect(-width/2, -height/2, width, height, 5);
        g.lineStyle(1, isBoss ? 0xff6600 : 0x00ff88, 0.6);
        g.strokeLine(-width/2 + 10, -height/4, width/2 - 10, -height/4);
        g.strokeLine(-width/2 + 10, height/4, width/2 - 10, height/4);
        
        // Boss has extra details
        if (isBoss) {
            g.fillStyle(0xff0000, 1);
            g.fillCircle(-width/3, -height/4, 4);
            g.fillCircle(width/3, -height/4, 4);
            g.fillCircle(0, -height/4, 5);
        }
        
        // Generate texture
        const textureKey = isBoss ? 'enemyBossGenerated' : 'enemyWeakGenerated';
        g.generateTexture(textureKey, width + 30, height + 20);
        g.destroy();
        
        this.sprite = scene.add.sprite(x, y, textureKey);
        // FIXED: Reduced enemy scales to match player size (player uses 0.6)
        this.sprite.setScale(isBoss ? 0.5 : 0.4);  // Reduced from 0.8/0.5 to be similar to player
        } catch (e) {
            console.error('Error creating realistic enemy sprite:', e);
            // Simple fallback
            this.sprite = scene.add.rectangle(x, y, 30, 30, isBoss ? 0xff0000 : 0x00ff00);
        }
    }

    takeDamage(amount) {
        this.hp -= amount;
        
        // Flash on hit
        this.scene.tweens.add({
            targets: this.sprite,
            tint: 0xffffff,
            duration: 100,
            yoyo: true
        });
        
        // Return true if destroyed (sprite will be destroyed in game.js)
        if (this.hp <= 0) {
            return true;
        }
        return false;
    }
}

class BossEnemy {
    constructor(scene, x, y, hp, missionNumber = 1) {
        this.scene = scene;
        this.type = 'boss';
        this.hp = hp;
        this.maxHP = hp;
        this.missionNumber = missionNumber;
        this.shootTimer = 0;
        this.attackPatternTimer = 0;
        this.currentAttackPattern = 0;
        this.moveDirection = 1;
        this.canDamage = true;
        this.moveSpeed = 50;
        
        // Use boss_jesse image or create fallback
        if (!scene.textures.exists('bossJesse')) {
            console.error('Boss image not loaded! Check path: assets/images/boss_jesse.png (or .jpg if renamed)');
            // Fallback: Use red circle (40px radius = 80px diameter)
            this.sprite = scene.add.circle(x, y, 40, 0xff0000, 1);
        } else {
            // Image loaded successfully
            // CRITICAL: Scale to reasonable boss size (80x80 pixels)
            this.sprite = scene.add.image(x, y, 'bossJesse');
            this.sprite.setDisplaySize(80, 80); // Fixed size: 80x80 pixels
            this.sprite.setOrigin(0.5);
            
            // Make circular mask (40px radius for 80px diameter)
            const maskGraphics = scene.make.graphics();
            maskGraphics.fillCircle(x, y, 40);
            const mask = maskGraphics.createGeometryMask();
            this.sprite.setMask(mask);
        }
        
        this.sprite.setDepth(5);
        
        // Add glow effect
        this.glow = scene.add.graphics();
        this.glow.lineStyle(8, 0xff00ff, 0.8);
        this.glow.strokeCircle(x, y, 65);
        this.glow.setDepth(4);
        this.glow.setBlendMode(Phaser.BlendModes.ADD);
        
        // Pulsing glow animation
        scene.tweens.add({
            targets: this.glow,
            alpha: { from: 0.5, to: 1 },
            scale: { from: 0.95, to: 1.05 },
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
        
        // Health bar with gradient (green→yellow→red)
        const barWidth = 200;
        const barHeight = 12;
        this.healthBarBg = scene.add.rectangle(x, y - 80, barWidth, barHeight, 0x000000, 0.9);
        this.healthBarBg.setOrigin(0.5);
        this.healthBarBg.setDepth(10);
        
        // Health bar fill (will be updated in update method)
        this.healthBar = scene.add.graphics();
        this.healthBar.setDepth(11);
        
        // Physics
        scene.physics.add.existing(this.sprite);
        this.sprite.body.setVelocity(0, 0);
        
        // Rewards
        this.rewards = {
            gold: 1000 + missionNumber * 200,
            diamonds: Phaser.Math.Between(5, 10) + missionNumber,
            score: 5000 + missionNumber * 1000,
            xp: 500 + missionNumber * 100
        };
    }

    update(time, delta) {
        // Move side to side
        this.sprite.x += this.moveDirection * this.moveSpeed * (delta / 1000);
        if (this.sprite.x < 100 || this.sprite.x > this.scene.scale.width - 100) {
            this.moveDirection *= -1;
        }
        
        // Update glow position
        if (this.glow) {
            this.glow.x = this.sprite.x;
            this.glow.y = this.sprite.y;
        }
        
        // Update health bar position and gradient
        const healthPercent = Math.max(0, this.hp / this.maxHP);
        const barWidth = 200;
        const barHeight = 12;
        const currentWidth = barWidth * healthPercent;
        
        this.healthBarBg.x = this.sprite.x;
        this.healthBarBg.y = this.sprite.y - 80;
        
        // Clear and redraw health bar with gradient (green→yellow→red)
        this.healthBar.clear();
        if (currentWidth > 0) {
            let color1, color2;
            if (healthPercent > 0.6) {
                // Green
                color1 = 0x00ff00;
                color2 = 0x88ff88;
            } else if (healthPercent > 0.3) {
                // Yellow
                color1 = 0xffff00;
                color2 = 0xffff88;
            } else {
                // Red
                color1 = 0xff0000;
                color2 = 0xff8888;
            }
            
            this.healthBar.fillGradientStyle(color1, color1, color2, color2, 1);
            this.healthBar.fillRect(
                this.sprite.x - barWidth / 2,
                this.sprite.y - 80 - barHeight / 2,
                currentWidth,
                barHeight
            );
        }
        
        // Attack patterns (cycle through 3 patterns)
        if (time > this.attackPatternTimer) {
            this.currentAttackPattern = (this.currentAttackPattern + 1) % 3;
            this.attackPatternTimer = time + 3000; // Change pattern every 3 seconds
        }
        
        // Shoot based on current pattern
        if (time > this.shootTimer) {
            if (this.currentAttackPattern === 0) {
                this.attack1(); // Simple spread (3 bullets)
            } else if (this.currentAttackPattern === 1) {
                this.attack2(); // Wide spread (5 bullets)
            } else {
                this.attack3(); // Laser (7 fast bullets)
            }
            this.shootTimer = time + 800;
        }
    }
    
    attack1() {
        // Simple spread: 3 bullets
        const angles = [-15, 0, 15];
        angles.forEach(angle => {
            this.shootBullet(this.sprite.x, this.sprite.y + 40, angle, 250);
        });
    }
    
    attack2() {
        // Wide spread: 5 bullets
        const angles = [-30, -15, 0, 15, 30];
        angles.forEach(angle => {
            this.shootBullet(this.sprite.x, this.sprite.y + 40, angle, 250);
        });
    }
    
    attack3() {
        // Laser: 7 fast bullets
        const angles = [-30, -20, -10, 0, 10, 20, 30];
        angles.forEach(angle => {
            this.shootBullet(this.sprite.x, this.sprite.y + 40, angle, 400); // Faster bullets
        });
    }

    shootBullet(x, y, angle, speed) {
        const bullet = this.scene.add.rectangle(x, y, 6, 15, 0xff0000);
        bullet.setDepth(10);
        this.scene.physics.add.existing(bullet);
        const rad = Phaser.Math.DegToRad(angle);
        bullet.body.setVelocity(Math.sin(rad) * speed, Math.cos(rad) * speed);
        this.scene.enemyBullets.add(bullet);
    }

    takeDamage(amount) {
        this.hp -= amount;
        
        // Flash on hit
        this.scene.tweens.add({
            targets: this.sprite,
            tint: 0xffffff,
            duration: 100,
            yoyo: true
        });
        
        // Glow flash
        if (this.glow) {
            this.scene.tweens.add({
                targets: this.glow,
                alpha: { from: 1, to: 0.5 },
                duration: 100,
                yoyo: true
            });
        }
        
        // Screen shake
        this.scene.cameras.main.shake(200, 0.02);
        
        // Return true if destroyed (sprite will be destroyed in game.js)
        if (this.hp <= 0) {
            // Set boss flag (sprite cleanup handled in game.js)
            this.scene.bossActive = false;
            if (this.scene.missionSystem) {
                this.scene.missionSystem.bossActive = false;
            }
            return true;
        }
        return false;
    }
}
