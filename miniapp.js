/**
 * Base Invaders – Farcaster Mini App wallet (vanilla JS, ESM).
 * viem + @farcaster/miniapp-sdk, нульова tx на Base.
 */
import { createWalletClient, createPublicClient, custom, parseAbi, getAddress } from 'https://esm.sh/viem';
import { base } from 'https://esm.sh/viem/chains';
import { sdk } from 'https://cdn.jsdelivr.net/npm/@farcaster/miniapp-sdk@0.2.1/+esm';

const CHECKIN_ADDR = '0xb13102BbC97C25ba39967208eDd20b109104AAF4';
const LEADERBOARD_ADDR = '0x76762B1535C3D2004a996e76c776e7C946aF03FB';

const CHECKIN_ABI = parseAbi(['function checkIn() external']);
const LEADERBOARD_ABI = parseAbi([
    'function submitScore(uint256,uint256,uint256,string) external',
    'function getTopPlayers() view returns (tuple(address player, string name, uint256 score, uint256 wave, uint256 streak, uint256 timestamp)[])'
]);

function getWalletClient(provider) {
    return createWalletClient({ chain: base, transport: custom(provider) });
}

function getPublicClient(provider) {
    return createPublicClient({ chain: base, transport: custom(provider) });
}

// ─── Check-in onchain ──────────────────────────────────────────────────────
window.baseInvadersOnchainCheckIn = async function () {
    try {
        console.log('[miniapp] baseInvadersOnchainCheckIn start');
        await sdk.actions.ready({ disableNativeGestures: false });
        if (typeof sdk.actions?.requestCapabilities === 'function') {
            await sdk.actions.requestCapabilities(['wallet']).catch(() => {});
        }
        const provider = await sdk.wallet.getEthereumProvider();
        if (!provider || typeof provider.request !== 'function') {
            throw new Error('Farcaster wallet provider not available');
        }
        const accounts = await provider.request({ method: 'eth_requestAccounts', params: [] });
        const address = accounts?.[0];
        if (!address) throw new Error('Wallet not connected');
        const client = getWalletClient(provider);
        const account = { address: getAddress(address), type: 'json-rpc' };
        const hash = await client.writeContract({
            address: CHECKIN_ADDR,
            abi: CHECKIN_ABI,
            functionName: 'checkIn',
            account,
            value: 0n
        });
        console.log('[miniapp] checkIn hash', hash);
        window.dispatchEvent(new CustomEvent('base-invaders:wallet-connected', { detail: { address } }));
        return { success: true, hash };
    } catch (e) {
        console.error('[miniapp] CheckIn tx failed', e);
        throw e;
    }
};

// ─── Submit leaderboard score ───────────────────────────────────────────────
window.baseInvadersSubmitScore = async function (score, wave, streak, name) {
    try {
        console.log('[miniapp] baseInvadersSubmitScore start');
        await sdk.actions.ready({ disableNativeGestures: false });
        if (typeof sdk.actions?.requestCapabilities === 'function') {
            await sdk.actions.requestCapabilities(['wallet']).catch(() => {});
        }
        const provider = await sdk.wallet.getEthereumProvider();
        if (!provider || typeof provider.request !== 'function') {
            throw new Error('Farcaster wallet provider not available');
        }
        const accounts = await provider.request({ method: 'eth_requestAccounts', params: [] });
        const address = accounts?.[0];
        if (!address) throw new Error('Wallet not connected');
        const client = getWalletClient(provider);
        const account = { address: getAddress(address), type: 'json-rpc' };
        const hash = await client.writeContract({
            address: LEADERBOARD_ADDR,
            abi: LEADERBOARD_ABI,
            functionName: 'submitScore',
            args: [BigInt(score), BigInt(wave), BigInt(streak), (name || '').toString()],
            account,
            value: 0n
        });
        console.log('[miniapp] submitScore hash', hash);
        window.dispatchEvent(new CustomEvent('base-invaders:wallet-connected', { detail: { address } }));
        return { success: true, hash };
    } catch (e) {
        console.error('[miniapp] SubmitScore tx failed', e);
        throw e;
    }
};

// ─── Fetch leaderboard (read-only) ───────────────────────────────────────────
window.baseInvadersGetLeaderboard = async function () {
    try {
        const provider = await sdk.wallet.getEthereumProvider();
        if (!provider) return [];
        const client = getPublicClient(provider);
        const data = await client.readContract({
            address: LEADERBOARD_ADDR,
            abi: LEADERBOARD_ABI,
            functionName: 'getTopPlayers'
        });
        return Array.isArray(data) ? data : [];
    } catch (e) {
        console.error('[miniapp] getLeaderboard failed', e);
        return [];
    }
};

window.baseInvadersMarkMiniAppReady = async function () {
    try {
        await sdk.actions.ready({ disableNativeGestures: false });
        console.log('[miniapp] SDK ready OK');
    } catch (e) {
        console.error('[miniapp] ready failed', e?.message);
    }
};
window.baseInvadersMiniAppSdk = sdk;

// ─── DOMContentLoaded: sdk.ready() + dispatch game-ready ─────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await sdk.actions.ready({ disableNativeGestures: false });
        console.log('[miniapp] DOMContentLoaded – SDK ready');
        window.dispatchEvent(new Event('base-invaders:game-ready'));
    } catch (e) {
        console.error('[miniapp] DOMContentLoaded ready failed', e);
        window.dispatchEvent(new Event('base-invaders:game-ready'));
    }
});

// Тест у консолі: window.__debugCheckIn()
window.__debugCheckIn = async function () {
    try {
        const result = await window.baseInvadersOnchainCheckIn();
        console.log('Check-in OK', result);
        alert('Check-in OK! Hash: ' + (result?.hash ?? ''));
    } catch (e) {
        console.error('Check-in failed', e);
        alert('Check-in failed: ' + (e?.message ?? e));
    }
};

console.log('[miniapp] Loaded (viem + Farcaster SDK). Test: window.__debugCheckIn()');
