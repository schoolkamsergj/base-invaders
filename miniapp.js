/**
 * Base Invaders – Farcaster Mini App wallet (vanilla JS).
 * SDK from UMD (window.MiniAppSDK), viem loaded at runtime (no static import).
 * Must be loaded as <script type="module"> for dynamic import(viem).
 */
const CHECKIN_ADDR = '0xb13102BbC97C25ba39967208eDd20b109104AAF4';
const LEADERBOARD_ADDR = '0x76762B1535C3D2004a996e76c776e7C946aF03FB';

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

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
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
    console.log('[miniapp] baseInvadersSubmitScore start', score, wave, streak, name);
    try {
        const sdk = getSdk();
        if (!sdk) throw new Error('Farcaster SDK not loaded');
        console.log('[miniapp] sdk.version:', sdk?.version || sdk?.sdkVersion || 'unknown');
        if (typeof sdk.ready === 'function') await sdk.ready();
        else if (sdk.actions && typeof sdk.actions.ready === 'function') await sdk.actions.ready({ disableNativeGestures: false });
        const { provider, account } = await ensureWalletProvider(sdk);
        if (!provider || !account) throw new Error('Wallet not connected');

        const viem = await getViem();
        const baseChain = viem.base || (await import('https://esm.sh/viem/chains').then((m) => m.base));
        const { createWalletClient, custom, parseAbi, getAddress } = viem;
        const LEADERBOARD_ABI = parseAbi(['function submitScore(uint256,uint256,uint256,string) external']);

        const client = createWalletClient({ chain: baseChain, transport: custom(provider) });
        const accountObj = { address: getAddress(account), type: 'json-rpc' };
        const hash = await client.writeContract({
            address: LEADERBOARD_ADDR,
            abi: LEADERBOARD_ABI,
            functionName: 'submitScore',
            args: [BigInt(score), BigInt(wave), BigInt(streak), (name || '').toString()],
            account: accountObj,
            value: 0n
        });
        console.log('[miniapp] submitScore hash:', hash);
        window.dispatchEvent(new CustomEvent('base-invaders:wallet-connected', { detail: { address: account } }));
        return { success: true, hash };
    } catch (e) {
        console.error('[miniapp] SubmitScore tx failed', e);
        throw e;
    }
};

window.baseInvadersGetLeaderboard = async function () {
    console.log('[miniapp] baseInvadersGetLeaderboard start');
    try {
        const viem = await getViem();
        const baseChain = viem.base || (await import('https://esm.sh/viem/chains').then((m) => m.base));
        const { createPublicClient, http, parseAbi } = viem;
        const LEADERBOARD_ABI = parseAbi(['function getTopPlayers() view returns (tuple(address player, string name, uint256 score, uint256 wave, uint256 streak, uint256 timestamp)[])']);
        // Use public Base RPC so leaderboard works without wallet
        const client = createPublicClient({
            chain: baseChain,
            transport: http('https://mainnet.base.org')
        });
        const data = await client.readContract({ address: LEADERBOARD_ADDR, abi: LEADERBOARD_ABI, functionName: 'getTopPlayers' });
        console.log('[miniapp] getTopPlayers entries:', Array.isArray(data) ? data.length : 0);
        return Array.isArray(data) ? data : [];
    } catch (e) {
        console.error('[miniapp] getLeaderboard failed', e);
        return [];
    }
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

document.addEventListener('DOMContentLoaded', async () => {
    console.log('[miniapp] DOMContentLoaded');
    try {
        const sdk = getSdk();
        if (sdk) {
            if (typeof sdk.ready === 'function') await sdk.ready();
            else if (sdk.actions && typeof sdk.actions.ready === 'function') await sdk.actions.ready({ disableNativeGestures: false });
            console.log('[miniapp] DOMContentLoaded – SDK ready');
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

console.log('[miniapp] Loaded (SDK UMD, viem runtime). Test: window.debugCheckIn()');
