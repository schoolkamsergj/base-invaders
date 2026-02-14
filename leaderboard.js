/**
 * Base Invaders – Leaderboard UI and local/on-chain state.
 * Exposes window.baseInvadersLeaderboard (open, close, getCurrentStreak, getLocalHighScore, saveLocalHighScore, getSavedName, setSavedName).
 */
(function () {
    'use strict';

    const OVERLAY_ID = 'leaderboard-overlay';
    const CLOSE_BTN_ID = 'close-leaderboard';
    const REFRESH_BTN_ID = 'refresh-leaderboard';
    const GLOBAL_STATUS_ID = 'leaderboard-global-status';
    const GLOBAL_BODY_ID = 'leaderboard-global-body';
    const LOCAL_BODY_ID = 'leaderboard-local-body';
    const LOCAL_STORAGE_HIGH = 'baseInvadersLocalHighScore';
    const LOCAL_STORAGE_NAME = 'baseInvadersLeaderboardName';

    function getOverlay() {
        return document.getElementById(OVERLAY_ID);
    }

    function truncateAddress(addr) {
        if (!addr || typeof addr !== 'string') return '—';
        const a = addr.trim();
        if (a.length <= 10) return a;
        return a.slice(0, 6) + '…' + a.slice(-4);
    }

    /** Format date as DD,MM,YYYY (e.g. 02,02,2026), English only, no locale text. */
    function formatDateDDMMYYYY(tsOrDate) {
        let d;
        if (tsOrDate instanceof Date) {
            d = tsOrDate;
        } else if (tsOrDate != null) {
            const n = typeof tsOrDate === 'bigint' ? Number(tsOrDate) : Number(tsOrDate);
            if (!Number.isFinite(n)) return '—';
            d = new Date(n * 1000);
        } else {
            return '—';
        }
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return day + ',' + month + ',' + year;
    }

    /** Format check-in date (Supabase YYYY-MM-DD string or unix timestamp). */
    function formatCheckInDate(val) {
        if (val == null) return '—';
        if (typeof val === 'string') {
            var datePart = val.slice(0, 10);
            if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
                var parts = datePart.split('-');
                return parts[2] + '.' + parts[1] + '.' + parts[0];
            }
        }
        const n = typeof val === 'bigint' ? Number(val) : Number(val);
        if (Number.isFinite(n) && n > 0) return formatDateDDMMYYYY(new Date(n * 1000)).replace(/,/g, '.');
        return '—';
    }

    function formatTimestamp(ts) {
        if (ts == null) return '—';
        const n = typeof ts === 'bigint' ? Number(ts) : Number(ts);
        if (!Number.isFinite(n)) return '—';
        return formatDateDDMMYYYY(new Date(n * 1000));
    }

    function getCurrentStreakFromStorage() {
        const fid = (typeof window !== 'undefined' && (window.__baseInvadersCheckInFid || window.game?.scene?.getScene?.('GameScene')?.ui?._checkInFid)) || 'default';
        let raw = localStorage.getItem('checkInStreak_' + fid);
        if (raw == null) raw = localStorage.getItem('checkInStreak');
        if (raw == null) return 0;
        try {
            const data = JSON.parse(raw);
            return data && typeof data.totalDays === 'number' ? data.totalDays : 0;
        } catch (e) {
            return 0;
        }
    }

    function getCurrentStreak() {
        try {
            const scene = window.game?.scene?.getScene?.('GameScene');
            if (scene?.ui?.getCheckInStreak) {
                const info = scene.ui.getCheckInStreak();
                if (info && typeof info.totalDays === 'number') return info.totalDays;
            }
        } catch (e) { /* ignore */ }
        return getCurrentStreakFromStorage();
    }

    function getLocalHighScore() {
        try {
            const raw = localStorage.getItem(LOCAL_STORAGE_HIGH);
            if (raw == null) return null;
            const data = JSON.parse(raw);
            return data && typeof data === 'object' ? data : null;
        } catch (e) {
            return null;
        }
    }

    function saveLocalHighScore(entry) {
        try {
            localStorage.setItem(LOCAL_STORAGE_HIGH, JSON.stringify(entry || {}));
        } catch (e) {
            console.warn('[leaderboard] saveLocalHighScore failed', e);
        }
    }

    function getSavedName() {
        try {
            return localStorage.getItem(LOCAL_STORAGE_NAME) || '';
        } catch (e) {
            return '';
        }
    }

    function setSavedName(name) {
        try {
            localStorage.setItem(LOCAL_STORAGE_NAME, String(name || ''));
        } catch (e) {
            console.warn('[leaderboard] setSavedName failed', e);
        }
    }

    function renderGlobalRows(entries, nameMap) {
        if (!Array.isArray(entries) || entries.length === 0) {
            return '<tr><td colspan="7">No on-chain scores yet.</td></tr>';
        }
        var sorted = entries.slice().sort(function (a, b) {
            var sa = typeof a[2] === 'bigint' ? Number(a[2]) : Number(a[2] ?? 0);
            var sb = typeof b[2] === 'bigint' ? Number(b[2]) : Number(b[2] ?? 0);
            return sb - sa;
        });
        const nameMapLower = nameMap && typeof nameMap === 'object' ? nameMap : {};
        return sorted.map(function (row, i) {
            const address = row[0];
            let name = (row[1] && String(row[1]).trim()) || '';
            const score = row[2];
            const wave = row[3];
            const streak = row[4];
            const timestamp = row[5];
            const lastCheckIn = row[6];
            const addrLower = (address && String(address).toLowerCase()) || '';
            if (!name || name === 'Player') {
                name = nameMapLower[addrLower] || truncateAddress(address);
            }
            const scoreNum = typeof score === 'bigint' ? Number(score) : Number(score);
            const waveNum = typeof wave === 'bigint' ? Number(wave) : Number(wave);
            const streakNum = typeof streak === 'bigint' ? Number(streak) : Number(streak);
            const checkInFormatted = formatCheckInDate(lastCheckIn);
            var rank = i + 1;
            var dateFormatted = formatTimestamp(timestamp).replace(/,/g, '.');
            return '<tr><td>' + rank + '</td><td>' + (Number.isFinite(scoreNum) ? scoreNum.toLocaleString('en-US') : '—') + '</td><td>' + (name || '—') + '</td><td>' + (Number.isFinite(waveNum) ? waveNum : '—') + '</td><td>' + dateFormatted + '</td><td>' + (Number.isFinite(streakNum) ? streakNum : '—') + '</td><td>' + checkInFormatted + '</td></tr>';
        }).join('');
    }

    function renderLocalRow(entry) {
        if (!entry || typeof entry !== 'object') {
            return '<tr><td colspan="7">Play a run to set your personal best.</td></tr>';
        }
        const score = entry.score != null ? Number(entry.score).toLocaleString('en-US') : '—';
        const wave = entry.wave != null ? entry.wave : '—';
        const date = entry.date ? formatDateDDMMYYYY(new Date(entry.date)) : '—';
        const streak = entry.streak != null ? entry.streak : '—';
        const name = (entry.name && String(entry.name).trim()) || 'You';
        return '<tr><td>1</td><td>' + score + '</td><td>' + name + '</td><td>' + wave + '</td><td>' + date + '</td><td>' + streak + '</td><td>—</td></tr>';
    }

    function setGlobalStatus(text, isError) {
        const el = document.getElementById(GLOBAL_STATUS_ID);
        if (el) {
            el.textContent = text || 'Global leaderboard (on-chain)';
            el.classList.toggle('error', !!isError);
        }
    }

    function loadGlobal() {
        const tbody = document.getElementById(GLOBAL_BODY_ID);
        if (tbody) tbody.innerHTML = '<tr><td colspan="7">Loading...</td></tr>';
        setGlobalStatus('Loading...', false);

        if (typeof window.baseInvadersGetLeaderboard !== 'function') {
            if (tbody) tbody.innerHTML = '<tr><td colspan="7">Leaderboard not available (open in Warpcast?).</td></tr>';
            setGlobalStatus('Global leaderboard (on-chain)', true);
            return;
        }

        window.baseInvadersGetLeaderboard()
            .then(function (arr) {
                const entries = Array.isArray(arr) ? arr : [];
                let nameMap = {};
                if (entries.length > 0 && typeof window.baseInvadersResolveAddressesToUsernames === 'function') {
                    const addrs = entries.map(function (r) { return r[0]; }).filter(Boolean);
                    return window.baseInvadersResolveAddressesToUsernames(addrs).then(function (map) {
                        nameMap = map || {};
                        if (tbody) tbody.innerHTML = renderGlobalRows(entries, nameMap);
                        setGlobalStatus('Global leaderboard (on-chain)', false);
                    });
                }
                if (tbody) tbody.innerHTML = renderGlobalRows(entries, nameMap);
                setGlobalStatus('Global leaderboard (on-chain)', false);
            })
            .catch(function (err) {
                if (tbody) tbody.innerHTML = '<tr><td colspan="7">Failed to load: ' + (err?.message || String(err)) + '</td></tr>';
                setGlobalStatus('Failed to load leaderboard', true);
            });
    }

    function loadLocal() {
        const tbody = document.getElementById(LOCAL_BODY_ID);
        if (!tbody) return;
        const entry = getLocalHighScore();
        tbody.innerHTML = renderLocalRow(entry);
    }

    function open() {
        const overlay = getOverlay();
        if (overlay) {
            if (window.game && window.game.scene) {
                const gameScene = window.game.scene.getScene('GameScene');
                // Only pause if GameScene is actually running (active), not when already stopped (e.g. after Exit Game).
                if (gameScene?.scene?.isActive && gameScene.scene.isActive() && gameScene?.gameState && !gameScene.gameState.paused && gameScene.togglePause) {
                    gameScene.togglePause();
                }
            }
            overlay.classList.remove('hidden');
            loadGlobal();
            loadLocal();
        }
    }

    function close() {
        const overlay = getOverlay();
        if (overlay) overlay.classList.add('hidden');
        if (window.game && window.game.scene) {
            if (window.game.scene.isActive && window.game.scene.isActive('GameScene')) {
                window.game.scene.stop('GameScene');
            }
            window.game.scene.start('MenuScene');
        }
    }

    function onDomReady() {
        const overlay = getOverlay();
        if (!overlay) return;

        const closeBtn = document.getElementById(CLOSE_BTN_ID);
        if (closeBtn) closeBtn.addEventListener('click', close);

        const refreshBtn = document.getElementById(REFRESH_BTN_ID);
        if (refreshBtn) refreshBtn.addEventListener('click', function () {
            if (window.game && window.game.scene) {
                const g = window.game.scene.getScene('GameScene');
                // Only toggle pause if GameScene is actually running; avoid calling on stopped scene (freeze fix).
                if (g?.scene?.isActive && g.scene.isActive() && g?.gameState && !g.gameState.paused && g.togglePause) g.togglePause();
            }
            loadGlobal();
            loadLocal();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onDomReady);
    } else {
        onDomReady();
    }

    window.baseInvadersLeaderboard = {
        open: open,
        close: close,
        getCurrentStreak: getCurrentStreak,
        getLocalHighScore: getLocalHighScore,
        saveLocalHighScore: saveLocalHighScore,
        getSavedName: getSavedName,
        setSavedName: setSavedName
    };

    console.log('[leaderboard] Loaded. Use window.baseInvadersLeaderboard.open() to show.');
})();
