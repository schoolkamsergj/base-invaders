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
        
        // Create 3D holographic Base cube
        const size = 35;
        
        // Shadow
        this.shadow = scene.add.ellipse(x, y + 25, size * 1.2, size * 0.4, 0x0000ff, 0.3);
        this.shadow.setDepth(4);
        this.shadow.setBlendMode(Phaser.BlendModes.MULTIPLY);
        
        // Outer glow (holographic effect)
        this.outerGlow = scene.add.graphics();
        this.outerGlow.lineStyle(4, 0x00ffff, 0.6);
        this.outerGlow.strokeRect(-size/2 - 3, -size/2 - 3, size + 6, size + 6);
        this.outerGlow.x = x;
        this.outerGlow.y = y;
        this.outerGlow.setDepth(4);
        this.outerGlow.setBlendMode(Phaser.BlendModes.ADD);
        
        // Main cube with 3D gradient
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
        this.sprite.setDepth(5);
        
        // Base "B" letter text (big, bold, visible)
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
        
        // Inner glow
        this.innerGlow = scene.add.graphics();
        this.innerGlow.fillStyle(0x00ffff, 0.3);
        this.innerGlow.fillRect(x - size/4, y - size/4, size/2, size/2);
        this.innerGlow.setDepth(4);
        this.innerGlow.setBlendMode(Phaser.BlendModes.ADD);
        
        // Physics
        scene.physics.add.existing(this.sprite);
        this.sprite.body.setVelocity(0, 60 + scene.gameState.stage * 5);
        
        // 3D rotation animation (X, Y, Z axes)
        scene.tweens.add({
            targets: this.sprite,
            rotation: Math.PI * 2,
            duration: 3000,
            repeat: -1,
            ease: 'Linear'
        });
        
        scene.tweens.add({
            targets: [this.outerGlow, this.innerGlow],
            rotation: Math.PI * 2,
            duration: 4000,
            repeat: -1,
            ease: 'Linear'
        });
        
        // Pulsing holographic glow
        scene.tweens.add({
            targets: [this.outerGlow, this.innerGlow],
            alpha: { from: 0.4, to: 0.8 },
            scale: { from: 0.95, to: 1.05 },
            duration: 1000,
            yoyo: true,
            repeat: -1
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
        
        // Flash on hit with glow
        this.scene.tweens.add({
            targets: [this.sprite, this.outerGlow, this.innerGlow],
            tint: 0xffffff,
            duration: 100,
            yoyo: true
        });
        
        // Pulse effect
        this.scene.tweens.add({
            targets: this.outerGlow,
            scale: { from: 1, to: 1.2 },
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
        // Update glow positions
        if (this.outerGlow) {
            this.outerGlow.x = this.sprite.x;
            this.outerGlow.y = this.sprite.y;
        }
        if (this.innerGlow) {
            this.innerGlow.x = this.sprite.x;
            this.innerGlow.y = this.sprite.y;
        }
        if (this.shadow) {
            this.shadow.x = this.sprite.x;
            this.shadow.y = this.sprite.y + 25;
        }
        // Update "B" letter position
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
    constructor(scene, x, y, hp) {
        this.scene = scene;
        this.type = 'boss';
        this.hp = hp;
        this.maxHP = hp;
        this.shootTimer = 0;
        this.moveDirection = 1;
        this.canDamage = true;
        
        // Create boss ship
        // FIXED: Reduced boss size to match player (player is ~60px, boss should be ~70-80px)
        this.sprite = scene.add.graphics();
        const width = 70;  // Reduced from 120 to match player size
        const height = 50;  // Reduced from 80 to match player size
        
        // Main body
        this.sprite.fillStyle(0x880000, 1);
        this.sprite.fillRect(x - width/2, y - height/2, width, height);
        this.sprite.lineStyle(3, 0xff0000, 1);
        this.sprite.strokeRect(x - width/2, y - height/2, width, height);
        
        // Wings
        this.sprite.fillStyle(0x660000, 1);
        this.sprite.fillRect(x - width/2 - 20, y - 10, 20, 20);
        this.sprite.fillRect(x + width/2, y - 10, 20, 20);
        
        // Turrets
        this.sprite.fillStyle(0xff4400, 1);
        this.sprite.fillCircle(x - 40, y - 30, 8);
        this.sprite.fillCircle(x + 40, y - 30, 8);
        this.sprite.fillCircle(x, y - 30, 10);
        
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.setDepth(5);
        
        // Health bar (scaled to match reduced boss size)
        this.healthBarBg = scene.add.rectangle(x, y - 45, width + 15, 8, 0x000000, 0.8);
        this.healthBar = scene.add.rectangle(x, y - 45, width + 15, 8, 0xff0000, 1);
        this.healthBar.setOrigin(0.5);
        this.healthBarBg.setOrigin(0.5);
        
        // Physics
        scene.physics.add.existing(this.sprite);
        this.sprite.body.setVelocity(0, 0);
        
        // Rewards
        this.rewards = {
            gold: 1000,
            diamonds: Phaser.Math.Between(5, 10),
            score: 5000,
            xp: 500
        };
    }

    update(time, delta) {
        // Move side to side
        this.sprite.x += this.moveDirection * 50 * (delta / 1000);
        if (this.sprite.x < 100 || this.sprite.x > this.scene.scale.width - 100) {
            this.moveDirection *= -1;
        }
        
        // Update health bar
        const healthPercent = this.hp / this.maxHP;
        this.healthBar.width = (this.scene.scale.width - 40) * healthPercent;
        this.healthBar.x = this.sprite.x;
        this.healthBarBg.x = this.sprite.x;
        
        // Shoot patterns
        if (time > this.shootTimer) {
            this.shootPattern();
            this.shootTimer = time + 1000;
        }
        
        // Spawn minions occasionally
        if (Math.random() < 0.01) {
            this.scene.spawnSpaceship();
        }
    }

    shootPattern() {
        const patterns = [
            () => {
                // Single shot
                this.shootBullet(this.sprite.x, this.sprite.y + 40, 0, 200);
            },
            () => {
                // Triple shot
                this.shootBullet(this.sprite.x, this.sprite.y + 40, -20, 200);
                this.shootBullet(this.sprite.x, this.sprite.y + 40, 0, 200);
                this.shootBullet(this.sprite.x, this.sprite.y + 40, 20, 200);
            },
            () => {
                // Spread shot
                for (let i = -2; i <= 2; i++) {
                    this.shootBullet(this.sprite.x, this.sprite.y + 40, i * 15, 200);
                }
            }
        ];
        
        Phaser.Math.RND.pick(patterns)();
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
        
        // Screen shake
        this.scene.cameras.main.shake(200, 0.02);
        
        // Return true if destroyed (sprite will be destroyed in game.js)
        if (this.hp <= 0) {
            // Set boss flag (sprite cleanup handled in game.js)
            this.scene.bossActive = false;
            return true;
        }
        return false;
    }
}
