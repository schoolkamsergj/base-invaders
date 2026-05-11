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

/** Base App (2026+) runs mini-apps as a normal in-app browser; host does not drive Farcaster comlink — ready() / SDK wallet can hang. */
const MINIAPP_READY_TIMEOUT_MS = 5000;
const REQUEST_ACCOUNTS_TIMEOUT_MS = 120000;

async function callMiniAppReady(sdk) {
    if (!sdk) return;
    const invoke =
        typeof sdk.ready === 'function'
            ? () => sdk.ready()
            : sdk.actions && typeof sdk.actions.ready === 'function'
                ? () => sdk.actions.ready({ disableNativeGestures: false })
                : null;
    if (!invoke) return;
    try {
        await Promise.race([
            invoke(),
            new Promise((_, rej) =>
                setTimeout(() => rej(new Error('miniapp ready timeout')), MINIAPP_READY_TIMEOUT_MS)
            ),
        ]);
    } catch (e) {
        console.warn('[miniapp] ready() finished with timeout or error (expected in Base App browser):', e?.message || e);
    }
}

/** EIP-1193 provider injected by Base App / Coinbase / extensions (not the Farcaster bridge). */
function pickInjectedEvmProvider() {
    if (typeof window === 'undefined') return null;
    const cw = window.coinbaseWalletExtension;
    if (cw && typeof cw.request === 'function') return cw;
    const eth = window.ethereum;
    if (!eth) return null;
    if (eth.providers && Array.isArray(eth.providers) && eth.providers.length > 0) {
        const preferred =
            eth.providers.find((p) => p && (p.isCoinbaseWallet || p.isBase)) ||
            eth.providers.find((p) => p && typeof p.request === 'function') ||
            eth.providers[0];
        if (preferred && typeof preferred.request === 'function') return preferred;
    }
    if (typeof eth.request === 'function') return eth;
    return null;
}

async function requestAccountsWithTimeout(provider, ms) {
    return Promise.race([
        provider.request({ method: 'eth_requestAccounts', params: [] }),
        new Promise((_, rej) =>
            setTimeout(() => rej(new Error('Wallet connection timed out')), ms)
        ),
    ]);
}

async function isHostMiniApp(sdk) {
    if (!sdk || typeof sdk.isInMiniApp !== 'function') return false;
    try {
        return await sdk.isInMiniApp(2000);
    } catch (e) {
        console.warn('[miniapp] isInMiniApp failed:', e?.message || e);
        return false;
    }
}

/** Provider for read-only eth_accounts (no popup). Uses SDK path only when embedded in a Farcaster-style mini-app host. */
async function getEthereumProviderForRead(sdk) {
    const s = sdk || getSdk();
    const inHost = await isHostMiniApp(s);
    if (!inHost) {
        return pickInjectedEvmProvider() || window.farcasterProvider || null;
    }
    try {
        const p = s?.wallet?.getEthereumProvider?.();
        const provider = p && typeof p.then === 'function' ? await p : p;
        if (provider && typeof provider.request === 'function') return provider;
    } catch (_) { /* ignore */ }
    return window.farcasterProvider || pickInjectedEvmProvider() || null;
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
    await callMiniAppReady(sdk);
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
    await callMiniAppReady(sdk);
    return getContext(sdk);
};

/** Get custody address for current user by FID via Neynar (no wallet popup). For check-in sync on phone. */
window.baseInvadersGetCustodyAddressByFid = async function () {
    const key = typeof window !== 'undefined' && window.baseInvadersNeynarApiKey;
    if (!key) return null;
    try {
        const ctx = await window.baseInvadersGetUserContext?.();
        const fid = ctx?.user?.fid;
        if (fid == null) return null;
        const url = 'https://api.neynar.com/v2/farcaster/user/bulk?fids=' + encodeURIComponent(String(fid));
        const res = await fetch(url, { headers: { 'x-api-key': key } });
        if (!res.ok) return null;
        const data = await res.json();
        const users = data.users || data.result?.users || (Array.isArray(data) ? data : []);
        const u = users[0];
        const addr = (u && (u.custody_address || u.custodyAddress || '')) || '';
        return (addr && String(addr).trim()) ? addr : null;
    } catch (e) {
        console.warn('[miniapp] getCustodyAddressByFid failed', e?.message || e);
        return null;
    }
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
    if (!sdk) throw new Error('Farcaster SDK not loaded');

    const inHost = await isHostMiniApp(sdk);
    if (!inHost) {
        console.log('[miniapp] Standard web / Base App in-app browser — using injected wallet (not Farcaster comlink)');
        const injected = pickInjectedEvmProvider();
        if (!injected || typeof injected.request !== 'function') {
            console.error('[miniapp] No injected EIP-1193 provider (window.ethereum)');
            throw new Error('No wallet — open in Base App or connect a browser wallet');
        }
        const accounts = await requestAccountsWithTimeout(injected, REQUEST_ACCOUNTS_TIMEOUT_MS);
        const address = accounts?.[0];
        if (!address) throw new Error('Wallet not connected');
        return { provider: injected, account: address, error: null };
    }

    // Embedded Farcaster / Warpcast mini-app host: SDK bridge + optional farcasterProvider
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

    let provider = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            if (sdk?.wallet?.getEthereumProvider) {
                const maybeProvider = sdk.wallet.getEthereumProvider();
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

    if (!provider) {
        provider = window.farcasterProvider || null;
        console.log('[miniapp] Provider fallback (window.farcasterProvider):', !!provider);
    }

    if (!provider || typeof provider.request !== 'function') {
        const injected = pickInjectedEvmProvider();
        if (injected) {
            console.warn('[miniapp] SDK provider missing; last resort injected wallet inside mini-app shell');
            const accounts = await requestAccountsWithTimeout(injected, REQUEST_ACCOUNTS_TIMEOUT_MS);
            const address = accounts?.[0];
            if (!address) throw new Error('Wallet not connected');
            return { provider: injected, account: address, error: null };
        }
        console.error('[miniapp] ❌ Provider is null/invalid after retries + fallbacks');
        throw new Error('No wallet — open in Warpcast or Base App');
    }

    const accounts = await requestAccountsWithTimeout(provider, REQUEST_ACCOUNTS_TIMEOUT_MS);
    const address = accounts?.[0];
    if (!address) throw new Error('Wallet not connected');

    return { provider, account: address, error: null };
}

/** Get last check-in UTC day index from chain. Uses cache, eth_accounts, or Neynar custody by FID (no wallet popup).
 *  Never calls eth_requestAccounts so check-in click still opens wallet once. */
window.baseInvadersGetLastCheckInDayFromChain = async function () {
    let account = (typeof window !== 'undefined' && window.__baseInvadersWalletAddress) || null;
    if (!account) {
        try {
            const sdk = getSdk();
            if (!sdk) return null;
            let provider = null;
            try {
                provider = await getEthereumProviderForRead(sdk);
            } catch (_) {}
            if (!provider) provider = window.farcasterProvider || null;
            if (provider && typeof provider.request === 'function') {
                const accounts = await provider.request({ method: 'eth_accounts', params: [] });
                account = accounts?.[0] || null;
                if (account && typeof window !== 'undefined') window.__baseInvadersWalletAddress = account;
            }
            if (!account && typeof window.baseInvadersGetCustodyAddressByFid === 'function') {
                account = await window.baseInvadersGetCustodyAddressByFid();
                if (account && typeof window !== 'undefined') window.__baseInvadersWalletAddress = account;
            }
        } catch (_) {}
    }
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

        await callMiniAppReady(sdk);
        console.log('[miniapp] callMiniAppReady() done');

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
        await callMiniAppReady(sdk);
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

        await callMiniAppReady(sdk);

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

/** Get current user's streak from leaderboard (on-chain, syncs across devices). Returns streak number or null if not in top 100. */
window.baseInvadersGetCurrentUserStreakFromLeaderboard = async function () {
    let account = (typeof window !== 'undefined' && window.__baseInvadersWalletAddress) || null;
    if (!account) {
        try {
            const sdk = getSdk();
            if (!sdk) return null;
            let provider = null;
            try {
                provider = await getEthereumProviderForRead(sdk);
            } catch (_) {}
            if (!provider) provider = window.farcasterProvider || null;
            if (provider && typeof provider.request === 'function') {
                const accounts = await provider.request({ method: 'eth_accounts', params: [] });
                account = accounts?.[0] || null;
                if (account && typeof window !== 'undefined') window.__baseInvadersWalletAddress = account;
            }
            if (!account && typeof window.baseInvadersGetCustodyAddressByFid === 'function') {
                account = await window.baseInvadersGetCustodyAddressByFid();
                if (account && typeof window !== 'undefined') window.__baseInvadersWalletAddress = account;
            }
        } catch (_) {}
    }
    if (!account || typeof window.baseInvadersGetLeaderboard !== 'function') return null;
    try {
        const viem = await getViem();
        const { getAddress } = viem;
        const addrLower = getAddress(account).toLowerCase();
        const data = await window.baseInvadersGetLeaderboard();
        const arr = Array.isArray(data) ? data : [];
        for (const row of arr) {
            const player = row[0];
            if (!player) continue;
            const p = (typeof player === 'string' ? player : '').toLowerCase();
            if (p === addrLower) {
                const streak = row[4];
                const n = typeof streak === 'bigint' ? Number(streak) : Number(streak);
                return Number.isFinite(n) && n >= 0 ? n : null;
            }
        }
        return null;
    } catch (e) {
        console.warn('[miniapp] getCurrentUserStreakFromLeaderboard failed', e?.message || e);
        return null;
    }
};

window.baseInvadersGetLeaderboard = async function () {
    console.log('[miniapp] baseInvadersGetLeaderboard start');
    const viem = await getViem();
    const baseChain = viem.base || (await import('https://esm.sh/viem/chains').then((m) => m.base));
    const { createPublicClient, parseAbi, custom } = viem;
    const http = viem.http;
    const LEADERBOARD_ABI = parseAbi([
        'function getTopPlayers() view returns ((address,string,uint256,uint256,uint256,uint256)[])',
        'function lastCheckIn(address) view returns (uint256)'
    ]);
    const CHECKIN_READ_ABI = parseAbi(['function lastCheckInDay(address) view returns (uint256)']);

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
            // Check-in date: read from check-in contract (lastCheckInDay → timestamp for display); fallback to leaderboard lastCheckIn
            const withCheckIn = await Promise.all(arr.map(async (row) => {
                const player = row[0];
                let checkInTs = 0n;
                try {
                    const day = await client.readContract({ address: CHECKIN_ADDR, abi: CHECKIN_READ_ABI, functionName: 'lastCheckInDay', args: [player] });
                    const d = typeof day === 'bigint' ? Number(day) : Number(day);
                    if (d > 0) checkInTs = BigInt(d * 86400);
                } catch (_) { /* check-in contract read failed */ }
                if (checkInTs === 0n) {
                    try {
                        checkInTs = await client.readContract({ address: LEADERBOARD_ADDR, abi: LEADERBOARD_ABI, functionName: 'lastCheckIn', args: [player] });
                    } catch (_) {}
                }
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
    await callMiniAppReady(sdk);
    console.log('[miniapp] SDK ready OK (or skipped after timeout)');
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
            await callMiniAppReady(sdk);
            console.log('[miniapp] DOMContentLoaded – SDK ready (or Base App timeout)');
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
