/**
 * Base Invaders – Farcaster/Base Mini App wallet integration (ESM).
 * Uses @wagmi/core + @farcaster/miniapp-wagmi-connector for transactions.
 */
import { sdk } from 'https://cdn.jsdelivr.net/npm/@farcaster/miniapp-sdk@0.2.1/+esm';
import {
    createConfig,
    http,
    getAccount,
    connect,
    writeContract,
    readContract,
    waitForTransactionReceipt
} from 'https://esm.sh/@wagmi/core';
import { base } from 'https://esm.sh/@wagmi/core/chains';
import { farcasterMiniApp } from 'https://cdn.jsdelivr.net/npm/@farcaster/miniapp-wagmi-connector@0.2/+esm';
import { parseAbi } from 'https://esm.sh/viem';

// ─── Wagmi config (Farcaster Mini App connector) ─────────────────────────────
const config = createConfig({
    chains: [base],
    transports: { [base.id]: http() },
    connectors: [farcasterMiniApp()]
});

const CHECK_IN_ADDRESS = '0xb13102BbC97C25ba39967208eDd20b109104AAF4';
const LEADERBOARD_ADDRESS = '0x76762B1535C3D2004a996e76c776e7C946aF03FB';

const checkInAbi = parseAbi(['function checkIn() external']);
const leaderboardAbi = parseAbi([
    'function submitScore(uint256 score, uint256 wave, uint256 streak, string name) external',
    'function getTopPlayers() view returns (tuple(address player, string name, uint256 score, uint256 wave, uint256 streak, uint256 timestamp)[])'
]);

let readyCalled = false;

// ─── Farcaster splash: ready() ────────────────────────────────────────────
async function markMiniAppReady() {
    if (readyCalled) return;
    readyCalled = true;
    try {
        await sdk.actions.ready({ disableNativeGestures: false });
        console.log('[miniapp] SDK ready() OK – splash hidden');
    } catch (e) {
        console.error('[miniapp] ready() failed:', e?.message);
    }
}

// ─── Check-in onchain (wagmi + Farcaster connector) ────────────────────────
window.baseInvadersOnchainCheckIn = async function () {
    let account = getAccount(config);
    if (!account?.address) {
        const connector = config.connectors[0];
        if (!connector) throw new Error('Farcaster Mini App connector not found');
        await connect(config, { connector });
        account = getAccount(config);
    }
    if (!account?.address) throw new Error('Wallet not connected');

    try {
        const hash = await writeContract(config, {
            address: CHECK_IN_ADDRESS,
            abi: checkInAbi,
            functionName: 'checkIn',
            chainId: base.id
        });
        window.dispatchEvent(new CustomEvent('base-invaders:wallet-connected', { detail: { address: account.address } }));
        return { success: true, hash };
    } catch (e) {
        console.error('CheckIn tx failed', e);
        throw e;
    }
};

// ─── Submit leaderboard score ───────────────────────────────────────────────
window.baseInvadersSubmitScore = async function (score, wave, streak, name) {
    let account = getAccount(config);
    if (!account?.address) {
        const connector = config.connectors[0];
        if (!connector) throw new Error('Farcaster Mini App connector not found');
        await connect(config, { connector });
        account = getAccount(config);
    }
    if (!account?.address) throw new Error('Wallet not connected');

    try {
        const hash = await writeContract(config, {
            address: LEADERBOARD_ADDRESS,
            abi: leaderboardAbi,
            functionName: 'submitScore',
            args: [BigInt(score), BigInt(wave), BigInt(streak), (name || '').toString()],
            chainId: base.id
        });
        window.dispatchEvent(new CustomEvent('base-invaders:wallet-connected', { detail: { address: account.address } }));
        return { success: true, hash };
    } catch (e) {
        console.error('SubmitScore tx failed', e);
        throw e;
    }
};

// ─── Fetch leaderboard (read-only) ──────────────────────────────────────────
window.baseInvadersGetLeaderboard = async function () {
    const data = await readContract(config, {
        address: LEADERBOARD_ADDRESS,
        abi: leaderboardAbi,
        functionName: 'getTopPlayers',
        chainId: base.id
    });
    return Array.isArray(data) ? data : [];
};

window.baseInvadersMarkMiniAppReady = markMiniAppReady;
window.baseInvadersMiniAppSdk = sdk;

// ─── Init on load: wagmi ready, then game-ready ─────────────────────────────
window.addEventListener('load', () => {
    console.log('[miniapp] load – wagmi config ready');
    markMiniAppReady();
    window.dispatchEvent(new Event('base-invaders:game-ready'));
});

window.addEventListener('base-invaders:game-ready', () => {
    console.log('[miniapp] game-ready – ensuring SDK ready');
    markMiniAppReady();
});

// Debug: викликати в console: window.__debugCheckIn()
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

console.log('[miniapp] Loaded (wagmi + farcasterMiniApp). Test: window.__debugCheckIn()');
