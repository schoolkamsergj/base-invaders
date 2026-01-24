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
    address: '0x0000000000000000000000000000000000000000',
    abi: [
        {
            inputs: [
                { internalType: 'uint256', name: 'score', type: 'uint256' },
                { internalType: 'uint256', name: 'wave', type: 'uint256' },
                { internalType: 'uint256', name: 'streak', type: 'uint256' },
                { internalType: 'string', name: 'name', type: 'string' }
            ],
            name: 'submitScore',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function'
        },
        {
            inputs: [],
            name: 'getTopPlayers',
            outputs: [
                {
                    components: [
                        { internalType: 'address', name: 'player', type: 'address' },
                        { internalType: 'string', name: 'name', type: 'string' },
                        { internalType: 'uint256', name: 'score', type: 'uint256' },
                        { internalType: 'uint256', name: 'wave', type: 'uint256' },
                        { internalType: 'uint256', name: 'timestamp', type: 'uint256' },
                        { internalType: 'uint256', name: 'streak', type: 'uint256' }
                    ],
                    internalType: 'struct BaseInvadersLeaderboard.PlayerEntry[]',
                    name: '',
                    type: 'tuple[]'
                }
            ],
            stateMutability: 'view',
            type: 'function'
        }
    ]
};

let wagmiConfigPromise = null;
let readyCalled = false;

async function getWagmiConfig() {
    if (wagmiConfigPromise) return wagmiConfigPromise;

    wagmiConfigPromise = (async () => {
        const provider = await sdk.wallet.getEthereumProvider();
        if (!window.ethereum) {
            window.ethereum = provider;
        }

        return createConfig({
            chains: [base],
            connectors: [injected({ shimDisconnect: true })],
            transports: {
                [base.id]: custom(provider)
            }
        });
    })();

    return wagmiConfigPromise;
}

async function checkInOnchain() {
    if (!CHECK_IN_CONTRACT.address || CHECK_IN_CONTRACT.address === '0x0000000000000000000000000000000000000000') {
        throw new Error('Check-in contract address is not configured.');
    }

    const config = await getWagmiConfig();
    await connect(config, { connector: injected({ shimDisconnect: true }) });

    const account = getAccount(config);
    const hash = await writeContract(config, {
        address: CHECK_IN_CONTRACT.address,
        abi: CHECK_IN_CONTRACT.abi,
        functionName: CHECK_IN_CONTRACT.functionName,
        args: CHECK_IN_CONTRACT.args,
        chainId: CHECK_IN_CONTRACT.chainId,
        account: account.address
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
});

window.addEventListener('load', () => {
    setTimeout(() => {
        markMiniAppReady();
    }, 0);
});
