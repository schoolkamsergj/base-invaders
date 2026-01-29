(() => {
    const LEADERBOARD_LIMIT = 20;
    const LOCAL_HIGH_SCORE_KEY = 'baseInvadersLocalHighScore';
    const LEADERBOARD_NAME_KEY = 'baseInvadersLeaderboardName';

    const overlay = document.getElementById('leaderboard-overlay');
    const closeBtn = document.getElementById('close-leaderboard');
    const refreshBtn = document.getElementById('refresh-leaderboard');
    const globalTableBody = document.getElementById('leaderboard-global-body');
    const localTableBody = document.getElementById('leaderboard-local-body');
    const globalStatus = document.getElementById('leaderboard-global-status');

    function truncateAddress(address) {
        if (!address) return 'Unknown';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    function formatDate(value) {
        if (!value) return '-';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '-';
        return date.toLocaleDateString();
    }

    function toBigInt(value) {
        if (typeof value === 'bigint') return value;
        if (typeof value === 'number') return BigInt(Math.floor(value));
        if (typeof value === 'string' && value !== '') return BigInt(value);
        return BigInt(0);
    }

    function formatNumber(value) {
        const big = toBigInt(value);
        return big.toString();
    }

    function sortEntries(entries) {
        return entries.sort((a, b) => {
            const scoreA = toBigInt(a.score);
            const scoreB = toBigInt(b.score);
            if (scoreA !== scoreB) return scoreB > scoreA ? 1 : -1;

            const waveA = toBigInt(a.wave);
            const waveB = toBigInt(b.wave);
            if (waveA !== waveB) return waveB > waveA ? 1 : -1;

            const streakA = toBigInt(a.streak);
            const streakB = toBigInt(b.streak);
            if (streakA !== streakB) return streakB > streakA ? 1 : -1;

            return 0;
        });
    }

    function getCurrentStreak() {
        const data = localStorage.getItem('checkInStreak');
        if (!data) return 0;
        try {
            const parsed = JSON.parse(data);
            return parsed.totalDays || 0;
        } catch (error) {
            return 0;
        }
    }

    function getLocalHighScore() {
        const saved = localStorage.getItem(LOCAL_HIGH_SCORE_KEY);
        if (!saved) return null;
        try {
            return JSON.parse(saved);
        } catch (error) {
            return null;
        }
    }

    function saveLocalHighScore(entry) {
        localStorage.setItem(LOCAL_HIGH_SCORE_KEY, JSON.stringify(entry));
    }

    function getSavedName() {
        return localStorage.getItem(LEADERBOARD_NAME_KEY) || '';
    }

    function setSavedName(name) {
        if (typeof name !== 'string') return;
        localStorage.setItem(LEADERBOARD_NAME_KEY, name.trim());
    }

    function renderLocal() {
        localTableBody.innerHTML = '';
        const local = getLocalHighScore();

        if (!local) {
            localTableBody.innerHTML =
                '<tr><td colspan="5">Play a run to set your personal best.</td></tr>';
            return;
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatNumber(local.score)}</td>
            <td>${local.name || getSavedName() || 'You'}</td>
            <td>${local.wave ?? '-'}</td>
            <td>${formatDate(local.date)}</td>
            <td>${formatNumber(local.streak ?? 0)}</td>
        `;
        localTableBody.appendChild(row);
    }

    function normalizeEntry(entry) {
        if (!entry || typeof entry !== 'object') return null;
        // Support both named keys and tuple indices (ABI: player, name, score, wave, streak, timestamp = 0..5)
        const address = entry.player ?? entry[0];
        const name = entry.name ?? entry[1] ?? '';
        const score = entry.score ?? entry[2];
        const wave = entry.wave ?? entry[3];
        const streak = entry.streak ?? entry[4];
        const timestamp = entry.timestamp ?? entry[5];
        if (address == null) return null;
        return { address, name, score, wave, streak, timestamp };
    }

    async function fetchGlobal() {
        if (typeof window.baseInvadersGetLeaderboard !== 'function') {
            throw new Error('Leaderboard integration not available.');
        }

        const data = await window.baseInvadersGetLeaderboard();
        if (!data) return [];
        const arr = Array.isArray(data) ? data : (data.length !== undefined ? Array.from(data) : []);
        const entries = arr.map(normalizeEntry).filter(Boolean);
        return entries;
    }

    /** Resolve addresses to Farcaster usernames (Neynar) if API key is set. */
    async function resolveUsernames(entries) {
        if (typeof window.baseInvadersResolveAddressesToUsernames !== 'function') return;
        const needResolve = entries
            .filter((e) => {
                const raw = (e.name && String(e.name).trim()) || '';
                return !raw || raw.toLowerCase() === 'player';
            })
            .map((e) => e.address);
        if (!needResolve.length) return;
        try {
            const map = await window.baseInvadersResolveAddressesToUsernames(needResolve);
            entries.forEach((e) => {
                const key = (e.address && String(e.address).toLowerCase()) || '';
                if (key && map[key]) e.resolvedUsername = map[key];
            });
        } catch (err) {
            console.warn('[leaderboard] resolve usernames failed:', err);
        }
    }

    function renderGlobal(entries) {
        globalTableBody.innerHTML = '';
        if (!entries.length) {
            globalTableBody.innerHTML =
                '<tr><td colspan="5">No on-chain scores yet.</td></tr>';
            return;
        }

        entries.slice(0, LEADERBOARD_LIMIT).forEach((entry) => {
            const raw = (entry.name && String(entry.name).trim()) || '';
            const fromChain = raw && raw.toLowerCase() !== 'player' ? raw : '';
            const name = entry.resolvedUsername || fromChain || truncateAddress(entry.address);
            const dateValue = entry.timestamp ? Number(entry.timestamp) * 1000 : null;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatNumber(entry.score)}</td>
                <td>${name}</td>
                <td>${formatNumber(entry.wave)}</td>
                <td>${formatDate(dateValue)}</td>
                <td>${formatNumber(entry.streak)}</td>
            `;
            globalTableBody.appendChild(row);
        });
    }

    async function loadLeaderboard() {
        renderLocal();
        globalStatus.textContent = 'Loading on-chain leaderboard...';
        globalStatus.classList.remove('error');
        globalTableBody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';

        try {
            const entries = await fetchGlobal();
            const sorted = sortEntries(entries);
            await resolveUsernames(sorted);
            renderGlobal(sorted);
            globalStatus.textContent = 'Global leaderboard (on-chain)';
        } catch (error) {
            const msg = error && error.message ? error.message : String(error);
            console.warn('Failed to load global leaderboard:', error);
            globalStatus.textContent = 'Global leaderboard: ' + msg;
            globalStatus.classList.add('error');
            globalTableBody.innerHTML =
                '<tr><td colspan="5">Failed to load. Try Refresh or check console.</td></tr>';
        }
    }

    async function open() {
        overlay.classList.remove('hidden');
        if (!getSavedName() && typeof window.baseInvadersGetUserName === 'function') {
            try {
                const name = await window.baseInvadersGetUserName();
                if (name) setSavedName(name);
            } catch (e) {
                // ignore
            }
        }
        loadLeaderboard();
    }

    function close() {
        overlay.classList.add('hidden');
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', close);
    }

    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadLeaderboard);
    }

    if (overlay) {
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                close();
            }
        });
    }

    window.baseInvadersLeaderboard = {
        open,
        close,
        load: loadLeaderboard,
        getLocalHighScore,
        saveLocalHighScore,
        getCurrentStreak,
        getSavedName,
        setSavedName
    };
})();
