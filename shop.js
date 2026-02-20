// Shop System
class ShopSystem {
    constructor() {
        this.data = this.loadShopData();
        this.currentTab = 'spaceships';
        this.init();
    }

    /** Відтворює звук кліку з GameScene або MenuScene (магазин відкрито з меню). */
    playClickSound() {
        if (!window.game?.scene) return;
        const gameScene = window.game.scene.getScene('GameScene');
        if (gameScene && typeof gameScene.playSound === 'function') {
            gameScene.playSound('click');
            return;
        }
        const menuScene = window.game.scene.getScene('MenuScene');
        if (menuScene?.clickSound) try { menuScene.clickSound.play(); } catch (e) {}
    }

    /** Відтворює звук покупки з GameScene або MenuScene. */
    playPurchaseSound() {
        if (!window.game?.scene) return;
        const gameScene = window.game.scene.getScene('GameScene');
        if (gameScene && typeof gameScene.playSound === 'function') {
            gameScene.playSound('purchase');
            return;
        }
        const menuScene = window.game.scene.getScene('MenuScene');
        if (menuScene?.clickSound) try { menuScene.clickSound.play(); } catch (e) {}
    }

    init() {
        // Setup tab buttons (use currentTarget so click on button text still gives correct data-tab)
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.playClickSound();
                const tab = (e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.tab) || e.target.dataset.tab;
                if (tab) this.switchTab(tab);
            });
        });

        // Generate shop items
        this.generateShopItems();
        this.updateDisplay();
    }

    loadShopData() {
        const defaults = {
            ownedShips: ['starter'],
            fireRate: 300,
            fireRateLevel: 1,
            damage: 1,
            damageLevel: 1,
            multiShot: 1,
            maxHP: 100,
            speed: 300,
            upgrades: {},
            shield: 0,
            extraLives: 0,
            score2xBankedSeconds: 0
        };
        const saved = localStorage.getItem('baseInvadersShop');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                return { ...defaults, ...parsed, upgrades: { ...(defaults.upgrades || {}), ...(parsed.upgrades || {}) } };
            } catch (e) {
                return defaults;
            }
        }
        return defaults;
    }

    saveShopData() {
        localStorage.setItem('baseInvadersShop', JSON.stringify(this.data));
    }

    switchTab(tab) {
        if (!tab || typeof tab !== 'string') return;
        this.currentTab = tab;
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.querySelector(`[data-tab="${tab}"]`);
        if (activeBtn) activeBtn.classList.add('active');
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
        const g = typeof window !== 'undefined' && typeof window.getText === 'function' ? window.getText : function (k, r) { return k; };
        const ships = [
            { id: 'starter', name: g('shopItems.starterShip.name'), icon: '🚀', price: { gold: 0 }, stats: g('shopItems.starterShip.stats'), owned: true },
            { id: 'speedDemon', name: g('shopItems.speedDemon.name'), icon: '⚡', price: { gold: 500 }, stats: g('shopItems.speedDemon.stats'), owned: false },
            { id: 'baseDefender', name: g('shopItems.baseDefender.name'), icon: '🛡️', price: { gold: 1000 }, stats: g('shopItems.baseDefender.stats'), owned: false },
            { id: 'tank', name: g('shopItems.tank.name'), icon: '🛡️', price: { gold: 1500 }, stats: g('shopItems.tank.stats'), owned: false },
            { id: 'lightningStrike', name: g('shopItems.lightningStrike.name'), icon: '⚡', price: { diamonds: 50 }, stats: g('shopItems.lightningStrike.stats'), owned: false },
            { id: 'legendary', name: g('shopItems.legendary.name'), icon: '⭐', price: { diamonds: 100 }, stats: g('shopItems.legendary.stats'), owned: false }
        ];

        ships.forEach(ship => {
            const item = this.createShopItem(ship);
            document.getElementById('shop-content').appendChild(item);
        });
    }

    generateWeapons() {
        const g = typeof window !== 'undefined' && typeof window.getText === 'function' ? window.getText : function (k, r) { return k; };
        const weapons = [
            { id: 'fireRate', name: g('shopItems.fireRate.name'), icon: '🔥', price: { gold: 200 }, stats: g('shopItems.fireRate.stats', { level: this.data.fireRateLevel, rate: this.data.fireRate }), level: this.data.fireRateLevel, maxLevel: 10, owned: false },
            { id: 'damage', name: g('shopItems.damage.name'), icon: '💥', price: { gold: 300 }, stats: g('shopItems.damage.stats', { level: this.data.damageLevel, damage: this.data.damage }), level: this.data.damageLevel, maxLevel: 10, owned: false },
            { id: 'multiShot2', name: g('shopItems.multiShot2.name'), icon: '🔫', price: { gold: 200 }, stats: g('shopItems.multiShot2.stats'), owned: this.data.multiShot >= 2, required: { multiShot: 1 } },
            { id: 'multiShot3', name: g('shopItems.multiShot3.name'), icon: '🔫', price: { gold: 500 }, stats: g('shopItems.multiShot3.stats'), owned: this.data.multiShot >= 3, required: { multiShot: 2 } },
            { id: 'multiShot5', name: g('shopItems.multiShot5.name'), icon: '🔫', price: { diamonds: 20 }, stats: g('shopItems.multiShot5.stats'), owned: this.data.multiShot >= 5, required: { multiShot: 3 } },
            { id: 'laserBeam', name: g('shopItems.laserBeam.name'), icon: '⚡', price: { diamonds: 50 }, stats: g('shopItems.laserBeam.stats'), owned: (this.data.upgrades && this.data.upgrades.laserBeam) || false }
        ];

        weapons.forEach(weapon => {
            const item = this.createShopItem(weapon);
            document.getElementById('shop-content').appendChild(item);
        });
    }

    generatePowerUps() {
        const g = typeof window !== 'undefined' && typeof window.getText === 'function' ? window.getText : function (k, r) { return k; };
        const powerUps = [
            { id: 'shield', name: g('shopItems.shieldGen.name'), icon: '🛡️', price: { diamonds: 10 }, stats: g('shopItems.shieldGen.stats'), owned: false },
            { id: 'shieldLightning', name: g('shopItems.shieldLightning.name'), icon: '🛡️', price: { lightning: 15 }, stats: g('shopItems.shieldLightning.stats'), owned: false },
            { id: 'smartBomb', name: g('shopItems.smartBomb.name'), icon: '💣', price: { diamonds: 5 }, stats: g('shopItems.smartBomb.stats'), owned: (this.data.upgrades && this.data.upgrades.smartBomb) || false },
            { id: 'coinMagnet', name: g('shopItems.coinMagnet.name'), icon: '🧲', price: { gold: 100 }, stats: g('shopItems.coinMagnet.stats'), owned: (this.data.upgrades && this.data.upgrades.coinMagnet) || false },
            { id: 'score2x', name: g('shopItems.score2x.name'), icon: '⭐', price: { diamonds: 20 }, stats: g('shopItems.score2x.stats'), owned: false },
            { id: 'extraLife', name: g('shopItems.extraLife.name'), icon: '❤️', price: { diamonds: 30 }, stats: g('shopItems.extraLife.stats'), owned: false },
            { id: 'extraLifeLightning', name: g('shopItems.extraLifeLightning.name'), icon: '❤️', price: { lightning: 25 }, stats: g('shopItems.extraLifeLightning.stats'), owned: false }
        ];

        powerUps.forEach(powerUp => {
            const item = this.createShopItem(powerUp);
            document.getElementById('shop-content').appendChild(item);
        });
    }

    generateUpgrades() {
        const g = typeof window !== 'undefined' && typeof window.getText === 'function' ? window.getText : function (k, r) { return k; };
        const upgrades = [
            { id: 'maxHP', name: g('shopItems.maxHP.name'), icon: '❤️', price: { gold: 150 }, stats: g('shopItems.maxHP.stats'), owned: false },
            { id: 'hpRegen', name: g('shopItems.hpRegen.name'), icon: '💚', price: { gold: 500 }, stats: g('shopItems.hpRegen.stats'), owned: (this.data.upgrades && this.data.upgrades.hpRegen) || false },
            { id: 'fasterMovement', name: g('shopItems.fasterMovement.name'), icon: '🏃', price: { gold: 300 }, stats: g('shopItems.fasterMovement.stats'), owned: (this.data.upgrades && this.data.upgrades.fasterMovement) || false }
        ];

        upgrades.forEach(upgrade => {
            const item = this.createShopItem(upgrade);
            document.getElementById('shop-content').appendChild(item);
        });
    }

    createShopItem(item) {
        const div = document.createElement('div');
        div.className = `shop-item ${item.owned ? 'owned' : ''}`;
        div.setAttribute('onclick', 'event.stopPropagation()');
        
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
        
        const g = typeof window !== 'undefined' && typeof window.getText === 'function' ? window.getText : function (k) { return k; };
        const buttonText = item.owned ? g('shopItems.owned') : g('shopItems.buy');
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
        
        // Play purchase sound effect (з гри або з меню, якщо магазин відкрито з налаштувань)
        if (window.shopSystem && typeof window.shopSystem.playPurchaseSound === 'function') {
            window.shopSystem.playPurchaseSound();
        } else if (gameScene && gameScene.playSound) {
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
            case 'smartBomb':
                this.data.upgrades.smartBomb = true;
                break;
            case 'laserBeam':
                this.data.upgrades.laserBeam = true;
                break;
            case 'shield':
            case 'shieldLightning':
                this.data.shield = (this.data.shield || 0) + 5;
                if (gameScene && gameScene.playerStats) gameScene.playerStats.shield = (gameScene.playerStats.shield || 0) + 5;
                if (gameScene && gameScene.player) gameScene.player.shield = (gameScene.playerStats?.shield || 0);
                break;
            case 'score2x':
                if (gameScene && gameScene.gameState && gameScene.time) {
                    const now = gameScene.time.now;
                    const add = 60000;
                    gameScene.gameState.score2xEndTime = Math.max(now, (gameScene.gameState.score2xEndTime || 0)) + add;
                } else {
                    this.data.score2xBankedSeconds = (this.data.score2xBankedSeconds || 0) + 60;
                }
                break;
            case 'extraLife':
            case 'extraLifeLightning':
                this.data.extraLives = (this.data.extraLives || 0) + 1;
                if (gameScene && gameScene.gameState) gameScene.gameState.extraLives = (gameScene.gameState.extraLives || 0) + 1;
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
                scene.player.shield = scene.playerStats.shield || 0;
            }
            if (scene.ui && scene.ui.update) scene.ui.update(scene.gameState);
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
