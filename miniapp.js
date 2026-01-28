// Prefer jsdelivr (works in Farcaster WebView); fallback esm.sh
import { sdk } from 'https://cdn.jsdelivr.net/npm/@farcaster/miniapp-sdk@0.2.1/+esm';
import {
    connect,
    createConfig,
    getAccount,
    readContract,
    waitForTransactionReceipt,
    writeContract
} from 'https://esm.sh/@wagmi/core@latest';
import { injected } from 'https://esm.sh/@wagmi/core@latest/connectors';
import { base } from 'https://esm.sh/@wagmi/core@latest/chains';
import { custom, encodeFunctionData } from 'https://esm.sh/viem@latest';

const CHECK_IN_CONTRACT = {
    chainId: base.id,
    address: '0xb13102BbC97C25ba39967208eDd20b109104AAF4',
    abi: [
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'user',
                    type: 'address'
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'timestamp',
                    type: 'uint256'
                }
            ],
            name: 'CheckedIn',
            type: 'event'
        },
        {
            inputs: [],
            name: 'checkIn',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function'
        },
        {
            inputs: [],
            name: 'COOLDOWN',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256'
                }
            ],
            stateMutability: 'view',
            type: 'function'
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address'
                }
            ],
            name: 'lastCheckIn',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256'
                }
            ],
            stateMutability: 'view',
            type: 'function'
        }
    ],
    functionName: 'checkIn',
    args: []
};

const LEADERBOARD_CONTRACT = {
    chainId: base.id,
    address: '0x76762B1535C3D2004a996e76c776e7C946aF03FB',
    abi: [
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'player',
                    type: 'address'
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'score',
                    type: 'uint256'
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'wave',
                    type: 'uint256'
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'streak',
                    type: 'uint256'
                },
                {
                    indexed: false,
                    internalType: 'string',
                    name: 'name',
                    type: 'string'
                }
            ],
            name: 'ScoreSubmitted',
            type: 'event'
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: 'score',
                    type: 'uint256'
                },
                {
                    internalType: 'uint256',
                    name: 'wave',
                    type: 'uint256'
                },
                {
                    internalType: 'uint256',
                    name: 'streak',
                    type: 'uint256'
                },
                {
                    internalType: 'string',
                    name: 'name',
                    type: 'string'
                }
            ],
            name: 'submitScore',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function'
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256'
                }
            ],
            name: 'entries',
            outputs: [
                {
                    internalType: 'address',
                    name: 'player',
                    type: 'address'
                },
                {
                    internalType: 'string',
                    name: 'name',
                    type: 'string'
                },
                {
                    internalType: 'uint256',
                    name: 'score',
                    type: 'uint256'
                },
                {
                    internalType: 'uint256',
                    name: 'wave',
                    type: 'uint256'
                },
                {
                    internalType: 'uint256',
                    name: 'streak',
                    type: 'uint256'
                },
                {
                    internalType: 'uint256',
                    name: 'timestamp',
                    type: 'uint256'
                }
            ],
            stateMutability: 'view',
            type: 'function'
        },
        {
            inputs: [],
            name: 'getTopPlayers',
            outputs: [
                {
                    components: [
                        {
                            internalType: 'address',
                            name: 'player',
                            type: 'address'
                        },
                        {
                            internalType: 'string',
                            name: 'name',
                            type: 'string'
                        },
                        {
                            internalType: 'uint256',
                            name: 'score',
                            type: 'uint256'
                        },
                        {
                            internalType: 'uint256',
                            name: 'wave',
                            type: 'uint256'
                        },
                        {
                            internalType: 'uint256',
                            name: 'streak',
                            type: 'uint256'
                        },
                        {
                            internalType: 'uint256',
                            name: 'timestamp',
                            type: 'uint256'
                        }
                    ],
                    internalType: 'struct BaseInvadersLeaderboard.Entry[]',
                    name: '',
                    type: 'tuple[]'
                }
            ],
            stateMutability: 'view',
            type: 'function'
        },
        {
            inputs: [],
            name: 'MAX_ENTRIES',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256'
                }
            ],
            stateMutability: 'view',
            type: 'function'
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address'
                }
            ],
            name: 'playerIndex',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256'
                }
            ],
            stateMutability: 'view',
            type: 'function'
        }
    ]
};

let wagmiConfigPromise = null;
let readyCalled = false;
let connectedAddress = null;

async function initializeMiniApp() {
    try {
        const provider = await sdk.wallet.getEthereumProvider();
        if (!window.ethereum) {
            window.ethereum = provider;
        }

        const config = createConfig({
            chains: [base],
            connectors: [injected({ shimDisconnect: true })],
            transports: {
                [base.id]: custom(provider)
            }
        });

        // Auto-connect Farcaster wallet
        try {
            await connect(config, { connector: injected({ shimDisconnect: true }) });
            const account = getAccount(config);
            if (account.address) {
                connectedAddress = account.address;
                window.dispatchEvent(new CustomEvent('base-invaders:wallet-connected', { detail: { address: account.address } }));
                console.log('✅ Wallet connected:', account.address);
            }
        } catch (error) {
            console.warn('Auto-connect failed (user may need to connect manually):', error);
        }

        return config;
    } catch (error) {
        console.error('Failed to initialize mini app:', error);
        throw error;
    }
}

async function getWagmiConfig() {
    if (wagmiConfigPromise) return wagmiConfigPromise;

    wagmiConfigPromise = initializeMiniApp();
    return wagmiConfigPromise;
}

async function checkInOnchain() {
    if (!CHECK_IN_CONTRACT.address || CHECK_IN_CONTRACT.address === '0x0000000000000000000000000000000000000000') {
        throw new Error('Check-in contract address is not configured.');
    }

    try {
        const provider = await sdk.wallet.getEthereumProvider();
        if (!provider || typeof provider.request !== 'function') {
            throw new Error('Farcaster wallet provider not available.');
        }
        const accounts = await provider.request({ method: 'eth_requestAccounts', params: [] });
        const from = (accounts && accounts[0]) ? accounts[0] : null;
        if (!from) {
            throw new Error('Wallet not connected. Please connect your wallet in Farcaster.');
        }
        connectedAddress = from;
        window.dispatchEvent(new CustomEvent('base-invaders:wallet-connected', { detail: { address: from } }));
        const data = encodeFunctionData({
            abi: CHECK_IN_CONTRACT.abi,
            functionName: 'checkIn',
            args: []
        });
        const tx = {
            from,
            to: CHECK_IN_CONTRACT.address,
            data,
            chainId: `0x${CHECK_IN_CONTRACT.chainId.toString(16)}`,
            value: '0x0'
        };
        const hash = await provider.request({ method: 'eth_sendTransaction', params: [tx] });
        if (!hash || typeof hash !== 'string') {
            throw new Error('Transaction was not sent.');
        }
        const config = await getWagmiConfig().catch(() => null);
        if (config) {
            return waitForTransactionReceipt(config, { hash });
        }
        return { hash };
    } catch (directErr) {
        console.warn('[miniapp] Direct provider check-in failed, trying wagmi:', directErr);
    }

    const config = await getWagmiConfig();
    window.ethereum = window.ethereum || await sdk.wallet.getEthereumProvider();
    const account = getAccount(config);
    if (!account.address || !connectedAddress) {
        await connect(config, { connector: injected({ shimDisconnect: true }) });
        const newAccount = getAccount(config);
        if (newAccount.address) {
            connectedAddress = newAccount.address;
            window.dispatchEvent(new CustomEvent('base-invaders:wallet-connected', { detail: { address: newAccount.address } }));
        }
    }

    const finalAccount = getAccount(config);
    if (!finalAccount.address) {
        throw new Error('Wallet not connected. Please connect your wallet.');
    }

    const hash = await writeContract(config, {
        address: CHECK_IN_CONTRACT.address,
        abi: CHECK_IN_CONTRACT.abi,
        functionName: CHECK_IN_CONTRACT.functionName,
        args: CHECK_IN_CONTRACT.args,
        chainId: CHECK_IN_CONTRACT.chainId,
        account: finalAccount.address
    });

    return waitForTransactionReceipt(config, { hash });
}

async function submitLeaderboardScore(score, wave, streak, name) {
    if (!LEADERBOARD_CONTRACT.address || LEADERBOARD_CONTRACT.address === '0x0000000000000000000000000000000000000000') {
        throw new Error('Leaderboard contract address is not configured.');
    }

    const config = await getWagmiConfig();
    await connect(config, { connector: injected({ shimDisconnect: true }) });

    const account = getAccount(config);
    const hash = await writeContract(config, {
        address: LEADERBOARD_CONTRACT.address,
        abi: LEADERBOARD_CONTRACT.abi,
        functionName: 'submitScore',
        args: [score, wave, streak, name || ''],
        chainId: LEADERBOARD_CONTRACT.chainId,
        account: account.address
    });

    return waitForTransactionReceipt(config, { hash });
}

async function fetchLeaderboard() {
    if (!LEADERBOARD_CONTRACT.address || LEADERBOARD_CONTRACT.address === '0x0000000000000000000000000000000000000000') {
        throw new Error('Leaderboard contract address is not configured.');
    }

    const config = await getWagmiConfig();
    return readContract(config, {
        address: LEADERBOARD_CONTRACT.address,
        abi: LEADERBOARD_CONTRACT.abi,
        functionName: 'getTopPlayers',
        chainId: LEADERBOARD_CONTRACT.chainId
    });
}

/**
 * Call Farcaster Mini App SDK ready() to hide splash and show app.
 * MUST be called after game canvas is visible (e.g. from MenuScene.create() or game-ready).
 */
async function markMiniAppReady() {
    if (readyCalled) {
        console.log('[miniapp] markMiniAppReady already called, skip');
        return;
    }
    readyCalled = true;
    console.log('[miniapp] Calling sdk.actions.ready()...');

    try {
        await sdk.actions.ready({ disableNativeGestures: false });
        console.log('[miniapp] SDK ready() OK – splash should hide, app visible');
        window.dispatchEvent(new Event('base-invaders:wallet-connected'));
    } catch (error) {
        console.error('[miniapp] sdk.actions.ready() failed:', error);
    }
}

// Expose so game can call when first scene is ready (canvas in DOM)
window.baseInvadersMarkMiniAppReady = markMiniAppReady;

window.baseInvadersOnchainCheckIn = checkInOnchain;
window.baseInvadersSubmitScore = submitLeaderboardScore;
window.baseInvadersGetLeaderboard = fetchLeaderboard;
window.baseInvadersMiniAppSdk = sdk;

// Prefer: ready() when Phaser has booted and first scene is ready
window.addEventListener('base-invaders:game-ready', () => {
    console.log('[miniapp] base-invaders:game-ready received');
    markMiniAppReady();
    getWagmiConfig().catch(err => console.warn('[miniapp] Wallet init failed:', err));
});

// Fallback: if game-ready never fires (e.g. miniapp loaded late), call ready() after delay
const READY_FALLBACK_MS = 2500;
window.addEventListener('load', () => {
    console.log('[miniapp] window load – scheduling ready() fallback in', READY_FALLBACK_MS, 'ms');
    setTimeout(() => {
        if (!readyCalled) {
            console.log('[miniapp] Fallback: calling markMiniAppReady() (game-ready may have been missed)');
            markMiniAppReady();
        }
        getWagmiConfig().catch(err => console.warn('[miniapp] Wallet init failed:', err));
    }, READY_FALLBACK_MS);
});
