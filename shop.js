// Shop System
class ShopSystem {
    constructor() {
        this.data = this.loadShopData();
        this.currentTab = 'spaceships';
        this.init();
    }

    init() {
        // Setup tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Generate shop items
        this.generateShopItems();
        this.updateDisplay();
    }

    loadShopData() {
        const saved = localStorage.getItem('baseInvadersShop');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            ownedShips: ['starter'],
            fireRate: 300,
            fireRateLevel: 1,
            damage: 1,
            damageLevel: 1,
            multiShot: 1,
            maxHP: 100,
            speed: 300,
            upgrades: {}
        };
    }

    saveShopData() {
        localStorage.setItem('baseInvadersShop', JSON.stringify(this.data));
    }

    switchTab(tab) {
        this.currentTab = tab;
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        this.generateShopItems();
    }

    generateShopItems() {
        const container = document.getElementById('shop-content');
        container.innerHTML = '';

        switch (this.currentTab) {
            case 'spaceships':
                this.generateSpaceships();
                break;
            case 'weapons':
                this.generateWeapons();
                break;
            case 'powerups':
                this.generatePowerUps();
                break;
            case 'upgrades':
                this.generateUpgrades();
                break;
        }
    }

    generateSpaceships() {
        const ships = [
            {
                id: 'starter',
                name: 'Starter Ship',
                icon: '🚀',
                price: { gold: 0 },
                stats: 'HP: 100 | Speed: 300 | Balanced',
                owned: true
            },
            {
                id: 'speedDemon',
                name: 'Speed Demon',
                icon: '⚡',
                price: { gold: 500 },
                stats: 'HP: 90 | Speed: 390 | +30% Speed',
                owned: false
            },
            {
                id: 'baseDefender',
                name: 'Base Defender',
                icon: '🛡️',
                price: { gold: 1000 },
                stats: 'HP: 150 | Speed: 300 | +50 HP',
                owned: false
            },
            {
                id: 'tank',
                name: 'Tank',
                icon: '🛡️',
                price: { gold: 1500 },
                stats: 'HP: 200 | Speed: 240 | Slow but Strong',
                owned: false
            },
            {
                id: 'lightningStrike',
                name: 'Lightning Strike',
                icon: '⚡',
                price: { diamonds: 50 },
                stats: 'HP: 120 | Speed: 450 | Very Fast',
                owned: false
            },
            {
                id: 'legendary',
                name: 'Legendary',
                icon: '⭐',
                price: { diamonds: 100 },
                stats: 'HP: 250 | Speed: 400 | Best Stats',
                owned: false
            }
        ];

        ships.forEach(ship => {
            const item = this.createShopItem(ship);
            document.getElementById('shop-content').appendChild(item);
        });
    }

    generateWeapons() {
        const weapons = [
            {
                id: 'fireRate',
                name: 'Fire Rate',
                icon: '🔥',
                price: { gold: 200 },
                stats: `Level ${this.data.fireRateLevel}/10 | Current: ${this.data.fireRate}ms`,
                level: this.data.fireRateLevel,
                maxLevel: 10,
                owned: false
            },
            {
                id: 'damage',
                name: 'Damage',
                icon: '💥',
                price: { gold: 300 },
                stats: `Level ${this.data.damageLevel}/10 | Current: ${this.data.damage} damage`,
                level: this.data.damageLevel,
                maxLevel: 10,
                owned: false
            },
            {
                id: 'multiShot2',
                name: 'Multi-Shot x2',
                icon: '🔫',
                price: { gold: 200 },
                stats: 'Shoot 2 bullets at once',
                owned: this.data.multiShot >= 2,
                required: { multiShot: 1 }
            },
            {
                id: 'multiShot3',
                name: 'Multi-Shot x3',
                icon: '🔫',
                price: { gold: 500 },
                stats: 'Shoot 3 bullets at once',
                owned: this.data.multiShot >= 3,
                required: { multiShot: 2 }
            },
            {
                id: 'multiShot5',
                name: 'Multi-Shot x5',
                icon: '🔫',
                price: { diamonds: 20 },
                stats: 'Shoot 5 bullets at once',
                owned: this.data.multiShot >= 5,
                required: { multiShot: 3 }
            },
            {
                id: 'laserBeam',
                name: 'Laser Beam',
                icon: '⚡',
                price: { diamonds: 50 },
                stats: 'Continuous beam attack',
                owned: false
            }
        ];

        weapons.forEach(weapon => {
            const item = this.createShopItem(weapon);
            document.getElementById('shop-content').appendChild(item);
        });
    }

    generatePowerUps() {
        const powerUps = [
            {
                id: 'shield',
                name: 'Shield Generator',
                icon: '🛡️',
                price: { diamonds: 10 },
                stats: 'Absorbs 5 hits',
                owned: false
            },
            {
                id: 'smartBomb',
                name: 'Smart Bomb',
                icon: '💣',
                price: { diamonds: 5 },
                stats: 'Clears all enemies on screen',
                owned: false
            },
            {
                id: 'coinMagnet',
                name: 'Coin Magnet',
                icon: '🧲',
                price: { gold: 100 },
                stats: 'Auto-collect coins',
                owned: this.data.upgrades.coinMagnet || false
            },
            {
                id: 'score2x',
                name: '2x Score Multiplier',
                icon: '⭐',
                price: { diamonds: 20 },
                stats: '2x score for 60 seconds',
                owned: false
            },
            {
                id: 'extraLife',
                name: 'Extra Life',
                icon: '❤️',
                price: { diamonds: 30 },
                stats: '+1 continue',
                owned: false
            }
        ];

        powerUps.forEach(powerUp => {
            const item = this.createShopItem(powerUp);
            document.getElementById('shop-content').appendChild(item);
        });
    }

    generateUpgrades() {
        const upgrades = [
            {
                id: 'maxHP',
                name: 'Max HP +10',
                icon: '❤️',
                price: { gold: 150 },
                stats: 'Increase max health by 10',
                owned: false
            },
            {
                id: 'hpRegen',
                name: 'HP Regeneration',
                icon: '💚',
                price: { gold: 500 },
                stats: 'Heal 1 HP per second',
                owned: this.data.upgrades.hpRegen || false
            },
            {
                id: 'fasterMovement',
                name: 'Faster Movement',
                icon: '🏃',
                price: { gold: 300 },
                stats: '+20% movement speed',
                owned: this.data.upgrades.fasterMovement || false
            }
        ];

        upgrades.forEach(upgrade => {
            const item = this.createShopItem(upgrade);
            document.getElementById('shop-content').appendChild(item);
        });
        
        // Add vibration settings toggle (free, no purchase needed)
        this.createVibrationToggle();
    }

    createVibrationToggle() {
        const container = document.getElementById('shop-content');
        const vibrationItem = document.createElement('div');
        vibrationItem.className = 'shop-item';
        vibrationItem.style.cssText = 'background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border: 2px solid #00ffff; border-radius: 10px; padding: 15px; margin: 10px; text-align: center;';
        
        const isEnabled = window.vibrationManager && window.vibrationManager.isEnabled();
        const isSupported = window.vibrationManager && window.vibrationManager.supported;
        
        vibrationItem.innerHTML = `
            <div style="font-size: 32px; margin-bottom: 10px;">📳</div>
            <div style="font-weight: bold; color: #00ffff; margin-bottom: 5px;">Haptic Vibration</div>
            <div style="color: #aaa; font-size: 12px; margin-bottom: 15px;">
                ${isSupported ? 'Mobile vibration feedback' : 'Not supported on this device'}
            </div>
            <button id="vibration-toggle" class="shop-item-btn" style="
                background: ${isEnabled ? '#00aa00' : '#666'};
                border: 2px solid #00ffff;
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
                width: 100%;
            ">
                ${isEnabled ? '✓ Enabled' : '✗ Disabled'}
            </button>
        `;
        
        container.appendChild(vibrationItem);
        
        // Add click handler
        const toggleBtn = vibrationItem.querySelector('#vibration-toggle');
        if (toggleBtn && isSupported) {
            toggleBtn.addEventListener('click', () => {
                if (window.vibrationManager) {
                    const newState = !window.vibrationManager.enabled;
                    window.vibrationManager.setEnabled(newState);
                    toggleBtn.textContent = newState ? '✓ Enabled' : '✗ Disabled';
                    toggleBtn.style.background = newState ? '#00aa00' : '#666';
                    
                    // Test vibration when enabling
                    if (newState) {
                        window.vibrationManager.vibrate(50);
                    }
                }
            });
        } else if (toggleBtn && !isSupported) {
            toggleBtn.disabled = true;
            toggleBtn.style.opacity = '0.5';
            toggleBtn.style.cursor = 'not-allowed';
        }
    }

    createShopItem(item) {
        const div = document.createElement('div');
        div.className = `shop-item ${item.owned ? 'owned' : ''}`;
        
        // Determine price text based on currency type
        let priceText = '';
        if (item.price.gold) {
            priceText = `🪙 ${item.price.gold.toLocaleString()}`;
        } else if (item.price.diamonds) {
            priceText = `💎 ${item.price.diamonds}`;
        } else if (item.price.lightning) {
            priceText = `⚡ ${item.price.lightning}`;
        }
        
        // Check if player can afford this item
        const canAfford = this.canAffordItem(item);
        
        const buttonText = item.owned ? 'OWNED' : 'BUY';
        const buttonDisabled = item.owned || (item.required && !this.checkRequirement(item.required)) || !canAfford;
        
        div.innerHTML = `
            <div class="shop-item-icon">${item.icon}</div>
            <div class="shop-item-name">${item.name}</div>
            <div class="shop-item-stats">${item.stats}</div>
            <div class="shop-item-price">${priceText}</div>
            <button class="shop-item-btn ${item.owned ? 'owned' : ''}" 
                    data-item-id="${item.id}" 
                    ${buttonDisabled ? 'disabled' : ''}>
                ${buttonText}
            </button>
        `;
        
        if (!buttonDisabled) {
            div.querySelector('button').addEventListener('click', () => {
                this.purchaseItem(item);
            });
        } else if (!canAfford && !item.owned) {
            // Add visual indicator for unaffordable items
            div.querySelector('button').style.opacity = '0.5';
            div.querySelector('button').style.cursor = 'not-allowed';
            div.querySelector('.shop-item-price').style.color = '#ff4444';
        }
        
        return div;
    }

    canAffordItem(item) {
        // Get current currency from GameScene
        let gameState;
        if (window.game && window.game.scene) {
            const gameScene = window.game.scene.getScene('GameScene');
            if (gameScene && gameScene.gameState) {
                gameState = {
                    gold: gameScene.gameState.gold || 0,
                    diamonds: gameScene.gameState.diamonds || 0,
                    lightning: gameScene.gameState.lightning || 0
                };
            }
        }
        
        // Fallback to localStorage
        if (!gameState) {
            const gameData = localStorage.getItem('baseInvadersData');
            gameState = gameData ? JSON.parse(gameData) : { gold: 0, diamonds: 0, lightning: 0 };
        }
        
        // Check if can afford
        if (item.price.gold && gameState.gold < item.price.gold) {
            return false;
        }
        if (item.price.diamonds && gameState.diamonds < item.price.diamonds) {
            return false;
        }
        if (item.price.lightning && gameState.lightning < item.price.lightning) {
            return false;
        }
        
        return true;
    }

    checkRequirement(required) {
        for (const key in required) {
            if (this.data[key] < required[key]) {
                return false;
            }
        }
        return true;
    }

    purchaseItem(item) {
        // Get GameScene specifically (not MenuScene)
        let gameScene = null;
        if (window.game && window.game.scene) {
            gameScene = window.game.scene.getScene('GameScene');
        }
        
        // Get current game state from GameScene or localStorage
        let gameState;
        if (gameScene && gameScene.gameState) {
            // Get fresh currency from running game
            gameState = {
                gold: gameScene.gameState.gold || 0,
                diamonds: gameScene.gameState.diamonds || 0,
                lightning: gameScene.gameState.lightning || 0,
                playerLevel: gameScene.gameState.playerLevel || 1,
                highScore: gameScene.gameState.score || 0
            };
        } else {
            // Fallback to localStorage if game not running
            const gameData = localStorage.getItem('baseInvadersData');
            gameState = gameData ? JSON.parse(gameData) : { gold: 0, diamonds: 0, lightning: 0 };
        }
        
        // Check if can afford - CRITICAL CHECK
        if (item.price.gold && gameState.gold < item.price.gold) {
            alert(`Not enough gold! You have ${gameState.gold.toLocaleString()}, need ${item.price.gold.toLocaleString()}`);
            return;
        }
        if (item.price.diamonds && gameState.diamonds < item.price.diamonds) {
            alert(`Not enough diamonds! You have ${gameState.diamonds}, need ${item.price.diamonds}`);
            return;
        }
        if (item.price.lightning && gameState.lightning < item.price.lightning) {
            alert(`Not enough lightning! You have ${gameState.lightning}, need ${item.price.lightning}`);
            return;
        }
        
        // DEDUCT PRICE - This is the critical fix!
        if (item.price.gold) {
            gameState.gold -= item.price.gold;
        }
        if (item.price.diamonds) {
            gameState.diamonds -= item.price.diamonds;
        }
        if (item.price.lightning) {
            gameState.lightning -= item.price.lightning;
        }
        
        // Play purchase sound effect
        if (gameScene && gameScene.playSound) {
            gameScene.playSound('purchase');
        }
        
        // Update localStorage FIRST
        localStorage.setItem('baseInvadersData', JSON.stringify(gameState));
        
        // Update running game state if GameScene exists
        if (gameScene && gameScene.gameState) {
            gameScene.gameState.gold = gameState.gold;
            gameScene.gameState.diamonds = gameState.diamonds;
            gameScene.gameState.lightning = gameState.lightning;
            
            // Update UI currency display in game
            if (gameScene.ui && gameScene.ui.update) {
                gameScene.ui.update(gameScene.gameState);
            }
        }
        
        // Apply purchase FIRST (before saving/updating)
        switch (item.id) {
            case 'fireRate':
                if (this.data.fireRateLevel < 10) {
                    this.data.fireRateLevel++;
                    this.data.fireRate = Math.max(100, 300 - (this.data.fireRateLevel - 1) * 20);
                }
                break;
            case 'damage':
                if (this.data.damageLevel < 10) {
                    this.data.damageLevel++;
                    this.data.damage = this.data.damageLevel;
                }
                break;
            case 'multiShot2':
                this.data.multiShot = 2;
                break;
            case 'multiShot3':
                this.data.multiShot = 3;
                break;
            case 'multiShot5':
                this.data.multiShot = 5;
                break;
            case 'maxHP':
                this.data.maxHP += 10;
                break;
            case 'hpRegen':
                this.data.upgrades.hpRegen = true;
                break;
            case 'fasterMovement':
                this.data.upgrades.fasterMovement = true;
                this.data.speed = 360;
                break;
            case 'coinMagnet':
                this.data.upgrades.coinMagnet = true;
                break;
            case 'speedDemon':
            case 'baseDefender':
            case 'tank':
            case 'lightningStrike':
            case 'legendary':
                this.data.ownedShips.push(item.id);
                this.data.currentShip = item.id;
                // Apply ship stats
                this.applyShipStats(item.id);
                break;
        }
        
        // Save shop data after applying purchase
        this.saveShopData();
        
        // Update shop currency display IMMEDIATELY
        this.updateCurrencyDisplay();
        
        // Refresh shop items to update button states (disable if can't afford anymore)
        this.generateShopItems();
        
        // Update game state and apply upgrades immediately (use GameScene, not scenes[0])
        const scene = window.game && window.game.scene && window.game.scene.getScene('GameScene');
        if (scene) {
            const gameData = localStorage.getItem('baseInvadersData');
            if (gameData) {
                try {
                    const saved = JSON.parse(gameData);
                    if (scene.gameState) {
                        scene.gameState.gold = saved.gold ?? scene.gameState.gold;
                        scene.gameState.diamonds = saved.diamonds ?? scene.gameState.diamonds;
                        scene.gameState.lightning = saved.lightning ?? scene.gameState.lightning;
                    }
                } catch (e) { /* ignore */ }
            }
            if (scene.loadPlayerStats) scene.loadPlayerStats();
            if (scene.player) {
                scene.player.maxHP = scene.playerStats.maxHP;
                scene.player.hp = Math.min(scene.player.hp, scene.playerStats.maxHP);
            }
        }
    }

    applyShipStats(shipId) {
        const stats = {
            starter: { maxHP: 100, speed: 300 },
            speedDemon: { maxHP: 90, speed: 390 },
            baseDefender: { maxHP: 150, speed: 300 },
            tank: { maxHP: 200, speed: 240 },
            lightningStrike: { maxHP: 120, speed: 450 },
            legendary: { maxHP: 250, speed: 400 }
        };
        
        if (stats[shipId]) {
            this.data.maxHP = stats[shipId].maxHP;
            this.data.speed = stats[shipId].speed;
        }
    }

    updateDisplay() {
        // Sync currency from game state if game is running
        this.syncCurrencyFromGameState();
        // Update currency display in shop header
        this.updateCurrencyDisplay();
        this.generateShopItems();
    }

    updateCurrencyDisplay() {
        // Get currency from game state or localStorage
        let gold = 0, lightning = 0, diamonds = 0;
        
        // Get GameScene specifically (not MenuScene)
        if (window.game && window.game.scene) {
            const gameScene = window.game.scene.getScene('GameScene');
            if (gameScene && gameScene.gameState) {
                gold = gameScene.gameState.gold || 0;
                lightning = gameScene.gameState.lightning || 0;
                diamonds = gameScene.gameState.diamonds || 0;
            }
        }
        
        // Fallback to localStorage if GameScene not available
        if (diamonds === 0 && gold === 0 && lightning === 0) {
            const gameData = localStorage.getItem('baseInvadersData');
            if (gameData) {
                const saved = JSON.parse(gameData);
                gold = saved.gold || 0;
                lightning = saved.lightning || 0;
                diamonds = saved.diamonds || 0;
            }
        }
        
        // Update currency display elements
        const goldEl = document.getElementById('shop-gold');
        const lightningEl = document.getElementById('shop-lightning');
        const diamondsEl = document.getElementById('shop-diamonds');
        
        if (goldEl) goldEl.textContent = `🪙 ${this.formatNumber(gold)}`;
        if (lightningEl) lightningEl.textContent = `⚡ ${this.formatNumber(lightning)}`;
        if (diamondsEl) diamondsEl.textContent = `💎 ${this.formatNumber(diamonds)}`;
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    syncCurrencyFromGameState() {
        // Get currency from GameScene specifically (not MenuScene)
        if (window.game && window.game.scene) {
            const gameScene = window.game.scene.getScene('GameScene');
            if (gameScene && gameScene.gameState) {
                // Update localStorage with current game state currency
                const gameData = {
                    gold: gameScene.gameState.gold || 0,
                    diamonds: gameScene.gameState.diamonds || 0,
                    lightning: gameScene.gameState.lightning || 0,
                    playerLevel: gameScene.gameState.playerLevel || 1,
                    highScore: gameScene.gameState.score || 0
                };
                localStorage.setItem('baseInvadersData', JSON.stringify(gameData));
            }
        }
    }

    syncWithGameState(gameState) {
        // Sync shop purchases to GameScene (not MenuScene)
        const scene = window.game && window.game.scene && window.game.scene.getScene('GameScene');
        if (scene && scene.loadPlayerStats) {
            scene.loadPlayerStats();
            if (scene.player) {
                scene.player.maxHP = scene.playerStats.maxHP;
                scene.player.hp = Math.min(scene.player.hp, scene.playerStats.maxHP);
            }
        }
    }

    getPlayerStats() {
        return {
            fireRate: this.data.fireRate || 300,
            damage: this.data.damage || 1,
            multiShot: this.data.multiShot || 1,
            maxHP: this.data.maxHP || 100,
            speed: this.data.speed || 300
        };
    }
}

// Initialize shop system when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.shopSystem = new ShopSystem();
    });
} else {
    window.shopSystem = new ShopSystem();
}
