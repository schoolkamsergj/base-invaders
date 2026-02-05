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
        let str = getNested(strings, key);
        if (str == null) str = getNested(enFallback, key);
        if (str == null) return key;
        return template(String(str), replacements);
    }

    /**
     * Set language and persist. Loads locale if needed, then dispatches base-invaders:lang-changed.
     * @param {string} lang - 'en' | 'hi'
     * @returns {Promise<void>}
     */
    function setLang(lang) {
        if (lang !== 'en' && lang !== 'hi') lang = DEFAULT_LANG;
        currentLang = lang;
        localStorage.setItem(STORAGE_KEY, lang);
        return loadLocale(lang).then(function () {
            if (typeof global.dispatchEvent === 'function') {
                global.dispatchEvent(new Event('base-invaders:lang-changed'));
            }
        });
    }

    function getLang() {
        return currentLang;
    }

    /**
     * Load locale. Uses embedded en and hi so no fetch needed (works in Farcaster/iframe).
     */
    function loadLocale(lang) {
        if (lang === 'en') {
            strings = JSON.parse(JSON.stringify(enFallback));
            return Promise.resolve();
        }
        if (lang === 'hi') {
            strings = typeof hiFallback !== 'undefined' ? JSON.parse(JSON.stringify(hiFallback)) : JSON.parse(JSON.stringify(enFallback));
            return Promise.resolve();
        }
        return Promise.resolve();
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
            "hindi": "🇮🇳 हिंदी"
        }
    };

    var hiFallback = {
        "menu": { "title": "बेस डिस्ट्रॉयर", "welcome": "स्वागत है, कमांडर! 🚀\n\nएलियन आक्रमणकारियों से बेस की रक्षा करें।\nहीरे इकट्ठा करें और अपने जहाज को अपग्रेड करें।", "goodLuck": "शुभकामनाएं! ⭐", "start": "शुरू करें", "howToPlay": "कैसे खेलें", "language": "भाषा 🌐", "resetProgress": "प्रगति रीसेट करें", "leaderboard": "लीडरबोर्ड" },
        "instructions": { "title": "📖 कैसे खेलें", "body": "🎮 नियंत्रण\n← → या A/D - बाएं/दाएं चलें\n↑ ↓ या W/S - ऊपर/नीचे चलें\nSPACE - ऑटो शूट\nESC - गेम रोकें\n\n🎯 उद्देश्य\n-  दुश्मनों और बेस को नष्ट करें\n-  हीरे 💎 इकट्ठा करें\n-  पावर-अप ⚡ उठाएं\n-  दुकान में जहाज अपग्रेड करें\n-  मिशन पूरे करें और बॉस को हराएं\n\n👾 दुश्मन\n🔴 लाल गोले - कमजोर (तेज़)\n🔷 हेक्सागोन - मध्यम (HP दिखाता है)\n🟦 नीले क्यूब - बेस (इन्हें नष्ट करें!)\n\n🛒 दुकान\n-  नए स्पेसशिप खरीदें\n-  हथियार अपग्रेड करें\n-  स्टैट्स सुधारें\n-  फायर रेट और डैमेज बढ़ाएं\n\nशुभकामनाएं, कमांडर! 🚀" },
        "ui": { "stage": "स्टेज", "mission": "मिशन", "wave": "वेव", "boss": "बॉस ⚔️", "score": "स्कोर", "level": "लेवल", "shop": "🛒 दुकान", "checkIn": "📅 चेक-इन", "checkedIn": "चेक इन हो चुका", "dayStreak": "Day {next} →{milestone}", "dayMilestone": "Day {next} →{next7} 🎉", "signing": "⛓️ साइन हो रहा...", "confirmedBase": "⛓️ बेस पर पुष्टि!", "transactionFailed": "लेनदेन विफल", "transactionCancelled": "लेनदेन रद्द", "insufficientFunds": "अपर्याप्त धन", "walletNotReady": "वॉलेट तैयार नहीं, पुनः प्रयास करें", "alreadyCheckedIn": "आज पहले ही चेक इन हो चुका", "sdkNotLoaded": "SDK लोड नहीं हुआ" },
        "shop": { "title": "🛒 दुकान", "tabSpaceships": "🚀 स्पेसशिप", "tabWeapons": "🔫 हथियार", "tabPowerups": "⚡ पावर-अप", "tabUpgrades": "⬆️ अपग्रेड" },
        "pause": { "title": "⏸️ रुका हुआ", "resume": "जारी रखें", "mainMenu": "मुख्य मेनू", "resetGame": "गेम रीसेट", "exitGame": "गेम से बाहर" },
        "resetConfirm": { "title": "प्रगति रीसेट करें?", "message": "इससे मुद्रा, खरीदारी, स्कोर और सभी सहेजे डेटा मिट जाएंगे। पूर्ववत नहीं हो सकता।", "cancel": "रद्द करें", "reset": "रीसेट" },
        "gameover": { "title": "💥 गेम ओवर", "restart": "दोबारा शुरू", "finalScore": "अंतिम स्कोर", "stageReached": "पहुंचा स्टेज", "level": "लेवल" },
        "leaderboard": { "title": "🏆 लीडरबोर्ड", "submitMyScore": "मेरा स्कोर जमा करें", "refresh": "रीफ्रेश", "globalStatus": "ग्लोबल लीडरबोर्ड (ऑन-चेन)", "personalBest": "व्यक्तिगत सर्वश्रेष्ठ (लोकल)", "loading": "लोड हो रहा...", "playToSetBest": "व्यक्तिगत सर्वश्रेष्ठ सेट करने के लिए एक रन खेलें।", "submitNewHighTitle": "🏆 नया हाई स्कोर!", "submitNewHighMessage": "ग्लोबल लीडरबोर्ड में जमा करें? (वॉलेट लेनदेन आवश्यक।)", "submit": "जमा करें", "cancel": "रद्द करें", "submitting": "जमा हो रहा...", "submitted": "जमा हो गया!", "openInWarpcast": "जमा करने के लिए Warpcast में खोलें।", "playFirst": "स्कोर के लिए पहले एक गेम खेलें।" },
        "lang": { "english": "🇺🇸 English", "hindi": "🇮🇳 हिंदी" }
    };

    // Init: load current locale then expose API and refresh once
    loadLocale(currentLang).then(function () {
        if (currentLang === 'en') strings = JSON.parse(JSON.stringify(enFallback));
        refreshAll();
    });

    global.getText = getText;
    global.setLang = setLang;
    global.getLang = getLang;
    global.refreshI18n = refreshAll;
})(typeof window !== 'undefined' ? window : this);
