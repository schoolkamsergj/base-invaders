// Base Invaders - Main Game File
console.log('MenuScene and GameScene classes defined');

// Menu Scene - Start Screen
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        // Create starry background
        this.createBackground();

        // Title - "BASE DESTROYER"
        const title = this.add.text(width / 2, 80, 'BASE DESTROYER', {
            fontSize: '64px',
            fontWeight: 'bold',
            color: '#00d9ff',
            stroke: '#0088ff',
            strokeThickness: 4
        });
        title.setOrigin(0.5);
        title.setShadow(0, 0, '#00d9ff', 20, true, true);

        // Animated glow effect on title
        this.tweens.add({
            targets: title,
            alpha: { from: 0.8, to: 1 },
            scale: { from: 0.98, to: 1.02 },
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Instructions panel (left side)
        const instructionsBg = this.add.graphics();
        instructionsBg.fillStyle(0x000033, 0.8);
        instructionsBg.fillRoundedRect(20, 180, 360, 380, 10);
        instructionsBg.lineStyle(2, 0x00d9ff, 1);
        instructionsBg.strokeRoundedRect(20, 180, 360, 380, 10);
        instructionsBg.setDepth(1);

        // Add glow effect to instructions panel
        const instructionsGlow = this.add.graphics();
        instructionsGlow.lineStyle(4, 0x00d9ff, 0.3);
        instructionsGlow.strokeRoundedRect(18, 178, 364, 384, 12);
        instructionsGlow.setDepth(0);
        instructionsGlow.setBlendMode(Phaser.BlendModes.ADD);

        const instructionsText = `🎮 CONTROLS
← → or A/D - Move
SPACE - Auto-shoot
ESC - Pause/Menu

🎯 OBJECTIVE
Destroy enemies and bases
Collect diamonds 💎
Pickup power-ups ⚡
Upgrade in shop

👾 ENEMIES
🔴 Red spheres - weak
🔷 Hexagons - medium (HP shown)
🟦 Blue cubes - BASES

🛒 SHOP
Buy new spaceships
Upgrade weapons
Improve stats`;

        const instructions = this.add.text(40, 200, instructionsText, {
            fontSize: '16px',
            color: '#ffffff',
            lineSpacing: 10,
            wordWrap: { width: 340 }
        });
        instructions.setDepth(2);
        instructions.setShadow(2, 2, '#000000', 2, true);

        // START button (center-right)
        const startBtnX = width / 2 + 100;
        const startBtnY = height / 2 + 50;

        const startBtnBg = this.add.graphics();
        startBtnBg.fillStyle(0x0052FF, 0.9);
        startBtnBg.fillRoundedRect(startBtnX - 120, startBtnY - 40, 240, 80, 15);
        startBtnBg.lineStyle(3, 0x00d9ff, 1);
        startBtnBg.strokeRoundedRect(startBtnX - 120, startBtnY - 40, 240, 80, 15);
        startBtnBg.setDepth(1);

        const startBtn = this.add.rectangle(startBtnX, startBtnY, 240, 80, 0x0052FF, 0);
        startBtn.setInteractive({ useHandCursor: true });
        startBtn.setDepth(2);

        const startText = this.add.text(startBtnX, startBtnY, 'START', {
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#00ff00',
            stroke: '#00aa00',
            strokeThickness: 3
        });
        startText.setOrigin(0.5);
        startText.setDepth(3);
        startText.setShadow(0, 0, '#00ff00', 15, true, true);

        // Hover effect
        startBtn.on('pointerover', () => {
            startBtnBg.clear();
            startBtnBg.fillStyle(0x0088ff, 0.9);
            startBtnBg.fillRoundedRect(startBtnX - 120, startBtnY - 40, 240, 80, 15);
            startBtnBg.lineStyle(3, 0x00ffff, 1);
            startBtnBg.strokeRoundedRect(startBtnX - 120, startBtnY - 40, 240, 80, 15);
            startText.setScale(1.1);
            this.tweens.add({
                targets: startText,
                scale: 1.15,
                duration: 200,
                ease: 'Back.easeOut'
            });
        });

        startBtn.on('pointerout', () => {
            startBtnBg.clear();
            startBtnBg.fillStyle(0x0052FF, 0.9);
            startBtnBg.fillRoundedRect(startBtnX - 120, startBtnY - 40, 240, 80, 15);
            startBtnBg.lineStyle(3, 0x00d9ff, 1);
            startBtnBg.strokeRoundedRect(startBtnX - 120, startBtnY - 40, 240, 80, 15);
            this.tweens.add({
                targets: startText,
                scale: 1,
                duration: 200
            });
        });

        // Click to start game
        startBtn.on('pointerdown', () => {
            // Button press effect
            this.tweens.add({
                targets: [startBtn, startText],
                scale: 0.95,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    // Start the game
                    this.scene.start('GameScene');
                }
            });
        });

        // Also allow space/enter to start
        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.start('GameScene');
        });
        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start('GameScene');
        });
        
        // RESET PROGRESS button (below START button)
        const resetBtnX = width / 2 + 100;
        const resetBtnY = height / 2 + 150;  // Below START button
        
        const resetBtnBg = this.add.graphics();
        resetBtnBg.fillStyle(0xcc0000, 0.8);  // Red color for destructive action
        resetBtnBg.fillRoundedRect(resetBtnX - 100, resetBtnY - 25, 200, 50, 10);
        resetBtnBg.lineStyle(2, 0xff4444, 1);  // Bright red border
        resetBtnBg.strokeRoundedRect(resetBtnX - 100, resetBtnY - 25, 200, 50, 10);
        resetBtnBg.setDepth(1);
        
        const resetBtn = this.add.rectangle(resetBtnX, resetBtnY, 200, 50, 0xcc0000, 0);
        resetBtn.setInteractive({ useHandCursor: true });
        resetBtn.setDepth(2);
        
        const resetText = this.add.text(resetBtnX, resetBtnY, 'Reset Progress', {
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        });
        resetText.setOrigin(0.5);
        resetText.setDepth(3);
        
        // Hover effect for reset button
        resetBtn.on('pointerover', () => {
            resetBtnBg.clear();
            resetBtnBg.fillStyle(0xff0000, 0.9);  // Brighter red on hover
            resetBtnBg.fillRoundedRect(resetBtnX - 100, resetBtnY - 25, 200, 50, 10);
            resetBtnBg.lineStyle(2, 0xff6666, 1);
            resetBtnBg.strokeRoundedRect(resetBtnX - 100, resetBtnY - 25, 200, 50, 10);
            this.tweens.add({
                targets: resetText,
                scale: 1.1,
                duration: 200,
                ease: 'Back.easeOut'
            });
        });
        
        resetBtn.on('pointerout', () => {
            resetBtnBg.clear();
            resetBtnBg.fillStyle(0xcc0000, 0.8);
            resetBtnBg.fillRoundedRect(resetBtnX - 100, resetBtnY - 25, 200, 50, 10);
            resetBtnBg.lineStyle(2, 0xff4444, 1);
            resetBtnBg.strokeRoundedRect(resetBtnX - 100, resetBtnY - 25, 200, 50, 10);
            this.tweens.add({
                targets: resetText,
                scale: 1,
                duration: 200
            });
        });
        
        // Click handler with confirmation dialog
        resetBtn.on('pointerdown', () => {
            // Confirmation dialog
            const confirmed = confirm('⚠️ Reset all progress?\n\nThis will:\n- Clear all currency (Gold, Lightning, Diamonds)\n- Reset all upgrades and purchases\n- Reset score and level\n\nThis cannot be undone!');
            
            if (confirmed) {
                // Clear all localStorage data
                localStorage.removeItem('baseInvadersData');
                localStorage.removeItem('baseInvadersShopData');
                localStorage.removeItem('baseInvadersVibration');
                
                // Visual feedback
                this.tweens.add({
                    targets: [resetBtn, resetText],
                    alpha: 0.5,
                    scale: 0.9,
                    duration: 200,
                    yoyo: true,
                    onComplete: () => {
                        // Reload the game to fresh state
                        location.reload();
                    }
                });
            }
        });
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
        
        this.load.on('loaderror', (file) => {
            if (file.type === 'audio') {
                console.error('❌ Sound file FAILED to load:', file.key, 'Path:', file.src);
                console.error('   Check if file exists at:', file.src);
            } else {
                console.warn('Failed to load:', file.key, 'Path:', file.src);
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
        });
        
        console.log('Preload complete - loading spaceship sprites and sounds');
    }

    create() {
        console.log('Game create() started');
        
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
                scoreMultiplier: 1
            };

            // Load saved data
            try {
                this.loadGameData();
                console.log('Game data loaded');
            } catch (e) {
                console.warn('Error loading game data:', e);
            }

            // Create background
            try {
                this.createBackground();
                console.log('Background created');
            } catch (e) {
                console.error('Error creating background:', e);
            }

            // Initialize boss flag
            this.bossActive = false;

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

            // Load player stats from shop
            try {
                this.loadPlayerStats();
            } catch (e) {
                console.warn('Error loading player stats:', e);
            }

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
                const playerY = this.scale.height - 80;
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
        // Position: top-right corner, near pause button (40x40 pixels)
        const buttonX = this.scale.width - 100;  // Left of pause button
        const buttonY = 75;  // Same y as pause button
        
        // Button background (semi-transparent circle)
        this.muteButtonBg = this.add.circle(buttonX, buttonY, 20, 0x333333, 0.7);
        this.muteButtonBg.setScrollFactor(0);
        this.muteButtonBg.setDepth(100);
        this.muteButtonBg.setInteractive({ useHandCursor: true });
        
        // Unmuted icon (bright speaker 🔊)
        this.muteIconUnmuted = this.add.text(buttonX, buttonY, '🔊', {
            fontSize: '24px',
            align: 'center'
        });
        this.muteIconUnmuted.setOrigin(0.5);
        this.muteIconUnmuted.setScrollFactor(0);
        this.muteIconUnmuted.setDepth(101);
        
        // Muted icon (gray speaker with X 🔇)
        this.muteIconMuted = this.add.text(buttonX, buttonY, '🔇', {
            fontSize: '24px',
            align: 'center',
            alpha: 0.5
        });
        this.muteIconMuted.setOrigin(0.5);
        this.muteIconMuted.setScrollFactor(0);
        this.muteIconMuted.setDepth(101);
        this.muteIconMuted.setVisible(false);
        this.muteIconMuted.setTint(0x888888);  // Gray tint
        
        // Cross line for muted state (visual X)
        this.muteCross = this.add.graphics();
        this.muteCross.lineStyle(3, 0xff0000, 0.8);
        this.muteCross.strokeLineShape(new Phaser.Geom.Line(buttonX - 12, buttonY - 12, buttonX + 12, buttonY + 12));
        this.muteCross.strokeLineShape(new Phaser.Geom.Line(buttonX + 12, buttonY - 12, buttonX - 12, buttonY + 12));
        this.muteCross.setScrollFactor(0);
        this.muteCross.setDepth(102);
        this.muteCross.setVisible(false);
        
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
        
        // Mouse/Touch drag
        this.input.on('pointerdown', (pointer) => {
            this.isDragging = true;
            // Ensure audio context is active
            this.handleUserInteraction();
        });

        this.input.on('pointermove', (pointer) => {
            if (this.isDragging && !this.gameState.paused && !this.gameState.gameOver) {
                this.player.setX(Phaser.Math.Clamp(pointer.x, 30, this.scale.width - 30));
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

            // Auto-shoot
            try {
                if (time > this.shootTimer) {
                    this.shootBullets();
                    this.shootTimer = time + this.playerStats.fireRate;
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

            // Update UI
            try {
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
        // Play shoot sound effect
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
            // Check if enemy went off screen
            if (enemySprite.y > this.scale.height + 50) {
                if (enemy && enemy.type !== 'boss') {
                    this.gameState.score -= 50;
                    this.player.takeDamage(5);
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

        // Power-ups vs Player
        this.physics.overlap(this.powerUps, this.player.sprite, (powerUp, player) => {
            this.collectPowerUp(powerUp);
            powerUp.destroy();
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

        // Check level up
        this.checkLevelUp();
    }

    destroyEnemy(enemy, enemySprite) {
        if (!enemy || !enemySprite) return;
        
        // Destroy all enemy visual components
        if (enemy.sprite && enemy.sprite !== enemySprite && enemy.sprite.active) {
            enemy.sprite.destroy();
        }
        if (enemy.shadow && enemy.shadow.active) enemy.shadow.destroy();
        if (enemy.glow && enemy.glow.active) enemy.glow.destroy();
        if (enemy.outerGlow && enemy.outerGlow.active) enemy.outerGlow.destroy();
        if (enemy.innerGlow && enemy.innerGlow.active) enemy.innerGlow.destroy();
        if (enemy.engineGlow && enemy.engineGlow.active) enemy.engineGlow.destroy();
        if (enemy.numberText && enemy.numberText.active) enemy.numberText.destroy();
        if (enemy.letterB && enemy.letterB.active) enemy.letterB.destroy(); // Base cube "B" letter
        
        // Boss-specific components
        if (enemy.type === 'boss') {
            if (enemy.healthBar && enemy.healthBar.active) enemy.healthBar.destroy();
            if (enemy.healthBarBg && enemy.healthBarBg.active) enemy.healthBarBg.destroy();
        }
        
        // Remove from enemies group and destroy sprite
        if (enemySprite && enemySprite.active) {
            this.enemies.remove(enemySprite);
            enemySprite.destroy();
        }
        
        // Clear enemy object reference
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
        this.physics.add.existing(bolt);
        bolt.body.setVelocity(
            Phaser.Math.Between(-50, 50),
            Phaser.Math.Between(50, 100)
        );
        bolt.body.setGravityY(150);
        
        this.tweens.add({
            targets: bolt,
            alpha: { from: 1, to: 0.3 },
            duration: 300,
            yoyo: true,
            repeat: 5,
            onComplete: () => {
                this.gameState.lightning += 1;
                bolt.destroy();
            }
        });
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

    dropPowerUp(x, y) {
        const types = ['shield', 'bomb', 'score2x'];
        const type = Phaser.Math.RND.pick(types);
        const icons = { shield: '🛡️', bomb: '💣', score2x: '⭐' };
        
        const powerUp = this.add.text(x, y, icons[type], { fontSize: '24px' });
        powerUp.setDepth(10);
        powerUp.powerUpType = type;
        this.physics.add.existing(powerUp);
        
        // CRITICAL FIX: Ensure physics body has velocity and falls properly
        if (powerUp.body) {
            powerUp.body.setVelocity(0, 100);  // Fall down at 100 pixels/second
            powerUp.body.setGravityY(0);  // No gravity (using velocity instead)
            powerUp.body.setCollideWorldBounds(false);  // Allow to fall off screen
            powerUp.body.setMaxVelocity(1000, 1000);  // Ensure velocity isn't capped too low
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
        // Play powerup collection sound
        this.playSound('powerup');
        
        // Haptic feedback - vibration on power-up collected
        if (window.vibrationManager) {
            window.vibrationManager.powerUpCollected();
        }
        
        switch (powerUp.powerUpType) {
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
            case 'score2x':
                this.gameState.scoreMultiplier = 2;
                this.time.delayedCall(60000, () => {
                    this.gameState.scoreMultiplier = 1;
                });
                break;
        }
    }

    handleSpawning(time) {
        if (time > this.spawnTimer) {
            this.spawnRandomEnemy();
            this.spawnTimer = time + this.enemySpawnRate;
        }
    }

    spawnRandomEnemy() {
        const rand = Math.random();
        const stage = this.gameState.stage;
        
        if (stage % 10 === 0 && !this.bossActive && this.enemies.children.size === 0) {
            this.spawnBoss();
            this.bossActive = true;
        } else if (rand < 0.4) {
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
        const hp = 500 + (this.gameState.stage - 1) * 100;
        const boss = new BossEnemy(this, this.scale.width / 2, 100, hp);
        boss.sprite.enemyObject = boss; // Store reference
        this.enemies.add(boss.sprite);
    }

    spawnEnemies() {
        console.log('Starting enemy spawns...');
        // Initial wave
        for (let i = 0; i < 5; i++) {
            this.time.delayedCall(i * 500, () => {
                this.spawnRandomEnemy();
            });
        }
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
            this.scene.pause();
            document.getElementById('pause-overlay').classList.remove('hidden');
        } else {
            // Resume game
            this.scene.resume();
            this.gameState.paused = false; // Ensure state is set correctly
            document.getElementById('pause-overlay').classList.add('hidden');
        }
    }

    gameOver() {
        this.gameState.gameOver = true;
        this.scene.pause();
        this.saveGameData();
        document.getElementById('gameover-overlay').classList.remove('hidden');
        document.getElementById('final-stats').innerHTML = `
            <p>Final Score: ${this.gameState.score.toLocaleString()}</p>
            <p>Stage Reached: ${this.gameState.stage}</p>
            <p>Level: ${this.gameState.playerLevel}</p>
        `;
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

    loadPlayerStats() {
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
        width: 800,
        height: 600,
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
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        }
    };

    console.log('Creating Phaser game with config:', config);
    const game = new Phaser.Game(config);
    window.game = game; // Make game accessible globally
    console.log('Phaser game created:', game);
}

// UI Event Handlers (wait for DOM to be ready)
document.addEventListener('DOMContentLoaded', () => {
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
                
                // Sync shop purchases with game state
                if (window.shopSystem && scene.gameState) {
                    window.shopSystem.syncWithGameState(scene.gameState);
                }
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
                document.getElementById('shop-overlay').classList.remove('hidden');
                if (window.shopSystem) {
                    window.shopSystem.updateDisplay();
                }
            }
        }
    });

    // RESET GAME button handler in pause menu
    document.getElementById('reset-game-btn')?.addEventListener('click', () => {
        // Play click sound
        if (window.game && window.game.scene) {
            const gameScene = window.game.scene.getScene('GameScene');
            if (gameScene && gameScene.playSound) {
                gameScene.playSound('click');
            }
        }
        
        // Create custom confirmation dialog with YES/CANCEL buttons
        const confirmed = confirm('⚠️ Reset ALL progress?\n\nThis will:\n- Clear ALL currency (Gold, Lightning, Diamonds)\n- Reset ALL purchases (ships, weapons, upgrades)\n- Reset score, level, and all progress\n- Delete ALL saved data\n\nThis cannot be undone!');
        
        if (confirmed) {
            // Clear ALL localStorage data completely
            localStorage.clear();  // This removes ALL localStorage items
            
            // Also explicitly remove game-specific keys (in case clear() doesn't work)
            localStorage.removeItem('baseInvadersData');
            localStorage.removeItem('baseInvadersShopData');
            localStorage.removeItem('baseInvadersVibration');
            
            // Close pause overlay
            document.getElementById('pause-overlay').classList.add('hidden');
            
            // Stop the game scene
            if (window.game && window.game.scene) {
                window.game.scene.stop('GameScene');
            }
            
            // Restart from MenuScene (start screen)
            if (window.game && window.game.scene) {
                window.game.scene.start('MenuScene');
            } else {
                // If game not initialized, just reload page
                location.reload();
            }
        }
    });

    // EXIT GAME button handler in pause menu
    document.getElementById('exit-game-btn')?.addEventListener('click', () => {
        // Play click sound
        if (window.game && window.game.scene) {
            const gameScene = window.game.scene.getScene('GameScene');
            if (gameScene && gameScene.playSound) {
                gameScene.playSound('click');
            }
        }
        
        // Get GameScene to access gameState
        if (window.game && window.game.scene) {
            const gameScene = window.game.scene.getScene('GameScene');
            if (gameScene && gameScene.gameState) {
                // Save current score to localStorage as 'lastScore'
                localStorage.setItem('lastScore', gameScene.gameState.score.toString());
                
                // Update high score in localStorage if current score is higher
                const currentHighScore = parseInt(localStorage.getItem('highScore') || '0');
                if (gameScene.gameState.score > currentHighScore) {
                    localStorage.setItem('highScore', gameScene.gameState.score.toString());
                    console.log('🏆 New high score:', gameScene.gameState.score);
                }
                
                // Save timestamp as 'lastPlayed'
                localStorage.setItem('lastPlayed', new Date().toISOString());
                
                // Save game data
                if (gameScene.saveGameData) {
                    gameScene.saveGameData();
                }
            }
        }
        
        // Close pause overlay
        document.getElementById('pause-overlay').classList.add('hidden');
        
        // Return to main menu (MenuScene)
        if (window.game && window.game.scene) {
            window.game.scene.stop('GameScene');
            window.game.scene.start('MenuScene');
        } else {
            // If game not initialized, just reload page
            location.reload();
        }
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
});
