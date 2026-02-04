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
        
        // Daily Check-in button
        this.createDailyCheckInButton();
        
        // Shop button handler
        this.setupShopButton();

        this.applyLayout();
        this.scene.scale.on('resize', (gameSize) => {
            this.applyLayout(gameSize.width, gameSize.height);
        });

        window.addEventListener('load', () => {
            this.updateCheckInButtonState();
        });
        window.addEventListener('focus', () => {
            this.updateCheckInButtonState();
        });
        window.addEventListener('base-invaders:game-ready', () => {
            this.attachCheckInHandlers();
            this.updateCheckInButtonState();
        });
        window.addEventListener('base-invaders:wallet-connected', () => {
            this.updateCheckInButtonState();
        });
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
        // Create buttons with temporary positions (will be set by applyLayout)
        // Shop button (bottom left)
        this.shopBtn = this.scene.add.rectangle(
            0, 0, // Temporary - set by applyLayout
            80, 40,
            0x0052FF,
            0.8
        );
        this.shopBtn.setScrollFactor(0);
        this.shopBtn.setDepth(100);
        this.shopBtn.setInteractive({ useHandCursor: true });
        
        this.shopBtnText = this.scene.add.text(
            0, 0, // Temporary - set by applyLayout
            '🛒 SHOP',
            {
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#ffffff',
                align: 'center'
            }
        );
        this.shopBtnText.setOrigin(0.5);
        this.shopBtnText.setScrollFactor(0);
        this.shopBtnText.setDepth(101);
        
        this.shopBtn.on('pointerdown', () => {
            // Play click sound
            if (this.scene.playSound) {
                this.scene.playSound('click');
            }
            this.openShop();
        });
        
        // Pause button (top right)
        this.pauseBtn = this.scene.add.rectangle(
            0, 0, // Temporary - set by applyLayout
            60, 30,
            0x666666,
            0.8
        );
        this.pauseBtn.setScrollFactor(0);
        this.pauseBtn.setDepth(100);
        this.pauseBtn.setInteractive({ useHandCursor: true });
        
        this.pauseBtnText = this.scene.add.text(
            0, 0, // Temporary - set by applyLayout
            '⏸️',
            {
                fontSize: '18px',
                align: 'center'
            }
        );
        this.pauseBtnText.setOrigin(0.5);
        this.pauseBtnText.setScrollFactor(0);
        this.pauseBtnText.setDepth(101);
        
        this.pauseBtn.on('pointerdown', () => {
            // Play click sound
            if (this.scene.playSound) {
                this.scene.playSound('click');
            }
            this.scene.togglePause();
        });
    }

    getLayoutMetrics(width = this.scene.scale.width, height = this.scene.scale.height) {
        // Base margins and spacing
        const margin = Math.max(10, width * 0.03);
        const topMargin = Math.max(8, height * 0.02);
        
        // Font sizes (stage smaller so "Mission X / Wave Y" fits and doesn't overlap score or currency)
        const currencyFont = Math.max(14, Math.min(width * 0.045, 22));
        const stageFont = Math.max(14, Math.min(width * 0.04, 20));
        const scoreFont = Math.max(12, Math.min(width * 0.035, 20));
        const levelFont = Math.max(11, Math.min(width * 0.03, 16));
        const currencySpacing = Math.max(18, currencyFont * 1.5);
        
        // Health bar (at bottom, primary reference point)
        const healthBarHeight = Math.max(12, Math.min(height * 0.03, 20));
        const healthBarMargin = Math.max(45, height * 0.075); // Space from bottom
        const healthBarY = height - healthBarMargin;
        const healthBarWidth = Math.max(220, Math.min(width * 0.7, width - margin * 2));
        const healthBarX = (width - healthBarWidth) / 2;
        
        // Shop button (above health bar)
        const shopWidth = Math.max(70, Math.min(width * 0.2, 120));
        const shopHeight = Math.max(30, Math.min(height * 0.06, 40));
        const shopMargin = Math.max(15, height * 0.025); // Gap above health bar
        const shopY = healthBarY - healthBarHeight - shopMargin - (shopHeight / 2);
        const shopX = margin + shopWidth / 2;
        
        // Pause button (below level text, top right)
        const pauseWidth = Math.max(50, Math.min(width * 0.12, 80));
        const pauseHeight = Math.max(26, Math.min(height * 0.05, 36));
        const pauseGap = Math.max(15, height * 0.025); // Gap below level text
        const pauseY = topMargin + scoreFont * 1.4 + levelFont * 1.6 + pauseGap + (pauseHeight / 2);
        const pauseX = width - margin - pauseWidth / 2;
        
        // Check-in button (below currency, left side)
        const checkInWidth = Math.max(100, Math.min(width * 0.28, 160));
        const checkInHeight = Math.max(34, Math.min(height * 0.06, 46));
        const checkInY = topMargin + currencySpacing * 3 + checkInHeight / 2 + Math.max(8, height * 0.01);
        const checkInX = margin + checkInWidth / 2;
        
        // Button fonts
        const shopFont = Math.max(12, Math.min(width * 0.032, 16));
        const pauseFont = Math.max(14, Math.min(width * 0.04, 20));

        return {
            width,
            height,
            margin,
            topMargin,
            
            // Fonts
            currencyFont,
            stageFont,
            scoreFont,
            levelFont,
            currencySpacing,
            
            // Health bar
            healthBarHeight,
            healthBarWidth,
            healthBarX,
            healthBarY,
            healthBarMargin,
            
            // Shop button - ALL coordinates
            shopWidth,
            shopHeight,
            shopX,
            shopY,
            shopFont,
            
            // Pause button - ALL coordinates
            pauseWidth,
            pauseHeight,
            pauseX,
            pauseY,
            pauseFont,
            
            // Check-in button
            checkInWidth,
            checkInHeight,
            checkInX,
            checkInY
        };
    }

    applyLayout(width = this.scene.scale.width, height = this.scene.scale.height) {
        this.layout = this.getLayoutMetrics(width, height);
        const layout = this.layout;

        // Currency container and text
        this.currencyContainer.setPosition(layout.margin, layout.topMargin);
        this.goldText.setFontSize(`${layout.currencyFont}px`);
        this.lightningText.setFontSize(`${layout.currencyFont}px`);
        this.diamondsText.setFontSize(`${layout.currencyFont}px`);
        this.goldText.setPosition(0, 0);
        this.lightningText.setPosition(0, layout.currencySpacing);
        this.diamondsText.setPosition(0, layout.currencySpacing * 2);

        // Stage text (center, smaller font so 2-line text doesn't overlap)
        this.stageText.setPosition(layout.width / 2, layout.topMargin);
        this.stageText.setFontSize(`${layout.stageFont}px`);

        // Score and level (right)
        this.scoreText.setPosition(layout.width - layout.margin, layout.topMargin);
        this.scoreText.setFontSize(`${layout.scoreFont}px`);
        this.levelText.setPosition(layout.width - layout.margin, layout.topMargin + layout.scoreFont * 1.4);
        this.levelText.setFontSize(`${layout.levelFont}px`);

        // Pause button (top right) - use pre-calculated metrics
        this.pauseBtn.setPosition(layout.pauseX, layout.pauseY);
        this.pauseBtn.setSize(layout.pauseWidth, layout.pauseHeight);
        this.pauseBtnText.setPosition(layout.pauseX, layout.pauseY);
        this.pauseBtnText.setFontSize(`${layout.pauseFont}px`);

        // Shop button (bottom left, above health bar) - use pre-calculated metrics
        this.shopBtn.setPosition(layout.shopX, layout.shopY);
        this.shopBtn.setSize(layout.shopWidth, layout.shopHeight);
        this.shopBtnText.setPosition(layout.shopX, layout.shopY);
        this.shopBtnText.setFontSize(`${layout.shopFont}px`);

        // Health bar
        this.barWidth = layout.healthBarWidth;
        this.barHeight = layout.healthBarHeight;
        this.barX = layout.healthBarX;
        this.barY = layout.healthBarY;

        this.healthBarBg.clear();
        this.healthBarBg.fillStyle(0x000000, 0.9);
        this.healthBarBg.fillRoundedRect(
            this.barX - 2,
            this.barY - this.barHeight / 2 - 2,
            this.barWidth + 4,
            this.barHeight + 4,
            5
        );
        this.healthBarBg.lineStyle(2, 0x00ffff, 1);
        this.healthBarBg.strokeRoundedRect(
            this.barX - 2,
            this.barY - this.barHeight / 2 - 2,
            this.barWidth + 4,
            this.barHeight + 4,
            5
        );

        this.healthText.setPosition(this.barX + this.barWidth / 2, this.barY);
        this.healthText.setFontSize(`${Math.max(12, layout.healthBarHeight)}px`);

        // Daily check-in button
        const checkInX = layout.margin + layout.checkInWidth / 2;
        const checkInY = layout.topMargin + layout.currencySpacing * 3 + layout.checkInHeight / 2 + Math.max(8, height * 0.01);
        this.checkInLayout = {
            x: checkInX,
            y: checkInY,
            width: layout.checkInWidth,
            height: layout.checkInHeight
        };
        this.checkInButton.setPosition(checkInX, checkInY);
        this.checkInButton.setSize(layout.checkInWidth * 1.2, layout.checkInHeight * 1.2);
        this.checkInButtonText.setPosition(checkInX, checkInY);
        this.checkInButtonText.setFontSize(`${Math.max(11, layout.checkInHeight * 0.35)}px`);
        this.checkInCountdownText.setPosition(checkInX, checkInY + layout.checkInHeight * 0.35);
        this.checkInCountdownText.setFontSize(`${Math.max(10, layout.checkInHeight * 0.28)}px`);

        this.attachCheckInHandlers();
        this.updateCheckInButtonState();
        
        // Update mute button position after layout (if it exists)
        if (this.scene.updateMuteButtonPosition) {
            this.scene.time.delayedCall(50, () => {
                this.scene.updateMuteButtonPosition();
            });
        }
    }

    attachCheckInHandlers() {
        if (!this.checkInButton || !this.checkInButtonText || !this.handleCheckIn) return;
        this.checkInButton.removeAllListeners('pointerdown');
        this.checkInButtonText.removeAllListeners('pointerdown');
        this.checkInButton.on('pointerdown', this.handleCheckIn, this);
        this.checkInButtonText.on('pointerdown', this.handleCheckIn, this);
    }

    // Helper: Get stable local day key (YYYY-MM-DD)
    getDayKey(date = new Date()) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Helper: Get UTC day key (for check-in: contract uses block.timestamp = UTC)
    getDayKeyUTC(date = new Date()) {
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Helper: Calculate days between two day keys (local dates)
    daysBetweenDayKeys(key1, key2) {
        const d1 = new Date(key1 + 'T00:00:00');
        const d2 = new Date(key2 + 'T00:00:00');
        return Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    }

    // Helper: Days between UTC day keys (for check-in streak)
    daysBetweenDayKeysUTC(key1, key2) {
        const d1 = new Date(key1 + 'T00:00:00Z');
        const d2 = new Date(key2 + 'T00:00:00Z');
        return Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    }

    /** Get Farcaster ID for per-user check-in state (localStorage keys). */
    async getUserFid() {
        try {
            const ctx = await window.baseInvadersGetUserContext?.();
            const fid = ctx?.user?.fid;
            return fid != null ? String(fid) : 'default';
        } catch (e) {
            return 'default';
        }
    }

    /** localStorage key for last check-in date (per user). */
    getLastCheckInKey() {
        const fid = this._checkInFid ?? window.__baseInvadersCheckInFid ?? 'default';
        return 'lastCheckIn_' + fid;
    }

    /** localStorage key for check-in streak (per user). */
    getStreakKey() {
        const fid = this._checkInFid ?? window.__baseInvadersCheckInFid ?? 'default';
        return 'checkInStreak_' + fid;
    }

    createDailyCheckInButton() {
        this._checkInFid = 'default';
        (async () => {
            this._checkInFid = await this.getUserFid();
            window.__baseInvadersCheckInFid = this._checkInFid;
            if (this.updateCheckInButtonState) this.updateCheckInButtonState();
        })();

        const buttonX = this.scene.scale.width * 0.1;
        const buttonY = this.scene.scale.height * 0.25;
        const buttonWidth = 120;
        const buttonHeight = 40;
        this.checkInLayout = { x: buttonX, y: buttonY, width: buttonWidth, height: buttonHeight };
        
        // Button background graphics
        this.checkInButtonBg = this.scene.add.graphics();
        this.checkInButtonBg.setScrollFactor(0);
        this.checkInButtonBg.setDepth(105);
        
        // Interactive rectangle (invisible, for click detection)
        this.checkInButton = this.scene.add.rectangle(buttonX, buttonY, buttonWidth, buttonHeight, 0x00ffff, 0);
        this.checkInButton.setScrollFactor(0);
        this.checkInButton.setDepth(105);
        this.checkInButton.setInteractive({ useHandCursor: true });
        
        // Button text
        this.checkInButtonText = this.scene.add.text(buttonX, buttonY, '📅 CHECK-IN', {
            fontSize: '13px',
            fontWeight: 'bold',
            color: '#ffffff',
            align: 'center'
        });
        this.checkInButtonText.setOrigin(0.5);
        this.checkInButtonText.setScrollFactor(0);
        this.checkInButtonText.setDepth(106);
        this.checkInButtonText.setInteractive({ useHandCursor: true });
        
        // Countdown text (shown when disabled)
        this.checkInCountdownText = this.scene.add.text(buttonX, buttonY + 15, '', {
            fontSize: '11px',
            fontWeight: 'bold',
            color: '#cccccc',
            align: 'center'
        });
        this.checkInCountdownText.setOrigin(0.5);
        this.checkInCountdownText.setScrollFactor(0);
        this.checkInCountdownText.setDepth(106);
        this.checkInCountdownText.setVisible(false);
        
        // Glow effect (shown when active)
        this.checkInGlow = this.scene.add.graphics();
        this.checkInGlow.setScrollFactor(0);
        this.checkInGlow.setDepth(104);
        this.checkInGlow.setBlendMode(Phaser.BlendModes.ADD);
        
        // Initialize button state
        this.updateCheckInButtonState();
        
        // Click handler
        const handleCheckIn = async () => {
            console.log('Check-in button clicked');
            console.log('🎯 CHECK-IN CLICKED!');
            console.log('isActive:', this.isCheckInActive);
            console.log('isPending:', this.checkInPending);
            if (!this.isCheckInActive()) {
                return; // Button is disabled
            }
            
            if (this.checkInPending) {
                return;
            }

            // Play click sound
            if (this.scene.playSound) {
                this.scene.playSound('click');
            }

            const notifyX = this.checkInLayout?.x ?? buttonX;
            const notifyY = this.checkInLayout?.y ?? buttonY;
            const todayKey = this.getDayKey();

            if (typeof window.baseInvadersOnchainCheckIn !== 'function') {
                console.error('[UI] SDK function not found');
                this.showNotification('⚠️ SDK not loaded', notifyX, notifyY - 40);
                return;
            }

            this.checkInPending = true;
            this.checkInButtonText.setText('⛓️ SIGNING...');
            this.checkInButton.disableInteractive();
            this.checkInButtonText.disableInteractive();

            try {
                const result = await window.baseInvadersOnchainCheckIn();
                console.log('[UI] Check-in tx success:', result);

                const lastKey = this.getLastCheckInKey();
                const streakKey = this.getStreakKey();
                this._lastCheckInKeyUsed = lastKey;
                localStorage.setItem(lastKey, todayKey);
                this.showNotification('⛓️ Confirmed on Base!', notifyX, notifyY - 40);

                let totalDays = 0;
                const streakData = localStorage.getItem(streakKey);
                if (streakData) {
                    try {
                        const data = JSON.parse(streakData);
                        const lastDateKey = data.lastDate;
                        const previousStreak = data.totalDays || 0;
                        if (!lastDateKey) {
                            totalDays = 1;
                        } else {
                            const daysSince = this.daysBetweenDayKeys(lastDateKey, todayKey);
                            if (daysSince === 1) totalDays = previousStreak + 1;
                            else if (daysSince === 0) totalDays = previousStreak || 1;
                            else totalDays = 1;
                        }
                    } catch (e) {
                        totalDays = 1;
                    }
                } else {
                    totalDays = 1;
                }

                localStorage.setItem(this.getStreakKey(), JSON.stringify({ totalDays, lastDate: todayKey }));
                this._lastCheckInKeyUsed = this.getLastCheckInKey();

                const isMilestone = (totalDays % 7 === 0 && totalDays >= 7);
                const dayInCycle = (totalDays % 7) || 7;
                const milestoneNumber = Math.floor(totalDays / 7);
                const baseRewards = [10, 15, 20, 25, 30, 35, 50];
                let reward = baseRewards[dayInCycle - 1];
                if (isMilestone) reward += reward;

                this.gameState.diamonds += reward;
                const message = isMilestone ? `🎉 MILESTONE DAY ${totalDays}! +${reward} 💎` : `+${reward} 💎 Day Streak: ${totalDays}`;
                this.showNotification(message, this.checkInLayout.x, this.checkInLayout.y - 40);
                this.updateCheckInButtonState();
                this.startCountdownInterval();
                if (this.scene.syncProgress) this.scene.syncProgress();
                if (isMilestone) setTimeout(() => this.showMilestoneCelebration(totalDays), 500);
            } catch (error) {
                console.error('[UI] Check-in tx failed:', error.message);
                let errorMsg = 'Transaction failed';
                if (error.message.includes('cancelled') || error.message.includes('rejected')) errorMsg = 'Transaction cancelled';
                else if (error.message.includes('funds')) errorMsg = 'Insufficient funds';
                else if (error.message.includes('not available')) errorMsg = 'Wallet not ready, try again';
                else if (error.message.includes('Already checked in today')) {
                    errorMsg = 'Already checked in today';
                    const key = this.getLastCheckInKey();
                    this._lastCheckInKeyUsed = key;
                    localStorage.setItem(key, todayKey);
                    this.startCountdownInterval();
                    this.updateCheckInButtonState();
                    if (this.scene.syncProgress) this.scene.syncProgress();
                }
                this.showNotification('⚠️ ' + errorMsg, notifyX, notifyY - 40);
            } finally {
                this.checkInPending = false;
                this.checkInButton.setInteractive({ useHandCursor: true });
                this.checkInButtonText.setInteractive({ useHandCursor: true });
            }
        };
        
        this.handleCheckIn = handleCheckIn;
        this.attachCheckInHandlers();
        
        // Hover effect (only when active)
        this.checkInButton.on('pointerover', () => {
            if (this.isCheckInActive()) {
                this.checkInButton.setScale(1.1);
                this.checkInButtonText.setScale(1.1);
            }
        });
        
        this.checkInButton.on('pointerout', () => {
            this.checkInButton.setScale(1);
            this.checkInButtonText.setScale(1);
        });
        
        // Start countdown interval on creation
        this.startCountdownInterval();
    }

    startCountdownInterval() {
        // Clear existing interval if any
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
        
        // Update immediately
        this.updateCheckInButtonState();
        
        // Update every second
        this.countdownInterval = setInterval(() => {
            this.updateCheckInButtonState();
        }, 1000);
    }

    /** YYYY-MM-DD regex for valid day keys */
    _isDayKey(val) {
        if (typeof val !== 'string' || val.length !== 10) return false;
        return /^\d{4}-\d{2}-\d{2}$/.test(val);
    }

    /**
     * Get effective last check-in date from any source (current FID, legacy, or any lastCheckIn_*).
     * Sets _lastCheckInKeyUsed to the key that had the latest date so streak can be found.
     */
    _getLastCheckInValue() {
        const candidates = [];
        const currentKey = this.getLastCheckInKey();
        candidates.push([currentKey, localStorage.getItem(currentKey)]);
        if (currentKey !== 'lastCheckIn') candidates.push(['lastCheckIn', localStorage.getItem('lastCheckIn')]);
        if (this._lastCheckInKeyUsed) candidates.push([this._lastCheckInKeyUsed, localStorage.getItem(this._lastCheckInKeyUsed)]);
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                if (k && (k === 'lastCheckIn' || k.startsWith('lastCheckIn_')))
                    candidates.push([k, localStorage.getItem(k)]);
            }
        } catch (e) { /* ignore */ }
        let bestDate = null;
        let bestKey = null;
        for (const [key, val] of candidates) {
            if (!key || val == null || !this._isDayKey(val)) continue;
            if (bestDate == null || val > bestDate) {
                bestDate = val;
                bestKey = key;
            }
        }
        if (bestKey) {
            this._lastCheckInKeyUsed = bestKey;
            const m = bestKey.match(/^lastCheckIn_(.+)$/);
            if (m && m[1] !== 'default') {
                this._checkInFid = m[1];
                if (typeof window !== 'undefined') window.__baseInvadersCheckInFid = m[1];
            }
        }
        return bestDate;
    }

    _getStreakValue() {
        const key = this.getStreakKey();
        let v = localStorage.getItem(key);
        if (v == null && this._lastCheckInKeyUsed) {
            const streakKey = (this._lastCheckInKeyUsed || '').replace('lastCheckIn_', 'checkInStreak_');
            if (streakKey) v = localStorage.getItem(streakKey);
        }
        if (v == null) v = localStorage.getItem('checkInStreak');
        return v;
    }

    isCheckInActive() {
        const lastCheckIn = this._getLastCheckInValue();
        if (!lastCheckIn) {
            return true; // Never checked in, button is active
        }
        const todayKey = this.getDayKey();
        return lastCheckIn !== todayKey;
    }

    getCheckInTimeRemaining() {
        const lastCheckIn = this._getLastCheckInValue();
        if (!lastCheckIn) {
            return null; // No cooldown
        }
        const todayKey = this.getDayKey();
        if (lastCheckIn !== todayKey) {
            return null; // Cooldown expired (different day)
        }
        const now = new Date();
        const nextLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
        const msRemaining = nextLocal.getTime() - now.getTime();
        if (msRemaining <= 0) {
            return null;
        }
        const hours = Math.floor(msRemaining / (1000 * 60 * 60));
        const minutes = Math.floor((msRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((msRemaining % (1000 * 60)) / 1000);
        return { hours, minutes, seconds };
    }

    getCheckInStreak() {
        const streakData = this._getStreakValue();
        if (!streakData) {
            return { totalDays: 0, nextMilestone: 7, isMilestone: false };
        }
        try {
            const data = JSON.parse(streakData);
            const lastDateKey = data.lastDate;
            if (!lastDateKey) {
                return { totalDays: 0, nextMilestone: 7, isMilestone: false };
            }
            const todayKey = this.getDayKey();
            const daysSince = this.daysBetweenDayKeys(lastDateKey, todayKey);
            if (daysSince > 1 || daysSince < 0) {
                return { totalDays: 0, nextMilestone: 7, isMilestone: false };
            }
            const totalDays = data.totalDays || 0;
            const nextMilestone = Math.ceil(totalDays / 7) * 7;
            const isMilestone = (totalDays > 0 && totalDays % 7 === 0);
            return { totalDays, nextMilestone, isMilestone };
        } catch (e) {
            return { totalDays: 0, nextMilestone: 7, isMilestone: false };
        }
    }
    

    updateCheckInButtonState() {
        const layout = this.checkInLayout || { x: 80, y: 170, width: 120, height: 40 };
        const buttonX = layout.x;
        const buttonY = layout.y;

        const buttonWidth = layout.width;
        const buttonHeight = layout.height;
        const streakInfo = this.getCheckInStreak();

        
        const isActive = this.isCheckInActive();
        const timeRemaining = this.getCheckInTimeRemaining();
        
        // Clear and redraw background
        this.checkInButtonBg.clear();
        this.checkInGlow.clear();
        
        if (isActive) {
            // Active state: Cyan color with glow
            this.checkInButtonBg.fillStyle(0x0052FF, 0.9);  // Cyan
            this.checkInButtonBg.fillRoundedRect(buttonX - buttonWidth / 2, buttonY - buttonHeight / 2, buttonWidth, buttonHeight, 5);
            this.checkInButtonBg.lineStyle(2, 0x00ffff, 1);
            this.checkInButtonBg.strokeRoundedRect(buttonX - buttonWidth / 2, buttonY - buttonHeight / 2, buttonWidth, buttonHeight, 5);
            
            // Glow effect
            this.checkInGlow.fillStyle(0x00ffff, 0.3);
            this.checkInGlow.fillRoundedRect(buttonX - buttonWidth / 2 - 2, buttonY - buttonHeight / 2 - 2, buttonWidth + 4, buttonHeight + 4, 7);
            
            // Calculate next day to claim (always starts from 1)
            const currentStreak = streakInfo.totalDays || 0; // 0 if never claimed
            const nextDay = currentStreak + 1; // Day 1, 2, 3... (the day user will claim)
            
            // Check if next claim is milestone
            const isNextMilestone = (nextDay % 7 === 0 && nextDay >= 7);
            
            // Calculate next milestone after this claim
            const nextMilestone = Math.ceil(nextDay / 7) * 7;
            
            // Build button text (restore font size after disabled state)
            this.checkInButtonText.setFontSize(Math.max(11, Math.min(13, layout.checkInHeight * 0.35)) + 'px');
            this.checkInButtonText.setPosition(buttonX, buttonY);
            if (isNextMilestone) {
                this.checkInButtonText.setText(`📅 Day ${nextDay} →${nextDay + 7} 🎉`);
            } else {
                this.checkInButtonText.setText(`📅 Day ${nextDay} →${nextMilestone}`);
            }
            this.checkInButtonText.setColor('#00ff00');
            this.checkInCountdownText.setVisible(false);
            
            // Enable interaction
            this.checkInButton.setInteractive({ useHandCursor: true });
            this.checkInButtonText.setInteractive({ useHandCursor: true });
        } else {
            // Disabled state: Gray, single line countdown inside button (no overflow)
            this.checkInButtonBg.fillStyle(0x666666, 0.7);  // Gray
            this.checkInButtonBg.fillRoundedRect(buttonX - buttonWidth / 2, buttonY - buttonHeight / 2, buttonWidth, buttonHeight, 5);
            this.checkInButtonBg.lineStyle(2, 0x888888, 1);
            this.checkInButtonBg.strokeRoundedRect(buttonX - buttonWidth / 2, buttonY - buttonHeight / 2, buttonWidth, buttonHeight, 5);

            // One line: countdown, larger font (use ~60% of button height), with seconds
            const countdownFontPx = Math.max(12, Math.min(18, Math.floor(buttonHeight * 0.6)));
            this.checkInButtonText.setFontSize(countdownFontPx + 'px');
            this.checkInButtonText.setColor('#00ff00');
            this.checkInButtonText.setPosition(buttonX, buttonY);
            if (timeRemaining && (timeRemaining.hours > 0 || timeRemaining.minutes > 0 || (timeRemaining.seconds != null && timeRemaining.seconds > 0))) {
                const s = timeRemaining.seconds != null ? timeRemaining.seconds : 0;
                this.checkInButtonText.setText(timeRemaining.hours + 'h ' + timeRemaining.minutes + 'm ' + s + 's');
            } else {
                this.checkInButtonText.setText('Checked in');
            }
            this.checkInCountdownText.setVisible(false);

            // Disable interaction
            this.checkInButton.disableInteractive();
            this.checkInButtonText.disableInteractive();
        }
    }

    showNotification(text, x, y) {
        const notification = this.scene.add.text(x, y, text, {
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#00ffff',
            stroke: '#000000',
            strokeThickness: 3
        });
        notification.setOrigin(0.5);
        notification.setScrollFactor(0);
        notification.setDepth(10000);
        notification.setShadow(0, 0, '#00ffff', 10, true);
        
        // Animate notification
        this.scene.tweens.add({
            targets: notification,
            y: y - 50,
            alpha: 0,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => {
                notification.destroy();
            }
        });
    }

    showMilestoneCelebration(dayNumber) {
        // 1. Store current sound states and mute all game sounds
        const gameScene = this.scene;
        const originalSoundStates = {
            bgMusicVolume: null,
            bgMusicWasPlaying: false,
            soundsMuted: false
        };
        
        // Store and mute background music
        if (gameScene.bgMusic) {
            originalSoundStates.bgMusicVolume = gameScene.bgMusic.volume || 0.2;
            originalSoundStates.bgMusicWasPlaying = gameScene.bgMusic.isPlaying;
            gameScene.bgMusic.setVolume(0); // Mute background music
        }
        
        // Mute all game sound effects
        if (gameScene.sounds) {
            originalSoundStates.soundsMuted = true;
            Object.keys(gameScene.sounds).forEach(key => {
                if (gameScene.sounds[key] && typeof gameScene.sounds[key].setVolume === 'function') {
                    gameScene.sounds[key].setVolume(0); // Mute all sound effects
                }
            });
        }

        // 2. Play celebration sound at full volume
        if (this.scene.playSound) {
            // Temporarily enable celebration sound if it exists
            if (gameScene.sounds && gameScene.sounds.celebration) {
                gameScene.sounds.celebration.setVolume(0.5); // Play at full volume
            }
            this.scene.playSound('celebration');
        } else {
            console.log("Add celebration.mp3 to assets/sounds/");
        }

        // 3. Create full-screen overlay
        const overlay = document.createElement('div');
        overlay.className = 'milestone-overlay';
        document.body.appendChild(overlay);

        // Create character image element
        const characterImg = document.createElement('img');
        characterImg.className = 'milestone-character';
        characterImg.src = './assets/milestone-character.png';
        characterImg.alt = 'Milestone Celebration';
        
        // Fallback if image fails to load
        characterImg.onerror = () => {
            console.warn("milestone-character.png not found in assets/");
            characterImg.style.display = 'none';
            
            // Show fallback text
            const fallbackText = document.createElement('div');
            fallbackText.className = 'milestone-text';
            fallbackText.textContent = `🎉 DAY ${dayNumber} MILESTONE! 🎉`;
            overlay.appendChild(fallbackText);
        };
        
        overlay.appendChild(characterImg);

        // 4. Restore sounds after animation completes (total duration ~2.5s)
        setTimeout(() => {
            // Restore background music
            if (gameScene.bgMusic && originalSoundStates.bgMusicVolume !== null) {
                gameScene.bgMusic.setVolume(originalSoundStates.bgMusicVolume);
                // Resume if it was playing (unless muted)
                if (originalSoundStates.bgMusicWasPlaying && !gameScene.isMuted) {
                    if (!gameScene.bgMusic.isPlaying) {
                        gameScene.bgMusic.play();
                    }
                }
            }
            
            // Restore game sound effects
            if (originalSoundStates.soundsMuted && gameScene.sounds) {
                Object.keys(gameScene.sounds).forEach(key => {
                    if (gameScene.sounds[key] && typeof gameScene.sounds[key].setVolume === 'function') {
                        // Restore original volume (default 0.5 for sound effects)
                        if (key !== 'celebration') {
                            gameScene.sounds[key].setVolume(0.5);
                        }
                    }
                });
            }
            
            // Clean up overlay
            if (overlay && overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 2500);
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
        
        // Update mission/wave display (2 lines so it doesn't overlap Score right / currency left)
        if (gameState.missionSystem) {
            const m = gameState.missionSystem.currentMission;
            if (gameState.missionSystem.bossActive) {
                this.stageText.setText(`Mission ${m}\nBOSS ⚔️`);
                this.stageText.setColor('#ff0000');
            } else {
                const w = gameState.missionSystem.currentWave;
                this.stageText.setText(`Mission ${m}\nWave ${w}/5`);
                this.stageText.setColor('#00ffff');
            }
        } else {
            this.stageText.setText(`STAGE ${gameState.stage}`);
            this.stageText.setColor('#00ffff');
        }
        
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
            // STRICT check: barX must be >= 50, barY must be >= 50
            if (this.barX && this.barY && this.barWidth && this.barHeight && 
                this.barX >= 50 && this.barY >= 50 && currentWidth > 0) {
                this.healthBar.fillStyle(color1, 0.9);
                this.healthBar.fillRoundedRect(this.barX, this.barY - this.barHeight/2, currentWidth, this.barHeight, 3);
                
                // Glow effect (only if bar is drawn) - same strict coordinates
                if (this.barX >= 50 && this.barY >= 50) {
                    this.healthBarGlow.fillStyle(color1, 0.5);
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

// Debug helper for Daily Check-in (dev only)
(function() {
    'use strict';
    
    // Helper to get day key (same as UI method - local time)
    function getDayKey(date = new Date()) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    // Helper to calculate days between day keys (local dates)
    function daysBetweenDayKeys(key1, key2) {
        const d1 = new Date(key1 + 'T00:00:00');
        const d2 = new Date(key2 + 'T00:00:00');
        return Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    }
    
    window.__strikeDebug = {
        getState: function() {
            const fid = (window.game && window.game.scene && window.game.scene.getScene && window.game.scene.getScene('GameScene')?.ui?._checkInFid) || 'default';
            const lastCheckIn = localStorage.getItem('lastCheckIn_' + fid);
            const streakData = localStorage.getItem('checkInStreak_' + fid);
            const todayKey = getDayKey();
            
            let streak = null;
            let daysSince = null;
            let nextMilestone = 7;
            let isMilestone = false;
            
            if (streakData) {
                try {
                    streak = JSON.parse(streakData);
                    if (streak.lastDate) {
                        daysSince = daysBetweenDayKeys(streak.lastDate, todayKey);
                    }
                    if (streak.totalDays) {
                        nextMilestone = Math.ceil(streak.totalDays / 7) * 7;
                        isMilestone = (streak.totalDays % 7 === 0);
                    }
                } catch (e) {
                    streak = { error: e.message };
                }
            }
            
            return {
                lastCheckInDayKey: lastCheckIn || null,
                todayDayKey: todayKey,
                daysSinceLastCheckin: lastCheckIn ? daysBetweenDayKeys(lastCheckIn, todayKey) : null,
                streak: streak,
                streakDaysSince: daysSince,
                totalDays: streak ? (streak.totalDays || 0) : 0,
                nextMilestone: nextMilestone,
                isMilestone: isMilestone,
                canClaim: lastCheckIn !== todayKey
            };
        },
        
        setLastCheckinDaysAgo: function(n) {
            if (typeof n !== 'number' || n < 0) {
                console.error('__strikeDebug.setLastCheckinDaysAgo: n must be a non-negative number');
                return;
            }
            
            const today = new Date();
            const targetDate = new Date(today);
            targetDate.setDate(targetDate.getDate() - n);
            const targetKey = getDayKey(targetDate);
            const fid = (window.game && window.game.scene && window.game.scene.getScene && window.game.scene.getScene('GameScene')?.ui?._checkInFid) || 'default';
            localStorage.setItem('lastCheckIn_' + fid, targetKey);
            const streakData = localStorage.getItem('checkInStreak_' + fid);
            if (streakData) {
                try {
                    const streak = JSON.parse(streakData);
                    streak.lastDate = targetKey;
                    localStorage.setItem('checkInStreak_' + fid, JSON.stringify(streak));
                } catch (e) {
                    console.warn('Could not update streak lastDate:', e);
                }
            }
            
            // Refresh UI if game is running
            if (window.game && window.game.scene) {
                const gameScene = window.game.scene.getScene('GameScene');
                if (gameScene && gameScene.ui && gameScene.ui.updateCheckInButtonState) {
                    gameScene.ui.updateCheckInButtonState();
                    console.log('UI refreshed. New state:', this.getState());
                } else {
                    console.log('UI not available. State updated:', this.getState());
                }
            } else {
                console.log('Game not initialized. State updated:', this.getState());
            }
        },
        
        clearStrike: function() {
            const fid = (window.game && window.game.scene && window.game.scene.getScene && window.game.scene.getScene('GameScene')?.ui?._checkInFid) || 'default';
            localStorage.removeItem('lastCheckIn_' + fid);
            localStorage.removeItem('checkInStreak_' + fid);
            
            // Refresh UI if game is running
            if (window.game && window.game.scene) {
                const gameScene = window.game.scene.getScene('GameScene');
                if (gameScene && gameScene.ui && gameScene.ui.updateCheckInButtonState) {
                    gameScene.ui.updateCheckInButtonState();
                    console.log('Strike cleared. UI refreshed. New state:', this.getState());
                } else {
                    console.log('Strike cleared. UI not available. New state:', this.getState());
                }
            } else {
                console.log('Strike cleared. Game not initialized. New state:', this.getState());
            }
        }
    };
    
    console.log('Daily Check-in Debug Helper loaded. Use window.__strikeDebug');
})();
