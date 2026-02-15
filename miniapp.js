/**
 * Base Invaders – Farcaster Mini App wallet (vanilla JS).
 * SDK from UMD (window.MiniAppSDK), viem loaded at runtime (no static import).
 * Must be loaded as <script type="module"> for dynamic import(viem).
 */
const CHECKIN_ADDR = '0x709Ef1bc52a302206E1244Df92Ae0329a9d3C736';
// On-chain leaderboard (Base). Contract may keep only top N entries (e.g. 100); new scores below the minimum may not appear.
const LEADERBOARD_ADDR = '0xAC89DA9d8508d0865c55083552da91894537aC89'; // V2 contract with clear function

// viem: use esm.sh only (Skypack pulls "ox/tempo" which fails in browser)
let viemPromise = null;
function getViem() {
    if (!viemPromise) {
        console.log('[miniapp] Loading viem from esm.sh...');
        viemPromise = import('https://esm.sh/viem');
    }
    return viemPromise;
}

function getSdk() {
    const sdk = window.MiniAppSDK || (window.miniapp && window.miniapp.sdk) || window.miniapp;
    if (!sdk) console.error('[miniapp] SDK not found. Add UMD script: @farcaster/miniapp-sdk dist/index.umd.js');
    return sdk;
}

/** Get context (sdk.context can be a Promise in some SDK builds). */
async function getContext(sdk) {
    if (!sdk) return null;
    let ctx = sdk.context;
    if (ctx && typeof ctx.then === 'function') ctx = await ctx;
    return ctx && typeof ctx === 'object' ? ctx : null;
}

function getUserFromContext(ctx) {
    if (!ctx || typeof ctx !== 'object') return null;
    const user = ctx.user ?? null;
    return user && typeof user === 'object' ? user : null;
}

/** Get current user's username (preferred) or display name from Farcaster / Base (for leaderboard). */
window.baseInvadersGetUserName = async function () {
    const sdk = getSdk();
    if (!sdk) return '';
    try {
        if (typeof sdk.ready === 'function') await sdk.ready();
        else if (sdk.actions && typeof sdk.actions.ready === 'function') await sdk.actions.ready({ disableNativeGestures: false });
    } catch (e) {
        // ignore
    }
    let ctx = await getContext(sdk);
    let user = getUserFromContext(ctx);
    if (!user) {
        await sleep(400);
        ctx = await getContext(sdk);
        user = getUserFromContext(ctx);
    }
    if (!user) {
        await sleep(400);
        ctx = await getContext(sdk);
        user = getUserFromContext(ctx);
    }
    if (!user || typeof user !== 'object') return '';
    // Prefer username (e.g. vitalik.eth) over display name for leaderboard
    const name = (user.username && String(user.username).trim())
        || (user.displayName && String(user.displayName).trim())
        || (user.display_name && String(user.display_name).trim())
        || '';
    return name || '';
};

/** Get Farcaster context (user with fid, etc.) for per-user check-in state. */
window.baseInvadersGetUserContext = async function () {
    const sdk = getSdk();
    if (!sdk) return null;
    try {
        if (typeof sdk.ready === 'function') await sdk.ready();
        else if (sdk.actions && typeof sdk.actions.ready === 'function') await sdk.actions.ready({ disableNativeGestures: false });
    } catch (e) { /* ignore */ }
    return getContext(sdk);
};

/**
 * Resolve Ethereum addresses to Farcaster usernames via Neynar API.
 * Set window.baseInvadersNeynarApiKey (get key at neynar.com) to enable.
 * Returns Promise<Record<addressLowercase, username>>.
 */
window.baseInvadersResolveAddressesToUsernames = async function (addresses) {
    const key = typeof window !== 'undefined' && window.baseInvadersNeynarApiKey;
    if (!key || !Array.isArray(addresses) || addresses.length === 0) return {};
    const list = addresses.map((a) => String(a).toLowerCase()).filter(Boolean);
    const uniq = [...new Set(list)];
    try {
        const url = 'https://api.neynar.com/v2/farcaster/user/bulk-by-address/?addresses=' + encodeURIComponent(uniq.join(','));
        const res = await fetch(url, { headers: { 'x-api-key': key } });
        if (!res.ok) return {};
        const data = await res.json();
        const users = data.users || data.result?.users || (Array.isArray(data) ? data : []);
        const map = {};
        users.forEach((u) => {
            const username = (u.username && String(u.username).trim()) || '';
            if (!username) return;
            const addr = (u.custody_address || u.custodyAddress || '').toString().toLowerCase();
            if (addr) map[addr] = username;
            const verifications = u.verifications || u.verified_addresses || u.verifiedAddresses || [];
            verifications.forEach((v) => {
                const a = (v && String(v).toLowerCase()) || '';
                if (a) map[a] = username;
            });
        });
        return map;
    } catch (e) {
        console.warn('[miniapp] Neynar resolve usernames failed:', e?.message || e);
        return {};
    }
};

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Base mainnet chainId */
const BASE_CHAIN_ID = 8453;
const BASE_CHAIN_ID_HEX = '0x' + BASE_CHAIN_ID.toString(16);

/** Ensure wallet is on Base; optionally request switch. */
async function ensureBaseNetwork(provider) {
    if (!provider || typeof provider.request !== 'function') return;
    let chainIdHex = null;
    try {
        chainIdHex = await provider.request({ method: 'eth_chainId', params: [] });
    } catch (e) {
        console.warn('[miniapp] eth_chainId failed', e?.message);
        return;
    }
    const chainId = typeof chainIdHex === 'string' ? parseInt(chainIdHex, 16) : Number(chainIdHex);
    if (chainId === BASE_CHAIN_ID) return;
    console.warn('[miniapp] Wallet not on Base. Current chainId:', chainId, 'Expected:', BASE_CHAIN_ID);
    try {
        await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: BASE_CHAIN_ID_HEX }]
        });
    } catch (switchErr) {
        const msg = (switchErr && switchErr.message) ? String(switchErr.message) : 'Switch failed';
        throw new Error('Switch wallet to Base network. ' + msg);
    }
}

/** Contract requires name length in bytes 1–32. Truncate to 32 bytes UTF-8. */
function truncateNameTo32Bytes(name) {
    if (!name || typeof name !== 'string') return 'Player';
    const s = String(name).trim() || 'Player';
    let enc = new TextEncoder().encode(s);
    if (enc.length <= 32) return s;
    enc = enc.slice(0, 32);
    const decoded = new TextDecoder().decode(enc);
    return decoded.replace(/\uFFFD/g, '').trim() || 'Player';
}

async function ensureWalletProvider(sdk) {
    // 1) Request wallet capability
    let capabilities = null;
    try {
        if (typeof sdk.requestCapabilities === 'function') {
            capabilities = await sdk.requestCapabilities(['wallet']);
        } else if (typeof sdk.actions?.requestCapabilities === 'function') {
            capabilities = await sdk.actions.requestCapabilities(['wallet']);
        }
    } catch (e) {
        console.warn('[miniapp] ⚠️ requestCapabilities failed (continuing):', e?.message || e);
    }
    console.log('[miniapp] Capabilities:', capabilities);

    // 2) Retry provider up to 3 times with 1s delay
    let provider = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            if (sdk?.wallet?.getEthereumProvider) {
                const maybeProvider = sdk.wallet.getEthereumProvider();
                // Some SDK builds return a Promise here
                provider =
                    maybeProvider && typeof maybeProvider.then === 'function'
                        ? await maybeProvider
                        : maybeProvider;
            } else {
                provider = null;
            }
        } catch (e) {
            provider = null;
        }
        console.log(`[miniapp] Provider attempt ${attempt}/3:`, provider);
        if (provider) break;
        await sleep(1000);
    }

    // 3) Fallback ONLY to Farcaster-injected provider (do NOT use window.ethereum = Rabby/MetaMask)
    if (!provider) {
        provider = window.farcasterProvider || null;
        console.log('[miniapp] Provider fallback (window.farcasterProvider only, not Rabby):', !!provider);
    }

    if (!provider || typeof provider.request !== 'function') {
        console.error('[miniapp] ❌ Provider is null/invalid after retries + fallbacks');
        throw new Error('No wallet - open in Warpcast');
    }

    // 5) Manual connect: request accounts (throw if no address)
    const accounts = await provider.request({ method: 'eth_requestAccounts', params: [] });
    const address = accounts?.[0];
    if (!address) throw new Error('Wallet not connected');

    return { provider, account: address, error: null };
}

/** Get last check-in UTC day index from chain. Uses cached wallet address only (no wallet popup on load).
 *  Cache is set after first check-in or submit score so sync works without calling provider on load/focus. */
window.baseInvadersGetLastCheckInDayFromChain = async function () {
    const account = (typeof window !== 'undefined' && window.__baseInvadersWalletAddress) || null;
    if (!account) return null;
    try {
        const viem = await getViem();
        const baseChain = viem.base || (await import('https://esm.sh/viem/chains').then((m) => m.base));
        const { createPublicClient, parseAbi, getAddress, http } = viem;
        const CHECKIN_READ_ABI = parseAbi(['function lastCheckInDay(address) view returns (uint256)']);
        const httpFn = viem.http;
        for (const rpcUrl of BASE_RPC_URLS) {
            try {
                const transport = typeof httpFn === 'function'
                    ? httpFn(rpcUrl)
                    : viem.custom(async ({ method, params }) => {
                        const res = await fetch(rpcUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }) });
                        if (!res.ok) throw new Error('RPC ' + res.status);
                        const json = await res.json();
                        if (json.error) throw new Error(json.error.message || JSON.stringify(json.error));
                        return json.result;
                    });
                const client = createPublicClient({ chain: baseChain, transport });
                const day = await client.readContract({ address: CHECKIN_ADDR, abi: CHECKIN_READ_ABI, functionName: 'lastCheckInDay', args: [getAddress(account)] });
                return typeof day === 'bigint' ? Number(day) : Number(day);
            } catch (_) {}
        }
        return null;
    } catch (e) {
        console.warn('[miniapp] getLastCheckInDayFromChain failed', e?.message || e);
        return null;
    }
};

window.baseInvadersOnchainCheckIn = async function () {
    console.log('[miniapp] baseInvadersOnchainCheckIn start');
    try {
        const sdk = getSdk();
        if (!sdk) throw new Error('Farcaster SDK not loaded');
        console.log('[miniapp] SDK:', !!sdk, 'wallet:', !!sdk.wallet);
        console.log('[miniapp] sdk.version:', sdk?.version || sdk?.sdkVersion || 'unknown');

        if (typeof sdk.ready === 'function') {
            await sdk.ready();
            console.log('[miniapp] sdk.ready() done');
        } else if (sdk.actions && typeof sdk.actions.ready === 'function') {
            await sdk.actions.ready({ disableNativeGestures: false });
            console.log('[miniapp] sdk.actions.ready() done');
        }

        const { provider, account } = await ensureWalletProvider(sdk);
        console.log('[miniapp] Provider:', provider);
        if (!account) throw new Error('Wallet not connected');
        console.log('[miniapp] Connected account:', account);

        const viem = await getViem();
        const baseChain = viem.base || (await import('https://esm.sh/viem/chains').then((m) => m.base));
        const { createWalletClient, custom, parseAbi, getAddress } = viem;
        const CHECKIN_ABI = parseAbi(['function checkIn() external']);

        const client = createWalletClient({ chain: baseChain, transport: custom(provider) });
        console.log('[miniapp] wallet client created');

        const accountObj = { address: getAddress(account), type: 'json-rpc' };
        if (typeof window !== 'undefined') window.__baseInvadersWalletAddress = account;
        const hash = await client.writeContract({
            address: CHECKIN_ADDR,
            abi: CHECKIN_ABI,
            functionName: 'checkIn',
            account: accountObj,
            value: 0n
        });
        console.log('[miniapp] checkIn hash:', hash);

        // Record check-in date in leaderboard so it appears in the leaderboard table (sync across devices)
        try {
            const LEADERBOARD_CHECKIN_ABI = parseAbi(['function recordCheckIn() external']);
            const hash2 = await client.writeContract({
                address: LEADERBOARD_ADDR,
                abi: LEADERBOARD_CHECKIN_ABI,
                functionName: 'recordCheckIn',
                account: accountObj,
                value: 0n
            });
            console.log('[miniapp] leaderboard recordCheckIn hash:', hash2);
        } catch (e2) {
            console.warn('[miniapp] leaderboard recordCheckIn failed (check-in already saved)', e2?.message || e2);
        }

        window.dispatchEvent(new CustomEvent('base-invaders:wallet-connected', { detail: { address: account } }));
        return { success: true, hash };
    } catch (e) {
        console.error('[miniapp] CheckIn tx failed', e);
        throw e;
    }
};

window.baseInvadersSubmitScore = async function (score, wave, streak, name) {
    console.log('[miniapp] baseInvadersSubmitScore CALLED — score:', score, 'wave:', wave, 'streak:', streak, 'name:', name);
    try {
        const sdk = getSdk();
        if (!sdk) throw new Error('Farcaster SDK not loaded');
        console.log('[miniapp] submitScore — SDK ready, contract:', LEADERBOARD_ADDR);
        if (typeof sdk.ready === 'function') await sdk.ready();
        else if (sdk.actions && typeof sdk.actions.ready === 'function') await sdk.actions.ready({ disableNativeGestures: false });
        let displayName = (name != null && name !== '') ? String(name).trim() : '';
        if (!displayName || displayName === 'Player') {
            if (typeof window.baseInvadersGetUserName === 'function') {
                displayName = await window.baseInvadersGetUserName();
            }
        }
        displayName = displayName || 'Player';
        displayName = truncateNameTo32Bytes(displayName);
        console.log('[miniapp] submitScore — displayName:', displayName);
        const { provider, account } = await ensureWalletProvider(sdk);
        if (!provider || !account) throw new Error('Wallet not connected');
        if (typeof window !== 'undefined') window.__baseInvadersWalletAddress = account;
        await ensureBaseNetwork(provider);

        const viem = await getViem();
        const baseChain = viem.base || (await import('https://esm.sh/viem/chains').then((m) => m.base));
        const { createWalletClient, createPublicClient, custom, parseAbi, getAddress, http } = viem;
        const LEADERBOARD_ABI = parseAbi(['function submitScore(uint256,uint256,uint256,string) external']);

        const walletClient = createWalletClient({ chain: baseChain, transport: custom(provider) });
        const accountObj = { address: getAddress(account), type: 'json-rpc' };
        const args = [BigInt(score), BigInt(wave), BigInt(streak), displayName];
        console.log('[miniapp] submitScore — sending tx to', LEADERBOARD_ADDR, 'args:', args);
        const hash = await walletClient.writeContract({
            address: LEADERBOARD_ADDR,
            abi: LEADERBOARD_ABI,
            functionName: 'submitScore',
            args,
            account: accountObj,
            value: 0n
        });
        console.log('[miniapp] submitScore tx sent — hash:', hash, ', waiting for confirmation...');
        // Wait for inclusion so we only report success when the score is actually on-chain (catches reverts)
        const publicClient = createPublicClient({
            chain: baseChain,
            transport: typeof http === 'function' ? http(BASE_RPC_URLS[0]) : custom(async ({ method, params }) => {
                const res = await fetch(BASE_RPC_URLS[0], {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params })
                });
                if (!res.ok) throw new Error('RPC ' + res.status);
                const json = await res.json();
                if (json.error) throw new Error(json.error.message || JSON.stringify(json.error));
                return json.result;
            })
        });
        const receipt = await publicClient.waitForTransactionReceipt({ hash, confirmations: 1 });
        if (receipt && receipt.status === 'reverted') {
            throw new Error('Transaction reverted. Leaderboard may be full (top 100 only) or score too low.');
        }
        console.log('[miniapp] submitScore SUCCESS — confirmed, block:', receipt?.blockNumber);
        window.dispatchEvent(new CustomEvent('base-invaders:wallet-connected', { detail: { address: account } }));
        return { success: true, hash };
    } catch (e) {
        const msg = (e && e.message) ? String(e.message) : '';
        console.error('[miniapp] SubmitScore tx FAILED:', msg || e);
        if (msg && (msg.includes('revert') || msg.includes('execution reverted')) && !msg.includes('Leaderboard')) {
            throw new Error('Transaction reverted. Leaderboard may be full (top 100) or score too low.');
        }
        throw e;
    }
};

// 🔥 NEW FUNCTION: Clear leaderboard (owner only)
window.baseInvadersClearLeaderboard = async function () {
    console.log('[miniapp] clearLeaderboard start');
    try {
        const sdk = getSdk();
        if (!sdk) throw new Error('Farcaster SDK not loaded');

        if (typeof sdk.ready === 'function') await sdk.ready();
        else if (sdk.actions && typeof sdk.actions.ready === 'function') {
            await sdk.actions.ready({ disableNativeGestures: false });
        }

        const { provider, account } = await ensureWalletProvider(sdk);
        if (!provider || !account) throw new Error('Wallet not connected');

        const viem = await getViem();
        const baseChain = viem.base || (await import('https://esm.sh/viem/chains').then((m) => m.base));
        const { createWalletClient, custom, parseAbi, getAddress } = viem;

        const CLEAR_ABI = parseAbi(['function clearLeaderboard() external']);

        const client = createWalletClient({ chain: baseChain, transport: custom(provider) });
        const accountObj = { address: getAddress(account), type: 'json-rpc' };

        const hash = await client.writeContract({
            address: LEADERBOARD_ADDR,
            abi: CLEAR_ABI,
            functionName: 'clearLeaderboard',
            account: accountObj,
            value: 0n
        });

        console.log('[miniapp] clearLeaderboard hash:', hash);
        return { success: true, hash };
    } catch (e) {
        console.error('[miniapp] clearLeaderboard failed', e);
        throw e;
    }
};

// Base public RPCs (try in order; some may block CORS from browser)
const BASE_RPC_URLS = [
    'https://mainnet.base.org',
    'https://base.llamarpc.com',
    'https://1rpc.io/base',
    'https://base-rpc.publicnode.com',
    'https://base.drpc.org'
];

window.baseInvadersGetLeaderboard = async function () {
    console.log('[miniapp] baseInvadersGetLeaderboard start');
    const viem = await getViem();
    const baseChain = viem.base || (await import('https://esm.sh/viem/chains').then((m) => m.base));
    const { createPublicClient, parseAbi, custom } = viem;
    const http = viem.http;
    // Unnamed tuple (abitype rejects named tuple in parseAbi); order: player, name, score, wave, streak, timestamp
    const LEADERBOARD_ABI = parseAbi([
        'function getTopPlayers() view returns ((address,string,uint256,uint256,uint256,uint256)[])',
        'function lastCheckIn(address) view returns (uint256)'
    ]);

    let lastError = null;
    for (const rpcUrl of BASE_RPC_URLS) {
        try {
            const transport = typeof http === 'function'
                ? http(rpcUrl)
                : custom(async ({ method, params }) => {
                    const res = await fetch(rpcUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params })
                    });
                    if (!res.ok) throw new Error('RPC ' + res.status);
                    const json = await res.json();
                    if (json.error) throw new Error(json.error.message || JSON.stringify(json.error));
                    return json.result;
                });
            const client = createPublicClient({ chain: baseChain, transport });
            const data = await client.readContract({ address: LEADERBOARD_ADDR, abi: LEADERBOARD_ABI, functionName: 'getTopPlayers' });
            const arr = Array.isArray(data) ? data : [];
            console.log('[miniapp] getTopPlayers OK via', rpcUrl, 'entries:', arr.length);
            // Fetch lastCheckIn for each player (parallel)
            const withCheckIn = await Promise.all(arr.map(async (row) => {
                const player = row[0];
                let checkInTs = 0n;
                try {
                    checkInTs = await client.readContract({ address: LEADERBOARD_ADDR, abi: LEADERBOARD_ABI, functionName: 'lastCheckIn', args: [player] });
                } catch (e) { /* no check-in or old contract */ }
                return [...row, checkInTs];
            }));
            return withCheckIn;
        } catch (e) {
            lastError = e;
            console.warn('[miniapp] getLeaderboard failed for', rpcUrl, e?.message || e);
        }
    }
    console.error('[miniapp] getLeaderboard failed for all RPCs', lastError);
    throw lastError || new Error('Failed to load leaderboard');
};

window.baseInvadersMarkMiniAppReady = async function () {
    const sdk = getSdk();
    if (!sdk) return;
    try {
        if (typeof sdk.ready === 'function') await sdk.ready();
        else if (sdk.actions && typeof sdk.actions.ready === 'function') await sdk.actions.ready({ disableNativeGestures: false });
        console.log('[miniapp] SDK ready OK');
    } catch (e) {
        console.error('[miniapp] ready failed', e?.message);
    }
};
window.baseInvadersMiniAppSdk = getSdk();

// Раннє встановлення fid для чек-іну (щоб відлік працював у Farcaster/телефоні)
(function () {
    async function setCheckInFid() {
        try {
            const ctx = await window.baseInvadersGetUserContext?.();
            if (ctx?.user?.fid != null) {
                window.__baseInvadersCheckInFid = String(ctx.user.fid);
                console.log('[miniapp] __baseInvadersCheckInFid set:', window.__baseInvadersCheckInFid);
            }
        } catch (e) { /* ignore */ }
    }
    setCheckInFid();
})();

document.addEventListener('DOMContentLoaded', async () => {
    console.log('[miniapp] DOMContentLoaded');
    try {
        const sdk = getSdk();
        if (sdk) {
            if (typeof sdk.ready === 'function') await sdk.ready();
            else if (sdk.actions && typeof sdk.actions.ready === 'function') await sdk.actions.ready({ disableNativeGestures: false });
            console.log('[miniapp] DOMContentLoaded – SDK ready');
            const ctx = await getContext(sdk);
            if (ctx?.user?.fid != null) {
                window.__baseInvadersCheckInFid = String(ctx.user.fid);
            }
        }
    } catch (e) {
        console.error('[miniapp] DOMContentLoaded ready failed', e);
    }
    window.dispatchEvent(new Event('base-invaders:game-ready'));
});

window.debugCheckIn = async function () {
    console.log('[miniapp] debugCheckIn called');
    try {
        const result = await window.baseInvadersOnchainCheckIn();
        console.log('[miniapp] Check-in OK', result);
        if (typeof alert !== 'undefined') alert('Check-in OK! Hash: ' + (result?.hash ?? ''));
        return result;
    } catch (e) {
        console.error('[miniapp] Check-in failed', e);
        if (typeof alert !== 'undefined') alert('Check-in failed: ' + (e?.message ?? e));
        throw e;
    }
};
window.__debugCheckIn = window.debugCheckIn;

/** Call in console (e.g. in Warpcast) to see what Farcaster user/name is available. */
window.debugUserName = async function () {
    const sdk = getSdk();
    let name = '';
    console.log('[miniapp] sdk:', !!sdk, sdk ? Object.keys(sdk) : []);
    if (sdk) {
        const ctx = await getContext(sdk);
        console.log('[miniapp] context (after await):', ctx);
        console.log('[miniapp] context?.user:', ctx?.user);
        name = await window.baseInvadersGetUserName();
        console.log('[miniapp] baseInvadersGetUserName() =>', JSON.stringify(name));
    }
    return name;
};

window.debugLeaderboard = async function () {
    console.log('[miniapp] debugLeaderboard called');
    try {
        const data = await window.baseInvadersGetLeaderboard();
        console.log('[miniapp] getLeaderboard raw:', data);
        console.log('[miniapp] entries count:', Array.isArray(data) ? data.length : 0);
        return data;
    } catch (e) {
        console.error('[miniapp] getLeaderboard error:', e);
        throw e;
    }
};

console.log('[miniapp] Loaded (SDK UMD, viem runtime). Test: window.debugCheckIn(), window.debugLeaderboard()');
