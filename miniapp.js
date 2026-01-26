import { sdk } from 'https://esm.sh/@farcaster/miniapp-sdk@latest';
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
import { custom } from 'https://esm.sh/viem@latest';

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

    const config = await getWagmiConfig();
    
    // Connect if not already connected
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

async function markMiniAppReady() {
    if (readyCalled) return;
    readyCalled = true;
    try {
        await sdk.actions.ready();
    } catch (error) {
        console.warn('Mini app ready() failed:', error);
    }
}

window.baseInvadersOnchainCheckIn = checkInOnchain;
window.baseInvadersSubmitScore = submitLeaderboardScore;
window.baseInvadersGetLeaderboard = fetchLeaderboard;
window.baseInvadersMiniAppSdk = sdk;

window.addEventListener('base-invaders:game-ready', () => {
    markMiniAppReady();
    // Initialize wallet connection when game is ready
    getWagmiConfig().catch(err => console.warn('Wallet init failed:', err));
});

window.addEventListener('load', () => {
    setTimeout(() => {
        markMiniAppReady();
        // Initialize wallet connection on load
        getWagmiConfig().catch(err => console.warn('Wallet init failed:', err));
    }, 0);
});
