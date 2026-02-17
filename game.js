// Base Invaders - Main Game File
// Фіксований FID для бета-тесту синхронізації прогресу (Supabase)
const TEST_FID = 'test_user_12345';
console.log('MenuScene and GameScene classes defined');

// Menu Scene - Start Screen
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        this.load.audio('click', 'assets/sounds/click.mp3');
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        // Create starry background
        this.createBackground();

        // Title - i18n (підсунуто до верху)
        this.titleText = this.add.text(width / 2, height * 0.08, typeof getText === 'function' ? getText('menu.title') : 'BASE DESTROYER', {
            fontSize: '64px',
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'bold',
            color: '#00d9ff',
            stroke: '#0088ff',
            strokeThickness: 4,
            resolution: 2
        });
        this.titleText.setOrigin(0.5);
        this.titleText.setShadow(0, 0, '#00d9ff', 20, true, true);

        // Animated glow effect on title
        this.tweens.add({
            targets: this.titleText,
            alpha: { from: 0.8, to: 1 },
            scale: { from: 0.98, to: 1.02 },
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Welcome message - i18n (Defend the Base, alien invaders, Good luck)
        const welcomeText = typeof getText === 'function' ? getText('menu.welcome') : 'Welcome, Commander! 🚀\n\nDefend the Base from alien invaders.\nCollect diamonds and upgrade your ship.';
        this.welcomeText = this.add.text(width / 2, height * 0.14, welcomeText, {
            fontSize: '18px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff',
            align: 'center',
            lineSpacing: 8,
            resolution: 2,
            wordWrap: { width: Math.min(450, width * 0.85) }
        });
        this.welcomeText.setOrigin(0.5, 0);
        this.welcomeText.setDepth(2);
        this.welcomeText.setShadow(2, 2, '#000000', 3, true);

        // Good luck - i18n
        this.goodLuckText = this.add.text(width / 2, height * 0.30, typeof getText === 'function' ? getText('menu.goodLuck') : 'Good luck! ⭐', {
            fontSize: '22px',
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'bold',
            color: '#ffd700',
            align: 'center',
            resolution: 2
        });
        this.goodLuckText.setOrigin(0.5);
        this.goodLuckText.setDepth(2);
        this.goodLuckText.setShadow(0, 0, '#ffd700', 10, true, true);

        // Анімація для goodLuckText
        this.tweens.add({
            targets: this.goodLuckText,
            alpha: { from: 0.7, to: 1 },
            scale: { from: 0.95, to: 1.05 },
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // START button (менші кнопки, рівномірні відстані)
        const menuStartY = height * 0.40;
        const menuGap = 0.105;
        this.startBtnBg = this.add.graphics();
        this.startBtnBg.setDepth(1);

        this.startBtn = this.add.rectangle(width / 2, menuStartY, 220, 68, 0x0052FF, 0);
        this.startBtn.setInteractive({ useHandCursor: true });
        this.startBtn.setDepth(2);
        
        this.startText = this.add.text(width / 2, menuStartY, typeof getText === 'function' ? getText('menu.start') : 'START', {
            fontSize: '30px',
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'bold',
            color: '#00ff00',
            stroke: '#00aa00',
            strokeThickness: 3,
            resolution: 2
        });
        this.startText.setOrigin(0.5);
        this.startText.setDepth(3);
        this.startText.setShadow(0, 0, '#00ff00', 15, true, true);

        // Hover effect
        this.startBtn.on('pointerover', () => {
            this.updateMenuButtonStyle(this.startBtnBg, this.startBtn, true);
            this.startText.setScale(1.1);
            this.tweens.add({
                targets: this.startText,
                scale: 1.15,
                duration: 200,
                ease: 'Back.easeOut'
            });
        });

        this.startBtn.on('pointerout', () => {
            this.updateMenuButtonStyle(this.startBtnBg, this.startBtn, false);
            this.tweens.add({
                targets: this.startText,
                scale: 1,
                duration: 200
            });
        });

        // Click to start game (this.scene.start auto-stops current scene)
        this.startBtn.on('pointerdown', () => {
            if (this.clickSound) try { this.clickSound.play(); } catch (e) {}
            this.tweens.add({
                targets: [this.startBtn, this.startText],
                scale: 0.95,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    this.scene.start('GameScene');
                }
            });
        });

        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.start('GameScene');
        });
        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start('GameScene');
        });
        
        const languageBtnY = height * (menuStartY / height + menuGap);
        this.languageBtnBg = this.add.graphics();
        this.languageBtnBg.setDepth(1);
        this.languageBtn = this.add.rectangle(width / 2, languageBtnY, 200, 48, 0x2196F3, 0);
        this.languageBtn.setInteractive({ useHandCursor: true });
        this.languageBtn.setDepth(2);
        this.languageText = this.add.text(width / 2, languageBtnY, typeof getText === 'function' ? getText('menu.language') : 'Language 🌐', {
            fontSize: '18px',
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'bold',
            color: '#ffffff',
            stroke: '#0066cc',
            strokeThickness: 2,
            resolution: 2
        });
        this.languageText.setOrigin(0.5);
        this.languageText.setDepth(3);
        this.languageBtn.on('pointerover', () => {
            this.updateLanguageButtonStyle(true);
            this.tweens.add({ targets: this.languageText, scale: 1.1, duration: 200, ease: 'Back.easeOut' });
        });
        this.languageBtn.on('pointerout', () => {
            this.updateLanguageButtonStyle(false);
            this.tweens.add({ targets: this.languageText, scale: 1, duration: 200 });
        });
        this.languageBtn.on('pointerdown', () => {
            if (this.clickSound) try { this.clickSound.play(); } catch (e) {}
            console.log('LANGUAGE BUTTON CLICKED!');
            this.tweens.add({
                targets: [this.languageBtn, this.languageText],
                scale: 0.95,
                duration: 100,
                yoyo: true,
                onComplete: () => { this.showLanguageOverlay(); }
            });
        });
        
        const instructionsBtnY = height * (menuStartY / height + menuGap * 2);

        this.instructionsBtnBg = this.add.graphics();
        this.instructionsBtnBg.setDepth(1);

        this.instructionsBtn = this.add.rectangle(
            width / 2,
            instructionsBtnY,
            200,
            48,
            0x2196F3,
            0
        );
        this.instructionsBtn.setInteractive({ useHandCursor: true });
        this.instructionsBtn.setDepth(2);

        this.instructionsBtnText = this.add.text(
            width / 2,
            instructionsBtnY,
            typeof getText === 'function' ? getText('menu.howToPlay') : 'How to Play',
            {
                fontSize: '18px',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                color: '#ffffff',
                stroke: '#0066cc',
                strokeThickness: 2,
                resolution: 2
            }
        );
        this.instructionsBtnText.setOrigin(0.5);
        this.instructionsBtnText.setDepth(3);

        // Hover effect
        this.instructionsBtn.on('pointerover', () => {
            this.updateInstructionsButtonStyle(true);
            this.tweens.add({
                targets: this.instructionsBtnText,
                scale: 1.1,
                duration: 200,
                ease: 'Back.easeOut'
            });
        });

        this.instructionsBtn.on('pointerout', () => {
            this.updateInstructionsButtonStyle(false);
            this.tweens.add({
                targets: this.instructionsBtnText,
                scale: 1,
                duration: 200
            });
        });

        // Click to show instructions overlay
        this.instructionsBtn.on('pointerdown', () => {
            if (this.clickSound) try { this.clickSound.play(); } catch (e) {}
            this.tweens.add({
                targets: [this.instructionsBtn, this.instructionsBtnText],
                scale: 0.95,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    this.showInstructionsOverlay();
                }
            });
        });
        
        const resetBtnY = height * (menuStartY / height + menuGap * 3);
        this.resetBtnBg = this.add.graphics();
        this.resetBtnBg.setDepth(1);
        
        this.resetBtn = this.add.rectangle(width / 2, resetBtnY, 200, 48, 0xcc0000, 0);
        this.resetBtn.setInteractive({ useHandCursor: true });
        this.resetBtn.setDepth(2);
        
        this.resetText = this.add.text(width / 2, resetBtnY, typeof getText === 'function' ? getText('menu.resetProgress') : 'Reset Progress', {
            fontSize: '17px',
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'bold',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2,
            resolution: 2
        });
        this.resetText.setOrigin(0.5);
        this.resetText.setDepth(3);
        
        // Hover effect for reset button
        this.resetBtn.on('pointerover', () => {
            this.updateResetButtonStyle(true);
            this.tweens.add({
                targets: this.resetText,
                scale: 1.1,
                duration: 200,
                ease: 'Back.easeOut'
            });
        });
        
        this.resetBtn.on('pointerout', () => {
            this.updateResetButtonStyle(false);
            this.tweens.add({
                targets: this.resetText,
                scale: 1,
                duration: 200
            });
        });
        
        // Click handler: reset without confirmation (player knows the consequences)
        this.resetBtn.on('pointerdown', () => {
            if (this.clickSound) try { this.clickSound.play(); } catch (e) {}
            localStorage.removeItem('baseInvadersData');
            localStorage.removeItem('baseInvadersShop');
            localStorage.removeItem('baseInvadersVibration');
            location.reload();
        });

        // LEADERBOARD button (рівномірна відстань від інших)
        const leaderboardBtnY = height * (menuStartY / height + menuGap * 4);
        this.leaderboardBtnBg = this.add.graphics();
        this.leaderboardBtnBg.setDepth(1);
        
        this.leaderboardBtn = this.add.rectangle(width / 2, leaderboardBtnY, 200, 48, 0x0052FF, 0);
        this.leaderboardBtn.setInteractive({ useHandCursor: true });
        this.leaderboardBtn.setDepth(2);
        
        this.leaderboardText = this.add.text(width / 2, leaderboardBtnY, typeof getText === 'function' ? getText('menu.leaderboard') : 'Leaderboard', {
            fontSize: '17px',
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'bold',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2,
            resolution: 2
        });
        this.leaderboardText.setOrigin(0.5);
        this.leaderboardText.setDepth(3);
        
        this.leaderboardBtn.on('pointerover', () => {
            this.updateLeaderboardButtonStyle(true);
            this.tweens.add({
                targets: this.leaderboardText,
                scale: 1.05,
                duration: 150,
                ease: 'Back.easeOut'
            });
        });
        
        this.leaderboardBtn.on('pointerout', () => {
            this.updateLeaderboardButtonStyle(false);
            this.tweens.add({
                targets: this.leaderboardText,
                scale: 1,
                duration: 150
            });
        });
        
        this.leaderboardBtn.on('pointerdown', () => {
            if (this.clickSound) try { this.clickSound.play(); } catch (e) {}
            if (window.baseInvadersLeaderboard && window.baseInvadersLeaderboard.open) {
                window.baseInvadersLeaderboard.open();
            }
        });

        // Init click sound for menu buttons (same as pause menu)
        this.clickSound = null;
        try {
            if (this.cache.audio && this.cache.audio.exists('click')) {
                this.clickSound = this.sound.add('click', { volume: 0.5 });
            }
        } catch (e) {}

        this.updateMenuLayout(width, height);
        this.scale.on('resize', (gameSize) => {
            this.updateMenuLayout(gameSize.width, gameSize.height);
        });

        this.refreshMenuTexts();
        window.addEventListener('base-invaders:lang-changed', () => this.refreshMenuTexts());

        // Farcaster Mini App: hide splash and show canvas when menu is ready
        window.dispatchEvent(new Event('base-invaders:game-ready'));
        if (typeof window.baseInvadersMarkMiniAppReady === 'function') {
            window.baseInvadersMarkMiniAppReady();
        }
        if (typeof window.__farcasterCallReady === 'function') {
            window.__farcasterCallReady();
        }
    }

    refreshMenuTexts() {
        var g = typeof window !== 'undefined' && typeof window.getText === 'function' ? window.getText : (typeof getText === 'function' ? getText : null);
        if (!g) { console.warn('refreshMenuTexts: getText not found'); return; }
        var title = g('menu.title');
        console.log('refreshMenuTexts getLang:', typeof window.getLang === 'function' ? window.getLang() : 'N/A', 'menu.title:', title);
        if (this.titleText) this.titleText.setText(title);
        if (this.welcomeText) this.welcomeText.setText(g('menu.welcome'));
        if (this.goodLuckText) this.goodLuckText.setText(g('menu.goodLuck'));
        if (this.startText) this.startText.setText(g('menu.start'));
        if (this.languageText) this.languageText.setText(g('menu.language'));
        if (this.instructionsBtnText) this.instructionsBtnText.setText(g('menu.howToPlay'));
        if (this.resetText) this.resetText.setText(g('menu.resetProgress'));
        if (this.leaderboardText) this.leaderboardText.setText(g('menu.leaderboard'));
    }

    updateMenuButtonStyle(buttonBg, buttonRect, isHover) {
        const width = buttonRect.width;
        const height = buttonRect.height;
        const x = buttonRect.x - width / 2;
        const y = buttonRect.y - height / 2;
        buttonBg.clear();
        buttonBg.fillStyle(isHover ? 0x0088ff : 0x0052FF, isHover ? 0.9 : 0.8);
        buttonBg.fillRoundedRect(x, y, width, height, Math.min(15, height * 0.2));
        buttonBg.lineStyle(3, isHover ? 0x00ffff : 0x00d9ff, 1);
        buttonBg.strokeRoundedRect(x, y, width, height, Math.min(15, height * 0.2));
    }

    updateResetButtonStyle(isHover) {
        const width = this.resetBtn.width;
        const height = this.resetBtn.height;
        const x = this.resetBtn.x - width / 2;
        const y = this.resetBtn.y - height / 2;
        this.resetBtnBg.clear();
        this.resetBtnBg.fillStyle(isHover ? 0xff0000 : 0xcc0000, isHover ? 0.9 : 0.8);
        this.resetBtnBg.fillRoundedRect(x, y, width, height, Math.min(10, height * 0.2));
        this.resetBtnBg.lineStyle(2, isHover ? 0xff6666 : 0xff4444, 1);
        this.resetBtnBg.strokeRoundedRect(x, y, width, height, Math.min(10, height * 0.2));
    }

    updateLeaderboardButtonStyle(isHover) {
        const width = this.leaderboardBtn.width;
        const height = this.leaderboardBtn.height;
        const x = this.leaderboardBtn.x - width / 2;
        const y = this.leaderboardBtn.y - height / 2;
        this.leaderboardBtnBg.clear();
        this.leaderboardBtnBg.fillStyle(isHover ? 0x0077ff : 0x0052FF, isHover ? 0.9 : 0.8);
        this.leaderboardBtnBg.fillRoundedRect(x, y, width, height, Math.min(10, height * 0.2));
        this.leaderboardBtnBg.lineStyle(2, 0x00ffff, 1);
        this.leaderboardBtnBg.strokeRoundedRect(x, y, width, height, Math.min(10, height * 0.2));
    }

    updateInstructionsButtonStyle(isHover) {
        const width = this.instructionsBtn.width;
        const height = this.instructionsBtn.height;
        const x = this.instructionsBtn.x - width / 2;
        const y = this.instructionsBtn.y - height / 2;
        
        this.instructionsBtnBg.clear();
        this.instructionsBtnBg.fillStyle(
            isHover ? 0x42a5f5 : 0x2196F3, 
            isHover ? 0.9 : 0.8
        );
        this.instructionsBtnBg.fillRoundedRect(x, y, width, height, Math.min(15, height * 0.2));
        this.instructionsBtnBg.lineStyle(3, isHover ? 0x90caf9 : 0x64b5f6, 1);
        this.instructionsBtnBg.strokeRoundedRect(x, y, width, height, Math.min(15, height * 0.2));
    }

    updateLanguageButtonStyle(isHover) {
        if (!this.languageBtn || !this.languageBtnBg) return;
        const w = this.languageBtn.width;
        const h = this.languageBtn.height;
        const x = this.languageBtn.x - w / 2;
        const y = this.languageBtn.y - h / 2;
        this.languageBtnBg.clear();
        this.languageBtnBg.fillStyle(isHover ? 0x42a5f5 : 0x2196F3, isHover ? 0.9 : 0.8);
        this.languageBtnBg.fillRoundedRect(x, y, w, h, Math.min(15, h * 0.2));
        this.languageBtnBg.lineStyle(3, isHover ? 0x90caf9 : 0x64b5f6, 1);
        this.languageBtnBg.strokeRoundedRect(x, y, w, h, Math.min(15, h * 0.2));
    }

    updateMenuLayout(width, height) {
        const titleSize = Math.max(28, Math.min(width * 0.07, 56));
        const textSize = Math.max(14, Math.min(width * 0.022, 18));
        const buttonX = width * 0.5;
        const gap = 0.105;
        const startY = height * 0.40;
        const languageY = height * (0.40 + gap);
        const instructionsY = height * (0.40 + gap * 2);
        const resetY = height * (0.40 + gap * 3);
        const leaderboardY = height * (0.40 + gap * 4);

        this.titleText.setPosition(width / 2, height * 0.08);
        this.titleText.setFontSize(`${titleSize}px`);

        if (this.welcomeText) {
            this.welcomeText.setPosition(width / 2, height * 0.14);
            this.welcomeText.setFontSize(`${textSize}px`);
            this.welcomeText.setWordWrapWidth(Math.min(450, width * 0.85), true);
        }

        if (this.goodLuckText) {
            this.goodLuckText.setPosition(width / 2, height * 0.30);
            this.goodLuckText.setFontSize(`${Math.max(16, Math.min(width * 0.035, 22))}px`);
        }

        // START button (менші, рівномірні відстані)
        this.startBtn.setPosition(buttonX, startY);
        this.startBtn.setSize(220, 68);
        this.startText.setPosition(buttonX, startY);
        this.startText.setFontSize('30px');
        this.updateMenuButtonStyle(this.startBtnBg, this.startBtn, false);

        // Language button
        if (this.languageBtn) {
            this.languageBtn.setPosition(buttonX, languageY);
            this.languageBtn.setSize(200, 48);
            this.languageText.setPosition(buttonX, languageY);
            this.languageText.setFontSize('18px');
            this.updateLanguageButtonStyle(false);
        }

        // Instructions button
        if (this.instructionsBtn) {
            this.instructionsBtn.setPosition(buttonX, instructionsY);
            this.instructionsBtn.setSize(200, 48);
            this.instructionsBtnText.setPosition(buttonX, instructionsY);
            this.instructionsBtnText.setFontSize('18px');
            this.updateInstructionsButtonStyle(false);
        }

        // Reset button
        this.resetBtn.setPosition(buttonX, resetY);
        this.resetBtn.setSize(200, 48);
        this.resetText.setPosition(buttonX, resetY);
        this.resetText.setFontSize('17px');
        this.updateResetButtonStyle(false);

        // Leaderboard button
        this.leaderboardBtn.setPosition(buttonX, leaderboardY);
        this.leaderboardBtn.setSize(200, 48);
        this.leaderboardText.setPosition(buttonX, leaderboardY);
        this.leaderboardText.setFontSize('17px');
        this.updateLeaderboardButtonStyle(false);
    }

    createBackground() {
        const width = this.scale.width;
        const height = this.scale.height;

        // Create stars background
        this.stars = [];
        for (let i = 0; i < 150; i++) {
            const star = this.add.circle(
                Phaser.Math.Between(0, width),
                Phaser.Math.Between(0, height),
                Phaser.Math.Between(1, 3),
                0xffffff,
                Phaser.Math.FloatBetween(0.3, 0.8)
            );
            star.scrollSpeed = Phaser.Math.Between(20, 60);
            this.stars.push(star);
        }

        // Add nebula gradient
        const nebula = this.add.graphics();
        nebula.fillGradientStyle(0x4a00ff, 0x4a00ff, 0x0000ff, 0x0000ff, 0.2);
        nebula.fillRect(0, 0, width, height);
        nebula.setDepth(0);
    }

    update() {
        // Animate stars (slow parallax)
        this.stars.forEach(star => {
            star.y += star.scrollSpeed * 0.01;
            if (star.y > this.scale.height) {
                star.y = -10;
                star.x = Phaser.Math.Between(0, this.scale.width);
            }
        });
    }

    showInstructionsOverlay() {
        const width = this.scale.width;
        const height = this.scale.height;
        
        // Semi-transparent black overlay (background)
        this.overlay = this.add.rectangle(
            0, 0,
            width * 2, height * 2,
            0x000000,
            0.85
        );
        this.overlay.setOrigin(0, 0);
        this.overlay.setDepth(1000);
        this.overlay.setInteractive(); // Block clicks behind it
        
        // Instructions panel (white box)
        const panelWidth = Math.min(500, width * 0.9);
        const panelHeight = Math.min(650, height * 0.9);
        
        this.instructionsPanel = this.add.rectangle(
            width / 2,
            height / 2,
            panelWidth,
            panelHeight,
            0xffffff
        );
        this.instructionsPanel.setDepth(1001);
        
        // Panel border
        this.instructionsPanelBorder = this.add.graphics();
        this.instructionsPanelBorder.lineStyle(3, 0x2196F3, 1);
        this.instructionsPanelBorder.strokeRoundedRect(
            width / 2 - panelWidth / 2,
            height / 2 - panelHeight / 2,
            panelWidth,
            panelHeight,
            10
        );
        this.instructionsPanelBorder.setDepth(1001);
        
        // Title - i18n
        this.instructionsTitle = this.add.text(
            width / 2,
            height / 2 - panelHeight / 2 + 30,
            typeof getText === 'function' ? getText('instructions.title') : '📖 HOW TO PLAY',
            {
                fontSize: '28px',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                color: '#2196F3',
                align: 'center',
                resolution: 2
            }
        );
        this.instructionsTitle.setOrigin(0.5);
        this.instructionsTitle.setDepth(1002);
        
        // Full instructions text - i18n
        const fullInstructions = typeof getText === 'function' ? getText('instructions.body') : '🎮 CONTROLS\n← → or A/D - Move left/right\n↑ ↓ or W/S - Move up/down\nSPACE - Auto-shoot\nESC - Pause game\n\n🎯 OBJECTIVE\n-  Destroy enemies and bases\n-  Collect diamonds 💎\n-  Pick up power-ups ⚡\n-  Upgrade your ship in shop\n-  Complete missions and defeat bosses\n\n👾 ENEMIES\n🔴 Red spheres - Weak (fast)\n🔷 Hexagons - Medium (shows HP)\n🟦 Blue cubes - BASES (destroy these!)\n\n🛒 SHOP\n-  Buy new spaceships\n-  Upgrade weapons\n-  Improve stats\n-  Increase fire rate & damage\n\nGood luck, Commander! 🚀';
        
        this.instructionsContent = this.add.text(
            width / 2,
            height / 2 - panelHeight / 2 + 80,
            fullInstructions,
            {
                fontSize: '16px',
                fontFamily: 'Arial, sans-serif',
                color: '#333333',
                align: 'left',
                lineSpacing: 6,
                resolution: 2,
                wordWrap: { width: panelWidth - 60 }
            }
        );
        this.instructionsContent.setOrigin(0.5, 0);
        this.instructionsContent.setDepth(1002);
        
        // Close on overlay click
        this.overlay.on('pointerdown', () => {
            this.closeInstructionsOverlay();
        });
        
        // Fade in animation
        this.overlay.setAlpha(0);
        this.instructionsPanel.setScale(0.8);
        this.instructionsPanelBorder.setAlpha(0);
        this.instructionsTitle.setAlpha(0);
        this.instructionsContent.setAlpha(0);
        
        this.tweens.add({
            targets: this.overlay,
            alpha: 1,
            duration: 200
        });
        
        this.tweens.add({
            targets: [this.instructionsPanel, this.instructionsPanelBorder],
            alpha: 1,
            duration: 300,
            delay: 100
        });
        
        this.tweens.add({
            targets: this.instructionsPanel,
            scale: 1,
            duration: 300,
            delay: 100,
            ease: 'Back.easeOut'
        });
        
        this.tweens.add({
            targets: [this.instructionsTitle, this.instructionsContent],
            alpha: 1,
            duration: 300,
            delay: 250
        });
    }

    closeInstructionsOverlay() {
        // Fade out and destroy
        const elements = [
            this.overlay,
            this.instructionsPanel,
            this.instructionsPanelBorder,
            this.instructionsTitle,
            this.instructionsContent
        ];
        
        this.tweens.add({
            targets: elements,
            alpha: 0,
            duration: 200,
            onComplete: () => {
                elements.forEach(el => {
                    if (el && el.destroy) {
                        el.destroy();
                    }
                });
            }
        });
    }

    showLanguageOverlay() {
        const width = this.scale.width;
        const height = this.scale.height;
        const depthLang = 10000;
        this.langOverlay = this.add.rectangle(0, 0, width * 2, height * 2, 0x000000, 0.9);
        this.langOverlay.setOrigin(0, 0);
        this.langOverlay.setDepth(depthLang);
        this.langOverlay.setInteractive();
        this.langOverlay.on('pointerdown', () => this.closeLanguageOverlay());
        const panelW = Math.min(340, width * 0.85);
        const panelH = Math.min(500, height * 0.85);
        const panelX = width / 2 - panelW / 2;
        const panelY = height / 2 - panelH / 2;
        const textOffset = 40;
        const textX = panelX + textOffset;
        this.langPanel = this.add.rectangle(width / 2, height / 2, panelW, panelH, 0x1a1a2e, 0.98);
        this.langPanel.setDepth(depthLang + 1);
        this.langPanelBorder = this.add.graphics();
        this.langPanelBorder.lineStyle(3, 0x0052FF, 1);
        this.langPanelBorder.strokeRoundedRect(panelX, panelY, panelW, panelH, 10);
        this.langPanelBorder.setDepth(depthLang + 1);
        const titleStr = typeof getText === 'function' ? getText('menu.language') : 'Language 🌐';
        this.langTitle = this.add.text(textX, panelY + 26, titleStr, {
            fontSize: '20px',
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'bold',
            color: '#00ffff',
            align: 'left',
            resolution: 2
        });
        this.langTitle.setOrigin(0, 0.5);
        this.langTitle.setDepth(depthLang + 2);
        const g = typeof window !== 'undefined' && typeof window.getText === 'function' ? window.getText : (typeof getText === 'function' ? getText : function (k) { return k; });
        const zhStr = g('lang.chinese');
        const beStr = g('lang.belarusian');
        const deStr = g('lang.german');
        const enStr = g('lang.english');
        const frStr = g('lang.french');
        const hiStr = g('lang.hindi');
        const idStr = g('lang.indonesian');
        const ptStr = g('lang.portuguese');
        const ruStr = g('lang.russian');
        const tgStr = g('lang.tagalog');
        const viStr = g('lang.vietnamese');
        const ukStr = g('lang.ukrainian');
        const rowH = 30;
        const firstRowY = panelY + 66;
        var textStyle = { fontSize: '18px', fontFamily: 'Arial, sans-serif', color: '#ffffff', align: 'left', resolution: 2 };
        function addLangButton(y, str, langCode, logEmoji) {
            const t = this.add.text(textX, y, str, textStyle);
            t.setOrigin(0, 0.5);
            t.setDepth(depthLang + 2);
            t.setInteractive({ useHandCursor: true });
            t.on('pointerdown', () => { console.log(logEmoji); this._applyLang(langCode); });
            return t;
        }
        this.langZh = addLangButton.call(this, firstRowY + rowH * 0, zhStr, 'zh', '🇨🇳 ZH CLICKED');
        this.langBe = addLangButton.call(this, firstRowY + rowH * 1, beStr, 'be', '🇧🇾 BE CLICKED');
        this.langDe = addLangButton.call(this, firstRowY + rowH * 2, deStr, 'de', '🇩🇪 DE CLICKED');
        this.langEn = addLangButton.call(this, firstRowY + rowH * 3, enStr, 'en', '🇺🇸 EN CLICKED');
        this.langFr = addLangButton.call(this, firstRowY + rowH * 4, frStr, 'fr', '🇫🇷 FR CLICKED');
        this.langHi = addLangButton.call(this, firstRowY + rowH * 5, hiStr, 'hi', '🇮🇳 HI CLICKED');
        this.langId = addLangButton.call(this, firstRowY + rowH * 6, idStr, 'id', '🇮🇩 ID CLICKED');
        this.langPt = addLangButton.call(this, firstRowY + rowH * 7, ptStr, 'pt', '🇧🇷 PT CLICKED');
        this.langRu = addLangButton.call(this, firstRowY + rowH * 8, ruStr, 'ru', '🇷🇺 RU CLICKED');
        this.langTg = addLangButton.call(this, firstRowY + rowH * 9, tgStr, 'tg', '🇵🇭 TG CLICKED');
        this.langVi = addLangButton.call(this, firstRowY + rowH * 10, viStr, 'vi', '🇻🇳 VI CLICKED');
        this.langUk = addLangButton.call(this, firstRowY + rowH * 11, ukStr, 'uk', '🇺🇦 UK CLICKED');
    }

    /** Calls setLang(lang) then closes overlay and refreshMenuTexts. E.g. _applyLang('hi') -> setLang('hi'). */
    _applyLang(lang) {
        var setLangFn = typeof window !== 'undefined' ? window.setLang : (typeof setLang !== 'undefined' ? setLang : null);
        if (!setLangFn) { this.closeLanguageOverlay(); return; }
        setLangFn(lang);
        this.closeLanguageOverlay();
        var self = this;
        setTimeout(function () { self.refreshMenuTexts(); }, 0);
    }

    closeLanguageOverlay() {
        const el = [this.langOverlay, this.langPanel, this.langPanelBorder, this.langTitle, this.langEn, this.langHi, this.langRu, this.langUk, this.langTg, this.langId, this.langVi, this.langPt, this.langFr, this.langDe, this.langZh, this.langBe];
        el.forEach(o => { if (o && o.destroy) o.destroy(); });
        this.langOverlay = this.langPanel = this.langPanelBorder = this.langTitle = this.langEn = this.langHi = this.langRu = this.langUk = this.langTg = this.langId = this.langVi = this.langPt = this.langFr = this.langDe = this.langZh = this.langBe = null;
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        console.log('GameScene constructor called');
    }

    preload() {
        console.log('GameScene preload called');
        
        // Load spaceship sprites - try multiple path formats
        this.load.image('player', './assets/images/player.png');
        this.load.image('enemyWeak', './assets/images/enemy_weak.png');
        this.load.image('enemyBoss', './assets/images/enemy_boss.png');
        
        // Load mission system assets
        this.load.image('bossJesse', './assets/images/boss_jesse.png');
        this.load.image('baseCube', './assets/images/base_cube.jpg');
        
        // Load sound effects - try multiple path formats
        console.log('Loading sound files...');
        try {
            // Try without ./ prefix first (standard path)
            this.load.audio('shoot', 'assets/sounds/shoot.mp3');
            this.load.audio('explosion', 'assets/sounds/explosion.mp3');
            this.load.audio('hit', 'assets/sounds/hit.mp3');
            this.load.audio('powerup', 'assets/sounds/powerup.mp3');
            this.load.audio('coin', 'assets/sounds/coin.mp3');
            this.load.audio('click', 'assets/sounds/click.mp3');
            this.load.audio('purchase', 'assets/sounds/purchase.mp3');
            this.load.audio('celebration', 'assets/sounds/celebration.mp3');
            this.load.audio('bgMusic', 'assets/sounds/background.mp3');
            console.log('Sound file loading started');
        } catch (e) {
            console.error('Error setting up sound loading:', e);
        }
        
        // Debug: Track each file as it loads
        this.load.on('filecomplete', (key, type, data) => {
            if (type === 'audio') {
                console.log('✅ Sound loaded:', key, 'Type:', type);
            } else {
                console.log('Asset loaded:', key, 'Type:', type);
            }
        });
        
        // Enhanced error handling for all file types
        this.load.on('loaderror', (file) => {
            console.error('❌ Failed to load:', file.key, 'at path:', file.src);
            if (file.type === 'audio') {
                console.error('   Check if file exists at:', file.src);
            } else if (file.type === 'image') {
                console.error('   Image file failed to load. Check path:', file.src);
                if (file.key === 'bossJesse') {
                    console.error('   Boss image will use red circle fallback');
                    console.error('   Expected: assets/images/boss_jesse.png');
                } else if (file.key === 'baseCube') {
                    console.error('   Base cube will use original design with "B" letter');
                    console.error('   Expected: assets/images/base_cube.jpg');
                }
            }
        });
        
        this.load.on('complete', () => {
            console.log('📦 All assets loading complete');
            console.log('Checking audio cache...');
            const audioKeys = ['shoot', 'explosion', 'hit', 'powerup', 'coin', 'click', 'purchase', 'bgMusic'];
            let loadedCount = 0;
            audioKeys.forEach(key => {
                const exists = this.cache && this.cache.audio && this.cache.audio.exists(key);
                if (exists) loadedCount++;
                console.log(`   Audio '${key}': ${exists ? '✅ LOADED' : '❌ MISSING'}`);
                if (!exists) {
                    console.error(`      Expected path: assets/sounds/${key === 'bgMusic' ? 'background' : key}.mp3`);
                }
            });
            console.log(`📊 Audio summary: ${loadedCount}/${audioKeys.length} sounds loaded`);
            
            if (loadedCount === 0) {
                console.error('⚠️ WARNING: No audio files loaded!');
                console.error('   Check that files exist in assets/sounds/ folder');
                console.error('   Files should be named exactly: shoot.mp3, explosion.mp3, etc.');
            } else {
                console.log('✅ Sounds loaded successfully - will initialize after scene creates');
            }
            
            console.log('Player texture exists:', this.textures.exists('player'));
            console.log('EnemyWeak texture exists:', this.textures.exists('enemyWeak'));
            console.log('EnemyBoss texture exists:', this.textures.exists('enemyBoss'));
            
            // Texture verification for boss and cube
            console.log('===== TEXTURE VERIFICATION =====');
            console.log('Boss texture exists:', this.textures.exists('bossJesse'));
            console.log('Cube texture exists:', this.textures.exists('baseCube'));
            
            if (this.textures.exists('bossJesse')) {
                const tex = this.textures.get('bossJesse');
                console.log('Boss image size:', tex.source.width, 'x', tex.source.height);
            }
            if (this.textures.exists('baseCube')) {
                const tex = this.textures.get('baseCube');
                console.log('Cube image size:', tex.source.width, 'x', tex.source.height);
            }
            console.log('================================');
        });
        
        console.log('Preload complete - loading spaceship sprites and sounds');
    }

    create() {
        console.log('Game create() started');

        this.sceneReady = false;
        var pauseEl = document.getElementById('pause-overlay');
        if (pauseEl) pauseEl.classList.add('hidden');

        // 🔥 V2 RESET: One-time localStorage clear for all players
        if (!localStorage.getItem('base_invaders_v2_migrated')) {
            console.log('🔄 Migrating to V2: Clearing old data...');

            // Clear all old game data (including local leaderboard high score so first score after migration can be submitted)
            localStorage.removeItem('baseInvadersData');
            localStorage.removeItem('baseInvadersShop');
            localStorage.removeItem('baseInvadersLeaderboard');
            localStorage.removeItem('baseInvadersLocalHighScore');
            localStorage.removeItem('checkInStreak');
            localStorage.removeItem('highScore');

            // Mark migration as complete
            localStorage.setItem('base_invaders_v2_migrated', 'true');

            console.log('✅ V2 Migration complete - fresh start!');
        }

        // Verify textures loaded
        console.log('=== Texture Verification ===');
        console.log('Boss texture exists:', this.textures.exists('bossJesse'));
        console.log('Cube texture exists:', this.textures.exists('baseCube'));
        if (!this.textures.exists('bossJesse')) {
            console.warn('⚠️ Boss image (boss_jesse.png) not found - will use red circle fallback');
        }
        if (!this.textures.exists('baseCube')) {
            console.warn('⚠️ Base cube image (base_cube.jpg) not found - will use original design with "B" letter');
        }
        console.log('===========================');
        
        try {
            console.log('Scene width:', this.scale.width, 'height:', this.scale.height);
            // Game state
            this.gameState = {
                score: 0,
                stage: 1,
                gold: 0,
                lightning: 0,
                diamonds: 0,
                playerLevel: 1,
                xp: 0,
                xpToNext: 100,
                paused: false,
                gameOver: false,
                scoreMultiplier: 1,
                inMenuPause: false
            };

            // Create background
            try {
                this.createBackground();
                console.log('Background created');
            } catch (e) {
                console.error('Error creating background:', e);
            }

            // Initialize boss flag
            this.bossActive = false;
            this.laserActive = false;
            this.laserBeamGraphic = null;
            this.laserDuration = 3;
            this.laserEndTime = 0;
            this.laserCooldown = 15000;
            this.laserCooldownEnd = 0;
            this.enemyShootPausedUntil = 0;
            
            // Mission system
            this.missionSystem = {
                currentMission: 1,
                currentWave: 1,
                maxWaves: 5,
                waveEnemiesKilled: 0,
                waveEnemiesTotal: 0,
                bossActive: false
            };
            this.gameState.missionSystem = this.missionSystem;

            // Leaderboard: high score at run start (for "new record during play" dialog, like check-in)
            this._highScoreAtRunStart = (window.baseInvadersLeaderboard && typeof window.baseInvadersLeaderboard.getLocalHighScore === 'function')
                ? (window.baseInvadersLeaderboard.getLocalHighScore()?.score ?? 0)
                : 0;
            this._leaderboardSubmitShownThisRun = false;

            // Player stats (from shop) - load before creating player
            this.playerStats = {
                fireRate: 300,
                damage: 1,
                multiShot: 1,
                bulletSize: 1,
                maxHP: 100,
                speed: 300,
                shield: 0,
                coinMagnet: false
            };

            // --- Синхронізація прогресу (Supabase) — без блокування create() ---
            this.loadGameData();
            const loadFid = (window.__baseInvadersCheckInFid && window.__baseInvadersCheckInFid !== 'default') ? window.__baseInvadersCheckInFid : TEST_FID;
            try {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 3000);
                if (!localStorage.getItem('beta_reset_v2')) {
                    localStorage.clear();
                    localStorage.setItem('beta_reset_v2', 'true');
                    this.gameState.gold = 0; this.gameState.lightning = 0; this.gameState.diamonds = 0;
                    this.gameState.playerLevel = 1; this.gameState.stage = 1;
                    this.gameState.xp = 0; this.gameState.xpToNext = 100;
                    this.missionSystem.currentMission = 1; this.missionSystem.currentWave = 1; this.missionSystem.bossActive = false;
                    this.playerStats.fireRate = 300; this.playerStats.damage = 1; this.playerStats.multiShot = 1; this.playerStats.maxHP = 100; this.playerStats.speed = 300;
                    const payload = { fid: loadFid, gold: 0, diamonds: 0, lightning: 0, wave: 1, mission: 1, level: 1, best_score: 0, upgrades: { fireRate: 300, damage: 1, multiShot: 1, maxHP: 100, speed: 300 }, achievements: {}, daily_streak: 0, last_checkin: null };
                    fetch('/api/progress', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: controller.signal }).catch(() => {});
                    console.log('🔄 Beta reset completed. Starting from zero.');
                } else {
                    fetch(`/api/progress?fid=${encodeURIComponent(loadFid)}`, { signal: controller.signal })
                        .then(res => res.ok ? res.json() : null)
                        .then(data => {
                            if (!data || typeof data !== 'object') return;
                            if (typeof data.upgrades === 'string') { try { data.upgrades = JSON.parse(data.upgrades); } catch (e) { data.upgrades = null; } }
                            // Двостороння синхронізація: зливаємо сервер + локальні дані (беремо кращі значення), щоб апгрейди з ноутбука не скидалися телефоном і навпаки
                            const localGold = this.gameState.gold || 0;
                            const localDiamonds = this.gameState.diamonds || 0;
                            const localLightning = this.gameState.lightning || 0;
                            const localLevel = this.gameState.playerLevel || 1;
                            const localWave = this.gameState.stage || 1;
                            const localMission = this.missionSystem.currentMission || 1;
                            const serverGold = Number(data.gold) || 0;
                            const serverDiamonds = Number(data.diamonds) || 0;
                            const serverLightning = Number(data.lightning) || 0;
                            const serverLevel = Number(data.level) || 1;
                            const serverWave = Number(data.wave) || 1;
                            const serverMission = Number(data.mission) || 1;
                            this.gameState.gold = Math.max(localGold, serverGold);
                            this.gameState.lightning = Math.max(localLightning, serverLightning);
                            this.gameState.diamonds = Math.max(localDiamonds, serverDiamonds);
                            this.gameState.playerLevel = Math.max(localLevel, serverLevel);
                            this.gameState.stage = Math.max(localWave, serverWave);
                            this.missionSystem.currentMission = Math.max(localMission, serverMission);
                            this.missionSystem.currentWave = Math.max(localWave, serverWave);
                            const up = data.upgrades && typeof data.upgrades === 'object' ? data.upgrades : {};
                            const lr = this.playerStats.fireRate ?? 300;
                            const ld = this.playerStats.damage ?? 1;
                            const lm = this.playerStats.multiShot ?? 1;
                            const lh = this.playerStats.maxHP ?? 100;
                            const ls = this.playerStats.speed ?? 300;
                            this.playerStats.fireRate = Math.min(lr, up.fireRate != null ? Number(up.fireRate) : lr);
                            this.playerStats.damage = Math.max(ld, up.damage != null ? Number(up.damage) : ld);
                            this.playerStats.multiShot = Math.max(lm, up.multiShot != null ? Number(up.multiShot) : lm);
                            this.playerStats.maxHP = Math.max(lh, up.maxHP != null ? Number(up.maxHP) : lh);
                            this.playerStats.speed = Math.max(ls, up.speed != null ? Number(up.speed) : ls);
                            const localBest = parseInt(localStorage.getItem('highScore') || '0', 10);
                            const serverBest = data.best_score != null ? Number(data.best_score) : 0;
                            const bestScore = Math.max(localBest, serverBest);
                            localStorage.setItem('highScore', String(bestScore));
                            this.mergeServerProgressIntoLocalStorage();
                            this.loadPlayerStats();
                            if (this.player) {
                                this.player.maxHP = this.playerStats.maxHP;
                                this.player.hp = Math.min(this.player.hp, this.playerStats.maxHP);
                            }
                            if (this.ui) this.ui.update(this.gameState);
                            console.log('✅ Progress merged from server (sync both ways)');
                        })
                        .catch(() => console.log('⚠️ Server sync skipped'))
                        .finally(() => clearTimeout(timeout));
                }
            } catch (e) {
                console.log('⚠️ Offline mode');
            }

            // Load player stats from shop (з localStorage, який міг оновитись з сервера)
            try {
                this.loadPlayerStats();
            } catch (e) {
                console.warn('Error loading player stats:', e);
            }

            // Ability state from shop: 1 smart bomb per run if owned; laser beam if owned
            this.gameState.smartBombUses = 0;
            this.gameState.hasSmartBomb = false;
            this.gameState.hasLaserBeam = false;
            try {
                const shopJson = localStorage.getItem('baseInvadersShop');
                if (shopJson) {
                    const shop = JSON.parse(shopJson);
                    const up = shop.upgrades || {};
                    if (up.smartBomb) {
                        this.gameState.hasSmartBomb = true;
                        this.gameState.maxSmartBombs = up.maxSmartBombs || 1;
                        this.gameState.smartBombUses = Math.min(this.gameState.smartBombUses || 0, this.gameState.maxSmartBombs);
                        if (this.gameState.smartBombUses < 1) this.gameState.smartBombUses = this.gameState.maxSmartBombs;
                    }
                    if (up.laserBeam) this.gameState.hasLaserBeam = true;
                }
            } catch (e) {}

            // Create groups FIRST (before creating objects)
            this.bullets = this.add.group();
            this.enemyBullets = this.add.group();
            this.enemies = this.add.group();
            this.powerUps = this.add.group();
            this.particles = this.add.group();
            console.log('Groups created');

            // Create player
            try {
                const playerX = this.scale.width / 2;
                const playerY = this.scale.height - 120;
                console.log('Creating player at:', playerX, playerY);
                console.log('Player texture exists:', this.textures.exists('player'));
                this.player = new Player(this, playerX, playerY);
                
                // Apply loaded stats to player
                if (this.player) {
                    this.player.maxHP = this.playerStats.maxHP;
                    this.player.hp = this.playerStats.maxHP;
                    console.log('Player created');
                }
            } catch (e) {
                console.error('CRITICAL: Error creating player:', e);
                // Create simple fallback player
                this.player = { sprite: this.add.rectangle(this.scale.width / 2, this.scale.height - 80, 30, 30, 0x00ff00), hp: 100, maxHP: 100 };
                this.physics.add.existing(this.player.sprite);
            }

            // Create UI
            try {
                console.log('Creating UI...');
                this.ui = new UI(this, this.gameState);
                console.log('UI created');
            } catch (e) {
                console.error('Error creating UI:', e);
            }

            this.sceneReady = true;

            this._langChangedCallback = () => {
                if (this.ui) {
                    if (this.ui.shopBtnText && typeof getText === 'function') this.ui.shopBtnText.setText(getText('ui.shop'));
                    if (this.gameState) {
                        this.ui.update(this.gameState);
                        this.ui.updateCheckInButtonState();
                    }
                }
            };
            window.addEventListener('base-invaders:lang-changed', this._langChangedCallback);

            this._resizeCallback = () => {
                if (this.updateMuteButtonPosition) this.updateMuteButtonPosition();
            };
            this.scale.on('resize', this._resizeCallback);

            // Initialize Sound System
            // Sounds will start after first user interaction (browser autoplay policy)
            this.soundInitialized = false;
            this.userInteracted = false;
            this.sounds = {};  // Initialize empty sounds object
            this.bgMusic = null;
            
            console.log('🎵 Sound system initialization queued - will initialize after load completes');
            
            // Initialize sound system - use scene's 'ready' event or check cache periodically
            // Phaser's load happens before create(), but cache might not be ready immediately
            this.checkAndInitSounds();

            // Input handlers
            try {
                this.setupInput();
                console.log('Input handlers set up');
            } catch (e) {
                console.error('Error setting up input:', e);
            }

            // Game timers
            this.shootTimer = 0;
            this.spawnTimer = 0;
            this.stageTimer = 0;
            this.enemySpawnRate = 2000;

            // Синхронізація прогресу з сервером кожні 30 секунд
            this.syncProgressInterval = setInterval(() => {
                if (this.syncProgress) this.syncProgress();
            }, 30000);

            // Create particle texture for effects
            try {
                this.createParticleTexture();
            } catch (e) {
                console.warn('Error creating particle texture:', e);
            }
            
            // Start spawning enemies
            try {
                this.spawnEnemies();
                console.log('Enemies system initialized');
            } catch (e) {
                console.error('Error spawning enemies:', e);
            }
            
            console.log('Game running');

            setTimeout(() => {
                console.log('🎮 Dispatching base-invaders:game-ready event...');
                window.dispatchEvent(new Event('base-invaders:game-ready'));
            }, 500);
        } catch (e) {
            console.error('CRITICAL ERROR in create():', e);
            console.error('Stack:', e.stack);
        }
    }
    
    createParticleTexture() {
        // Create a simple particle texture for effects
        const graphics = this.add.graphics();
        graphics.fillStyle(0xffffff, 1);
        graphics.fillCircle(0, 0, 2);
        graphics.generateTexture('particle', 4, 4);
        graphics.destroy();
    }

    checkAndInitSounds() {
        // Check if sounds are loaded and initialize them
        const checkInterval = 200; // Check every 200ms
        let attempts = 0;
        const maxAttempts = 25; // Check for 5 seconds max
        
        const checkSounds = () => {
            attempts++;
            
            // Check if audio cache is available and has sounds
            if (this.cache && this.cache.audio) {
                const testKey = 'shoot'; // Test with one sound
                if (this.cache.audio.exists(testKey)) {
                    console.log('✅ Audio cache ready - initializing sounds...');
                    this.initSoundSystem();
                    return; // Success, stop checking
                } else if (attempts < maxAttempts) {
                    // Sounds not loaded yet, check again
                    console.log(`⏳ Waiting for sounds to load... (attempt ${attempts}/${maxAttempts})`);
                    this.time.delayedCall(checkInterval, checkSounds);
                } else {
                    console.warn('⚠️ Sounds did not load after 5 seconds - initializing anyway');
                    this.initSoundSystem(); // Initialize anyway, will handle missing sounds
                }
            } else if (attempts < maxAttempts) {
                // Cache not ready yet
                this.time.delayedCall(checkInterval, checkSounds);
            } else {
                console.error('❌ Audio cache not available - sounds may not work');
                this.initSoundSystem(); // Try anyway
            }
        };
        
        // Start checking
        this.time.delayedCall(checkInterval, checkSounds);
    }

    initSoundSystem() {
        // Prevent duplicate initialization
        if (this.soundInitialized) {
            console.log('⚠️ Sound system already initialized, skipping...');
            return;
        }
        
        console.log('🎵 Initializing sound system NOW...');
        console.log('Audio cache available:', this.cache && this.cache.audio ? 'YES' : 'NO');
        
        // Initialize sound objects with error handling
        if (!this.sounds) {
            this.sounds = {};
        }
        
        // Create sound effects (will be null if files not found)
        const soundKeys = ['shoot', 'explosion', 'hit', 'powerup', 'coin', 'click', 'purchase', 'celebration'];
        let soundsCreated = 0;
        let soundsFailed = 0;
        
        soundKeys.forEach(key => {
            try {
                // Check if cache exists and sound is loaded
                const exists = this.cache && this.cache.audio && this.cache.audio.exists(key);
                console.log(`   Checking sound '${key}': ${exists ? 'EXISTS' : 'NOT FOUND'}`);
                
                if (exists) {
                    // Check if sound already exists to avoid duplicates
                    if (this.sound.get(key)) {
                        this.sounds[key] = this.sound.get(key);
                        console.log(`✅ Sound '${key}' already exists, reusing`);
                    } else {
                        this.sounds[key] = this.sound.add(key, { volume: 0.5 });
                        console.log(`✅ Sound effect CREATED: ${key}`);
                        soundsCreated++;
                    }
                } else {
                    this.sounds[key] = null;
                    console.error(`❌ Sound '${key}' NOT FOUND in cache`);
                    console.error(`   File path should be: assets/sounds/${key}.mp3`);
                    soundsFailed++;
                }
            } catch (e) {
                this.sounds[key] = null;
                console.error(`❌ ERROR creating sound '${key}':`, e);
                soundsFailed++;
            }
        });
        
        // Background music with looping
        try {
            const bgExists = this.cache && this.cache.audio && this.cache.audio.exists('bgMusic');
            console.log(`   Checking background music: ${bgExists ? 'EXISTS' : 'NOT FOUND'}`);
            
            if (bgExists) {
                // Check if bgMusic already exists
                if (this.sound.get('bgMusic')) {
                    this.bgMusic = this.sound.get('bgMusic');
                    console.log('✅ Background music already exists, reusing');
                } else {
                    this.bgMusic = this.sound.add('bgMusic', { volume: 0.2, loop: true });
                    console.log('✅ Background music CREATED');
                    soundsCreated++;
                }
            } else {
                this.bgMusic = null;
                console.error('❌ Background music NOT FOUND in cache');
                console.error('   File path should be: assets/sounds/background.mp3');
                soundsFailed++;
            }
        } catch (e) {
            this.bgMusic = null;
            console.error('❌ ERROR creating background music:', e);
            soundsFailed++;
        }
        
        // Load mute preference from localStorage
        this.isMuted = localStorage.getItem('musicMuted') === 'true';
        console.log(`📊 Sound Summary: ${soundsCreated} created, ${soundsFailed} failed`);
        console.log(`🔇 Mute state: ${this.isMuted ? 'MUTED' : 'UNMUTED'}`);
        
        // Background music will start after first user interaction (browser autoplay policy)
        // Don't try to play immediately - wait for user click
        
        // Create mute button (only once)
        if (!this.muteButtonBg) {
            this.createMuteButton();
            console.log('🔘 Mute button created');
        }

        // Mark as initialized
        this.soundInitialized = true;
        console.log('✅ Sound system initialization COMPLETE');
        
        if (soundsFailed === 0) {
            console.log('🎉 All sounds loaded successfully!');
        } else {
            console.warn(`⚠️ ${soundsFailed} sound(s) failed to load - check file paths above`);
        }
    }

    handleUserInteraction() {
        // Start background music after first user interaction (required by browsers)
        if (!this.userInteracted) {
            this.userInteracted = true;
            console.log('👆 User interaction detected - activating audio');
            
            // Initialize sound system if not already done
            if (!this.soundInitialized) {
                try {
                    console.log('Initializing sound system on user interaction...');
                    this.initSoundSystem();
                } catch (e) {
                    console.error('❌ Error initializing sound system on user interaction:', e);
                }
            }
            
            // Start background music if available and not muted
            if (this.bgMusic && !this.isMuted) {
                try {
                    this.bgMusic.play();
                    console.log('🎵 Background music started after user interaction');
                } catch (e) {
                    console.error('❌ Could not play background music:', e);
                    console.error('   Error details:', e.message);
                }
            } else if (!this.bgMusic) {
                console.warn('⚠️ Background music not available - file may not have loaded');
            }
        }
    }

    createMuteButton() {
        const buttonX = 0;
        const buttonY = 0;
        
        // Button background (semi-transparent circle)
        this.muteButtonBg = this.add.circle(buttonX, buttonY, 20, 0x333333, 0.7);
        this.muteButtonBg.setScrollFactor(0);
        this.muteButtonBg.setDepth(100);
        this.muteButtonBg.setInteractive({ useHandCursor: true });
        
        // Unmuted icon (bright speaker 🔊) - no glow/tint/alpha
        this.muteIconUnmuted = this.add.text(buttonX, buttonY, '🔊', {
            fontSize: '24px',
            align: 'center'
        });
        this.muteIconUnmuted.setOrigin(0.5);
        this.muteIconUnmuted.setScrollFactor(0);
        this.muteIconUnmuted.setDepth(101);
        if (this.muteIconUnmuted.preFX) this.muteIconUnmuted.preFX.clear();
        if (this.muteIconUnmuted.postFX) this.muteIconUnmuted.postFX.clear();
        
        // Muted icon (speaker off 🔇) - no glow/tint/alpha, plain icon
        this.muteIconMuted = this.add.text(buttonX, buttonY, '🔇', {
            fontSize: '24px',
            align: 'center'
        });
        this.muteIconMuted.setOrigin(0.5);
        this.muteIconMuted.setScrollFactor(0);
        this.muteIconMuted.setDepth(101);
        this.muteIconMuted.setVisible(false);
        if (this.muteIconMuted.preFX) this.muteIconMuted.preFX.clear();
        if (this.muteIconMuted.postFX) this.muteIconMuted.postFX.clear();
        
        // Cross line for muted state (visual X)
        this.muteCross = this.add.graphics();
        this.muteCross.setScrollFactor(0);
        this.muteCross.setDepth(102);
        this.muteCross.setVisible(false);
        this.updateMuteButtonPosition();
        
        // Update visual state based on mute preference
        this.updateMuteButtonVisual();
        
        // Make both icon and background clickable
        this.muteIconUnmuted.setInteractive({ useHandCursor: true });
        this.muteIconMuted.setInteractive({ useHandCursor: true });
        
        // Click handler on background
        this.muteButtonBg.on('pointerdown', () => {
            console.log('🔊 Mute button clicked');
            this.toggleMute();
        });
        
        // Click handler on icons (in case background doesn't catch it)
        this.muteIconUnmuted.on('pointerdown', () => {
            console.log('🔊 Mute icon (unmuted) clicked');
            this.toggleMute();
        });
        
        this.muteIconMuted.on('pointerdown', () => {
            console.log('🔇 Mute icon (muted) clicked');
            this.toggleMute();
        });
        
        // Hover effect on background
        this.muteButtonBg.on('pointerover', () => {
            this.muteButtonBg.setFillStyle(0x444444, 0.9);
        });
        
        this.muteButtonBg.on('pointerout', () => {
            const bgColor = this.isMuted ? 0x222222 : 0x333333;
            this.muteButtonBg.setFillStyle(bgColor, 0.7);
        });
        
        // Hover effect on icons
        [this.muteIconUnmuted, this.muteIconMuted].forEach(icon => {
            icon.on('pointerover', () => {
                this.muteButtonBg.setFillStyle(0x444444, 0.9);
            });
            icon.on('pointerout', () => {
                const bgColor = this.isMuted ? 0x222222 : 0x333333;
                this.muteButtonBg.setFillStyle(bgColor, 0.7);
            });
        });
    }

    updateMuteButtonPosition() {
        if (!this.muteButtonBg) return;
        const width = this.scale.width;
        const height = this.scale.height;
        const margin = Math.max(10, width * 0.03);
        const radius = Math.max(16, Math.min(width * 0.05, 22));
        const buttonX = width - margin - radius;
        
        // Position below pause button (not covering Score/Level)
        // Get pause button Y from UI layout if available
        let pauseBtnY = margin + 80; // Fallback
        if (this.ui && this.ui.layout && this.ui.layout.pauseY) {
            pauseBtnY = this.ui.layout.pauseY;
        } else if (this.ui && this.ui.pauseBtn) {
            pauseBtnY = this.ui.pauseBtn.y;
        }
        const buttonY = pauseBtnY + 40; // Below pause button

        this.muteButtonBg.setPosition(buttonX, buttonY);
        this.muteButtonBg.setRadius(radius);
        const fontSize = Math.max(16, radius * 1.1);
        this.muteIconUnmuted.setPosition(buttonX, buttonY);
        this.muteIconUnmuted.setFontSize(`${fontSize}px`);
        this.muteIconMuted.setPosition(buttonX, buttonY);
        this.muteIconMuted.setFontSize(`${fontSize}px`);

        this.muteCross.clear();
        this.muteCross.lineStyle(3, 0xff0000, 0.8);
        const lineOffset = radius * 0.6;
        this.muteCross.strokeLineShape(
            new Phaser.Geom.Line(
                buttonX - lineOffset,
                buttonY - lineOffset,
                buttonX + lineOffset,
                buttonY + lineOffset
            )
        );
        this.muteCross.strokeLineShape(
            new Phaser.Geom.Line(
                buttonX + lineOffset,
                buttonY - lineOffset,
                buttonX - lineOffset,
                buttonY + lineOffset
            )
        );
    }

    updateMuteButtonVisual() {
        if (this.isMuted) {
            // Show muted state (gray + crossed)
            this.muteIconUnmuted.setVisible(false);
            this.muteIconMuted.setVisible(true);
            this.muteCross.setVisible(true);
            this.muteButtonBg.setFillStyle(0x222222, 0.7);  // Darker background
        } else {
            // Show unmuted state (bright)
            this.muteIconUnmuted.setVisible(true);
            this.muteIconMuted.setVisible(false);
            this.muteCross.setVisible(false);
            this.muteButtonBg.setFillStyle(0x333333, 0.7);  // Normal background
        }
    }

    toggleMute() {
        // Handle user interaction for audio context
        this.handleUserInteraction();
        
        // Toggle mute state
        this.isMuted = !this.isMuted;
        
        // Save to localStorage
        localStorage.setItem('musicMuted', this.isMuted.toString());
        console.log('🔊 Mute toggled:', this.isMuted ? 'MUTED' : 'UNMUTED');
        
        // Play/Stop background music
        if (this.bgMusic) {
            try {
                if (this.isMuted) {
                    // Stop background music
                    this.bgMusic.stop();
                    console.log('🔇 Background music STOPPED (muted)');
                } else {
                    // Start background music (Phaser handles already-playing case)
                    this.bgMusic.play();
                    console.log('🔊 Background music STARTED (unmuted)');
                }
            } catch (e) {
                console.error('❌ Error toggling background music:', e);
                console.error('   Error message:', e.message);
                console.error('   bgMusic type:', typeof this.bgMusic);
                console.error('   bgMusic object:', this.bgMusic);
            }
        } else {
            console.warn('⚠️ bgMusic is null - cannot toggle');
            console.warn('   Sound system may not be initialized yet - initializing now...');
            
            // Initialize sound system immediately if not done
            if (!this.soundInitialized) {
                try {
                    this.initSoundSystem();
                    // After initialization, toggle again
                    this.time.delayedCall(200, () => {
                        if (this.bgMusic && !this.isMuted) {
                            try {
                                this.bgMusic.play();
                                console.log('🔊 Background music started after initialization');
                            } catch (e) {
                                console.error('❌ Could not start music after init:', e);
                            }
                        }
                    });
                } catch (e) {
                    console.error('❌ Failed to initialize sound system:', e);
                }
            } else {
                console.warn('   Sound system initialized but bgMusic is null - file may not have loaded');
            }
        }
        
        // Update visual state immediately
        this.updateMuteButtonVisual();
        
        // Play click sound effect (not affected by mute - only bgMusic is muted)
        this.playSound('click');
    }

    playSound(soundKey) {
        // Handle user interaction for audio context (required by browsers)
        if (!this.userInteracted) {
            this.handleUserInteraction();
        }
        
        // Ensure sound system is initialized
        if (!this.soundInitialized) {
            this.initSoundSystem();
        }
        
        // Play sound effect (not affected by mute - only bgMusic is muted)
        if (this.sounds && this.sounds[soundKey]) {
            try {
                // Check if sound is already playing and stop it for immediate replay
                if (this.sounds[soundKey].isPlaying) {
                    this.sounds[soundKey].stop();
                }
                this.sounds[soundKey].play();
                // Only log in debug mode (first few plays to verify it works)
                if (!this._soundDebugLogged) {
                    console.log(`🔊 Sound system working - playing: ${soundKey}`);
                    this._soundDebugLogged = true;
                }
            } catch (e) {
                console.error(`❌ Error playing sound '${soundKey}':`, e);
                console.error(`   Sound object exists: ${!!this.sounds[soundKey]}`);
                console.error(`   Sound object type: ${typeof this.sounds[soundKey]}`);
            }
            } else {
                // Only log once per sound to avoid spam
                if (!this._soundWarnings) this._soundWarnings = {};
                if (!this._soundWarnings[soundKey]) {
                    console.warn(`⚠️ Sound '${soundKey}' is null - file may not be loaded`);
                    console.warn(`   Check console for loading errors above`);
                    this._soundWarnings[soundKey] = true;
                }
            }
    }

    createBackground() {
        const width = this.scale.width;
        const height = this.scale.height;
        console.log('Creating background, size:', width, 'x', height);
        
        // Parallax layers (3 layers for depth)
        // Layer 1: Far stars (slowest scroll)
        this.bgLayer1 = this.add.container(0, 0);
        this.bgLayer1.setDepth(-3);
        this.starsFar = [];
        for (let i = 0; i < 200; i++) {
            const star = this.add.circle(
                Phaser.Math.Between(0, width),
                Phaser.Math.Between(0, height),
                Phaser.Math.Between(1, 2),
                0xffffff,
                Phaser.Math.FloatBetween(0.3, 0.6)
            );
            star.scrollSpeed = 20;
            this.starsFar.push(star);
            this.bgLayer1.add(star);
        }
        
        // Layer 2: Nebula/mid stars (medium scroll)
        this.bgLayer2 = this.add.container(0, 0);
        this.bgLayer2.setDepth(-2);
        this.starsMid = [];
        for (let i = 0; i < 100; i++) {
            const star = this.add.circle(
                Phaser.Math.Between(0, width),
                Phaser.Math.Between(0, height),
                Phaser.Math.Between(2, 3),
                0x88aaff,
                Phaser.Math.FloatBetween(0.4, 0.7)
            );
            star.scrollSpeed = 50;
            this.starsMid.push(star);
            this.bgLayer2.add(star);
        }
        
        // Create nebula gradient effect
        this.nebula = this.add.graphics();
        this.nebula.fillGradientStyle(0x4a00ff, 0x4a00ff, 0x0000ff, 0x0000ff, 0.2);
        this.nebula.fillRect(0, 0, width, height);
        this.nebula.setDepth(-2);
        
        // Layer 3: Close debris (fastest scroll)
        this.bgLayer3 = this.add.container(0, 0);
        this.bgLayer3.setDepth(-1);
        this.debris = [];
        for (let i = 0; i < 30; i++) {
            const debris = this.add.circle(
                Phaser.Math.Between(0, width),
                Phaser.Math.Between(0, height),
                Phaser.Math.Between(3, 5),
                0xaaaaaa,
                0.5
            );
            debris.scrollSpeed = 100;
            this.debris.push(debris);
            this.bgLayer3.add(debris);
        }
        
        // Add fog/atmosphere overlay
        this.fog = this.add.graphics();
        this.fog.fillGradientStyle(0x000000, 0x000000, 0x000033, 0x000033, 0.1);
        this.fog.fillRect(0, 0, width, height);
        this.fog.setDepth(1);
        
        console.log('Background created successfully with parallax layers');
    }

    setupInput() {
        // Handle first user interaction for audio
        this.input.once('pointerdown', () => {
            this.handleUserInteraction();
        });
        
        // Touch drag-style controls: relative movement based on finger delta
        this.isDragging = false;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.playerStartX = 0;
        this.playerStartY = 0;
        
        this.input.on('pointerdown', (pointer) => {
            if (!this.gameState.paused && !this.gameState.gameOver && this.player) {
                this.isDragging = true;
                // Save initial touch position
                this.touchStartX = pointer.x;
                this.touchStartY = pointer.y;
                // Save initial player position
                this.playerStartX = this.player.sprite.x;
                this.playerStartY = this.player.sprite.y;
            }
            // Ensure audio context is active
            this.handleUserInteraction();
        });

        this.input.on('pointermove', (pointer) => {
            if (this.isDragging && !this.gameState.paused && !this.gameState.gameOver && this.player) {
                // Calculate delta (relative movement)
                const deltaX = pointer.x - this.touchStartX;
                const deltaY = pointer.y - this.touchStartY;
                
                // Move player by delta from initial position
                const newX = Phaser.Math.Clamp(
                    this.playerStartX + deltaX,
                    30,
                    this.scale.width - 30
                );
                const newY = Phaser.Math.Clamp(
                    this.playerStartY + deltaY,
                    100,
                    this.scale.height - 100
                );
                
                this.player.setPosition(newX, newY);
            }
        });

        this.input.on('pointerup', () => {
            this.isDragging = false;
        });

        // Keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,S,A,D');
        
        // Handle keyboard input for audio context (first key press)
        this.input.keyboard.once('keydown', () => {
            this.handleUserInteraction();
        });

        // Pause button
        this.input.keyboard.on('keydown-ESC', () => {
            this.handleUserInteraction();  // Ensure audio context is active
            this.togglePause();
        });
    }

    update(time, delta) {
        // 🔥 КРИТИЧНО! Зупинити update() якщо сцена неактивна
        if (!this.scene.isActive('GameScene')) {
            return;
        }
        // 🔥 КРИТИЧНО! Не оновлювати поки create() не завершив ініціалізацію (async create → update може бігти зі старими refs)
        if (!this.sceneReady) {
            return;
        }

        try {
            if (this.gameState.paused || this.gameState.gameOver) return;
            
            // Safety check
            if (!this.player || !this.player.sprite) {
                console.error('Player not initialized!');
                return;
            }
            if (!this.ui) {
                console.error('UI not initialized!');
                return;
            }

            // Update background
            try {
                this.updateBackground(delta);
            } catch (e) {
                console.warn('Error updating background:', e);
            }

            // Update player
            try {
                if (this.player && this.player.update) {
                    this.player.update(time, delta, this.cursors, this.wasd, this.playerStats);
                }
            } catch (e) {
                console.warn('Error updating player:', e);
            }

            // Auto-shoot (вимкнено під час 8с ульту лазера)
            try {
                if (this.laserActive && time <= this.laserEndTime) {
                    // не стріляти кулями під час лазера
                } else {
                    if (time > this.shootTimer) {
                        this.shootBullets();
                        this.shootTimer = time + this.playerStats.fireRate;
                    }
                }
                if (this.laserActive && time > this.laserEndTime) {
                    this.laserActive = false;
                    if (this.laserBeamGraphic) this.laserBeamGraphic.clear();
                }
            } catch (e) {
                console.warn('Error shooting:', e);
            }

            // Update bullets
            try {
                this.updateBullets();
            } catch (e) {
                console.warn('Error updating bullets:', e);
            }

            // Update enemies
            try {
                this.updateEnemies(time, delta);
            } catch (e) {
                console.warn('Error updating enemies:', e);
            }

            // Update enemy bullets
            try {
                this.updateEnemyBullets();
            } catch (e) {
                console.warn('Error updating enemy bullets:', e);
            }

            // Update power-ups
            try {
                this.updatePowerUps();
            } catch (e) {
                console.warn('Error updating power-ups:', e);
            }

            // Collision detection
            try {
                this.checkCollisions();
            } catch (e) {
                console.warn('Error checking collisions:', e);
            }

            if (this.laserActive && time <= this.laserEndTime && this.gameState.hasLaserBeam && this.player) {
                try {
                    this.updateLaserBeam(delta);
                } catch (e) {
                    console.warn('Error updating laser beam:', e);
                }
            } else if (this.laserBeamGraphic) {
                this.laserBeamGraphic.clear();
            }

            // Spawn enemies
            try {
                this.handleSpawning(time);
            } catch (e) {
                console.warn('Error spawning enemies:', e);
            }

            // Update stage
            try {
                this.updateStage(time);
            } catch (e) {
                console.warn('Error updating stage:', e);
            }

            // Update UI (expose laser cooldown for ability buttons)
            try {
                this.gameState.laserActive = this.laserActive;
                this.gameState.laserCooldownEnd = this.laserCooldownEnd;
                this.gameState.laserCooldownRemaining = Math.max(0, (this.laserCooldownEnd - time) / 1000);
                if (this.ui && this.ui.update) {
                    this.ui.update(this.gameState);
                }
            } catch (e) {
                console.warn('Error updating UI:', e);
            }
        } catch (e) {
            console.error('CRITICAL ERROR in update():', e);
        }
    }

    updateBackground(delta) {
        const deltaTime = delta / 1000;
        
        // Parallax scrolling - different speeds for depth
        this.starsFar.forEach(star => {
            star.y += star.scrollSpeed * deltaTime;
            if (star.y > this.scale.height) {
                star.y = -10;
                star.x = Phaser.Math.Between(0, this.scale.width);
            }
        });
        
        this.starsMid.forEach(star => {
            star.y += star.scrollSpeed * deltaTime;
            if (star.y > this.scale.height) {
                star.y = -10;
                star.x = Phaser.Math.Between(0, this.scale.width);
            }
        });
        
        this.debris.forEach(debris => {
            debris.y += debris.scrollSpeed * deltaTime;
            if (debris.y > this.scale.height) {
                debris.y = -10;
                debris.x = Phaser.Math.Between(0, this.scale.width);
            }
        });
    }

    shootBullets() {
        if (this.laserActive) return;
        this.playSound('shoot');
        const x = this.player.x;
        const y = this.player.y - 20;
        const bulletSpeed = 600;
        const spread = 15;

        if (this.playerStats.multiShot === 1) {
            this.createBullet(x, y, 0, bulletSpeed);
        } else if (this.playerStats.multiShot === 2) {
            this.createBullet(x - 10, y, -spread, bulletSpeed);
            this.createBullet(x + 10, y, spread, bulletSpeed);
        } else if (this.playerStats.multiShot === 3) {
            this.createBullet(x, y, 0, bulletSpeed);
            this.createBullet(x - 15, y, -spread, bulletSpeed);
            this.createBullet(x + 15, y, spread, bulletSpeed);
        } else if (this.playerStats.multiShot >= 5) {
            this.createBullet(x, y, 0, bulletSpeed);
            this.createBullet(x - 20, y, -spread * 1.5, bulletSpeed);
            this.createBullet(x + 20, y, spread * 1.5, bulletSpeed);
            this.createBullet(x - 10, y, -spread * 0.5, bulletSpeed);
            this.createBullet(x + 10, y, spread * 0.5, bulletSpeed);
        }
    }

    createBullet(x, y, angle, speed) {
        // Create realistic laser bullet with glow
        const size = 4 * this.playerStats.bulletSize;
        const length = 12 * this.playerStats.bulletSize;
        
        // Main bullet body - simplified to prevent ghost artifacts
        const bullet = this.add.graphics();
        bullet.fillGradientStyle(0x00ffff, 0x00ffff, 0x00ff00, 0x00ff00, 1);
        bullet.fillRect(-size/2, -length/2, size, length);
        bullet.fillStyle(0xffffff, 1);
        bullet.fillRect(-size/4, -length/2, size/2, length/3);
        bullet.x = x;
        bullet.y = y;
        bullet.setDepth(11);
        
        // DISABLED: Glow and trail effects causing ghost bullet artifacts
        // Removed to fix blue ghost duplicate rendering bug
        bullet.glow = null;
        bullet.trail = null;
        
        this.physics.add.existing(bullet);
        bullet.body.setVelocity(0, -speed);
        bullet.damage = this.playerStats.damage;
        this.bullets.add(bullet);
        
        // NO glow pulse animation - removed to prevent duplicates
    }

    useSmartBomb() {
        if (this.gameState.paused || this.gameState.gameOver || !this.gameState.smartBombUses) return;
        this.gameState.smartBombUses--;
        if (this.playSound) this.playSound('explosion');
        const list = this.enemies.getChildren().slice();
        list.forEach(enemySprite => {
            const enemy = enemySprite.enemyObject;
            if (!enemy) return;
            if (enemy.type === 'boss') {
                enemy.hp *= 0.75;
            } else {
                enemy.hp *= 0.4;
            }
            if (enemy.numberText) enemy.numberText.setText(Math.max(0, Math.ceil(enemy.hp)));
            if (enemy.hp <= 0) {
                this.onEnemyDestroyed(enemy);
                this.destroyEnemy(enemy, enemySprite);
            }
        });
        this.enemyBullets.clear(true, true);
        const t = this.time.now;
        this.enemyShootPausedUntil = t + 500;
        const flash = this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0xffff00, 0.35);
        flash.setScrollFactor(0);
        flash.setDepth(1000);
        this.tweens.add({ targets: flash, alpha: 0, duration: 300, onComplete: () => flash.destroy() });
    }

    setLaserActive(active) {
        if (active && this.gameState.hasLaserBeam) {
            const t = this.time.now;
            if (t < this.laserCooldownEnd) return;
            this.laserEndTime = t + 8000;
            this.laserCooldownEnd = t + this.laserCooldown;
            this.laserActive = true;
            return;
        }
        if (!active) {
            if (this.time.now < this.laserEndTime) return;
            this.laserActive = false;
            if (this.laserBeamGraphic) this.laserBeamGraphic.clear();
        }
    }

    updateLaserBeam(delta) {
        if (!this.player || !this.player.sprite || !this.gameState.hasLaserBeam) return;
        const px = this.player.x;
        const py = this.player.y - 25;
        const beamHalfW = 18;
        const damagePerFrame = 1.1;
        if (!this.laserBeamGraphic) {
            this.laserBeamGraphic = this.add.graphics();
            this.laserBeamGraphic.setScrollFactor(0);
            this.laserBeamGraphic.setDepth(10.5);
        }
        this.laserBeamGraphic.clear();
        this.laserBeamGraphic.fillStyle(0x0088ff, 0.4);
        this.laserBeamGraphic.fillRect(px - beamHalfW, 0, beamHalfW * 2, py);
        this.enemies.getChildren().slice().forEach(enemySprite => {
            const enemy = enemySprite.enemyObject;
            if (!enemy || !enemy.sprite || !enemy.takeDamage) return;
            const ex = enemy.sprite.x, ey = enemy.sprite.y;
            if (ey >= py) return;
            if (Math.abs(ex - px) > beamHalfW + 20) return;
            const destroyed = enemy.takeDamage(damagePerFrame);
            if (destroyed) {
                this.onEnemyDestroyed(enemy);
                this.destroyEnemy(enemy, enemySprite);
            }
        });
    }

    updateBullets() {
        this.bullets.children.entries.forEach(bullet => {
            // Glow and trail are disabled to prevent ghost artifacts
            // No position updates needed - just check if bullet is off screen
            
            if (bullet.y < -20) {
                // Clean up bullet when off screen (no glow/trail to destroy)
                bullet.destroy();
            }
        });
    }

    updateEnemies(time, delta) {
        this.enemies.children.entries.forEach(enemySprite => {
            const enemy = enemySprite.enemyObject;
            if (enemy && enemy.update) {
                enemy.update(time, delta);
            }
            // Check if enemy went off screen (penalty: score only, no invisible "hit" damage)
            if (enemySprite.y > this.scale.height + 50) {
                if (enemy && enemy.type !== 'boss') {
                    this.gameState.score -= 50;
                    // Removed: this.player.takeDamage(5) – caused "invisible hit" (vibration, no bullet/sound)
                }
                // Properly destroy enemy that went off screen
                if (enemy) {
                    this.destroyEnemy(enemy, enemySprite);
                } else {
                    // Fallback if enemy object is missing
                    this.enemies.remove(enemySprite);
                    enemySprite.destroy();
                }
            }
        });
    }

    updateEnemyBullets() {
        this.enemyBullets.children.entries.forEach(bullet => {
            if (bullet.y > this.scale.height + 20) {
                bullet.destroy();
            }
        });
    }

    updatePowerUps() {
        this.powerUps.children.entries.forEach(powerUp => {
            // Ensure powerup continues falling
            if (powerUp.body && powerUp.body.velocity) {
                // If velocity stopped (frozen), restart it
                if (powerUp.body.velocity.y === 0 || Math.abs(powerUp.body.velocity.y) < 10) {
                    powerUp.body.setVelocityY(100);
                }
            }
            
            // Clean up powerups that fell off screen
            if (powerUp.y > this.scale.height + 20) {
                powerUp.destroy();
            }
        });
    }

    checkCollisions() {
        // Bullets vs Enemies
        this.physics.overlap(this.bullets, this.enemies, (bullet, enemySprite) => {
            const enemy = enemySprite.enemyObject;
            if (enemy && enemy.takeDamage) {
                const destroyed = enemy.takeDamage(bullet.damage);
                if (destroyed) {
                    // Handle destruction: explosion, rewards, then remove sprite
                    this.onEnemyDestroyed(enemy);
                    // Destroy all enemy components
                    this.destroyEnemy(enemy, enemySprite);
                }
            }
            // Clean up bullet effects
            if (bullet.glow) bullet.glow.destroy();
            if (bullet.trail) bullet.trail.destroy();
            bullet.destroy();
        });

        // Enemy Bullets vs Player
        this.physics.overlap(this.enemyBullets, this.player.sprite, (bullet, player) => {
            this.playSound('hit');  // Play hit sound
            this.player.takeDamage(10);
            bullet.destroy();
        });

        // Enemies vs Player
        this.physics.overlap(this.enemies, this.player.sprite, (enemySprite, player) => {
            const enemy = enemySprite.enemyObject;
            if (enemy && (enemy.type !== 'boss' || enemy.canDamage)) {
                this.playSound('hit');  // Play hit sound
                this.player.takeDamage(20);
                if (enemy.type !== 'boss') {
                    this.onEnemyDestroyed(enemy);
                    this.destroyEnemy(enemy, enemySprite);
                }
            }
        });

        // Power-ups vs Player (destroy first so overlap cannot fire again, then collect by type)
        this.physics.overlap(this.powerUps, this.player.sprite, (powerUp, player) => {
            const powerUpType = powerUp.powerUpType;
            powerUp.destroy();
            this.collectPowerUp({ powerUpType });
        });
    }

    onEnemyDestroyed(enemy) {
        if (!enemy || !enemy.sprite) return;
        
        // Play explosion sound effect
        this.playSound('explosion');
        
        const x = enemy.sprite.x;
        const y = enemy.sprite.y;
        
        // Haptic feedback - vibration
        if (window.vibrationManager) {
            if (enemy.type === 'boss') {
                window.vibrationManager.bossDefeated();
            } else {
                window.vibrationManager.enemyDestroyed();
            }
        }
        
        // Award rewards
        if (enemy.rewards) {
            this.gameState.gold += enemy.rewards.gold || 0;
            this.gameState.lightning += enemy.rewards.lightning || 0;
            this.gameState.diamonds += enemy.rewards.diamonds || 0;
            const baseScore = enemy.rewards.score || 0;
            this.gameState.score += Math.floor(baseScore * (this.gameState.scoreMultiplier || 1));
            this.gameState.xp += enemy.rewards.xp || 0;
            // New record during play (like check-in): pause, show submit overlay, after sign → resume
            if (this.gameState.score > this._highScoreAtRunStart && !this._leaderboardSubmitShownThisRun) {
                this._leaderboardSubmitShownThisRun = true;
                const waveLevel = this.missionSystem ? this.missionSystem.currentWave : this.gameState.stage;
                const streak = window.baseInvadersLeaderboard?.getCurrentStreak ? window.baseInvadersLeaderboard.getCurrentStreak() : 0;
                window.__baseInvadersLeaderboardSubmitDuringPlay = true;
                window.__baseInvadersPendingLeaderboardSubmit = { score: this.gameState.score, wave: waveLevel, streak };
                this.scene.pause();
                this.gameState.paused = true;
                const overlay = document.getElementById('leaderboard-submit-overlay');
                const statusEl = document.getElementById('leaderboard-submit-status');
                if (statusEl) statusEl.textContent = '';
                if (overlay) overlay.classList.remove('hidden');
                console.log('[leaderboard] New record during play — pause, show submit overlay');
            }
        }

        // Create explosion
        this.createExplosion(x, y, enemy.type);

        // Drop coins/power-ups
        if (enemy.type === 'hexagon' || enemy.type === 'spaceship') {
            this.dropCoins(x, y, enemy.rewards?.gold || 10);
        }
        if (enemy.type === 'baseCube') {
            this.dropLightning(x, y);
        }
        if (enemy.type === 'spaceship' && Math.random() < 0.3) {
            this.dropDiamond(x, y);
        }
        if (enemy.type === 'boss') {
            this.dropCoins(x, y, 1000);
            for (let i = 0; i < 10; i++) {
                this.dropDiamond(x + Phaser.Math.Between(-50, 50), y + Phaser.Math.Between(-50, 50));
            }
        }

        // Random power-up drop
        if (Math.random() < 0.1) {
            this.dropPowerUp(x, y);
        }
        if (Math.random() < 0.05) {
            this.dropPowerUp(x, y, 'smartBomb');
        }

        // Track wave progress (mission system)
        if (this.missionSystem && !this.missionSystem.bossActive) {
            if (enemy.type !== 'boss') {
                this.missionSystem.waveEnemiesKilled++;
                console.log(`Wave progress: ${this.missionSystem.waveEnemiesKilled}/${this.missionSystem.waveEnemiesTotal} enemies killed`);
                // Check if wave is complete (use >= to handle edge cases)
                if (this.missionSystem.waveEnemiesKilled >= this.missionSystem.waveEnemiesTotal) {
                    console.log('Wave complete! Moving to next wave or boss...');
                    // Delay to ensure all enemies are properly destroyed
                    this.time.delayedCall(500, () => {
                        this.completeWave();
                    });
                }
            }
        }
        
        // Handle boss defeat
        if (enemy.type === 'boss' && this.missionSystem) {
            console.log('Boss defeated! Completing mission...');
            this.time.delayedCall(500, () => {
                this.completeMission();
            });
        }

        // Check level up
        this.checkLevelUp();
    }

    destroyEnemy(enemy, enemySprite) {
        if (!enemy || !enemySprite) return;
        
        // CRITICAL: Remove from group FIRST before destroying
        if (this.enemies.contains(enemySprite)) {
            this.enemies.remove(enemySprite, true, true); // Remove and destroy
        }
        
        // Destroy all visual components
        if (enemy.sprite && enemy.sprite.active) {
            enemy.sprite.destroy();
        }
        if (enemy.letterB && enemy.letterB.active) {
            enemy.letterB.destroy();
        }
        if (enemy.glow && enemy.glow.active) {
            enemy.glow.destroy();
        }
        if (enemy.shadow && enemy.shadow.active) {
            enemy.shadow.destroy();
        }
        if (enemy.outerGlow && enemy.outerGlow.active) {
            enemy.outerGlow.destroy();
        }
        if (enemy.innerGlow && enemy.innerGlow.active) {
            enemy.innerGlow.destroy();
        }
        if (enemy.engineGlow && enemy.engineGlow.active) {
            enemy.engineGlow.destroy();
        }
        if (enemy.numberText && enemy.numberText.active) {
            enemy.numberText.destroy();
        }
        
        // Boss-specific components
        if (enemy.type === 'boss') {
            if (enemy.healthBar && enemy.healthBar.active) {
                enemy.healthBar.destroy();
            }
            if (enemy.healthBarBg && enemy.healthBarBg.active) {
                enemy.healthBarBg.destroy();
            }
            if (enemy.bossEmoji && enemy.bossEmoji.active) {
                enemy.bossEmoji.destroy();
            }
        }
        
        // Destroy sprite separately if it still exists
        if (enemySprite && enemySprite.active) {
            enemySprite.destroy();
        }
        
        // Clear reference
        if (enemySprite) {
            enemySprite.enemyObject = null;
        }
    }

    createExplosion(x, y, type) {
        const colors = type === 'baseCube' ? [0x00ffff, 0x0088ff, 0xffffff] : 
                      type === 'spaceship' ? [0xff4400, 0xff8800, 0xffff00] : 
                      [0x888888, 0xaaaaaa, 0xffffff];
        
        // Create explosion particles with physics
        const particleCount = type === 'boss' ? 50 : 20;
        
        for (let i = 0; i < particleCount; i++) {
            const size = Phaser.Math.Between(3, 8);
            const particle = this.add.circle(
                x + Phaser.Math.Between(-10, 10),
                y + Phaser.Math.Between(-10, 10),
                size,
                Phaser.Math.RND.pick(colors),
                1
            );
            particle.setDepth(5);
            particle.setBlendMode(Phaser.BlendModes.ADD);
            
            // Add glow to particles
            const glow = this.add.circle(particle.x, particle.y, size * 2, 
                Phaser.Math.RND.pick(colors), 0.3);
            glow.setDepth(4);
            glow.setBlendMode(Phaser.BlendModes.ADD);
            particle.glow = glow;
            
            const angle = Phaser.Math.Between(0, 360);
            const speed = Phaser.Math.Between(100, 300);
            const distance = Phaser.Math.Between(50, 150);
            
            this.tweens.add({
                targets: [particle, glow],
                x: particle.x + Math.cos(Phaser.Math.DegToRad(angle)) * distance,
                y: particle.y + Math.sin(Phaser.Math.DegToRad(angle)) * distance,
                alpha: 0,
                scale: 0,
                duration: Phaser.Math.Between(400, 800),
                ease: 'Power2',
                onComplete: () => {
                    if (glow) glow.destroy();
                    particle.destroy();
                }
            });
        }
        
        // Screen shake based on explosion size
        const intensity = type === 'boss' ? 0.05 : 0.02;
        this.cameras.main.shake(200, intensity);
        
        // Flash effect
        const flash = this.add.rectangle(x, y, this.scale.width, this.scale.height, 
            Phaser.Math.RND.pick(colors), 0.3);
        flash.setDepth(100);
        flash.setBlendMode(Phaser.BlendModes.ADD);
        this.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 100,
            onComplete: () => flash.destroy()
        });
    }

    dropCoins(x, y, amount) {
        const count = Math.min(amount / 10, 10);
        for (let i = 0; i < count; i++) {
            const coin = this.add.text(
                x + Phaser.Math.Between(-30, 30),
                y + Phaser.Math.Between(-30, 30),
                '🪙',
                { fontSize: '20px' }
            );
            coin.setDepth(10);
            this.physics.add.existing(coin);
            coin.body.setVelocity(
                Phaser.Math.Between(-100, 100),
                Phaser.Math.Between(50, 150)
            );
            coin.body.setGravityY(200);
            
            this.tweens.add({
                targets: coin,
                alpha: 0,
                y: coin.y + 100,
                duration: 2000,
                onComplete: () => {
                    this.gameState.gold += 10;
                    this.playSound('coin');  // Play coin collection sound
                    coin.destroy();
                }
            });
        }
    }

    dropLightning(x, y) {
        const bolt = this.add.text(x, y, '⚡', { fontSize: '24px' });
        bolt.setDepth(10);
        bolt.powerUpType = 'lightning';
        this.physics.add.existing(bolt);
        if (bolt.body) {
            bolt.body.setVelocity(Phaser.Math.Between(-30, 30), 80);
            bolt.body.setGravityY(0);
            bolt.body.setCollideWorldBounds(false);
            bolt.body.setSize(32, 32);
        }
        this.tweens.add({
            targets: bolt,
            alpha: { from: 1, to: 0.6 },
            duration: 400,
            yoyo: true,
            repeat: -1
        });
        this.powerUps.add(bolt);
    }

    dropDiamond(x, y) {
        const diamond = this.add.text(x, y, '💎', { fontSize: '20px' });
        diamond.setDepth(10);
        this.physics.add.existing(diamond);
        diamond.body.setVelocity(
            Phaser.Math.Between(-50, 50),
            Phaser.Math.Between(50, 100)
        );
        diamond.body.setGravityY(150);
        
        this.tweens.add({
            targets: diamond,
            rotation: Math.PI * 2,
            alpha: 0,
            y: diamond.y + 100,
            duration: 2000,
            onComplete: () => {
                this.gameState.diamonds += 1;
                this.playSound('coin');  // Play coin/diamond collection sound
                diamond.destroy();
            }
        });
    }

    dropPowerUp(x, y, forcedType) {
        const types = ['shield', 'bomb', 'score2x'];
        const type = forcedType || Phaser.Math.RND.pick(types);
        const icons = { shield: '🛡️', bomb: '💣', score2x: '⭐', smartBomb: '💣' };
        
        const powerUp = this.add.text(x, y, icons[type], { fontSize: '24px' });
        powerUp.setDepth(10);
        powerUp.powerUpType = type;
        this.physics.add.existing(powerUp);
        
        if (powerUp.body) {
            powerUp.body.setSize(36, 36, true);
            powerUp.body.setVelocity(0, 100);
            powerUp.body.setGravityY(0);
            powerUp.body.setCollideWorldBounds(false);
            powerUp.body.setMaxVelocity(1000, 1000);
        }
        
        this.tweens.add({
            targets: powerUp,
            rotation: Math.PI * 2,
            duration: 1000,
            repeat: -1
        });
        
        this.powerUps.add(powerUp);
    }

    collectPowerUp(powerUp) {
        if (!powerUp || powerUp.powerUpType == null) return;
        this.playSound('powerup');
        if (window.vibrationManager) window.vibrationManager.powerUpCollected();
        switch (powerUp.powerUpType) {
            case 'lightning':
                this.gameState.lightning += 1;
                if (this.playSound) this.playSound('coin');
                break;
            case 'shield':
                this.playerStats.shield = 5;
                break;
            case 'bomb':
                this.enemies.children.entries.forEach(enemy => {
                    if (enemy.type !== 'boss') {
                        enemy.destroy();
                        this.onEnemyDestroyed(enemy);
                    }
                });
                break;
            case 'smartBomb':
                this.gameState.smartBombUses = Math.min(99, (this.gameState.smartBombUses || 0) + 1);
                if (this.ui && this.ui.update) this.ui.update(this.gameState);
                break;
            case 'score2x':
                this.gameState.scoreMultiplier = 2;
                this.time.delayedCall(60000, () => {
                    this.gameState.scoreMultiplier = 1;
                });
                break;
        }
    }

    handleSpawning(time) {
        // Mission system handles spawning via waves
        // This method is kept for compatibility but wave system controls spawning
    }

    spawnRandomEnemy() {
        // Only spawn if not in boss phase
        if (this.missionSystem && this.missionSystem.bossActive) {
            return;
        }
        
        const rand = Math.random();
        
        if (rand < 0.4) {
            this.spawnHexagon();
        } else if (rand < 0.7) {
            this.spawnBaseCube();
        } else {
            this.spawnSpaceship();
        }
    }

    spawnHexagon() {
        const hpValues = [10, 25, 50, 100, 147, 200];
        const hp = Phaser.Math.RND.pick(hpValues) + (this.gameState.stage - 1) * 10;
        const x = Phaser.Math.Between(50, this.scale.width - 50);
        const enemy = new HexagonEnemy(this, x, -50, hp);
        enemy.sprite.enemyObject = enemy; // Store reference
        this.enemies.add(enemy.sprite);
    }

    spawnBaseCube() {
        const x = Phaser.Math.Between(50, this.scale.width - 50);
        const hp = 3 + Math.floor((this.gameState.stage - 1) / 5);
        const enemy = new BaseCubeEnemy(this, x, -50, hp);
        enemy.sprite.enemyObject = enemy; // Store reference
        this.enemies.add(enemy.sprite);
    }

    spawnSpaceship() {
        const x = Phaser.Math.Between(50, this.scale.width - 50);
        // 60% weak enemies, 40% boss enemies
        const isBoss = Math.random() < 0.4;
        const hp = isBoss ? 50 : 20;
        const enemy = new SpaceshipEnemy(this, x, -50, hp, isBoss);
        enemy.sprite.enemyObject = enemy; // Store reference
        this.enemies.add(enemy.sprite);
    }

    spawnBoss() {
        if (!this.missionSystem) return;
        if (this.enemies.getChildren().some(s => s.enemyObject && s.enemyObject.type === 'boss')) return;
        this._bossSpawnScheduled = false;
        // Calculate boss HP based on mission (one boss, stronger each mission)
        let bossHP;
        if (this.missionSystem.currentMission === 1) {
            bossHP = 500;
        } else if (this.missionSystem.currentMission === 2) {
            bossHP = 800;
        } else {
            bossHP = 1200 + (this.missionSystem.currentMission - 3) * 200;
        }
        
        // Show "BOSS INCOMING!" warning message
        const warningText = this.add.text(
            this.scale.width / 2, 
            this.scale.height / 2,
            '⚠️ BOSS INCOMING! ⚠️',
            {
                fontSize: '48px',
                color: '#ff0000',
                fontWeight: 'bold',
                stroke: '#000000',
                strokeThickness: 6
            }
        );
        warningText.setOrigin(0.5);
        warningText.setDepth(1000);
        warningText.setScrollFactor(0);
        
        // Flash warning with scale animation
        this.tweens.add({
            targets: warningText,
            alpha: 0,
            scale: 1.5,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => {
                warningText.destroy();
                
                // Spawn boss after warning (start off-screen at top)
                this.missionSystem.bossActive = true;
                this.bossActive = true;
                
                const boss = new BossEnemy(this, this.scale.width / 2, -100, bossHP, this.missionSystem.currentMission);
                boss.sprite.enemyObject = boss; // Store reference
                this.enemies.add(boss.sprite);
                
                // Boss enters from top (slide down animation with bounce)
                this.tweens.add({
                    targets: boss.sprite,
                    y: 150,
                    duration: 1500,
                    ease: 'Bounce.easeOut',
                    onComplete: () => {
                        console.log(`BOSS ARRIVED! Mission ${this.missionSystem.currentMission}, HP: ${bossHP}`);
                    }
                });
                
                // Also animate boss glow if it exists
                if (boss.glow) {
                    this.tweens.add({
                        targets: boss.glow,
                        y: 150,
                        duration: 1500,
                        ease: 'Bounce.easeOut'
                    });
                }
            }
        });
    }

    spawnEnemies() {
        console.log('Starting enemy spawns...');
        // Start first wave
        this.startWave();
    }
    
    startWave() {
        if (!this.missionSystem) return;
        
        // Reset wave tracking
        this.missionSystem.waveEnemiesKilled = 0;
        this.missionSystem.bossActive = false;
        
        // Calculate enemies for this wave (scales with mission)
        const baseEnemies = 5 + this.missionSystem.currentWave;
        this.missionSystem.waveEnemiesTotal = baseEnemies + Math.floor(this.missionSystem.currentMission / 2);
        
        console.log(`Starting Mission ${this.missionSystem.currentMission} - Wave ${this.missionSystem.currentWave}/${this.missionSystem.maxWaves}`);
        console.log(`Spawning ${this.missionSystem.waveEnemiesTotal} enemies`);
        
        // Spawn enemies with delay
        for (let i = 0; i < this.missionSystem.waveEnemiesTotal; i++) {
            this.time.delayedCall(i * 500, () => {
                this.spawnRandomEnemy();
            });
        }
    }
    
    completeWave(fromRetry) {
        if (!this.missionSystem) return;
        if (fromRetry !== true && this.missionSystem.currentWave >= this.missionSystem.maxWaves && this._bossSpawnScheduled) return;
        if (this.missionSystem.currentWave >= this.missionSystem.maxWaves) {
            if (this._bossSpawnScheduled && fromRetry === true) {
                const n = this.enemies.children.size;
                if (n === 0) {
                    this.spawnBoss();
                } else {
                    this.time.delayedCall(1000, () => this.completeWave(true));
                }
                return;
            }
            if (this.missionSystem.bossActive) return;
        } else {
            if (this.missionSystem.bossActive) return;
        }
        console.log(`Wave ${this.missionSystem.currentWave} complete!`);
        if (this.syncProgress) this.syncProgress();
        if (this.missionSystem.currentWave >= this.missionSystem.maxWaves) {
            this.missionSystem.bossActive = true;
            this.bossActive = true;
            this._bossSpawnScheduled = true;
            console.log('All waves complete! Spawning single boss...');
            this.time.delayedCall(2000, () => {
                const n = this.enemies.children.size;
                if (n === 0) {
                    this.spawnBoss();
                } else {
                    this.time.delayedCall(1000, () => this.completeWave(true));
                }
            });
        } else {
            this.missionSystem.currentWave++;
            this.time.delayedCall(2000, () => {
                const n = this.enemies.children.size;
                if (n === 0) {
                    this.startWave();
                } else {
                    this.time.delayedCall(1000, () => this.completeWave());
                }
            });
        }
    }
    
    completeMission() {
        if (!this.missionSystem) return;
        if (this.syncProgress) this.syncProgress();
        console.log(`Mission ${this.missionSystem.currentMission} complete!`);
        
        // Award mission rewards
        const missionReward = this.missionSystem.currentMission * 100;
        this.gameState.gold += missionReward;
        this.gameState.diamonds += Math.floor(this.missionSystem.currentMission / 2) + 1;
        
        // Next mission
        this.missionSystem.currentMission++;
        this.missionSystem.currentWave = 1;
        this.missionSystem.bossActive = false;
        this.bossActive = false;
        this._bossSpawnScheduled = false;
        
        // Start next mission after delay
        this.time.delayedCall(3000, () => {
            this.startWave();
        });
    }

    updateStage(time) {
        if (this.enemies.children.size === 0 && time > this.stageTimer + 2000 && !this.bossActive) {
            this.gameState.stage++;
            this.enemySpawnRate = Math.max(1000, 2000 - (this.gameState.stage - 1) * 50);
            this.stageTimer = time;
            
            // Spawn new wave
            for (let i = 0; i < 5 + this.gameState.stage; i++) {
                this.time.delayedCall(i * 300, () => {
                    this.spawnRandomEnemy();
                });
            }
        }
    }

    checkLevelUp() {
        while (this.gameState.xp >= this.gameState.xpToNext) {
            this.gameState.xp -= this.gameState.xpToNext;
            this.gameState.playerLevel++;
            this.gameState.xpToNext = Math.floor(this.gameState.xpToNext * 1.5);
            // Level up bonus
            this.gameState.gold += this.gameState.playerLevel * 50;
        }
    }

    togglePause() {
        this.gameState.paused = !this.gameState.paused;
        if (this.gameState.paused) {
            if (this.syncProgress) this.syncProgress();
            this.scene.pause();
            if (typeof window.refreshHtmlOverlaysI18n === 'function') window.refreshHtmlOverlaysI18n();
            document.getElementById('pause-overlay').classList.remove('hidden');
        } else {
            // Resume game
            this.scene.resume();
            this.gameState.paused = false; // Ensure state is set correctly
            document.getElementById('pause-overlay').classList.add('hidden');
        }
    }

    shutdown() {
        console.log('🧹 Shutdown GameScene');

        this.sceneReady = false;

        // Remove scene-added listeners so they do not run after restart
        if (this._langChangedCallback) {
            window.removeEventListener('base-invaders:lang-changed', this._langChangedCallback);
            this._langChangedCallback = null;
        }
        if (this._resizeCallback && this.scale) {
            this.scale.off('resize', this._resizeCallback);
            this._resizeCallback = null;
        }

        // Clear intervals
        if (this.syncProgressInterval) {
            clearInterval(this.syncProgressInterval);
            this.syncProgressInterval = null;
        }

        if (this.ui) {
            if (typeof this.ui.destroy === 'function') this.ui.destroy();
            this.ui = null;
        }

        // КРИТИЧНО! Очистити ВСІ групи і обнулити посилання (щоб update() не використовував старі refs після рестарту)
        const groups = [
            ['bullets', this.bullets],
            ['enemyBullets', this.enemyBullets],
            ['enemies', this.enemies],
            ['powerUps', this.powerUps],
            ['particles', this.particles]
        ];
        groups.forEach(([name, group]) => {
            if (group) {
                group.clear(true, true);
            }
            this[name] = null;
        });

        // Stop all tweens
        this.tweens?.killAll();

        // Remove listeners
        this.input?.keyboard?.removeAllListeners();

        // Stop music
        if (this.bgMusic?.isPlaying) {
            this.bgMusic.stop();
        }

        this.laserActive = false;
        if (this.laserBeamGraphic) {
            try { this.laserBeamGraphic.destroy(); } catch (e) {}
            this.laserBeamGraphic = null;
        }

        // КРИТИЧНО! Знищити гравця, інакше при рестарті update() бачить старий sprite (glTexture помилки)
        if (this.player && this.player.sprite) {
            try {
                this.player.sprite.destroy();
            } catch (e) {}
            this.player = null;
        }

        // Destroy all display objects (background, etc.) so restart does not duplicate
        try {
            var list = [];
            if (this.children) {
                if (typeof this.children.getArray === 'function') list = this.children.getArray();
                else if (this.children.list) list = this.children.list;
            }
            for (var i = list.length - 1; i >= 0; i--) {
                if (list[i] && typeof list[i].destroy === 'function') list[i].destroy();
            }
        } catch (e) {}

        console.log('✅ Cleanup done');
    }

    gameOver() {
        this.gameState.gameOver = true;
        this.scene.pause();
        this.saveGameData();
        
        const waveLevel = this.gameState.missionSystem
            ? this.gameState.missionSystem.currentWave
            : this.gameState.stage;
        const streak = window.baseInvadersLeaderboard?.getCurrentStreak
            ? window.baseInvadersLeaderboard.getCurrentStreak()
            : 0;
        const localEntry = {
            score: this.gameState.score,
            wave: waveLevel,
            date: new Date().toISOString(),
            streak
        };
        
        const localHigh = window.baseInvadersLeaderboard?.getLocalHighScore
            ? window.baseInvadersLeaderboard.getLocalHighScore()
            : null;
        const isNewHigh = !localHigh || this.gameState.score > (localHigh.score || 0);
        console.log('[leaderboard] Game over — score:', this.gameState.score, 'localHigh:', localHigh?.score ?? 'none', 'isNewHigh:', isNewHigh);

        if (isNewHigh && window.baseInvadersLeaderboard?.saveLocalHighScore) {
            window.baseInvadersLeaderboard.saveLocalHighScore(localEntry);
        }

        document.getElementById('gameover-overlay').classList.remove('hidden');
        const fs = typeof getText === 'function' ? getText : function (k) { return k; };
        document.getElementById('final-stats').innerHTML = `
            <p>${fs('gameover.finalScore')}: ${this.gameState.score.toLocaleString()}</p>
            <p>${fs('gameover.stageReached')}: ${this.gameState.stage}</p>
            <p>${fs('gameover.level')}: ${this.gameState.playerLevel}</p>
        `;
        // If new high and user didn't submit during play, show submit overlay after game over so they can submit
        if (isNewHigh && !window.__baseInvadersPendingLeaderboardSubmit && typeof window.baseInvadersSubmitScore === 'function') {
            const waveLevel = this.missionSystem ? this.missionSystem.currentWave : this.gameState.stage;
            const streak = window.baseInvadersLeaderboard?.getCurrentStreak ? window.baseInvadersLeaderboard.getCurrentStreak() : 0;
            window.__baseInvadersPendingLeaderboardSubmit = { score: this.gameState.score, wave: waveLevel, streak };
            window.__baseInvadersLeaderboardSubmitDuringPlay = false;
            const statusEl = document.getElementById('leaderboard-submit-status');
            const overlay = document.getElementById('leaderboard-submit-overlay');
            if (statusEl) statusEl.textContent = '';
            if (overlay) overlay.classList.remove('hidden');
            console.log('[leaderboard] Game over — new high, showing submit overlay');
        }
    }

    saveGameData() {
        const data = {
            gold: this.gameState.gold,
            lightning: this.gameState.lightning,
            diamonds: this.gameState.diamonds,
            playerLevel: this.gameState.playerLevel,
            highScore: Math.max(this.gameState.score, parseInt(localStorage.getItem('highScore') || '0'))
        };
        localStorage.setItem('baseInvadersData', JSON.stringify(data));
    }

    loadGameData() {
        const data = localStorage.getItem('baseInvadersData');
        if (data) {
            const saved = JSON.parse(data);
            this.gameState.gold = saved.gold || 0;
            this.gameState.lightning = saved.lightning || 0;
            this.gameState.diamonds = saved.diamonds || 0;
            this.gameState.playerLevel = saved.playerLevel || 1;
        }
    }

    /** Після злиття даних з сервера — записати об’єднаний стан у localStorage і оновити магазин, щоб обидва пристрої мали однаковий “кращий” прогрес. */
    mergeServerProgressIntoLocalStorage() {
        if (!this.gameState || !this.playerStats) return;
        const data = {
            gold: this.gameState.gold,
            lightning: this.gameState.lightning,
            diamonds: this.gameState.diamonds,
            playerLevel: this.gameState.playerLevel,
            highScore: parseInt(localStorage.getItem('highScore') || '0', 10)
        };
        localStorage.setItem('baseInvadersData', JSON.stringify(data));
        let shopData = {};
        try {
            const raw = localStorage.getItem('baseInvadersShop');
            if (raw) shopData = JSON.parse(raw);
        } catch (e) {}
        shopData.fireRate = this.playerStats.fireRate;
        shopData.damage = this.playerStats.damage;
        shopData.multiShot = this.playerStats.multiShot;
        shopData.maxHP = this.playerStats.maxHP;
        shopData.speed = this.playerStats.speed;
        shopData.fireRateLevel = Math.min(10, Math.max(1, Math.round((300 - this.playerStats.fireRate) / 20) + 1));
        shopData.damageLevel = Math.min(10, Math.max(1, this.playerStats.damage));
        localStorage.setItem('baseInvadersShop', JSON.stringify(shopData));
        if (window.shopSystem && typeof window.shopSystem.loadShopData === 'function') {
            window.shopSystem.data = window.shopSystem.loadShopData();
            if (typeof window.shopSystem.updateDisplay === 'function') window.shopSystem.updateDisplay();
        }
    }

    /** Відправити поточний прогрес на сервер (Supabase). Використовує реальний FID (не TEST_FID), щоб прогрес не змішувався між акаунтами. */
    syncProgress() {
        if (!this.gameState || !this.missionSystem) return;
        try {
            const ms = this.missionSystem;
            const checkInFid = window.__baseInvadersCheckInFid || 'default';
            const fidForApi = (checkInFid && checkInFid !== 'default') ? checkInFid : TEST_FID;
            let dailyStreak = 0;
            let lastCheckin = null;
            try {
                const streakData = localStorage.getItem('checkInStreak_' + checkInFid);
                if (streakData) {
                    const parsed = JSON.parse(streakData);
                    dailyStreak = parsed.totalDays || 0;
                    lastCheckin = parsed.lastDate || null;
                }
            } catch (e) {}
            if (lastCheckin == null) lastCheckin = localStorage.getItem('lastCheckIn_' + checkInFid);
            const bestScore = Math.max(this.gameState.score, parseInt(localStorage.getItem('highScore') || '0', 10));
            const payload = {
                fid: fidForApi,
                gold: this.gameState.gold,
                diamonds: this.gameState.diamonds,
                lightning: this.gameState.lightning,
                wave: ms.currentWave || 1,
                mission: ms.currentMission || 1,
                level: this.gameState.playerLevel,
                best_score: bestScore,
                upgrades: {
                    fireRate: this.playerStats.fireRate,
                    damage: this.playerStats.damage,
                    multiShot: this.playerStats.multiShot,
                    maxHP: this.playerStats.maxHP,
                    speed: this.playerStats.speed
                },
                achievements: {},
                daily_streak: dailyStreak,
                last_checkin: lastCheckin
            };
            console.log('☁️ Syncing progress...');
            fetch('/api/progress', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).catch((e) => console.log('[progress] Sync failed:', e.message));
        } catch (e) {
            console.log('[progress] syncProgress error:', e.message);
        }
    }

    loadPlayerStats() {
        this.laserDuration = 3 + (this.gameState.playerLevel || 1);
        const shopData = localStorage.getItem('baseInvadersShop');
        if (shopData) {
            const shop = JSON.parse(shopData);
            if (shop.fireRate) this.playerStats.fireRate = shop.fireRate;
            if (shop.damage) this.playerStats.damage = shop.damage;
            if (shop.multiShot) this.playerStats.multiShot = shop.multiShot;
            if (shop.maxHP) {
                this.playerStats.maxHP = shop.maxHP;
                if (this.player) {
                    this.player.maxHP = shop.maxHP;
                    this.player.hp = Math.min(this.player.hp, shop.maxHP);
                }
            }
            if (shop.speed) this.playerStats.speed = shop.speed;
            const up = shop.upgrades || {};
            if (this.gameState) {
                this.gameState.hasLaserBeam = !!(up.laserBeam);
                this.gameState.hasSmartBomb = !!(up.smartBomb);
                this.laserDuration += (up.laserLevel || 0);
                this.gameState.maxSmartBombs = up.maxSmartBombs || 1;
                if (up.smartBomb) this.gameState.smartBombUses = this.gameState.maxSmartBombs;
            }
        }
    }
}

// Initialize game
console.log('Initializing Phaser game...');
console.log('Phaser available:', typeof Phaser !== 'undefined');

if (typeof Phaser === 'undefined') {
    console.error('Phaser.js not loaded! Check the CDN link in index.html');
} else {
    const config = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        parent: 'game-container',
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: false
            }
        },
        scene: [MenuScene, GameScene],
        scale: {
            mode: Phaser.Scale.RESIZE,
            autoCenter: Phaser.Scale.CENTER_BOTH
        }
    };

    console.log('Creating Phaser game (scale: RESIZE, CENTER_BOTH)', { w: config.width, h: config.height });
    const game = new Phaser.Game(config);
    window.game = game;
    console.log('Phaser game created – base-invaders:game-ready will fire from MenuScene.create()');
    window.addEventListener('resize', () => {
        game.scale.resize(window.innerWidth, window.innerHeight);
    });
}

// UI Event Handlers (wait for DOM to be ready)
document.addEventListener('DOMContentLoaded', () => {
    // Fallback: when returning from wallet (focus/visibility), if leaderboard submit overlay still visible — close and resume
    let leaderboardSubmitFocusTimer = null;
    function onVisibilityOrFocus() {
        if (document.visibilityState !== 'visible') return;
        const overlay = document.getElementById('leaderboard-submit-overlay');
        const submitBtn = document.querySelector('#leaderboard-submit-overlay button#leaderboard-submit-do');
        if (!overlay || overlay.classList.contains('hidden')) return;
        if (!window.__baseInvadersLeaderboardSubmitDuringPlay || !window.game?.scene) return;
        if (submitBtn && !submitBtn.disabled) return;
        if (leaderboardSubmitFocusTimer) clearTimeout(leaderboardSubmitFocusTimer);
        leaderboardSubmitFocusTimer = setTimeout(() => {
            leaderboardSubmitFocusTimer = null;
            overlay.classList.add('hidden');
            window.__baseInvadersPendingLeaderboardSubmit = null;
            window.__baseInvadersLeaderboardSubmitDuringPlay = false;
            if (window.game.scene.isPaused('GameScene')) window.game.scene.resume('GameScene');
            const g = window.game.scene.getScene('GameScene');
            if (g?.gameState) g.gameState.paused = false;
            if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = (typeof getText === 'function' ? getText('leaderboard.submit') : 'Submit'); }
            console.log('[leaderboard] Focus fallback: closed overlay and resumed');
        }, 2000);
    }
    document.addEventListener('visibilitychange', onVisibilityOrFocus);
    window.addEventListener('focus', onVisibilityOrFocus);

    document.getElementById('close-shop')?.addEventListener('click', () => {
        document.getElementById('shop-overlay').classList.add('hidden');
        if (window.game && window.game.scene) {
            // Always resume the scene when closing shop (CRITICAL to prevent freeze)
            // Resume from scene manager level
            if (window.game.scene.isPaused('GameScene')) {
                window.game.scene.resume('GameScene');
            }
            
            const scene = window.game.scene.getScene('GameScene');
            if (scene) {
                // Also resume at scene level
                if (scene.scene.isPaused()) {
                    scene.scene.resume();
                }
                
                // Check if shop was opened from pause menu or shop button
                const wasPausedBeforeShop = scene.ui && scene.ui.wasPausedBeforeShop;
                
                // If shop was opened from pause menu, show pause overlay again
                if (wasPausedBeforeShop) {
                    document.getElementById('pause-overlay').classList.remove('hidden');
                    // Keep game state as paused (game logic won't run, but scene is active for UI)
                    scene.gameState.paused = true;
                } else {
                    // If opened from shop button, resume game completely
                    scene.gameState.paused = false;
                    document.getElementById('pause-overlay').classList.add('hidden');
                }
                
                // Sync shop purchases with game state (currency)
                if (window.shopSystem && scene.gameState) {
                    window.shopSystem.syncWithGameState(scene.gameState);
                }
                // Apply purchased upgrades to current game (multi-shot, damage, HP, etc.)
                if (scene.loadPlayerStats) {
                    scene.loadPlayerStats();
                }
                if (scene.ui) {
                    scene.ui.createAbilityButtons();
                    scene.ui.applyLayout();
                    if (scene.ui.update) scene.ui.update(scene.gameState);
                }
                if (scene.syncProgress) scene.syncProgress();
            }
        }
    });

    document.getElementById('resume-btn')?.addEventListener('click', () => {
        // Play click sound
        if (window.game && window.game.scene) {
            const gameScene = window.game.scene.getScene('GameScene');
            if (gameScene && gameScene.playSound) {
                gameScene.playSound('click');
            }
        }
        
        // Get GameScene specifically (not MenuScene)
        if (window.game && window.game.scene) {
            const gameScene = window.game.scene.getScene('GameScene');
            if (gameScene) {
                // Resume the scene
                if (window.game.scene.isPaused('GameScene')) {
                    window.game.scene.resume('GameScene');
                }
                if (gameScene.scene.isPaused()) {
                    gameScene.scene.resume();
                }
                // Update game state
                gameScene.gameState.paused = false;
                // Hide pause overlay
                document.getElementById('pause-overlay').classList.add('hidden');
            }
        }
    });

    document.getElementById('main-menu-btn')?.addEventListener('click', () => {
        // Play click sound
        if (window.game && window.game.scene) {
            const gameScene = window.game.scene.getScene('GameScene');
            if (gameScene && gameScene.playSound) {
                gameScene.playSound('click');
            }
        }
        
        // Open shop menu from pause menu
        if (window.game && window.game.scene && window.game.scene.scenes[0]) {
            const scene = window.game.scene.scenes[0];
            // Hide pause overlay
            document.getElementById('pause-overlay').classList.add('hidden');
            // Open shop (game is already paused, so wasPausedBeforeShop will be true)
            if (scene.ui && scene.ui.openShop) {
                scene.ui.openShop();
            } else {
                // Fallback: open shop directly
                if (scene.ui) {
                    scene.ui.wasPausedBeforeShop = scene.gameState.paused;
                }
                if (typeof window.refreshHtmlOverlaysI18n === 'function') window.refreshHtmlOverlaysI18n();
                document.getElementById('shop-overlay').classList.remove('hidden');
                if (window.shopSystem) {
                    window.shopSystem.updateDisplay();
                }
            }
        }
    });

    // RESET GAME: show in-game confirmation (no browser confirm() so it works in Farcaster iframe/desktop)
    document.getElementById('reset-game-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.game && window.game.scene) {
            const gameScene = window.game.scene.getScene('GameScene');
            if (gameScene && gameScene.playSound) gameScene.playSound('click');
        }
        const confirmEl = document.getElementById('reset-confirm-overlay');
        if (confirmEl) confirmEl.classList.remove('hidden');
    });
    document.getElementById('reset-confirm-cancel')?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const confirmEl = document.getElementById('reset-confirm-overlay');
        if (confirmEl) confirmEl.classList.add('hidden');
        if (window.game && window.game.scene) {
            const gameScene = window.game.scene.getScene('GameScene');
            if (gameScene && gameScene.playSound) gameScene.playSound('click');
        }
    });
    document.getElementById('reset-confirm-do')?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.game && window.game.scene) {
            const gameScene = window.game.scene.getScene('GameScene');
            if (gameScene && gameScene.playSound) gameScene.playSound('click');
        }
        document.getElementById('reset-confirm-overlay')?.classList.add('hidden');
        document.getElementById('pause-overlay')?.classList.add('hidden');
        localStorage.clear();
        localStorage.removeItem('baseInvadersData');
        localStorage.removeItem('baseInvadersShopData');
        localStorage.removeItem('baseInvadersVibration');
        location.reload();
    });

    // EXIT GAME: save progress, then reload page so next Start runs like first time (no freeze)
    document.getElementById('exit-game-btn')?.addEventListener('click', () => {
        if (window.game?.scene) {
            const gs = window.game.scene.getScene('GameScene');
            if (gs?.playSound) gs.playSound('click');
            if (gs?.saveGameData) gs.saveGameData();
            if (gs?.gameState) {
                localStorage.setItem('lastScore', String(gs.gameState.score));
                var high = parseInt(localStorage.getItem('highScore') || '0', 10);
                if (gs.gameState.score > high) localStorage.setItem('highScore', String(gs.gameState.score));
            }
        }
        location.reload();
    });

    document.getElementById('restart-btn')?.addEventListener('click', () => {
        // Play click sound
        if (window.game && window.game.scene) {
            const gameScene = window.game.scene.getScene('GameScene');
            if (gameScene && gameScene.playSound) {
                gameScene.playSound('click');
            }
        }
        location.reload();
    });

    // Leaderboard submit overlay (replaces confirm() so it works in Farcaster/desktop)
    document.getElementById('leaderboard-submit-cancel')?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('leaderboard-submit-overlay')?.classList.add('hidden');
        window.__baseInvadersPendingLeaderboardSubmit = null;
        if (window.__baseInvadersLeaderboardSubmitDuringPlay && window.game?.scene) {
            window.__baseInvadersLeaderboardSubmitDuringPlay = false;
            if (window.game.scene.isPaused('GameScene')) window.game.scene.resume('GameScene');
            const g = window.game.scene.getScene('GameScene');
            if (g?.gameState) g.gameState.paused = false;
            if (g?.playSound) g.playSound('click');
        } else if (window.game?.scene) {
            const g = window.game.scene.getScene('GameScene');
            if (g?.playSound) g.playSound('click');
        }
    });
    document.getElementById('leaderboard-submit-do')?.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const pending = window.__baseInvadersPendingLeaderboardSubmit;
        const statusEl = document.getElementById('leaderboard-submit-status');
        const overlay = document.getElementById('leaderboard-submit-overlay');
        if (!pending) {
            if (overlay) overlay.classList.add('hidden');
            window.__baseInvadersPendingLeaderboardSubmit = null;
            return;
        }
        const gt = typeof getText === 'function' ? getText : function (k) { return k; };
        if (typeof window.baseInvadersSubmitScore !== 'function') {
            if (statusEl) { statusEl.textContent = gt('leaderboard.openInWarpcast'); statusEl.style.color = '#ff8888'; }
            return;
        }
        const btn = e.target;
        if (btn) { btn.disabled = true; btn.textContent = gt('leaderboard.submitting'); }
        if (statusEl) { statusEl.textContent = gt('leaderboard.submitting'); statusEl.style.color = '#00ff88'; }
        if (window.game?.scene) {
            const g = window.game.scene.getScene('GameScene');
            if (g?.playSound) g.playSound('click');
        }
        try {
            let name = '';
            if (typeof window.baseInvadersGetUserName === 'function') {
                name = await window.baseInvadersGetUserName();
            }
            if (!name && window.baseInvadersLeaderboard?.getSavedName) {
                name = window.baseInvadersLeaderboard.getSavedName();
            }
            name = (name && String(name).trim()) || 'Player';
            if (window.baseInvadersLeaderboard?.setSavedName) {
                window.baseInvadersLeaderboard.setSavedName(name);
            }
            await window.baseInvadersSubmitScore(pending.score, pending.wave, pending.streak, name);
            console.log('[leaderboard] Submit completed successfully');
            window.__baseInvadersPendingLeaderboardSubmit = null;
            const wasDuringPlay = window.__baseInvadersLeaderboardSubmitDuringPlay;
            if (wasDuringPlay) window.__baseInvadersLeaderboardSubmitDuringPlay = false;
            if (statusEl) { statusEl.textContent = gt('leaderboard.submittedNotInTop') || gt('leaderboard.submitted'); statusEl.style.color = '#00ff88'; }
            if (overlay) overlay.classList.add('hidden');
            if (btn) { btn.disabled = false; btn.textContent = gt('leaderboard.submit'); }
            if (wasDuringPlay && window.game?.scene) {
                if (window.game.scene.isPaused('GameScene')) window.game.scene.resume('GameScene');
                const g = window.game.scene.getScene('GameScene');
                if (g?.gameState) g.gameState.paused = false;
            }
        } catch (err) {
            const msg = (err && err.message) ? String(err.message) : 'Submit failed';
            if (statusEl) { statusEl.textContent = msg; statusEl.style.color = '#ff6666'; }
            console.error('Leaderboard submission failed:', err);
            if (btn) { btn.disabled = false; btn.textContent = gt('leaderboard.submit'); }
            if (window.__baseInvadersLeaderboardSubmitDuringPlay && window.game?.scene) {
                window.__baseInvadersLeaderboardSubmitDuringPlay = false;
                if (window.game.scene.isPaused('GameScene')) window.game.scene.resume('GameScene');
                const g = window.game.scene.getScene('GameScene');
                if (g?.gameState) g.gameState.paused = false;
            }
        }
    });

    document.getElementById('submit-my-score-btn')?.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.game && window.game.scene) {
            const g = window.game.scene.getScene('GameScene');
            if (g?.scene?.isActive && g.scene.isActive() && g?.gameState && !g.gameState.paused && g.togglePause) g.togglePause();
        }
        const statusEl = document.getElementById('leaderboard-submit-my-status');
        const btn = e.target;
        const gt2 = typeof getText === 'function' ? getText : function (k) { return k; };
        if (typeof window.baseInvadersSubmitScore !== 'function') {
            if (statusEl) { statusEl.textContent = gt2('leaderboard.openInWarpcast'); statusEl.style.color = '#ff8888'; }
            return;
        }
        const local = window.baseInvadersLeaderboard?.getLocalHighScore ? window.baseInvadersLeaderboard.getLocalHighScore() : null;
        if (!local) {
            if (statusEl) { statusEl.textContent = gt2('leaderboard.playFirst'); statusEl.style.color = '#ff8888'; }
            return;
        }
        const score = Number(local.score) || 0;
        const wave = Number(local.wave) || 1;
        const streak = window.baseInvadersLeaderboard?.getCurrentStreak ? window.baseInvadersLeaderboard.getCurrentStreak() : 0;
        if (btn) { btn.disabled = true; btn.textContent = gt2('leaderboard.submitting'); }
        if (statusEl) { statusEl.textContent = gt2('leaderboard.submitting'); statusEl.style.color = '#00ff88'; }
        try {
            let name = '';
            if (typeof window.baseInvadersGetUserName === 'function') name = await window.baseInvadersGetUserName();
            if (!name && window.baseInvadersLeaderboard?.getSavedName) name = window.baseInvadersLeaderboard.getSavedName();
            name = (name && String(name).trim()) || 'Player';
            if (window.baseInvadersLeaderboard?.setSavedName) window.baseInvadersLeaderboard.setSavedName(name);
            await window.baseInvadersSubmitScore(score, wave, streak, name);
            if (statusEl) { statusEl.textContent = gt2('leaderboard.submittedNotInTop') || gt2('leaderboard.submitted'); statusEl.style.color = '#00ff88'; }
        } catch (err) {
            const msg = (err && err.message) ? String(err.message) : 'Submit failed';
            if (statusEl) { statusEl.textContent = msg; statusEl.style.color = '#ff6666'; }
        }
        if (btn) { btn.disabled = false; btn.textContent = gt2('leaderboard.submitMyScore'); }
    });
});
