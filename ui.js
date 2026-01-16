// UI System
class UI {
    constructor(scene, gameState) {
        this.scene = scene;
        this.gameState = gameState;
        
        // Top bar
        this.createTopBar();
        
        // Health bar
        this.createHealthBar();
        
        // Buttons
        this.createButtons();
        
        // Shop button handler
        this.setupShopButton();
    }

    createTopBar() {
        // Currency display (left)
        this.currencyContainer = this.scene.add.container(10, 10);
        
        // Professional UI with glow effects
        this.goldText = this.scene.add.text(0, 0, '🪙 0', {
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#ffd700',
            stroke: '#000000',
            strokeThickness: 4
        });
        this.goldText.setShadow(3, 3, '#ffaa00', 3, true);
        
        this.lightningText = this.scene.add.text(0, 35, '⚡ 0', {
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#00ffff',
            stroke: '#000000',
            strokeThickness: 4
        });
        this.lightningText.setShadow(3, 3, '#0088ff', 3, true);
        
        this.diamondsText = this.scene.add.text(0, 70, '💎 0', {
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#ff00ff',
            stroke: '#000000',
            strokeThickness: 4
        });
        this.diamondsText.setShadow(3, 3, '#ff0088', 3, true);
        
        this.currencyContainer.add([this.goldText, this.lightningText, this.diamondsText]);
        this.currencyContainer.setScrollFactor(0);
        this.currencyContainer.setDepth(100);
        
        // Stage display (center) with professional styling
        this.stageText = this.scene.add.text(
            this.scene.scale.width / 2,
            20,
            'STAGE 1',
            {
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#00ffff',
                align: 'center',
                stroke: '#000000',
                strokeThickness: 5
            }
        );
        this.stageText.setOrigin(0.5, 0);
        this.stageText.setShadow(4, 4, '#0088ff', 4, true);
        this.stageText.setScrollFactor(0);
        this.stageText.setDepth(100);
        
        // Glow effect for stage text
        this.scene.tweens.add({
            targets: this.stageText,
            alpha: { from: 0.9, to: 1 },
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
        
        // Score and Level (right)
        this.scoreText = this.scene.add.text(
            this.scene.scale.width - 10,
            10,
            'Score: 0',
            {
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#ffff00',
                align: 'right'
            }
        );
        this.scoreText.setOrigin(1, 0);
        this.scoreText.setShadow(2, 2, '#000', 2);
        this.scoreText.setScrollFactor(0);
        this.scoreText.setDepth(100);
        
        this.levelText = this.scene.add.text(
            this.scene.scale.width - 10,
            40,
            'Level 1',
            {
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#00ff00',
                align: 'right'
            }
        );
        this.levelText.setOrigin(1, 0);
        this.levelText.setShadow(2, 2, '#000', 2);
        this.levelText.setScrollFactor(0);
        this.levelText.setDepth(100);
    }

    createHealthBar() {
        this.barWidth = this.scene.scale.width - 200;
        this.barHeight = 20;
        this.barX = 100;
        this.barY = this.scene.scale.height - 30;
        
        const barWidth = this.barWidth;
        const barHeight = this.barHeight;
        const barX = this.barX;
        const barY = this.barY;
        
        // Professional health bar with gradient
        // Background with border
        this.healthBarBg = this.scene.add.graphics();
        this.healthBarBg.fillStyle(0x000000, 0.9);
        this.healthBarBg.fillRoundedRect(barX - 2, barY - barHeight/2 - 2, barWidth + 4, barHeight + 4, 5);
        this.healthBarBg.lineStyle(2, 0x00ffff, 1);
        this.healthBarBg.strokeRoundedRect(barX - 2, barY - barHeight/2 - 2, barWidth + 4, barHeight + 4, 5);
        this.healthBarBg.setScrollFactor(0);
        this.healthBarBg.setDepth(100);
        
        // Health bar fill with gradient effect
        this.healthBar = this.scene.add.graphics();
        this.healthBar.setScrollFactor(0);
        this.healthBar.setDepth(101);
        // Ensure graphics object starts cleared (no drawing at 0,0)
        this.healthBar.clear();
        
        // Glow effect
        this.healthBarGlow = this.scene.add.graphics();
        this.healthBarGlow.setScrollFactor(0);
        this.healthBarGlow.setDepth(99);
        this.healthBarGlow.setBlendMode(Phaser.BlendModes.ADD);
        // Ensure graphics object starts cleared (no drawing at 0,0)
        this.healthBarGlow.clear();
        
        // Health text
        this.healthText = this.scene.add.text(
            barX + barWidth / 2,
            barY,
            '100 / 100',
            {
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#ffffff',
                align: 'center'
            }
        );
        this.healthText.setOrigin(0.5);
        this.healthText.setScrollFactor(0);
        this.healthText.setDepth(102);
    }

    createButtons() {
        // Shop button (bottom left)
        const shopBtn = this.scene.add.rectangle(
            50,
            this.scene.scale.height - 30,
            80,
            40,
            0x0052FF,
            0.8
        );
        shopBtn.setScrollFactor(0);
        shopBtn.setDepth(100);
        shopBtn.setInteractive({ useHandCursor: true });
        
        const shopBtnText = this.scene.add.text(
            50,
            this.scene.scale.height - 30,
            '🛒 SHOP',
            {
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#ffffff',
                align: 'center'
            }
        );
        shopBtnText.setOrigin(0.5);
        shopBtnText.setScrollFactor(0);
        shopBtnText.setDepth(101);
        
        shopBtn.on('pointerdown', () => {
            // Play click sound
            if (this.scene.playSound) {
                this.scene.playSound('click');
            }
            this.openShop();
        });
        
        // Pause button (top right) - positioned with more spacing to avoid overlap
        // Level text is at y=40 with fontSize 16px, so pause button goes to y=75 with extra spacing
        const pauseBtn = this.scene.add.rectangle(
            this.scene.scale.width - 50,
            75,  // Moved further down from Level text (y=40) with 35px spacing
            60,
            30,
            0x666666,
            0.8
        );
        pauseBtn.setScrollFactor(0);
        pauseBtn.setDepth(100);
        pauseBtn.setInteractive({ useHandCursor: true });
        
        const pauseBtnText = this.scene.add.text(
            this.scene.scale.width - 50,
            75,  // Moved further down with more spacing
            '⏸️',
            {
                fontSize: '18px',
                align: 'center'
            }
        );
        pauseBtnText.setOrigin(0.5);
        pauseBtnText.setScrollFactor(0);
        pauseBtnText.setDepth(101);
        
        pauseBtn.on('pointerdown', () => {
            // Play click sound
            if (this.scene.playSound) {
                this.scene.playSound('click');
            }
            this.scene.togglePause();
        });
    }

    setupShopButton() {
        // Also handle shop button from HTML
        const shopBtn = document.getElementById('shop-btn');
        if (shopBtn) {
            shopBtn.addEventListener('click', () => this.openShop());
        }
    }

    openShop() {
        // Track if game was already paused before opening shop
        this.wasPausedBeforeShop = this.scene.gameState.paused;
        
        // Pause game if not already paused
        if (!this.scene.gameState.paused) {
            this.scene.scene.pause();
            this.scene.gameState.paused = true;
        }
        document.getElementById('shop-overlay').classList.remove('hidden');
        if (window.shopSystem) {
            window.shopSystem.updateDisplay();
        }
    }

    update(gameState) {
        // Update currency
        this.goldText.setText(`🪙 ${this.formatNumber(gameState.gold)}`);
        this.lightningText.setText(`⚡ ${this.formatNumber(gameState.lightning)}`);
        this.diamondsText.setText(`💎 ${this.formatNumber(gameState.diamonds)}`);
        
        // Update stage
        this.stageText.setText(`STAGE ${gameState.stage}`);
        
        // Update score
        const multiplier = gameState.scoreMultiplier || 1;
        this.scoreText.setText(`Score: ${this.formatNumber(gameState.score * multiplier)}`);
        
        // Update level
        this.levelText.setText(`Level ${gameState.playerLevel}`);
        
        // Update health bar - only if properly initialized and valid coordinates
        if (this.scene.player && this.healthBar && this.healthBarGlow && 
            typeof this.barX !== 'undefined' && typeof this.barY !== 'undefined' &&
            this.barX > 0 && this.barY > 0 && this.barX > 50 && this.barY > 50) {
            const hp = this.scene.player.hp;
            const maxHP = this.scene.player.maxHP;
            const percent = Math.max(0, hp / maxHP);
            
            const currentWidth = this.barWidth * percent;
            
            // Clear and redraw health bar with gradient
            this.healthBar.clear();
            this.healthBarGlow.clear();
            
            // Determine color based on health
            let color1, color2;
            if (percent > 0.5) {
                color1 = 0x00ff00;
                color2 = 0x88ff88;
            } else if (percent > 0.25) {
                color1 = 0xffff00;
                color2 = 0xffff88;
            } else {
                color1 = 0xff0000;
                color2 = 0xff8888;
            }
            
            // Draw gradient health bar (ensure valid coordinates - prevent drawing at 0,0 or top-left)
            // barX should be 100 (left margin), barY should be at bottom (height - 30)
            // STRICT check: barX must be >= 100, barY must be in bottom half of screen
            if (this.barX && this.barY && this.barWidth && this.barHeight && 
                this.barX >= 100 && this.barY > this.scene.scale.height / 2 && currentWidth > 0) {
                this.healthBar.fillGradientStyle(color1, color1, color2, color2, 1);
                this.healthBar.fillRoundedRect(this.barX, this.barY - this.barHeight/2, currentWidth, this.barHeight, 3);
                
                // Glow effect (only if bar is drawn) - same strict coordinates
                if (this.barX >= 100 && this.barY > this.scene.scale.height / 2) {
                    this.healthBarGlow.fillStyle(color1, 0.3);
                    this.healthBarGlow.fillRoundedRect(this.barX - 2, this.barY - this.barHeight/2 - 2, currentWidth + 4, this.barHeight + 4, 5);
                }
            }
            
            if (this.healthText) {
                this.healthText.setText(`${Math.ceil(hp)} / ${maxHP}`);
            }
        } else {
            // If health bar not ready, ensure graphics are cleared to prevent artifacts
            if (this.healthBar) this.healthBar.clear();
            if (this.healthBarGlow) this.healthBarGlow.clear();
        }
        
        // Update XP bar (if we add one)
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return Math.floor(num).toString();
    }
}
