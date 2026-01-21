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

    // Helper: Get stable local day key (YYYY-MM-DD)
    getDayKey(date = new Date()) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Helper: Calculate days between two day keys (local dates)
    daysBetweenDayKeys(key1, key2) {
        const d1 = new Date(key1 + 'T00:00:00');
        const d2 = new Date(key2 + 'T00:00:00');
        return Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    }

    createDailyCheckInButton() {
        // Position: Top-right corner, next to diamonds display (x: width - 200, y: 20)
        const buttonX = 80;
        const buttonY = 170;

        const buttonWidth = 120;
        const buttonHeight = 40;
        
        // Button background graphics
        this.checkInButtonBg = this.scene.add.graphics();
        this.checkInButtonBg.setScrollFactor(0);
        this.checkInButtonBg.setDepth(100);
        
        // Interactive rectangle (invisible, for click detection)
        this.checkInButton = this.scene.add.rectangle(buttonX, buttonY, buttonWidth, buttonHeight, 0x00ffff, 0);
        this.checkInButton.setScrollFactor(0);
        this.checkInButton.setDepth(100);
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
        this.checkInButtonText.setDepth(101);
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
        this.checkInCountdownText.setDepth(101);
        this.checkInCountdownText.setVisible(false);
        
        // Glow effect (shown when active)
        this.checkInGlow = this.scene.add.graphics();
        this.checkInGlow.setScrollFactor(0);
        this.checkInGlow.setDepth(99);
        this.checkInGlow.setBlendMode(Phaser.BlendModes.ADD);
        
        // Initialize button state
        this.updateCheckInButtonState();
        
        // Click handler
        const handleCheckIn = () => {
            if (!this.isCheckInActive()) {
                return; // Button is disabled
            }
            
            // Play click sound
            if (this.scene.playSound) {
                this.scene.playSound('click');
            }
            
           // Save current day key (YYYY-MM-DD format)
const todayKey = this.getDayKey();
localStorage.setItem('lastCheckIn', todayKey);

// Update streak system
let totalDays = 0;
const streakData = localStorage.getItem('checkInStreak');
if (streakData) {
    try {
        const data = JSON.parse(streakData);
        const lastDateKey = data.lastDate;
        
        if (!lastDateKey) {
            // No previous date, start at day 1
            totalDays = 1;
        } else {
            const daysSince = this.daysBetweenDayKeys(lastDateKey, todayKey);
            
            if (daysSince === 1) {
                // Consecutive day - increment streak
                totalDays = (data.totalDays || 0) + 1;
            } else if (daysSince === 0) {
                // Same day - keep current streak (shouldn't happen, but handle gracefully)
                totalDays = data.totalDays || 1;
            } else {
                // Missed day(s) - reset to 1
                totalDays = 1;
            }
        }
    } catch (e) {
        totalDays = 1;
    }
} else {
    totalDays = 1;
}

// Save streak (infinite progression, no cap)
localStorage.setItem('checkInStreak', JSON.stringify({
    totalDays: totalDays,
    lastDate: todayKey
}));

// Calculate reward based on infinite streak
const isMilestone = (totalDays % 7 === 0); // Days 7, 14, 21, 28...
const dayInCycle = (totalDays % 7) || 7; // 1-7 (cycles for base rewards)
const milestoneNumber = Math.floor(totalDays / 7); // Which milestone (1, 2, 3...)

const baseRewards = [10, 15, 20, 25, 30, 35, 50]; // Days 1-7 base rewards
let reward = baseRewards[dayInCycle - 1];

// Milestone bonus (days 7, 14, 21, 28...)
if (isMilestone) {
    // Cap milestone bonus at day 21 (milestone 3)
    const cappedMilestone = Math.min(milestoneNumber, 3);
    // 2x base reward for milestone days
    const milestoneBonus = reward; // Double the base reward
    reward += milestoneBonus;
}

// Add diamonds
this.gameState.diamonds += reward;

// Show notification
let message;
if (isMilestone) {
    message = `🎉 MILESTONE DAY ${totalDays}! +${reward} 💎`;
    // Show milestone celebration animation
    this.showMilestoneCelebration(totalDays);
} else {
    message = `+${reward} 💎 Day Streak: ${totalDays}`;
}
this.showNotification(message, buttonX, buttonY - 40);

            
            // Update button state
            this.updateCheckInButtonState();
        };
        
        this.checkInButton.on('pointerdown', handleCheckIn);
        this.checkInButtonText.on('pointerdown', handleCheckIn);
        
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
        
        // Update countdown every second
        this.scene.time.addEvent({
            delay: 1000,
            callback: () => {
                this.updateCheckInButtonState();
            },
            loop: true
        });
    }

    isCheckInActive() {
        const lastCheckIn = localStorage.getItem('lastCheckIn');
        if (!lastCheckIn) {
            return true; // Never checked in, button is active
        }
        
        // Compare day keys - if lastCheckIn is not today, button is active
        const todayKey = this.getDayKey();
        return lastCheckIn !== todayKey;
    }

    getCheckInTimeRemaining() {
        const lastCheckIn = localStorage.getItem('lastCheckIn');
        if (!lastCheckIn) {
            return null; // No cooldown
        }
        
        // Compare day keys - if lastCheckIn is not today, no cooldown
        const todayKey = this.getDayKey();
        if (lastCheckIn !== todayKey) {
            return null; // Cooldown expired (different day)
        }
        
        // If checked in today, calculate time until midnight local (next day)
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0); // Midnight local time
        
        const msRemaining = tomorrow.getTime() - now.getTime();
        
        if (msRemaining <= 0) {
            return null; // Already past midnight
        }
        
        const hours = Math.floor(msRemaining / (1000 * 60 * 60));
        const minutes = Math.floor((msRemaining % (1000 * 60 * 60)) / (1000 * 60));
        
        return { hours, minutes };
    }

    getCheckInStreak() {
        const streakData = localStorage.getItem('checkInStreak');
        if (!streakData) {
            return { totalDays: 0, nextMilestone: 7, isMilestone: false };
        }
        try {
            const data = JSON.parse(streakData);
            const lastDateKey = data.lastDate;
            
            // Check if lastDate exists and is valid
            if (!lastDateKey) {
                return { totalDays: 0, nextMilestone: 7, isMilestone: false };
            }
            
            // Get today's day key
            const todayKey = this.getDayKey();
            const daysSince = this.daysBetweenDayKeys(lastDateKey, todayKey);
            
            // Reset streak if lastDate is not yesterday (1) or today (0)
            if (daysSince > 1 || daysSince < 0) {
                return { totalDays: 0, nextMilestone: 7, isMilestone: false };
            }
            
            // Return current streak data (infinite progression)
            const totalDays = data.totalDays || 0;
            const nextMilestone = Math.ceil(totalDays / 7) * 7; // Next multiple of 7
            const isMilestone = (totalDays > 0 && totalDays % 7 === 0);
            return { totalDays, nextMilestone, isMilestone };
        } catch (e) {
            return { totalDays: 0, nextMilestone: 7, isMilestone: false };
        }
    }
    

    updateCheckInButtonState() {
        const buttonX = 80;
        const buttonY = 170;

        const buttonWidth = 120;
        const buttonHeight = 40;
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
            
            // Update text - show infinite streak
            if (streakInfo.totalDays > 0) {
                const streakText = `Day ${streakInfo.totalDays}`;
                const milestoneText = !streakInfo.isMilestone 
                    ? ` →${streakInfo.nextMilestone}` 
                    : ' 🎉';
                this.checkInButtonText.setText(`📅 ${streakText}${milestoneText}`);
            } else {
                this.checkInButtonText.setText('📅 CHECK-IN');
            }

            this.checkInButtonText.setColor('#00ff00');
            this.checkInCountdownText.setVisible(false);
            
            // Enable interaction
            this.checkInButton.setInteractive({ useHandCursor: true });
            this.checkInButtonText.setInteractive({ useHandCursor: true });
        } else {
            // Disabled state: Gray color with countdown
            this.checkInButtonBg.fillStyle(0x666666, 0.7);  // Gray
            this.checkInButtonBg.fillRoundedRect(buttonX - buttonWidth / 2, buttonY - buttonHeight / 2, buttonWidth, buttonHeight, 5);
            this.checkInButtonBg.lineStyle(2, 0x888888, 1);
            this.checkInButtonBg.strokeRoundedRect(buttonX - buttonWidth / 2, buttonY - buttonHeight / 2, buttonWidth, buttonHeight, 5);
            
            // Update text
            
            this.checkInButtonText.setColor('#ffffff');

            
            // Show countdown
            if (timeRemaining) {
                const timeStr = `${timeRemaining.hours}h ${timeRemaining.minutes}m`;
                this.checkInCountdownText.setText(timeStr);
                this.checkInCountdownText.setVisible(true);
            } else {
                this.checkInCountdownText.setVisible(false);
            }
            
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
        // Play celebration sound
        if (this.scene.playSound) {
            this.scene.playSound('celebration');
        } else {
            console.log("Add celebration.mp3 to assets/sounds/");
        }

        // Create full-screen overlay
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

        // Clean up after animation completes (total duration ~2.5s)
        setTimeout(() => {
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
            const lastCheckIn = localStorage.getItem('lastCheckIn');
            const streakData = localStorage.getItem('checkInStreak');
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
            
            localStorage.setItem('lastCheckIn', targetKey);
            
            // Update streak's lastDate if it exists
            const streakData = localStorage.getItem('checkInStreak');
            if (streakData) {
                try {
                    const streak = JSON.parse(streakData);
                    streak.lastDate = targetKey;
                    localStorage.setItem('checkInStreak', JSON.stringify(streak));
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
        
        resetStrike: function() {
            localStorage.removeItem('lastCheckIn');
            localStorage.removeItem('checkInStreak');
            
            // Refresh UI if game is running
            if (window.game && window.game.scene) {
                const gameScene = window.game.scene.getScene('GameScene');
                if (gameScene && gameScene.ui && gameScene.ui.updateCheckInButtonState) {
                    gameScene.ui.updateCheckInButtonState();
                    console.log('Strike reset. UI refreshed. New state:', this.getState());
                } else {
                    console.log('Strike reset. UI not available. New state:', this.getState());
                }
            } else {
                console.log('Strike reset. Game not initialized. New state:', this.getState());
            }
        }
    };
    
    console.log('Daily Check-in Debug Helper loaded. Use window.__strikeDebug');
})();
