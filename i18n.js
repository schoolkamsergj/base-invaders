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
        if (lang !== 'en' && lang !== 'hi' && lang !== 'ru' && lang !== 'uk' && lang !== 'tg' && lang !== 'id' && lang !== 'vi' && lang !== 'pt' && lang !== 'fr' && lang !== 'de' && lang !== 'zh') lang = DEFAULT_LANG;
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
        if (lang === 'uk') {
            try {
                strings = typeof ukFallback !== 'undefined' && ukFallback !== null
                    ? JSON.parse(JSON.stringify(ukFallback))
                    : JSON.parse(JSON.stringify(enFallback));
                if (typeof global !== 'undefined') global.__i18nStrings = strings;
            } catch (e) {
                strings = JSON.parse(JSON.stringify(enFallback));
                if (typeof global !== 'undefined') global.__i18nStrings = strings;
            }
            return;
        }
        if (lang === 'tg') {
            try {
                strings = JSON.parse(JSON.stringify(tgFallback));
                if (typeof global !== 'undefined') global.__i18nStrings = strings;
            } catch (e) {
                strings = JSON.parse(JSON.stringify(enFallback));
                if (typeof global !== 'undefined') global.__i18nStrings = strings;
            }
            return;
        }
        if (lang === 'id') {
            try {
                strings = JSON.parse(JSON.stringify(idFallback));
                if (typeof global !== 'undefined') global.__i18nStrings = strings;
            } catch (e) {
                strings = JSON.parse(JSON.stringify(enFallback));
                if (typeof global !== 'undefined') global.__i18nStrings = strings;
            }
            return;
        }
        if (lang === 'vi') {
            try {
                strings = JSON.parse(JSON.stringify(viFallback));
                if (typeof global !== 'undefined') global.__i18nStrings = strings;
            } catch (e) {
                strings = JSON.parse(JSON.stringify(enFallback));
                if (typeof global !== 'undefined') global.__i18nStrings = strings;
            }
            return;
        }
        if (lang === 'pt') {
            try {
                strings = JSON.parse(JSON.stringify(ptFallback));
                if (typeof global !== 'undefined') global.__i18nStrings = strings;
            } catch (e) {
                strings = JSON.parse(JSON.stringify(enFallback));
                if (typeof global !== 'undefined') global.__i18nStrings = strings;
            }
            return;
        }
        if (lang === 'fr') {
            try {
                strings = JSON.parse(JSON.stringify(frFallback));
                if (typeof global !== 'undefined') global.__i18nStrings = strings;
            } catch (e) {
                strings = JSON.parse(JSON.stringify(enFallback));
                if (typeof global !== 'undefined') global.__i18nStrings = strings;
            }
            return;
        }
        if (lang === 'de') {
            try {
                strings = JSON.parse(JSON.stringify(deFallback));
                if (typeof global !== 'undefined') global.__i18nStrings = strings;
            } catch (e) {
                strings = JSON.parse(JSON.stringify(enFallback));
                if (typeof global !== 'undefined') global.__i18nStrings = strings;
            }
            return;
        }
        if (lang === 'zh') {
            try {
                strings = JSON.parse(JSON.stringify(zhFallback));
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
            "welcome": "Welcome, Commander! 🚀\n\nDefend the Base from alien invaders.\nCollect diamonds and upgrade your ship.",
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
            "russian": "🇷🇺 Русский",
            "ukrainian": "🇺🇦 Українська",
            "tagalog": "🇵🇭 Tagalog",
            "indonesian": "🇮🇩 Indonesian",
            "vietnamese": "🇻🇳 Tiếng Việt",
            "portuguese": "🇧🇷 Português",
            "french": "🇫🇷 Français",
            "german": "🇩🇪 Deutsch",
            "chinese": "🇨🇳 简体中文"
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
            russian: "🇷🇺 Русский",
            ukrainian: "🇺🇦 Українська",
            tagalog: "🇵🇭 Tagalog",
            indonesian: "🇮🇩 Indonesian",
            vietnamese: "🇻🇳 Tiếng Việt",
            portuguese: "🇧🇷 Português",
            french: "🇫🇷 Français",
            german: "🇩🇪 Deutsch",
            chinese: "🇨🇳 简体中文"
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
            russian: "🇷🇺 Русский",
            ukrainian: "🇺🇦 Українська",
            tagalog: "🇵🇭 Tagalog",
            indonesian: "🇮🇩 Indonesian",
            vietnamese: "🇻🇳 Tiếng Việt",
            portuguese: "🇧🇷 Português",
            french: "🇫🇷 Français",
            german: "🇩🇪 Deutsch",
            chinese: "🇨🇳 简体中文"
        }
    };

    var ukFallback = {
        menu: {
            title: "ЗНИЩУВАЧ БАЗ",
            welcome: "Ласкаво просимо, Командире! 🚀\n\nЗахисти базу від інопланетних загарбників.\nЗбирай діаманти та покращуй корабель.",
            goodLuck: "Удачі! 🌟",
            start: "СТАРТ",
            howToPlay: "Як грати",
            language: "Мова 🌐",
            resetProgress: "Скинути прогрес",
            leaderboard: "Таблиця лідерів"
        },
        instructions: {
            title: "📖 ЯК ГРАТИ",
            body: "🎮 КЕРУВАННЯ:\n← або A/D - Вліво/вправо\n↑ або W/S - Вгору/вниз\nSPACE - Авто-стрільба\nESC - Пауза\n\n🎯 МЕТА:\n- Знищуй ворогів та бази\n- Збирай діаманти 💎\n- Підбирай посилення ⚡\n- Покращуй корабель у магазині\n- Перемагай босів\n\n👾 ВОРОГИ\n🔴 Червоні сфери - Слабкі (швидкі)\n🔷 Гексагони - Середні (показує HP)\n🟦 Сині куби - БАЗИ (знищуй їх!)\n\n🛒 МАГАЗИН\n- Купуй кораблі, зброю, покращення\n\nУдачі, Командире! 🚀"
        },
        ui: {
            stage: "ЕТАП",
            mission: "Місія",
            wave: "Хвиля",
            boss: "БОС ⚔️",
            score: "Очки",
            level: "Рівень",
            shop: "🛒 МАГАЗИН",
            checkIn: "📅 ЧЕК-ІН",
            checkedIn: "Отримано",
            dayStreak: "День {next} →{milestone}",
            dayMilestone: "День {next} →{next7} 🎉",
            signing: "⛓️ ПІДПИС...",
            confirmedBase: "⛓️ Підтверджено на Base!",
            transactionFailed: "Помилка транзакції",
            transactionCancelled: "Скасовано",
            insufficientFunds: "Недостатньо коштів",
            walletNotReady: "Гаманець не готовий, спробуйте ще раз",
            alreadyCheckedIn: "Вже відзначено сьогодні",
            sdkNotLoaded: "SDK не завантажено"
        },
        shop: {
            title: "🛒 МАГАЗИН",
            tabSpaceships: "🚀 Кораблі",
            tabWeapons: "🔫 Зброя",
            tabPowerups: "⚡ Посилення",
            tabUpgrades: "⬆️ Покращення"
        },
        shopItems: {
            starterShip: { name: "Стартовий корабель", stats: "HP: 100 | Швидкість: 300 | Збалансований" },
            speedDemon: { name: "Демон швидкості", stats: "HP: 90 | Швидкість: 390 | +30% швидкості" },
            baseDefender: { name: "Захисник бази", stats: "HP: 150 | Швидкість: 300 | +50% HP" },
            tank: { name: "Танк", stats: "HP: 200 | Швидкість: 240 | Повільний але міцний" },
            lightningStrike: { name: "Блискавичний удар", stats: "HP: 120 | Швидкість: 450 | Дуже швидкий" },
            legendary: { name: "Легендарний", stats: "HP: 250 | Швидкість: 400 | Найкращі стати" },
            fireRate: { name: "Швидкострільність", stats: "Рівень {level}/10 | Поточна: {rate}мс" },
            damage: { name: "Урон", stats: "Рівень {level}/10 | Поточний: {damage}" },
            multiShot2: { name: "Мульти-постріл x2", stats: "2 кулі одночасно" },
            multiShot3: { name: "Мульти-постріл x3", stats: "3 кулі одночасно" },
            multiShot5: { name: "Мульти-постріл x5", stats: "5 куль одночасно" },
            laserBeam: { name: "Лазерний промінь", stats: "Безперервна атака" },
            shieldGen: { name: "Генератор щита", stats: "Поглинає 5 ударів" },
            smartBomb: { name: "Розумна бомба", stats: "Знищує всіх ворогів" },
            coinMagnet: { name: "Магніт монет", stats: "Авто-збір монет" },
            score2x: { name: "2x множник очок", stats: "2x очок протягом 60 сек" },
            extraLife: { name: "Додаткове життя", stats: "+1 продовження" },
            maxHP: { name: "Макс HP +10", stats: "Збільшити здоров'я на 10" },
            hpRegen: { name: "Регенерація HP", stats: "Лікування 1 HP/сек" },
            fasterMovement: { name: "Швидший рух", stats: "+20% до швидкості" },
            owned: "КУПЛЕНО",
            buy: "КУПИТИ",
            vibrationToggle: "Тактильна вібрація",
            vibrationSupported: "Увімкнено",
            vibrationNotSupported: "Не підтримується на цьому пристрої",
            enabled: "Увімкнено",
            disabled: "Вимкнено"
        },
        pause: {
            title: "⏸️ ПАУЗА",
            resume: "Продовжити",
            mainMenu: "Головне меню",
            resetGame: "Скинути гру",
            exitGame: "Вихід"
        },
        resetConfirm: {
            title: "Скинути прогрес?",
            message: "Це очистить валюту, покупки, рахунок та всі збережені дані. Неможливо скасувати.",
            cancel: "Скасувати",
            reset: "Скинути"
        },
        gameover: {
            title: "💥 ГРА ЗАКІНЧЕНА",
            restart: "Рестарт",
            finalScore: "Фінальний рахунок",
            stageReached: "Досягнутий етап",
            level: "Рівень"
        },
        leaderboard: {
            title: "🏆 ТАБЛИЦЯ ЛІДЕРІВ",
            submitMyScore: "Надіслати результат",
            refresh: "Оновити",
            globalStatus: "Глобальна таблиця (он-чейн)",
            personalBest: "Особистий рекорд (локально)",
            loading: "Завантаження...",
            playToSetBest: "Зіграйте, щоб встановити рекорд.",
            submitNewHighTitle: "🏆 Новий рекорд!",
            submitNewHighMessage: "Надіслати до глобальної таблиці? Потрібна транзакція гаманця.",
            submit: "Надіслати",
            cancel: "Скасувати",
            submitting: "Надсилання...",
            submitted: "Надіслано!",
            openInWarpcast: "Відкрийте у Warpcast для надсилання.",
            playFirst: "Спочатку зіграйте гру."
        },
        lang: {
            english: "🇺🇸 English",
            hindi: "🇮🇳 हिंदी",
            russian: "🇷🇺 Русский",
            ukrainian: "🇺🇦 Українська",
            tagalog: "🇵🇭 Tagalog",
            indonesian: "🇮🇩 Indonesian",
            vietnamese: "🇻🇳 Tiếng Việt",
            portuguese: "🇧🇷 Português",
            french: "🇫🇷 Français",
            german: "🇩🇪 Deutsch",
            chinese: "🇨🇳 简体中文"
        }
    };

    var tgFallback = {
        menu: {
            title: "TAGAPAGSIRA NG BASE",
            welcome: "Maligayang pagdating, Commander! Protektahan ang base mula sa mga alien invaders. Mangolekta ng mga brilyante at i-upgrade ang iyong spaceship.",
            goodLuck: "Good luck! 🌟",
            start: "SIMULAN",
            howToPlay: "Paano Laruin",
            language: "Wika 🌐",
            resetProgress: "I-reset ang Progress",
            leaderboard: "Leaderboard"
        },
        instructions: {
            title: "PAANO LARUIN",
            body: "CONTROLS:\n← o A/D - Kaliwa/kanan\n↑ o W/S - Taas/baba\nAuto-shoot\n⏸ - Pause\n\nLAYUNIN:\n- Sirain ang mga kalaban at base\n- Kolektahin ang mga brilyante 💎\n- Kunin ang power-ups\n- I-upgrade ang spaceship sa tindahan\n- Talunin ang mga boss\n\nGood luck, Commander! 🚀"
        },
        ui: {
            stage: "YUGTO",
            mission: "Misyon",
            wave: "Alon",
            boss: "BOSS",
            score: "Puntos",
            level: "Antas",
            shop: "TINDAHAN",
            checkIn: "CHECK-IN",
            checkedIn: "Nai-check in",
            dayStreak: "Araw {next} (hanggang {milestone})",
            dayMilestone: "Araw {next} ({next7}/7)",
            signing: "PUMIPIRMA...",
            confirmedBase: "Nakumpirma sa Base!",
            transactionFailed: "Nabigo ang transaksyon",
            transactionCancelled: "Kinansela",
            insufficientFunds: "Kulang ang pondo",
            walletNotReady: "Hindi handa ang wallet",
            tryAgain: "Subukan muli",
            alreadyCheckedIn: "Nai-check in na ngayong araw",
            sdkNotLoaded: "Hindi na-load ang SDK"
        },
        shop: {
            title: "TINDAHAN",
            tabSpaceships: "Mga Spaceship",
            tabWeapons: "Mga Sandata",
            tabPowerups: "Mga Power-up",
            tabUpgrades: "Mga Upgrade"
        },
        shopItems: {
            starterShip: { name: "Starter Ship", stats: "HP: 100 | Bilis: 300 | Balanse" },
            speedDemon: { name: "Speed Demon", stats: "HP: 90 | Bilis: 390 | +30% bilis" },
            baseDefender: { name: "Tagapagtanggol ng Base", stats: "HP: 150 | Bilis: 300 | +50% HP" },
            tank: { name: "Tank", stats: "HP: 200 | Bilis: 240 | Mabagal pero malakas" },
            lightningStrike: { name: "Kidlat na Atake", stats: "HP: 120 | Bilis: 450 | Napakabilis" },
            legendary: { name: "Legendary", stats: "HP: 250 | Bilis: 400 | Pinakamahusay" },
            fireRate: { name: "Bilis ng Putok", stats: "Antas {level}/10 | Kasalukuyan: {rate}ms" },
            damage: { name: "Pinsala", stats: "Antas {level}/10 | Kasalukuyan: {damage}" },
            multiShot2: { name: "Multi-Shot x2", stats: "2 bala nang sabay" },
            multiShot3: { name: "Multi-Shot x3", stats: "3 bala nang sabay" },
            multiShot5: { name: "Multi-Shot x5", stats: "5 bala nang sabay" },
            laserBeam: { name: "Laser Beam", stats: "Tuloy-tuloy na atake" },
            shieldGen: { name: "Shield Generator", stats: "Sumasipsip ng 5 tama" },
            smartBomb: { name: "Smart Bomb", stats: "Lilinisin ang lahat ng kalaban" },
            coinMagnet: { name: "Bakal ng Barya", stats: "Auto-kolekta ng barya" },
            score2x: { name: "2x Score Multiplier", stats: "2x puntos sa loob ng 60 segundo" },
            extraLife: { name: "Dagdag Buhay", stats: "+1 pagpapatuloy" },
            maxHP: { name: "Max HP +10", stats: "Dagdagan ang kalusugan ng 10" },
            hpRegen: { name: "HP Regeneration", stats: "Gumaling ng 1 HP/segundo" },
            fasterMovement: { name: "Mas Mabilis na Galaw", stats: "+20% sa bilis" },
            owned: "PAGMAMAY-ARI",
            buy: "BUMILI",
            vibrationToggle: "Haptic Vibration",
            vibrationSupported: "Naka-enable",
            vibrationNotSupported: "Hindi suportado sa device na ito",
            enabled: "Naka-enable",
            disabled: "Naka-disable"
        },
        pause: {
            title: "NAKA-PAUSE",
            resume: "Magpatuloy",
            mainMenu: "Pangunahing Menu",
            resetGame: "I-reset ang Laro",
            exitGame: "Lumabas"
        },
        resetConfirm: {
            title: "I-reset ang progress?",
            message: "Lilinisin nito ang pera, mga binili, puntos at lahat ng naka-save na data. Hindi maaaring bawiin.",
            cancel: "Kanselahin",
            reset: "I-reset"
        },
        gameover: {
            title: "TAPOS NA ANG LARO",
            restart: "I-restart",
            finalScore: "Huling Puntos",
            stageReached: "Naabot na Yugto",
            level: "Antas"
        },
        leaderboard: {
            title: "LEADERBOARD",
            submitMyScore: "Isumite ang puntos",
            refresh: "I-refresh",
            globalStatus: "Global leaderboard (on-chain)",
            personalBest: "Personal best (lokal)",
            loading: "Naglo-load...",
            playToSetBest: "Maglaro para magtakda ng record.",
            submitNewHighTitle: "Bagong record!",
            submitNewHighMessage: "Isumite sa global leaderboard? Kailangan ng wallet transaction.",
            submit: "Isumite",
            cancel: "Kanselahin",
            submitting: "Isinusumite...",
            submitted: "Naisumite na!",
            openInWarpcast: "Buksan sa Warpcast para magsumite.",
            playFirst: "Maglaro muna ng laro."
        },
        lang: {
            english: "🇺🇸 English",
            hindi: "🇮🇳 हिंदी",
            russian: "🇷🇺 Русский",
            ukrainian: "🇺🇦 Українська",
            tagalog: "🇵🇭 Tagalog",
            indonesian: "🇮🇩 Indonesian",
            vietnamese: "🇻🇳 Tiếng Việt",
            portuguese: "🇧🇷 Português",
            french: "🇫🇷 Français",
            german: "🇩🇪 Deutsch",
            chinese: "🇨🇳 简体中文"
        }
    };

    var idFallback = {
        menu: {
            title: "PENGHANCUR BASIS",
            welcome: "Selamat datang, Komandan! Lindungi basis dari penyerang alien. Kumpulkan berlian dan tingkatkan pesawat Anda.",
            goodLuck: "Semoga beruntung! 🌟",
            start: "MULAI",
            howToPlay: "Cara Bermain",
            language: "Bahasa 🌐",
            resetProgress: "Reset Progres",
            leaderboard: "Papan Peringkat"
        },
        instructions: {
            title: "CARA BERMAIN",
            body: "KONTROL:\n← atau A/D - Kiri/kanan\n↑ atau W/S - Atas/bawah\nTembak otomatis\n⏸ - Jeda\n\nTUJUAN:\n- Hancurkan musuh dan basis\n- Kumpulkan berlian 💎\n- Ambil power-up\n- Tingkatkan pesawat di toko\n- Kalahkan boss\n\nSemoga beruntung, Komandan! 🚀"
        },
        ui: {
            stage: "TAHAP",
            mission: "Misi",
            wave: "Gelombang",
            boss: "BOS",
            score: "Skor",
            level: "Level",
            shop: "TOKO",
            checkIn: "CHECK-IN",
            checkedIn: "Sudah check-in",
            dayStreak: "Hari {next} (ke {milestone})",
            dayMilestone: "Hari {next} ({next7}/7)",
            signing: "MENANDATANGANI...",
            confirmedBase: "Dikonfirmasi di Base!",
            transactionFailed: "Transaksi gagal",
            transactionCancelled: "Dibatalkan",
            insufficientFunds: "Dana tidak cukup",
            walletNotReady: "Dompet belum siap",
            tryAgain: "Coba lagi",
            alreadyCheckedIn: "Sudah check-in hari ini",
            sdkNotLoaded: "SDK tidak dimuat"
        },
        shop: {
            title: "TOKO",
            tabSpaceships: "Pesawat Luar Angkasa",
            tabWeapons: "Senjata",
            tabPowerups: "Power-up",
            tabUpgrades: "Peningkatan"
        },
        shopItems: {
            starterShip: { name: "Pesawat Pemula", stats: "HP: 100 | Kecepatan: 300 | Seimbang" },
            speedDemon: { name: "Iblis Kecepatan", stats: "HP: 90 | Kecepatan: 390 | +30% kecepatan" },
            baseDefender: { name: "Pembela Basis", stats: "HP: 150 | Kecepatan: 300 | +50% HP" },
            tank: { name: "Tank", stats: "HP: 200 | Kecepatan: 240 | Lambat tapi kuat" },
            lightningStrike: { name: "Serangan Petir", stats: "HP: 120 | Kecepatan: 450 | Sangat cepat" },
            legendary: { name: "Legendaris", stats: "HP: 250 | Kecepatan: 400 | Stat terbaik" },
            fireRate: { name: "Kecepatan Tembak", stats: "Level {level}/10 | Saat ini: {rate}ms" },
            damage: { name: "Kerusakan", stats: "Level {level}/10 | Saat ini: {damage}" },
            multiShot2: { name: "Multi-Shot x2", stats: "Tembak 2 peluru sekaligus" },
            multiShot3: { name: "Multi-Shot x3", stats: "Tembak 3 peluru sekaligus" },
            multiShot5: { name: "Multi-Shot x5", stats: "Tembak 5 peluru sekaligus" },
            laserBeam: { name: "Sinar Laser", stats: "Serangan berkelanjutan" },
            shieldGen: { name: "Generator Perisai", stats: "Serap 5 pukulan" },
            smartBomb: { name: "Bom Pintar", stats: "Bersihkan semua musuh" },
            coinMagnet: { name: "Magnet Koin", stats: "Kumpulkan koin otomatis" },
            score2x: { name: "Pengganda Skor 2x", stats: "2x skor selama 60 detik" },
            extraLife: { name: "Nyawa Ekstra", stats: "+1 lanjutan" },
            maxHP: { name: "HP Maks +10", stats: "Tambah kesehatan sebanyak 10" },
            hpRegen: { name: "Regenerasi HP", stats: "Pulih 1 HP/detik" },
            fasterMovement: { name: "Gerakan Lebih Cepat", stats: "+20% kecepatan" },
            owned: "DIMILIKI",
            buy: "BELI",
            vibrationToggle: "Getaran Haptik",
            vibrationSupported: "Aktif",
            vibrationNotSupported: "Tidak didukung di perangkat ini",
            enabled: "Aktif",
            disabled: "Nonaktif"
        },
        pause: {
            title: "JEDA",
            resume: "Lanjutkan",
            mainMenu: "Menu Utama",
            resetGame: "Reset Permainan",
            exitGame: "Keluar"
        },
        resetConfirm: {
            title: "Reset progres?",
            message: "Ini akan menghapus mata uang, pembelian, skor, dan semua data tersimpan. Tidak dapat dibatalkan.",
            cancel: "Batal",
            reset: "Reset"
        },
        gameover: {
            title: "PERMAINAN BERAKHIR",
            restart: "Mulai Ulang",
            finalScore: "Skor Akhir",
            stageReached: "Tahap Tercapai",
            level: "Level"
        },
        leaderboard: {
            title: "PAPAN PERINGKAT",
            submitMyScore: "Kirim skor saya",
            refresh: "Segarkan",
            globalStatus: "Papan peringkat global (on-chain)",
            personalBest: "Rekor pribadi (lokal)",
            loading: "Memuat...",
            playToSetBest: "Mainkan untuk mencetak rekor.",
            submitNewHighTitle: "Rekor baru!",
            submitNewHighMessage: "Kirim ke papan peringkat global? Memerlukan transaksi dompet.",
            submit: "Kirim",
            cancel: "Batal",
            submitting: "Mengirim...",
            submitted: "Terkirim!",
            openInWarpcast: "Buka di Warpcast untuk mengirim.",
            playFirst: "Mainkan game terlebih dahulu."
        },
        lang: {
            english: "🇺🇸 English",
            hindi: "🇮🇳 हिंदी",
            russian: "🇷🇺 Русский",
            ukrainian: "🇺🇦 Українська",
            tagalog: "🇵🇭 Tagalog",
            indonesian: "🇮🇩 Indonesian",
            vietnamese: "🇻🇳 Tiếng Việt",
            portuguese: "🇧🇷 Português",
            french: "🇫🇷 Français",
            german: "🇩🇪 Deutsch",
            chinese: "🇨🇳 简体中文"
        }
    };

    var viFallback = {
        menu: {
            title: "KẺ PHÁ HỦY CĂN CỨ",
            welcome: "Chào mừng, Chỉ huy! Bảo vệ căn cứ khỏi quân xâm lược ngoài hành tinh. Thu thập kim cương và nâng cấp tàu vũ trụ của bạn.",
            goodLuck: "Chúc may mắn! 🌟",
            start: "BẮT ĐẦU",
            howToPlay: "Cách Chơi",
            language: "Ngôn ngữ 🌐",
            resetProgress: "Đặt lại Tiến trình",
            leaderboard: "Bảng Xếp hạng"
        },
        instructions: {
            title: "CÁCH CHƠI",
            body: "ĐIỀU KHIỂN:\n← hoặc A/D - Trái/phải\n↑ hoặc W/S - Lên/xuống\nBắn tự động\n⏸ - Tạm dừng\n\nMỤC TIÊU:\n- Tiêu diệt kẻ địch và căn cứ\n- Thu thập kim cương 💎\n- Nhặt power-up\n- Nâng cấp tàu trong cửa hàng\n- Đánh bại các boss\n\nChúc may mắn, Chỉ huy! 🚀"
        },
        ui: {
            stage: "GIAI ĐOẠN",
            mission: "Nhiệm vụ",
            wave: "Làn sóng",
            boss: "TRÙM",
            score: "Điểm",
            level: "Cấp độ",
            shop: "CỬA HÀNG",
            checkIn: "CHECK-IN",
            checkedIn: "Đã check-in",
            dayStreak: "Ngày {next} (đến {milestone})",
            dayMilestone: "Ngày {next} ({next7}/7)",
            signing: "ĐANG KÝ...",
            confirmedBase: "Đã xác nhận trên Base!",
            transactionFailed: "Giao dịch thất bại",
            transactionCancelled: "Đã hủy",
            insufficientFunds: "Không đủ tiền",
            walletNotReady: "Ví chưa sẵn sàng",
            tryAgain: "Thử lại",
            alreadyCheckedIn: "Đã check-in hôm nay",
            sdkNotLoaded: "SDK chưa tải"
        },
        shop: {
            title: "CỬA HÀNG",
            tabSpaceships: "Tàu Vũ trụ",
            tabWeapons: "Vũ khí",
            tabPowerups: "Cường hóa",
            tabUpgrades: "Nâng cấp"
        },
        shopItems: {
            starterShip: { name: "Tàu Khởi đầu", stats: "HP: 100 | Tốc độ: 300 | Cân bằng" },
            speedDemon: { name: "Ác Quỷ Tốc độ", stats: "HP: 90 | Tốc độ: 390 | +30% tốc độ" },
            baseDefender: { name: "Người Bảo vệ Căn cứ", stats: "HP: 150 | Tốc độ: 300 | +50% HP" },
            tank: { name: "Xe Tăng", stats: "HP: 200 | Tốc độ: 240 | Chậm nhưng mạnh" },
            lightningStrike: { name: "Tấn Công Sét", stats: "HP: 120 | Tốc độ: 450 | Rất nhanh" },
            legendary: { name: "Huyền Thoại", stats: "HP: 250 | Tốc độ: 400 | Chỉ số tốt nhất" },
            fireRate: { name: "Tốc độ Bắn", stats: "Cấp {level}/10 | Hiện tại: {rate}ms" },
            damage: { name: "Sát thương", stats: "Cấp {level}/10 | Hiện tại: {damage}" },
            multiShot2: { name: "Bắn Nhiều x2", stats: "Bắn 2 viên đạn cùng lúc" },
            multiShot3: { name: "Bắn Nhiều x3", stats: "Bắn 3 viên đạn cùng lúc" },
            multiShot5: { name: "Bắn Nhiều x5", stats: "Bắn 5 viên đạn cùng lúc" },
            laserBeam: { name: "Tia Laser", stats: "Tấn công liên tục" },
            shieldGen: { name: "Máy Phát Khiên", stats: "Hấp thụ 5 đòn" },
            smartBomb: { name: "Bom Thông minh", stats: "Xóa sạch tất cả kẻ địch" },
            coinMagnet: { name: "Nam Châm Tiền xu", stats: "Tự động thu thập tiền" },
            score2x: { name: "Nhân Điểm 2x", stats: "2x điểm trong 60 giây" },
            extraLife: { name: "Mạng Thêm", stats: "+1 tiếp tục" },
            maxHP: { name: "HP Tối đa +10", stats: "Tăng máu lên 10" },
            hpRegen: { name: "Hồi Phục HP", stats: "Hồi 1 HP/giây" },
            fasterMovement: { name: "Di Chuyển Nhanh hơn", stats: "+20% tốc độ" },
            owned: "ĐÃ SỞ HỮU",
            buy: "MUA",
            vibrationToggle: "Rung Xúc giác",
            vibrationSupported: "Bật",
            vibrationNotSupported: "Không hỗ trợ trên thiết bị này",
            enabled: "Bật",
            disabled: "Tắt"
        },
        pause: {
            title: "TẠM DỪNG",
            resume: "Tiếp tục",
            mainMenu: "Menu Chính",
            resetGame: "Đặt lại Trò chơi",
            exitGame: "Thoát"
        },
        resetConfirm: {
            title: "Đặt lại tiến trình?",
            message: "Điều này sẽ xóa tiền tệ, mua sắm, điểm số và tất cả dữ liệu đã lưu. Không thể hoàn tác.",
            cancel: "Hủy",
            reset: "Đặt lại"
        },
        gameover: {
            title: "KẾT THÚC TRÒ CHƠI",
            restart: "Chơi lại",
            finalScore: "Điểm Cuối cùng",
            stageReached: "Giai đoạn Đạt được",
            level: "Cấp độ"
        },
        leaderboard: {
            title: "BẢNG XẾP HẠNG",
            submitMyScore: "Gửi điểm của tôi",
            refresh: "Làm mới",
            globalStatus: "Bảng xếp hạng toàn cầu (on-chain)",
            personalBest: "Kỷ lục cá nhân (cục bộ)",
            loading: "Đang tải...",
            playToSetBest: "Chơi để lập kỷ lục.",
            submitNewHighTitle: "Kỷ lục mới!",
            submitNewHighMessage: "Gửi lên bảng xếp hạng toàn cầu? Cần giao dịch ví.",
            submit: "Gửi",
            cancel: "Hủy",
            submitting: "Đang gửi...",
            submitted: "Đã gửi!",
            openInWarpcast: "Mở trong Warpcast để gửi.",
            playFirst: "Chơi trò chơi trước."
        },
        lang: {
            english: "🇺🇸 English",
            hindi: "🇮🇳 हिंदी",
            russian: "🇷🇺 Русский",
            ukrainian: "🇺🇦 Українська",
            tagalog: "🇵🇭 Tagalog",
            indonesian: "🇮🇩 Indonesian",
            vietnamese: "🇻🇳 Tiếng Việt",
            portuguese: "🇧🇷 Português",
            french: "🇫🇷 Français",
            german: "🇩🇪 Deutsch",
            chinese: "🇨🇳 简体中文"
        }
    };

    var ptFallback = {
        menu: {
            title: "DESTRUIDOR DE BASE",
            welcome: "Bem-vindo, Comandante! Proteja a base dos invasores alienígenas. Colete diamantes e melhore sua nave.",
            goodLuck: "Boa sorte! 🌟",
            start: "COMEÇAR",
            howToPlay: "Como Jogar",
            language: "Idioma 🌐",
            resetProgress: "Resetar Progresso",
            leaderboard: "Classificação"
        },
        instructions: {
            title: "COMO JOGAR",
            body: "CONTROLES:\n← ou A/D - Esquerda/direita\n↑ ou W/S - Cima/baixo\nDisparo automático\n⏸ - Pausar\n\nOBJETIVO:\n- Destrua inimigos e bases\n- Colete diamantes 💎\n- Pegue power-ups\n- Melhore sua nave na loja\n- Derrote os chefes\n\nBoa sorte, Comandante! 🚀"
        },
        ui: {
            stage: "ESTÁGIO",
            mission: "Missão",
            wave: "Onda",
            boss: "CHEFE",
            score: "Pontuação",
            level: "Nível",
            shop: "LOJA",
            checkIn: "CHECK-IN",
            checkedIn: "Check-in feito",
            dayStreak: "Dia {next} (até {milestone})",
            dayMilestone: "Dia {next} ({next7}/7)",
            signing: "ASSINANDO...",
            confirmedBase: "Confirmado na Base!",
            transactionFailed: "Transação falhou",
            transactionCancelled: "Cancelado",
            insufficientFunds: "Fundos insuficientes",
            walletNotReady: "Carteira não pronta",
            tryAgain: "Tente novamente",
            alreadyCheckedIn: "Já fez check-in hoje",
            sdkNotLoaded: "SDK não carregado"
        },
        shop: {
            title: "LOJA",
            tabSpaceships: "Naves Espaciais",
            tabWeapons: "Armas",
            tabPowerups: "Power-ups",
            tabUpgrades: "Melhorias"
        },
        shopItems: {
            starterShip: { name: "Nave Inicial", stats: "HP: 100 | Velocidade: 300 | Equilibrada" },
            speedDemon: { name: "Demônio da Velocidade", stats: "HP: 90 | Velocidade: 390 | +30% velocidade" },
            baseDefender: { name: "Defensor da Base", stats: "HP: 150 | Velocidade: 300 | +50% HP" },
            tank: { name: "Tanque", stats: "HP: 200 | Velocidade: 240 | Lento mas forte" },
            lightningStrike: { name: "Ataque Relâmpago", stats: "HP: 120 | Velocidade: 450 | Muito rápida" },
            legendary: { name: "Lendária", stats: "HP: 250 | Velocidade: 400 | Melhores stats" },
            fireRate: { name: "Taxa de Disparo", stats: "Nível {level}/10 | Atual: {rate}ms" },
            damage: { name: "Dano", stats: "Nível {level}/10 | Atual: {damage}" },
            multiShot2: { name: "Tiro Múltiplo x2", stats: "Atire 2 balas de uma vez" },
            multiShot3: { name: "Tiro Múltiplo x3", stats: "Atire 3 balas de uma vez" },
            multiShot5: { name: "Tiro Múltiplo x5", stats: "Atire 5 balas de uma vez" },
            laserBeam: { name: "Raio Laser", stats: "Ataque contínuo" },
            shieldGen: { name: "Gerador de Escudo", stats: "Absorve 5 acertos" },
            smartBomb: { name: "Bomba Inteligente", stats: "Limpa todos os inimigos" },
            coinMagnet: { name: "Ímã de Moedas", stats: "Coleta automática de moedas" },
            score2x: { name: "Multiplicador de Pontos 2x", stats: "2x pontos por 60 segundos" },
            extraLife: { name: "Vida Extra", stats: "+1 continuação" },
            maxHP: { name: "HP Máx +10", stats: "Aumenta saúde em 10" },
            hpRegen: { name: "Regeneração de HP", stats: "Cura 1 HP/segundo" },
            fasterMovement: { name: "Movimento Mais Rápido", stats: "+20% velocidade" },
            owned: "POSSUI",
            buy: "COMPRAR",
            vibrationToggle: "Vibração Tátil",
            vibrationSupported: "Ativado",
            vibrationNotSupported: "Não suportado neste dispositivo",
            enabled: "Ativado",
            disabled: "Desativado"
        },
        pause: {
            title: "PAUSADO",
            resume: "Continuar",
            mainMenu: "Menu Principal",
            resetGame: "Resetar Jogo",
            exitGame: "Sair"
        },
        resetConfirm: {
            title: "Resetar progresso?",
            message: "Isso limpará moeda, compras, pontuação e todos os dados salvos. Não pode ser desfeito.",
            cancel: "Cancelar",
            reset: "Resetar"
        },
        gameover: {
            title: "FIM DE JOGO",
            restart: "Reiniciar",
            finalScore: "Pontuação Final",
            stageReached: "Estágio Alcançado",
            level: "Nível"
        },
        leaderboard: {
            title: "CLASSIFICAÇÃO",
            submitMyScore: "Enviar minha pontuação",
            refresh: "Atualizar",
            globalStatus: "Classificação global (on-chain)",
            personalBest: "Melhor pessoal (local)",
            loading: "Carregando...",
            playToSetBest: "Jogue para estabelecer um recorde.",
            submitNewHighTitle: "Novo recorde!",
            submitNewHighMessage: "Enviar para classificação global? Requer transação na carteira.",
            submit: "Enviar",
            cancel: "Cancelar",
            submitting: "Enviando...",
            submitted: "Enviado!",
            openInWarpcast: "Abra no Warpcast para enviar.",
            playFirst: "Jogue primeiro."
        },
        lang: {
            english: "🇺🇸 English",
            hindi: "🇮🇳 हिंदी",
            russian: "🇷🇺 Русский",
            ukrainian: "🇺🇦 Українська",
            tagalog: "🇵🇭 Tagalog",
            indonesian: "🇮🇩 Indonesian",
            vietnamese: "🇻🇳 Tiếng Việt",
            portuguese: "🇧🇷 Português",
            french: "🇫🇷 Français",
            german: "🇩🇪 Deutsch",
            chinese: "🇨🇳 简体中文"
        }
    };

    var frFallback = {
        menu: {
            title: "DESTRUCTEUR DE BASE",
            welcome: "Bienvenue, Commandant ! Protégez la base contre les envahisseurs extraterrestres. Collectez des diamants et améliorez votre vaisseau.",
            goodLuck: "Bonne chance ! 🌟",
            start: "COMMENCER",
            howToPlay: "Comment Jouer",
            language: "Langue 🌐",
            resetProgress: "Réinitialiser la Progression",
            leaderboard: "Classement"
        },
        instructions: {
            title: "COMMENT JOUER",
            body: "CONTRÔLES :\n← ou A/D - Gauche/droite\n↑ ou W/S - Haut/bas\nTir automatique\n⏸ - Pause\n\nOBJECTIF :\n- Détruisez les ennemis et les bases\n- Collectez des diamants 💎\n- Ramassez les power-ups\n- Améliorez votre vaisseau dans la boutique\n- Battez les boss\n\nBonne chance, Commandant ! 🚀"
        },
        ui: {
            stage: "ÉTAPE",
            mission: "Mission",
            wave: "Vague",
            boss: "BOSS",
            score: "Score",
            level: "Niveau",
            shop: "BOUTIQUE",
            checkIn: "CHECK-IN",
            checkedIn: "Enregistré",
            dayStreak: "Jour {next} (jusqu'à {milestone})",
            dayMilestone: "Jour {next} ({next7}/7)",
            signing: "SIGNATURE...",
            confirmedBase: "Confirmé sur Base !",
            transactionFailed: "Échec de la transaction",
            transactionCancelled: "Annulé",
            insufficientFunds: "Fonds insuffisants",
            walletNotReady: "Portefeuille pas prêt",
            tryAgain: "Réessayez",
            alreadyCheckedIn: "Déjà enregistré aujourd'hui",
            sdkNotLoaded: "SDK non chargé"
        },
        shop: {
            title: "BOUTIQUE",
            tabSpaceships: "Vaisseaux",
            tabWeapons: "Armes",
            tabPowerups: "Power-ups",
            tabUpgrades: "Améliorations"
        },
        shopItems: {
            starterShip: { name: "Vaisseau de Départ", stats: "HP : 100 | Vitesse : 300 | Équilibré" },
            speedDemon: { name: "Démon de Vitesse", stats: "HP : 90 | Vitesse : 390 | +30% vitesse" },
            baseDefender: { name: "Défenseur de Base", stats: "HP : 150 | Vitesse : 300 | +50% HP" },
            tank: { name: "Tank", stats: "HP : 200 | Vitesse : 240 | Lent mais fort" },
            lightningStrike: { name: "Frappe Éclair", stats: "HP : 120 | Vitesse : 450 | Très rapide" },
            legendary: { name: "Légendaire", stats: "HP : 250 | Vitesse : 400 | Meilleures stats" },
            fireRate: { name: "Cadence de Tir", stats: "Niveau {level}/10 | Actuel : {rate}ms" },
            damage: { name: "Dégâts", stats: "Niveau {level}/10 | Actuel : {damage}" },
            multiShot2: { name: "Tir Multiple x2", stats: "Tirez 2 balles à la fois" },
            multiShot3: { name: "Tir Multiple x3", stats: "Tirez 3 balles à la fois" },
            multiShot5: { name: "Tir Multiple x5", stats: "Tirez 5 balles à la fois" },
            laserBeam: { name: "Rayon Laser", stats: "Attaque continue" },
            shieldGen: { name: "Générateur de Bouclier", stats: "Absorbe 5 coups" },
            smartBomb: { name: "Bombe Intelligente", stats: "Élimine tous les ennemis" },
            coinMagnet: { name: "Aimant à Pièces", stats: "Collecte automatique des pièces" },
            score2x: { name: "Multiplicateur de Score x2", stats: "2x score pendant 60 secondes" },
            extraLife: { name: "Vie Supplémentaire", stats: "+1 continuation" },
            maxHP: { name: "HP Max +10", stats: "Augmente la santé de 10" },
            hpRegen: { name: "Régénération HP", stats: "Soigne 1 HP/seconde" },
            fasterMovement: { name: "Mouvement Plus Rapide", stats: "+20% vitesse" },
            owned: "POSSÉDÉ",
            buy: "ACHETER",
            vibrationToggle: "Vibration Tactile",
            vibrationSupported: "Activé",
            vibrationNotSupported: "Non supporté sur cet appareil",
            enabled: "Activé",
            disabled: "Désactivé"
        },
        pause: {
            title: "PAUSE",
            resume: "Reprendre",
            mainMenu: "Menu Principal",
            resetGame: "Réinitialiser le Jeu",
            exitGame: "Quitter"
        },
        resetConfirm: {
            title: "Réinitialiser la progression ?",
            message: "Cela effacera la monnaie, les achats, le score et toutes les données sauvegardées. Impossible d'annuler.",
            cancel: "Annuler",
            reset: "Réinitialiser"
        },
        gameover: {
            title: "FIN DU JEU",
            restart: "Redémarrer",
            finalScore: "Score Final",
            stageReached: "Étape Atteinte",
            level: "Niveau"
        },
        leaderboard: {
            title: "CLASSEMENT",
            submitMyScore: "Soumettre mon score",
            refresh: "Actualiser",
            globalStatus: "Classement global (on-chain)",
            personalBest: "Meilleur personnel (local)",
            loading: "Chargement...",
            playToSetBest: "Jouez pour établir un record.",
            submitNewHighTitle: "Nouveau record !",
            submitNewHighMessage: "Soumettre au classement global ? Transaction du portefeuille requise.",
            submit: "Soumettre",
            cancel: "Annuler",
            submitting: "Soumission...",
            submitted: "Soumis !",
            openInWarpcast: "Ouvrez dans Warpcast pour soumettre.",
            playFirst: "Jouez d'abord au jeu."
        },
        lang: {
            english: "🇺🇸 English",
            hindi: "🇮🇳 हिंदी",
            russian: "🇷🇺 Русский",
            ukrainian: "🇺🇦 Українська",
            tagalog: "🇵🇭 Tagalog",
            indonesian: "🇮🇩 Indonesian",
            vietnamese: "🇻🇳 Tiếng Việt",
            portuguese: "🇧🇷 Português",
            french: "🇫🇷 Français",
            german: "🇩🇪 Deutsch",
            chinese: "🇨🇳 简体中文"
        }
    };

    var deFallback = {
        menu: {
            title: "BASEN-ZERSTÖRER",
            welcome: "Willkommen, Commander! Schützen Sie die Basis vor außerirdischen Invasoren. Sammeln Sie Diamanten und verbessern Sie Ihr Raumschiff.",
            goodLuck: "Viel Glück! 🌟",
            start: "START",
            howToPlay: "Spielanleitung",
            language: "Sprache 🌐",
            resetProgress: "Fortschritt zurücksetzen",
            leaderboard: "Bestenliste"
        },
        instructions: {
            title: "SPIELANLEITUNG",
            body: "STEUERUNG:\n← oder A/D - Links/rechts\n↑ oder W/S - Hoch/runter\nAuto-Schuss\n⏸ - Pause\n\nZIEL:\n- Zerstöre Feinde und Basen\n- Sammle Diamanten 💎\n- Nimm Power-ups auf\n- Verbessere dein Schiff im Shop\n- Besiege die Bosse\n\nViel Glück, Commander! 🚀"
        },
        ui: {
            stage: "STUFE",
            mission: "Mission",
            wave: "Welle",
            boss: "BOSS",
            score: "Punkte",
            level: "Level",
            shop: "SHOP",
            checkIn: "CHECK-IN",
            checkedIn: "Eingecheckt",
            dayStreak: "Tag {next} (bis {milestone})",
            dayMilestone: "Tag {next} ({next7}/7)",
            signing: "SIGNIERE...",
            confirmedBase: "Auf Base bestätigt!",
            transactionFailed: "Transaktion fehlgeschlagen",
            transactionCancelled: "Abgebrochen",
            insufficientFunds: "Unzureichende Mittel",
            walletNotReady: "Wallet nicht bereit",
            tryAgain: "Erneut versuchen",
            alreadyCheckedIn: "Heute schon eingecheckt",
            sdkNotLoaded: "SDK nicht geladen"
        },
        shop: {
            title: "SHOP",
            tabSpaceships: "Raumschiffe",
            tabWeapons: "Waffen",
            tabPowerups: "Power-ups",
            tabUpgrades: "Upgrades"
        },
        shopItems: {
            starterShip: { name: "Starter-Schiff", stats: "HP: 100 | Geschwindigkeit: 300 | Ausgewogen" },
            speedDemon: { name: "Geschwindigkeits-Dämon", stats: "HP: 90 | Geschwindigkeit: 390 | +30% Geschwindigkeit" },
            baseDefender: { name: "Basen-Verteidiger", stats: "HP: 150 | Geschwindigkeit: 300 | +50% HP" },
            tank: { name: "Panzer", stats: "HP: 200 | Geschwindigkeit: 240 | Langsam aber stark" },
            lightningStrike: { name: "Blitzangriff", stats: "HP: 120 | Geschwindigkeit: 450 | Sehr schnell" },
            legendary: { name: "Legendär", stats: "HP: 250 | Geschwindigkeit: 400 | Beste Stats" },
            fireRate: { name: "Feuerrate", stats: "Level {level}/10 | Aktuell: {rate}ms" },
            damage: { name: "Schaden", stats: "Level {level}/10 | Aktuell: {damage}" },
            multiShot2: { name: "Mehrfach-Schuss x2", stats: "Schieße 2 Kugeln gleichzeitig" },
            multiShot3: { name: "Mehrfach-Schuss x3", stats: "Schieße 3 Kugeln gleichzeitig" },
            multiShot5: { name: "Mehrfach-Schuss x5", stats: "Schieße 5 Kugeln gleichzeitig" },
            laserBeam: { name: "Laserstrahl", stats: "Kontinuierlicher Angriff" },
            shieldGen: { name: "Schild-Generator", stats: "Absorbiert 5 Treffer" },
            smartBomb: { name: "Intelligente Bombe", stats: "Beseitigt alle Feinde" },
            coinMagnet: { name: "Münz-Magnet", stats: "Automatisches Münzen sammeln" },
            score2x: { name: "2x Punkte-Multiplikator", stats: "2x Punkte für 60 Sekunden" },
            extraLife: { name: "Extra-Leben", stats: "+1 Fortsetzung" },
            maxHP: { name: "Max HP +10", stats: "Erhöht Gesundheit um 10" },
            hpRegen: { name: "HP-Regeneration", stats: "Heilt 1 HP/Sekunde" },
            fasterMovement: { name: "Schnellere Bewegung", stats: "+20% Geschwindigkeit" },
            owned: "BESESSEN",
            buy: "KAUFEN",
            vibrationToggle: "Haptische Vibration",
            vibrationSupported: "Aktiviert",
            vibrationNotSupported: "Auf diesem Gerät nicht unterstützt",
            enabled: "Aktiviert",
            disabled: "Deaktiviert"
        },
        pause: {
            title: "PAUSIERT",
            resume: "Fortsetzen",
            mainMenu: "Hauptmenü",
            resetGame: "Spiel zurücksetzen",
            exitGame: "Beenden"
        },
        resetConfirm: {
            title: "Fortschritt zurücksetzen?",
            message: "Dies löscht Währung, Käufe, Punktzahl und alle gespeicherten Daten. Kann nicht rückgängig gemacht werden.",
            cancel: "Abbrechen",
            reset: "Zurücksetzen"
        },
        gameover: {
            title: "SPIEL VORBEI",
            restart: "Neustart",
            finalScore: "Endpunktzahl",
            stageReached: "Erreichte Stufe",
            level: "Level"
        },
        leaderboard: {
            title: "BESTENLISTE",
            submitMyScore: "Meine Punktzahl einreichen",
            refresh: "Aktualisieren",
            globalStatus: "Globale Bestenliste (on-chain)",
            personalBest: "Persönliche Bestleistung (lokal)",
            loading: "Lädt...",
            playToSetBest: "Spielen Sie, um einen Rekord aufzustellen.",
            submitNewHighTitle: "Neuer Rekord!",
            submitNewHighMessage: "Zur globalen Bestenliste einreichen? Wallet-Transaktion erforderlich.",
            submit: "Einreichen",
            cancel: "Abbrechen",
            submitting: "Wird eingereicht...",
            submitted: "Eingereicht!",
            openInWarpcast: "In Warpcast öffnen zum Einreichen.",
            playFirst: "Spielen Sie zuerst das Spiel."
        },
        lang: {
            english: "🇺🇸 English",
            hindi: "🇮🇳 हिंदी",
            russian: "🇷🇺 Русский",
            ukrainian: "🇺🇦 Українська",
            tagalog: "🇵🇭 Tagalog",
            indonesian: "🇮🇩 Indonesian",
            vietnamese: "🇻🇳 Tiếng Việt",
            portuguese: "🇧🇷 Português",
            french: "🇫🇷 Français",
            german: "🇩🇪 Deutsch",
            chinese: "🇨🇳 简体中文"
        }
    };

    var zhFallback = {
        menu: {
            title: "基地毁灭者",
            welcome: "欢迎，指挥官！保护基地免受外星入侵者的侵害。收集钻石并升级你的飞船。",
            goodLuck: "祝你好运！🌟",
            start: "开始",
            howToPlay: "如何游玩",
            language: "语言 🌐",
            resetProgress: "重置进度",
            leaderboard: "排行榜"
        },
        instructions: {
            title: "如何游玩",
            body: "控制：\n← 或 A/D - 左/右\n↑ 或 W/S - 上/下\n自动射击\n⏸ - 暂停\n\n目标：\n- 摧毁敌人和基地\n- 收集钻石 💎\n- 拾取能量提升\n- 在商店升级飞船\n- 击败首领\n\n祝你好运，指挥官！🚀"
        },
        ui: {
            stage: "关卡",
            mission: "任务",
            wave: "波次",
            boss: "首领",
            score: "分数",
            level: "等级",
            shop: "商店",
            checkIn: "签到",
            checkedIn: "已签到",
            dayStreak: "第{next}天（至{milestone}）",
            dayMilestone: "第{next}天（{next7}/7）",
            signing: "签名中...",
            confirmedBase: "已在Base确认！",
            transactionFailed: "交易失败",
            transactionCancelled: "已取消",
            insufficientFunds: "资金不足",
            walletNotReady: "钱包未准备好",
            tryAgain: "重试",
            alreadyCheckedIn: "今天已签到",
            sdkNotLoaded: "SDK未加载"
        },
        shop: {
            title: "商店",
            tabSpaceships: "飞船",
            tabWeapons: "武器",
            tabPowerups: "能量提升",
            tabUpgrades: "升级"
        },
        shopItems: {
            starterShip: { name: "初始飞船", stats: "HP：100 | 速度：300 | 平衡型" },
            speedDemon: { name: "速度恶魔", stats: "HP：90 | 速度：390 | +30%速度" },
            baseDefender: { name: "基地守卫者", stats: "HP：150 | 速度：300 | +50% HP" },
            tank: { name: "坦克", stats: "HP：200 | 速度：240 | 缓慢但强大" },
            lightningStrike: { name: "闪电突袭", stats: "HP：120 | 速度：450 | 非常快" },
            legendary: { name: "传奇", stats: "HP：250 | 速度：400 | 最佳属性" },
            fireRate: { name: "射速", stats: "等级{level}/10 | 当前：{rate}毫秒" },
            damage: { name: "伤害", stats: "等级{level}/10 | 当前：{damage}" },
            multiShot2: { name: "多重射击 x2", stats: "同时发射2发子弹" },
            multiShot3: { name: "多重射击 x3", stats: "同时发射3发子弹" },
            multiShot5: { name: "多重射击 x5", stats: "同时发射5发子弹" },
            laserBeam: { name: "激光束", stats: "持续攻击" },
            shieldGen: { name: "护盾生成器", stats: "吸收5次攻击" },
            smartBomb: { name: "智能炸弹", stats: "清除所有敌人" },
            coinMagnet: { name: "金币磁铁", stats: "自动收集金币" },
            score2x: { name: "2倍分数", stats: "60秒内2倍分数" },
            extraLife: { name: "额外生命", stats: "+1次继续" },
            maxHP: { name: "最大HP +10", stats: "增加10点生命值" },
            hpRegen: { name: "HP再生", stats: "每秒恢复1 HP" },
            fasterMovement: { name: "更快移动", stats: "+20%速度" },
            owned: "已拥有",
            buy: "购买",
            vibrationToggle: "触觉震动",
            vibrationSupported: "已启用",
            vibrationNotSupported: "此设备不支持",
            enabled: "已启用",
            disabled: "已禁用"
        },
        pause: {
            title: "已暂停",
            resume: "继续",
            mainMenu: "主菜单",
            resetGame: "重置游戏",
            exitGame: "退出"
        },
        resetConfirm: {
            title: "重置进度？",
            message: "这将清除货币、购买、分数和所有保存的数据。无法撤销。",
            cancel: "取消",
            reset: "重置"
        },
        gameover: {
            title: "游戏结束",
            restart: "重新开始",
            finalScore: "最终分数",
            stageReached: "达到关卡",
            level: "等级"
        },
        leaderboard: {
            title: "排行榜",
            submitMyScore: "提交我的分数",
            refresh: "刷新",
            globalStatus: "全球排行榜（链上）",
            personalBest: "个人最佳（本地）",
            loading: "加载中...",
            playToSetBest: "开始游戏以创建记录。",
            submitNewHighTitle: "新纪录！",
            submitNewHighMessage: "提交到全球排行榜？需要钱包交易。",
            submit: "提交",
            cancel: "取消",
            submitting: "提交中...",
            submitted: "已提交！",
            openInWarpcast: "在Warpcast中打开以提交。",
            playFirst: "请先开始游戏。"
        },
        lang: {
            english: "🇺🇸 English",
            hindi: "🇮🇳 हिंदी",
            russian: "🇷🇺 Русский",
            ukrainian: "🇺🇦 Українська",
            tagalog: "🇵🇭 Tagalog",
            indonesian: "🇮🇩 Indonesian",
            vietnamese: "🇻🇳 Tiếng Việt",
            portuguese: "🇧🇷 Português",
            french: "🇫🇷 Français",
            german: "🇩🇪 Deutsch",
            chinese: "🇨🇳 简体中文"
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
