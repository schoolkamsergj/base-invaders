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
    console.log('🔗 [CHECK-IN] Starting transaction...');
    console.log('═══════════════════════════════════════');
    
    // Validate contract
    if (!CHECK_IN_CONTRACT.address || CHECK_IN_CONTRACT.address === '0x0000000000000000000000000000000000000000') {
        console.error('❌ Contract address not configured');
        throw new Error('Check-in contract address is not configured.');
    }
    
    console.log('✅ Contract:', CHECK_IN_CONTRACT.address);
    console.log('✅ Chain ID:', CHECK_IN_CONTRACT.chainId);

    try {
        // Step 1: Ensure wagmi config is initialized
        console.log('🔗 Step 1/6: Initializing wagmi config...');
        await getWagmiConfig().catch(e => {
            console.warn('Config init warning (may be ok):', e.message);
        });
        
        // Give SDK time to initialize if needed
        console.log('🔗 Waiting 500ms for SDK...');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Step 2: Get provider
        console.log('🔗 Step 2/6: Getting Ethereum provider...');
        const provider = await sdk.wallet.getEthereumProvider();
        
        if (!provider) {
            console.error('❌ Provider is null/undefined');
            throw new Error('Farcaster wallet provider not available. Try reopening the Mini App.');
        }
        
        if (typeof provider.request !== 'function') {
            console.error('❌ Provider has no request method');
            throw new Error('Wallet provider is invalid.');
        }
        
        console.log('✅ Provider obtained');

        // Step 3: Request accounts
        console.log('🔗 Step 3/6: Requesting wallet accounts...');
        console.log('   Calling: provider.request({ method: "eth_requestAccounts" })');
        
        const accounts = await provider.request({ 
            method: 'eth_requestAccounts', 
            params: [] 
        });
        
        console.log('✅ Accounts returned:', {
            count: accounts?.length || 0,
            first: accounts?.[0]?.substring(0, 10) + '...' || 'none'
        });
        
        const from = (accounts && accounts[0]) ? accounts[0] : null;
        
        if (!from) {
            console.error('❌ No account address returned');
            throw new Error('Wallet not connected. Please connect your wallet in Warpcast.');
        }

        // Step 4: Save connected address
        console.log('🔗 Step 4/6: Connected to wallet:', from.substring(0, 10) + '...');
        connectedAddress = from;
        window.dispatchEvent(new CustomEvent('base-invaders:wallet-connected', { 
            detail: { address: from } 
        }));

        // Step 5: Encode transaction data
        console.log('🔗 Step 5/6: Encoding function call...');
        const data = encodeFunctionData({
            abi: CHECK_IN_CONTRACT.abi,
            functionName: 'checkIn',
            args: []
        });
        console.log('✅ Encoded data:', data.substring(0, 20) + '...');

        // Step 6: Build and send transaction
        const tx = {
            from,
            to: CHECK_IN_CONTRACT.address,
            data,
            chainId: `0x${CHECK_IN_CONTRACT.chainId.toString(16)}`, // Base = 0x2105
            value: '0x0'
        };
        
        console.log('🔗 Step 6/6: Sending transaction...');
        console.log('   From:', tx.from.substring(0, 10) + '...');
        console.log('   To:', tx.to);
        console.log('   Chain:', tx.chainId, '(Base)');
        console.log('   Calling: provider.request({ method: "eth_sendTransaction" })');
        
        const hash = await provider.request({ 
            method: 'eth_sendTransaction', 
            params: [tx] 
        });
        
        console.log('═══════════════════════════════════════');
        console.log('✅✅✅ TRANSACTION SENT SUCCESSFULLY! ✅✅✅');
        console.log('✅ Hash:', hash);
        console.log('═══════════════════════════════════════');
        
        if (!hash || typeof hash !== 'string') {
            console.error('❌ Invalid hash returned:', hash);
            throw new Error('Transaction was not sent properly.');
        }

        // Try to wait for receipt (optional)
        const config = await getWagmiConfig().catch(() => null);
        if (config) {
            console.log('⏳ Waiting for transaction receipt...');
            return waitForTransactionReceipt(config, { hash });
        }

        return { hash };
        
    } catch (error) {
        console.log('═══════════════════════════════════════');
        console.error('❌❌❌ TRANSACTION FAILED ❌❌❌');
        console.error('❌ Error type:', error.constructor?.name || 'Unknown');
        console.error('❌ Error message:', error.message);
        console.error('❌ Error code:', error.code);
        if (error.stack) {
            console.error('❌ Stack trace:', error.stack.split('\n').slice(0, 3).join('\n'));
        }
        console.log('═══════════════════════════════════════');
        
        // Re-throw with better message
        if (error.message.includes('User rejected')) {
            throw new Error('Transaction cancelled by user');
        } else if (error.message.includes('insufficient funds')) {
            throw new Error('Insufficient funds for gas');
        } else {
            throw error;
        }
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

// ═══════════════════════════════════════
// INITIALIZATION - Start immediately
// ═══════════════════════════════════════
console.log('[miniapp] Module loaded, starting initialization...');

// Initialize SDK/wallet immediately (don't wait for events)
console.log('[miniapp] Pre-initializing wagmi config...');
getWagmiConfig()
    .then(() => {
        console.log('[miniapp] ✅ Wagmi config ready');
    })
    .catch(err => {
        console.warn('[miniapp] ⚠️ Wagmi config warning (may auto-connect later):', err.message);
    });

// Listen for game-ready event to call sdk.actions.ready()
window.addEventListener('base-invaders:game-ready', () => {
    console.log('[miniapp] base-invaders:game-ready received');
    markMiniAppReady();
});

// Fallback: call ready() after delay if game-ready never fires
const READY_FALLBACK_MS = 2500;
window.addEventListener('load', () => {
    console.log('[miniapp] window.load event');
    setTimeout(() => {
        if (!readyCalled) {
            console.log('[miniapp] Fallback: calling markMiniAppReady()');
            markMiniAppReady();
        }
    }, READY_FALLBACK_MS);
});

// ═══════════════════════════════════════
// DEBUG HELPER
// ═══════════════════════════════════════
window.__debugCheckIn = async function() {
    console.log('═══════════════════════════════════════');
    console.log('🧪 DEBUG: Manual check-in test');
    console.log('═══════════════════════════════════════');
    
    if (typeof window.baseInvadersOnchainCheckIn !== 'function') {
        console.error('❌ Function not available');
        alert('ERROR: SDK function not exported\nCheck if miniapp.js loaded correctly');
        return;
    }
    
    console.log('✅ Function exists, calling...');
    
    try {
        const result = await window.baseInvadersOnchainCheckIn();
        console.log('✅ DEBUG: Success!', result);
        alert('✅ Transaction successful!\n\nHash: ' + (result?.hash || 'unknown'));
    } catch (error) {
        console.error('❌ DEBUG: Failed', error);
        alert('❌ Transaction failed\n\nError: ' + error.message);
    }
};

console.log('[miniapp] ✅ Loaded');
console.log('[miniapp] 🧪 Test with: window.__debugCheckIn()');
