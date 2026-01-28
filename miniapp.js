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
    console.log('═══════════════════════════════════════');
    console.log('🔗 [CHECKIN] FUNCTION START');
    console.log('🔗 [CHECKIN] Contract:', CHECK_IN_CONTRACT.address);
    console.log('🔗 [CHECKIN] Chain ID:', CHECK_IN_CONTRACT.chainId);
    console.log('═══════════════════════════════════════');
    
    // Validate contract address
    if (!CHECK_IN_CONTRACT.address || CHECK_IN_CONTRACT.address === '0x0000000000000000000000000000000000000000') {
        console.error('❌ [CHECKIN] Contract address invalid!');
        throw new Error('Check-in contract address is not configured.');
    }

    try {
        // Step 1: Get provider
        console.log('🔗 [CHECKIN] Step 1/5: Getting provider...');
        const provider = await sdk.wallet.getEthereumProvider();
        console.log('✅ [CHECKIN] Provider obtained:', {
            exists: !!provider,
            hasRequest: typeof provider?.request === 'function',
            providerType: provider?.constructor?.name
        });
        
        if (!provider || typeof provider.request !== 'function') {
            console.error('❌ [CHECKIN] Provider not available or no request method');
            throw new Error('Farcaster wallet provider not available.');
        }

        // Step 2: Request accounts
        console.log('🔗 [CHECKIN] Step 2/5: Requesting accounts...');
        console.log('   Calling provider.request({ method: "eth_requestAccounts" })');
        
        const accounts = await provider.request({ 
            method: 'eth_requestAccounts', 
            params: [] 
        });
        
        console.log('✅ [CHECKIN] Accounts received:', {
            count: accounts?.length || 0,
            firstAccount: accounts?.[0] || 'none',
            allAccounts: accounts
        });
        
        const from = (accounts && accounts[0]) ? accounts[0] : null;
        
        if (!from) {
            console.error('❌ [CHECKIN] No account returned from provider');
            throw new Error('Wallet not connected. Please connect your wallet in Farcaster.');
        }

        // Step 3: Save connected address
        console.log('🔗 [CHECKIN] Step 3/5: Connected address:', from);
        connectedAddress = from;
        window.dispatchEvent(new CustomEvent('base-invaders:wallet-connected', { 
            detail: { address: from } 
        }));

        // Step 4: Encode function data
        console.log('🔗 [CHECKIN] Step 4/5: Encoding function call...');
        const data = encodeFunctionData({
            abi: CHECK_IN_CONTRACT.abi,
            functionName: 'checkIn',
            args: []
        });
        console.log('✅ [CHECKIN] Encoded data:', data);

        // Step 5: Build and send transaction
        const tx = {
            from,
            to: CHECK_IN_CONTRACT.address,
            data,
            chainId: `0x${CHECK_IN_CONTRACT.chainId.toString(16)}`,
            value: '0x0'
        };
        
        console.log('🔗 [CHECKIN] Step 5/5: Sending transaction...');
        console.log('   Transaction params:', JSON.stringify(tx, null, 2));
        console.log('   Calling provider.request({ method: "eth_sendTransaction" })');
        
        const hash = await provider.request({ 
            method: 'eth_sendTransaction', 
            params: [tx] 
        });
        
        console.log('═══════════════════════════════════════');
        console.log('✅✅✅ [CHECKIN] TRANSACTION SENT! ✅✅✅');
        console.log('✅ Transaction hash:', hash);
        console.log('═══════════════════════════════════════');
        
        if (!hash || typeof hash !== 'string') {
            console.error('❌ [CHECKIN] Invalid hash returned:', hash);
            throw new Error('Transaction was not sent properly.');
        }

        // Try to wait for receipt
        const config = await getWagmiConfig().catch(() => null);
        if (config) {
            console.log('🔗 [CHECKIN] Waiting for transaction receipt...');
            return waitForTransactionReceipt(config, { hash });
        }

        return { hash };
        
    } catch (error) {
        console.log('═══════════════════════════════════════');
        console.error('❌❌❌ [CHECKIN] EXCEPTION CAUGHT ❌❌❌');
        console.error('❌ Error type:', error.constructor.name);
        console.error('❌ Error message:', error.message);
        console.error('❌ Error code:', error.code);
        console.error('❌ Full error:', error);
        console.log('═══════════════════════════════════════');
        
        // Re-throw so UI can handle it
        throw error;
    }
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

// ═══════════════════════════════════════
// DEBUG HELPER - Manual transaction test
// ═══════════════════════════════════════
window.__debugCheckIn = async function() {
    console.log('🧪 [DEBUG] Manual test started...');
    
    if (typeof window.baseInvadersOnchainCheckIn !== 'function') {
        console.error('❌ [DEBUG] Function not available!');
        alert('ERROR: SDK function not exported. Check miniapp.js loading.');
        return;
    }
    
    try {
        console.log('🧪 [DEBUG] Calling check-in...');
        const result = await window.baseInvadersOnchainCheckIn();
        console.log('✅ [DEBUG] Success:', result);
        alert('✅ Transaction worked!\nHash: ' + (result?.hash || 'unknown'));
    } catch (error) {
        console.error('❌ [DEBUG] Failed:', error);
        alert('❌ Transaction failed:\n' + error.message);
    }
};

console.log('🧪 Debug helper loaded. Use: window.__debugCheckIn()');
