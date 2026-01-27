// Player Ship Class
class Player {
    constructor(scene, x, y) {
        try {
            this.scene = scene;
            this.maxHP = 100;
            this.hp = this.maxHP;
            this.shield = 0;
            
            // Use player sprite image or create fallback
            try {
                if (scene.textures && scene.textures.exists('player')) {
                    console.log('Using player.png sprite');
                    this.sprite = scene.add.sprite(x, y, 'player');
                    this.sprite.setScale(0.6);
                } else {
                    console.log('Player sprite not found, creating canvas-drawn spaceship');
                    this.createRealisticPlayerSprite(scene, x, y);
                }
            } catch (e) {
                console.error('Error creating player sprite, using simple fallback:', e);
                // Simple fallback
                this.sprite = scene.add.rectangle(x, y, 30, 30, 0x00ff00);
            }
            
            if (!this.sprite) {
                throw new Error('Failed to create player sprite');
            }
            
            this.sprite.setDepth(10);
            
            // Add shadow for depth
            try {
                this.shadow = scene.add.ellipse(x, y + 25, 30, 10, 0x000000, 0.3);
                this.shadow.setDepth(9);
                this.shadow.setBlendMode(Phaser.BlendModes.MULTIPLY);
            } catch (e) {
                console.warn('Error creating shadow:', e);
                this.shadow = null;
            }
            
            // DISABLED: Glow effect causing ghost artifacts
            // Removed to fix blue ghost duplicate rendering bug
            this.glow = null;
            
            // Engine trail - create after particle texture is ready
            this.engineTrail = null;
            this.engineTrailX = x;
            this.engineTrailY = y + 20;
            
            // Add physics
            try {
                scene.physics.add.existing(this.sprite);
                if (this.sprite.body) {
                    this.sprite.body.setCollideWorldBounds(true);
                }
            } catch (e) {
                console.warn('Error adding physics:', e);
            }
            
            // Add smooth idle animation
            try {
                scene.tweens.add({
                    targets: this.sprite,
                    scaleX: { from: 0.58, to: 0.62 },
                    scaleY: { from: 0.58, to: 0.62 },
                    duration: 1000,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            } catch (e) {
                console.warn('Error creating animation:', e);
            }
            
            // Glow pulse
            if (this.glow) {
                try {
                    scene.tweens.add({
                        targets: this.glow,
                        alpha: { from: 0.2, to: 0.4 },
                        duration: 800,
                        yoyo: true,
                        repeat: -1
                    });
                } catch (e) {
                    console.warn('Error creating glow animation:', e);
                }
            }
        } catch (e) {
            console.error('CRITICAL ERROR in Player constructor:', e);
            // Emergency fallback
            this.sprite = scene.add.rectangle(x, y, 30, 30, 0x00ff00);
            this.hp = 100;
            this.maxHP = 100;
        }
    }
    

    createRealisticPlayerSprite(scene, x, y) {
        try {
            // Create detailed blue spaceship with 3D effect
            const g = scene.add.graphics();
            const width = 60;
            const height = 80;
            
            // Shadow layer
            g.fillStyle(0x000033, 0.5);
            g.fillEllipse(0, height/2 + 5, width * 1.2, height * 0.3);
            
            // Main body - gradient blue
            g.fillGradientStyle(0x00aaff, 0x00aaff, 0x0066ff, 0x0066ff, 1);
            g.fillRoundedRect(-width/2, -height/2, width, height, 5);
            
            // Top section (cockpit area)
            g.fillStyle(0x00ddff, 1);
            g.fillRoundedRect(-width/2 + 5, -height/2, width - 10, height/3, 3);
            
            // Cockpit window
            g.fillStyle(0x00ffff, 0.8);
            g.fillEllipse(0, -height/3, width/2, height/4);
            g.lineStyle(2, 0x0088ff, 1);
            g.strokeEllipse(0, -height/3, width/2, height/4);
            
            // Wings
            g.fillStyle(0x0088ff, 1);
            g.fillTriangle(-width/2 - 15, height/4, -width/2, height/2, -width/2, 0);
            g.fillTriangle(width/2 + 15, height/4, width/2, height/2, width/2, 0);
            
            // Engine nozzles
            g.fillStyle(0x0044aa, 1);
            g.fillRect(-width/4, height/2 - 10, width/6, 15);
            g.fillRect(width/4 - width/6, height/2 - 10, width/6, 15);
            
            // Engine glow
            g.fillStyle(0x00ffff, 0.6);
            g.fillRect(-width/4, height/2, width/6, 8);
            g.fillRect(width/4 - width/6, height/2, width/6, 8);
            
            // Details - side panels
            g.lineStyle(2, 0x0088ff, 0.8);
            g.strokeRoundedRect(-width/2, -height/2, width, height, 5);
            g.lineStyle(1, 0x00ffff, 0.6);
            g.strokeLine(-width/2 + 10, -height/4, width/2 - 10, -height/4);
            g.strokeLine(-width/2 + 10, height/4, width/2 - 10, height/4);
            
            // Generate texture
            g.generateTexture('playerGenerated', width + 30, height + 20);
            g.destroy();
            
            this.sprite = scene.add.sprite(x, y, 'playerGenerated');
            this.sprite.setScale(0.6);
        } catch (e) {
            console.error('Error creating realistic player sprite:', e);
            // Simple fallback
            this.sprite = scene.add.rectangle(x, y, 30, 30, 0x00ff00);
        }
    }

    get x() {
        return this.sprite.x;
    }

    get y() {
        return this.sprite.y;
    }

    setX(x) {
        this.sprite.x = x;
        if (this.shadow) this.shadow.x = x;
        // Glow is disabled to prevent ghost artifacts
        if (this.engineTrail) this.engineTrail.setPosition(x, this.sprite.y + 20);
    }

    update(time, delta, cursors, wasd, stats) {
        // Initialize engine trail if particle texture is ready
        if (!this.engineTrail && this.scene.textures.exists('particle')) {
            this.engineTrail = this.scene.add.particles(this.sprite.x, this.sprite.y + 20, 'particle', {
                speed: { min: 20, max: 40 },
                scale: { start: 0.3, end: 0 },
                tint: [0x00ffff, 0x0088ff],
                lifespan: 300,
                frequency: 50,
                angle: 90
            });
            this.engineTrail.setDepth(9);
        }
        
        // Keyboard movement
        let moveSpeed = (stats.speed || 300) * (delta / 1000);
        
        // Horizontal movement (left/right)
        if (cursors.left.isDown || wasd.A.isDown) {
            this.sprite.x = Phaser.Math.Clamp(this.sprite.x - moveSpeed, 30, this.scene.scale.width - 30);
            // Tilt effect
            this.sprite.setRotation(-0.1);
        } else if (cursors.right.isDown || wasd.D.isDown) {
            this.sprite.x = Phaser.Math.Clamp(this.sprite.x + moveSpeed, 30, this.scene.scale.width - 30);
            // Tilt effect
            this.sprite.setRotation(0.1);
        } else {
            // Return to center rotation
            this.sprite.setRotation(Phaser.Math.Linear(this.sprite.rotation, 0, 0.1));
        }
        
        // Vertical movement (up/down)
        if (cursors.up.isDown || wasd.W.isDown) {
            this.sprite.y = Phaser.Math.Clamp(this.sprite.y - moveSpeed, 100, this.scene.scale.height - 100);
        } else if (cursors.down.isDown || wasd.S.isDown) {
            this.sprite.y = Phaser.Math.Clamp(this.sprite.y + moveSpeed, 100, this.scene.scale.height - 100);
        }
        
        // Update shadow position (glow is disabled to prevent ghost artifacts)
        if (this.shadow) {
            this.shadow.x = this.sprite.x;
            this.shadow.y = this.sprite.y + 25;
        }
        if (this.engineTrail) {
            this.engineTrail.setPosition(this.sprite.x, this.sprite.y + 20);
        }
    }

    takeDamage(amount) {
        if (this.shield > 0) {
            this.shield--;
            // Shield hit effect
            this.scene.tweens.add({
                targets: this.sprite,
                tint: 0x00ffff,
                duration: 100,
                yoyo: true
            });
            return;
        }

        this.hp -= amount;
        
        // Haptic feedback - vibration on player hit
        if (window.vibrationManager) {
            window.vibrationManager.playerHit();
        }
        
        // Damage flash
        this.scene.tweens.add({
            targets: this.sprite,
            tint: 0xff0000,
            duration: 100,
            yoyo: true
        });

        // Screen shake
        this.scene.cameras.main.shake(100, 0.01);

        if (this.hp <= 0) {
            this.hp = 0;
            this.scene.gameOver();
        }
    }

    heal(amount) {
        this.hp = Math.min(this.hp + amount, this.maxHP);
    }
}
