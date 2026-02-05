/**
 * Base Invaders i18n - EN (default) + HI
 * getText(key), setLang(lang), refreshAll()
 */
(function (global) {
    const STORAGE_KEY = 'baseInvadersLang';
    const DEFAULT_LANG = 'en';

    let currentLang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    let strings = {};
    let enFallback = {};

    function getNested(obj, path) {
        const parts = path.split('.');
        let o = obj;
        for (let i = 0; i < parts.length; i++) {
            if (o == null || typeof o !== 'object') return undefined;
            o = o[parts[i]];
        }
        return o;
    }

    function template(str, replacements) {
        if (!str || !replacements) return str;
        let out = str;
        for (const [k, v] of Object.entries(replacements)) {
            out = out.replace(new RegExp('\\{' + k + '\\}', 'g'), v);
        }
        return out;
    }

    /**
     * Get translated string. key e.g. "menu.title". Optional replacements for {key}.
     * @param {string} key - dot path e.g. "menu.title"
     * @param {Object} [replacements] - e.g. { next: 2, milestone: 7 }
     * @returns {string}
     */
    function getText(key, replacements) {
        if (!key) return '';
        var s = (typeof global !== 'undefined' && global.__i18nStrings) ? global.__i18nStrings : strings;
        let str = getNested(s, key);
        if (str == null) str = getNested(enFallback, key);
        if (str == null) return key;
        return template(String(str), replacements);
    }

    /**
     * Set language and persist. Loads locale synchronously, then dispatches base-invaders:lang-changed.
     * @param {string} lang - 'en' | 'hi'
     * @returns {Promise<void>}
     */
    function setLang(lang) {
        if (lang !== 'en' && lang !== 'hi' && lang !== 'ru') lang = DEFAULT_LANG;
        currentLang = lang;
        localStorage.setItem(STORAGE_KEY, lang);
        loadLocale(lang);
        console.log('setLang called:', lang, 'strings.menu.title:', (strings && strings.menu && strings.menu.title) || '(empty)');
        if (typeof global.dispatchEvent === 'function') {
            global.dispatchEvent(new Event('base-invaders:lang-changed'));
        }
        return Promise.resolve();
    }

    function getLang() {
        return currentLang;
    }

    function getHiStrings() {
        return typeof hiFallback !== 'undefined' && hiFallback !== null ? hiFallback : enFallback;
    }

    /**
     * Load locale. Uses embedded en and hi so no fetch needed (works in Farcaster/iframe).
     */
    function loadLocale(lang) {
        if (lang === 'en') {
            strings = JSON.parse(JSON.stringify(enFallback));
            if (typeof global !== 'undefined') global.__i18nStrings = strings;
            return;
        }
        if (lang === 'hi') {
            try {
                var hiData = getHiStrings();
                strings = JSON.parse(JSON.stringify(hiData));
                if (typeof global !== 'undefined') global.__i18nStrings = strings;
            } catch (e) {
                strings = JSON.parse(JSON.stringify(enFallback));
                if (typeof global !== 'undefined') global.__i18nStrings = strings;
            }
            return;
        }
        if (lang === 'ru') {
            try {
                strings = typeof ruFallback !== 'undefined' && ruFallback !== null
                    ? JSON.parse(JSON.stringify(ruFallback))
                    : JSON.parse(JSON.stringify(enFallback));
                if (typeof global !== 'undefined') global.__i18nStrings = strings;
            } catch (e) {
                strings = JSON.parse(JSON.stringify(enFallback));
                if (typeof global !== 'undefined') global.__i18nStrings = strings;
            }
            return;
        }
    }

    /**
     * Refresh all UI that uses i18n: Phaser menu texts + HTML overlays.
     * Call after setLang or on game ready. MenuScene and UI listen for base-invaders:lang-changed.
     */
    function refreshAll() {
        if (typeof global.dispatchEvent === 'function') {
            global.dispatchEvent(new Event('base-invaders:lang-changed'));
        }
    }

    // Embedded English (default) so no fetch needed for en
    enFallback = {
        "menu": {
            "title": "BASE DESTROYER",
            "welcome": "Welcome, Commander! 🚀\n\nDefend the base from alien invaders.\nCollect diamonds and upgrade your ship.",
            "goodLuck": "Good luck! ⭐",
            "start": "START",
            "howToPlay": "How to Play",
            "language": "Language 🌐",
            "resetProgress": "Reset Progress",
            "leaderboard": "Leaderboard"
        },
        "instructions": {
            "title": "📖 HOW TO PLAY",
            "body": "🎮 CONTROLS\n← → or A/D - Move left/right\n↑ ↓ or W/S - Move up/down\nSPACE - Auto-shoot\nESC - Pause game\n\n🎯 OBJECTIVE\n-  Destroy enemies and bases\n-  Collect diamonds 💎\n-  Pick up power-ups ⚡\n-  Upgrade your ship in shop\n-  Complete missions and defeat bosses\n\n👾 ENEMIES\n🔴 Red spheres - Weak (fast)\n🔷 Hexagons - Medium (shows HP)\n🟦 Blue cubes - BASES (destroy these!)\n\n🛒 SHOP\n-  Buy new spaceships\n-  Upgrade weapons\n-  Improve stats\n-  Increase fire rate & damage\n\nGood luck, Commander! 🚀"
        },
        "ui": {
            "stage": "STAGE",
            "mission": "Mission",
            "wave": "Wave",
            "boss": "BOSS ⚔️",
            "score": "Score",
            "level": "Level",
            "shop": "🛒 SHOP",
            "checkIn": "📅 CHECK-IN",
            "checkedIn": "Checked in",
            "dayStreak": "Day {next} →{milestone}",
            "dayMilestone": "Day {next} →{next7} 🎉",
            "signing": "⛓️ SIGNING...",
            "confirmedBase": "⛓️ Confirmed on Base!",
            "transactionFailed": "Transaction failed",
            "transactionCancelled": "Transaction cancelled",
            "insufficientFunds": "Insufficient funds",
            "walletNotReady": "Wallet not ready, try again",
            "alreadyCheckedIn": "Already checked in today",
            "sdkNotLoaded": "SDK not loaded"
        },
        "shop": {
            "title": "🛒 SHOP",
            "tabSpaceships": "🚀 Spaceships",
            "tabWeapons": "🔫 Weapons",
            "tabPowerups": "⚡ Power-ups",
            "tabUpgrades": "⬆️ Upgrades"
        },
        "shopItems": {
            "starterShip": { "name": "Starter Ship", "stats": "HP: 100 | Speed: 300 | Balanced" },
            "speedDemon": { "name": "Speed Demon", "stats": "HP: 90 | Speed: 390 | +30% Speed" },
            "baseDefender": { "name": "Base Defender", "stats": "HP: 150 | Speed: 300 | +50% HP" },
            "tank": { "name": "Tank", "stats": "HP: 200 | Speed: 240 | Slow but Strong" },
            "lightningStrike": { "name": "Lightning Strike", "stats": "HP: 120 | Speed: 450 | Very Fast" },
            "legendary": { "name": "Legendary", "stats": "HP: 250 | Speed: 400 | Best Stats" },
            "fireRate": { "name": "Fire Rate", "stats": "Level {level}/10 | Current: {rate}ms" },
            "damage": { "name": "Damage", "stats": "Level {level}/10 | Current: {damage} damage" },
            "multiShot2": { "name": "Multi-Shot x2", "stats": "Shoot 2 bullets at once" },
            "multiShot3": { "name": "Multi-Shot x3", "stats": "Shoot 3 bullets at once" },
            "multiShot5": { "name": "Multi-Shot x5", "stats": "Shoot 5 bullets at once" },
            "laserBeam": { "name": "Laser Beam", "stats": "Continuous beam attack" },
            "shieldGen": { "name": "Shield Generator", "stats": "Absorbs 5 hits" },
            "smartBomb": { "name": "Smart Bomb", "stats": "Clears all enemies on screen" },
            "coinMagnet": { "name": "Coin Magnet", "stats": "Auto-collect coins" },
            "score2x": { "name": "2x Score Multiplier", "stats": "2x score for 60 seconds" },
            "extraLife": { "name": "Extra Life", "stats": "+1 continue" },
            "maxHP": { "name": "Max HP +10", "stats": "Increase max health by 10" },
            "hpRegen": { "name": "HP Regeneration", "stats": "Heal 1 HP per second" },
            "fasterMovement": { "name": "Faster Movement", "stats": "+20% movement speed" },
            "owned": "OWNED",
            "buy": "BUY",
            "vibrationToggle": "Haptic Vibration",
            "vibrationSupported": "Mobile vibration feedback",
            "vibrationNotSupported": "Not supported on this device",
            "enabled": "Enabled",
            "disabled": "Disabled"
        },
        "pause": {
            "title": "⏸️ PAUSED",
            "resume": "Resume",
            "mainMenu": "Main Menu",
            "resetGame": "Reset Game",
            "exitGame": "Exit Game"
        },
        "resetConfirm": {
            "title": "Reset progress?",
            "message": "This will clear currency, purchases, score and all saved data. Cannot be undone.",
            "cancel": "Cancel",
            "reset": "Reset"
        },
        "gameover": {
            "title": "💥 GAME OVER",
            "restart": "Restart",
            "finalScore": "Final Score",
            "stageReached": "Stage Reached",
            "level": "Level"
        },
        "leaderboard": {
            "title": "🏆 LEADERBOARD",
            "submitMyScore": "Submit my score",
            "refresh": "Refresh",
            "globalStatus": "Global leaderboard (on-chain)",
            "personalBest": "Personal best (local)",
            "loading": "Loading...",
            "playToSetBest": "Play a run to set your personal best.",
            "submitNewHighTitle": "🏆 New high score!",
            "submitNewHighMessage": "Submit to global leaderboard? (Wallet transaction required.)",
            "submit": "Submit",
            "cancel": "Cancel",
            "submitting": "Submitting...",
            "submitted": "Submitted!",
            "openInWarpcast": "Open in Warpcast to submit.",
            "playFirst": "Play a game first to have a score."
        },
        "lang": {
            "english": "🇺🇸 English",
            "hindi": "🇮🇳 हिंदी",
            "russian": "🇷🇺 Русский"
        }
    };

    var hiFallback = {
        menu: {
            title: "बेस डेस्ट्रॉयर",
            welcome: "स्वागत है कमांडर! एलियन हमलावरों से आधार की रक्षा करें। हीरे इकट्ठा करें और अपने जहाज को अपग्रेड करें।",
            goodLuck: "गुड लक! 🌟",
            start: "शुरू करें",
            howToPlay: "कैसे खेलें",
            language: "भाषा 🌐",
            resetProgress: "प्रगति रीसेट करें",
            leaderboard: "लीडरबोर्ड"
        },
        instructions: {
            title: "📖 कैसे खेलें",
            body: "🎮 नियंत्रण\n← → या A/D - बाएं/दाएं चलें\n↑ ↓ या W/S - ऊपर/नीचे चलें\nSPACE - ऑटो शूट\nESC - गेम रोकें\n\n🎯 उद्देश्य\n-  दुश्मनों और बेस को नष्ट करें\n-  हीरे 💎 इकट्ठा करें\n-  पावर-अप ⚡ उठाएं\n-  दुकान में जहाज अपग्रेड करें\n-  मिशन पूरे करें और बॉस को हराएं\n\n👾 दुश्मन\n🔴 लाल गोले - कमजोर (तेज़)\n🔷 हेक्सागोन - मध्यम (HP दिखाता है)\n🟦 नीले क्यूब - बेस (इन्हें नष्ट करें!)\n\n🛒 दुकान\n-  नए स्पेसशिप खरीदें\n-  हथियार अपग्रेड करें\n-  स्टैट्स सुधारें\n-  फायर रेट और डैमेज बढ़ाएं\n\nशुभकामनाएं, कमांडर! 🚀"
        },
        ui: {
            stage: "चरण",
            mission: "मिशन",
            wave: "लहर",
            boss: "बॉस",
            score: "स्कोर",
            level: "स्तर",
            shop: "🛒 दुकान",
            checkIn: "📅 चेक-इन",
            checkedIn: "चेक इन हो चुका",
            dayStreak: "दिन {next} →{milestone}",
            dayMilestone: "दिन {next} →{next7} 🎉",
            signing: "⛓️ साइन हो रहा...",
            confirmedBase: "⛓️ बेस पर पुष्टि!",
            transactionFailed: "लेनदेन विफल",
            transactionCancelled: "लेनदेन रद्द",
            insufficientFunds: "अपर्याप्त धन",
            walletNotReady: "वॉलेट तैयार नहीं, पुनः प्रयास करें",
            alreadyCheckedIn: "आज पहले ही चेक इन हो चुका",
            sdkNotLoaded: "SDK लोड नहीं हुआ"
        },
        shop: {
            title: "🛒 दुकान",
            tabSpaceships: "🚀 स्पेसशिप",
            tabWeapons: "🔫 हथियार",
            tabPowerups: "⚡ पावर-अप",
            tabUpgrades: "⬆️ अपग्रेड"
        },
        shopItems: {
            starterShip: { name: "स्टार्टर शिप", stats: "HP: 100 | गति: 300 | संतुलित" },
            speedDemon: { name: "स्पीड डेमन", stats: "HP: 90 | गति: 390 | +30% गति" },
            baseDefender: { name: "बेस डिफेंडर", stats: "HP: 150 | गति: 300 | +50% HP" },
            tank: { name: "टैंक", stats: "HP: 200 | गति: 240 | धीमा लेकिन मजबूत" },
            lightningStrike: { name: "लाइटनिंग स्ट्राइक", stats: "HP: 120 | गति: 450 | बहुत तेज" },
            legendary: { name: "महान", stats: "HP: 250 | गति: 400 | सर्वश्रेष्ठ" },
            fireRate: { name: "आग की दर", stats: "स्तर {level}/10 | वर्तमान: {rate}ms" },
            damage: { name: "नुकसान", stats: "स्तर {level}/10 | वर्तमान: {damage}" },
            multiShot2: { name: "मल्टी-शॉट x2", stats: "एक साथ 2 गोलियां" },
            multiShot3: { name: "मल्टी-शॉट x3", stats: "एक साथ 3 गोलियां" },
            multiShot5: { name: "मल्टी-शॉट x5", stats: "एक साथ 5 गोलियां" },
            laserBeam: { name: "लेजर बीम", stats: "निरंतर हमला" },
            shieldGen: { name: "शील्ड जेनरेटर", stats: "5 हिट अवशोषित" },
            smartBomb: { name: "स्मार्ट बम", stats: "सभी दुश्मनों को साफ" },
            coinMagnet: { name: "सिक्का चुंबक", stats: "स्वतः सिक्के इकट्ठा" },
            score2x: { name: "2x स्कोर", stats: "60 सेकंड के लिए 2x" },
            extraLife: { name: "अतिरिक्त जीवन", stats: "+1 जारी रखें" },
            maxHP: { name: "अधिकतम HP +10", stats: "स्वास्थ्य +10 बढ़ाएं" },
            hpRegen: { name: "HP पुनर्जनन", stats: "1 HP/सेकंड हील" },
            fasterMovement: { name: "तेज गति", stats: "+20% गति" },
            owned: "स्वामित्व",
            buy: "खरीदें",
            vibrationToggle: "हैप्टिक वाइब्रेशन",
            vibrationSupported: "मोबाइल वाइब्रेशन",
            vibrationNotSupported: "इस डिवाइस पर समर्थित नहीं",
            enabled: "सक्षम",
            disabled: "अक्षम"
        },
        pause: {
            title: "⏸️ रुका हुआ",
            resume: "जारी रखें",
            mainMenu: "मुख्य मेनू",
            resetGame: "गेम रीसेट",
            exitGame: "गेम से बाहर"
        },
        resetConfirm: {
            title: "प्रगति रीसेट करें?",
            message: "इससे मुद्रा, खरीदारी, स्कोर और सभी सहेजे डेटा मिट जाएंगे। पूर्ववत नहीं हो सकता।",
            cancel: "रद्द करें",
            reset: "रीसेट"
        },
        gameover: {
            title: "💥 गेम ओवर",
            restart: "दोबारा शुरू",
            finalScore: "अंतिम स्कोर",
            stageReached: "पहुंचा स्टेज",
            level: "लेवल"
        },
        leaderboard: {
            title: "🏆 लीडरबोर्ड",
            submitMyScore: "मेरा स्कोर जमा करें",
            refresh: "रीफ्रेश",
            globalStatus: "ग्लोबल लीडरबोर्ड (ऑन-चेन)",
            personalBest: "व्यक्तिगत सर्वश्रेष्ठ (लोकल)",
            loading: "लोड हो रहा...",
            playToSetBest: "व्यक्तिगत सर्वश्रेष्ठ सेट करने के लिए एक रन खेलें।",
            submitNewHighTitle: "🏆 नया हाई स्कोर!",
            submitNewHighMessage: "ग्लोबल लीडरबोर्ड में जमा करें? (वॉलेट लेनदेन आवश्यक।)",
            submit: "जमा करें",
            cancel: "रद्द करें",
            submitting: "जमा हो रहा...",
            submitted: "जमा हो गया!",
            openInWarpcast: "जमा करने के लिए Warpcast में खोलें।",
            playFirst: "स्कोर के लिए पहले एक गेम खेलें।"
        },
        lang: {
            english: "🇺🇸 English",
            hindi: "🇮🇳 हिंदी",
            russian: "🇷🇺 Русский"
        }
    };

    var ruFallback = {
        menu: {
            title: "РАЗРУШИТЕЛЬ БАЗ",
            welcome: "Добро пожаловать, Командир! Защити базу от инопланетных захватчиков. Собирай алмазы и улучшай корабль.",
            goodLuck: "Удачи! 🌟",
            start: "СТАРТ",
            howToPlay: "Как играть",
            language: "Язык 🌐",
            resetProgress: "Сбросить прогресс",
            leaderboard: "Таблица лидеров"
        },
        instructions: {
            title: "КАК ИГРАТЬ",
            body: "УПРАВЛЕНИЕ:\n← или A/D - Влево/вправо\n↑ или W/S - Вверх/вниз\nАвто-стрельба\n⏸ - Пауза\n\nЦЕЛЬ:\n- Уничтожай врагов и базы\n- Собирай алмазы 💎\n- Забирай усиления\n- Улучшай корабль в магазине\n- Побеждай боссов\n\nУдачи, Командир! 🚀"
        },
        ui: {
            stage: "ЭТАП",
            mission: "Миссия",
            wave: "Волна",
            boss: "БОСС",
            score: "Очки",
            level: "Уровень",
            shop: "🛒 МАГАЗИН",
            checkIn: "📅 ЧЕК-ИН",
            checkedIn: "Получено",
            dayStreak: "День {next} →{milestone}",
            dayMilestone: "День {next} →{next7} 🎉",
            signing: "ПОДПИСЬ...",
            confirmedBase: "Подтверждено на Base!",
            transactionFailed: "Ошибка транзакции",
            transactionCancelled: "Отменено",
            insufficientFunds: "Недостаточно средств",
            walletNotReady: "Кошелёк не готов",
            alreadyCheckedIn: "Уже отмечено сегодня",
            sdkNotLoaded: "SDK не загружен"
        },
        shop: {
            title: "🛒 МАГАЗИН",
            tabSpaceships: "🚀 Корабли",
            tabWeapons: "🔫 Оружие",
            tabPowerups: "⚡ Усиления",
            tabUpgrades: "⬆️ Улучшения"
        },
        shopItems: {
            starterShip: { name: "Стартовый корабль", stats: "HP: 100 | Скорость: 300 | Сбалансированный" },
            speedDemon: { name: "Демон скорости", stats: "HP: 90 | Скорость: 390 | +30% скорости" },
            baseDefender: { name: "Защитник базы", stats: "HP: 150 | Скорость: 300 | +50% HP" },
            tank: { name: "Танк", stats: "HP: 200 | Скорость: 240 | Медленный но сильный" },
            lightningStrike: { name: "Молниеносный удар", stats: "HP: 120 | Скорость: 450 | Очень быстрый" },
            legendary: { name: "Легендарный", stats: "HP: 250 | Скорость: 400 | Лучшие статы" },
            fireRate: { name: "Скорострельность", stats: "Уровень {level}/10 | Текущая: {rate}мс" },
            damage: { name: "Урон", stats: "Уровень {level}/10 | Текущий: {damage}" },
            multiShot2: { name: "Мульти-выстрел x2", stats: "2 пули одновременно" },
            multiShot3: { name: "Мульти-выстрел x3", stats: "3 пули одновременно" },
            multiShot5: { name: "Мульти-выстрел x5", stats: "5 пуль одновременно" },
            laserBeam: { name: "Лазерный луч", stats: "Непрерывная атака" },
            shieldGen: { name: "Генератор щита", stats: "Поглощает 5 ударов" },
            smartBomb: { name: "Умная бомба", stats: "Убирает всех врагов" },
            coinMagnet: { name: "Магнит монет", stats: "Авто-сбор монет" },
            score2x: { name: "2x множитель очков", stats: "2x очков на 60 сек" },
            extraLife: { name: "Доп. жизнь", stats: "+1 продолжение" },
            maxHP: { name: "Макс HP +10", stats: "Увеличить здоровье на 10" },
            hpRegen: { name: "Регенерация HP", stats: "Лечение 1 HP/сек" },
            fasterMovement: { name: "Быстрое движение", stats: "+20% к скорости" },
            owned: "КУПЛЕНО",
            buy: "КУПИТЬ",
            vibrationToggle: "Вибрация",
            vibrationSupported: "Тактильная обратная связь",
            vibrationNotSupported: "Не поддерживается на этом устройстве",
            enabled: "Вкл",
            disabled: "Выкл"
        },
        pause: {
            title: "⏸️ ПАУЗА",
            resume: "Продолжить",
            mainMenu: "Главное меню",
            resetGame: "Сбросить игру",
            exitGame: "Выход"
        },
        resetConfirm: {
            title: "Сбросить прогресс?",
            message: "Будет очищена валюта, покупки, счёт и все сохранённые данные. Нельзя отменить.",
            cancel: "Отмена",
            reset: "Сбросить"
        },
        gameover: {
            title: "💥 ИГРА ОКОНЧЕНА",
            restart: "Рестарт",
            finalScore: "Финальный счёт",
            stageReached: "Достигнут этап",
            level: "Уровень"
        },
        leaderboard: {
            title: "🏆 ТАБЛИЦА ЛИДЕРОВ",
            submitMyScore: "Отправить результат",
            refresh: "Обновить",
            globalStatus: "Глобальная таблица (on-chain)",
            personalBest: "Локальный рекорд",
            loading: "Загрузка...",
            playToSetBest: "Сыграйте, чтобы установить рекорд.",
            submitNewHighTitle: "🏆 Новый рекорд!",
            submitNewHighMessage: "Отправить в таблицу лидеров? (Требуется транзакция кошелька.)",
            submit: "Отправить",
            cancel: "Отмена",
            submitting: "Отправка...",
            submitted: "Отправлено!",
            openInWarpcast: "Откройте в Warpcast для отправки.",
            playFirst: "Сначала сыграйте, чтобы был счёт."
        },
        lang: {
            english: "🇺🇸 English",
            hindi: "🇮🇳 हिंदी",
            russian: "🇷🇺 Русский"
        }
    };

    // Init: load current locale then expose API and refresh once
    loadLocale(currentLang);
    if (currentLang === 'en') { strings = JSON.parse(JSON.stringify(enFallback)); if (typeof global !== 'undefined') global.__i18nStrings = strings; }
    refreshAll();

    global.getText = getText;
    global.setLang = setLang;
    global.getLang = getLang;
    global.refreshI18n = refreshAll;
    if (typeof global !== 'undefined') global.__i18nStrings = strings;
})(typeof window !== 'undefined' ? window : this);
