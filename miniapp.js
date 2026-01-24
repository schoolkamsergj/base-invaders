import { sdk } from 'https://esm.sh/@farcaster/miniapp-sdk@latest';
import {
    connect,
    createConfig,
    getAccount,
    waitForTransactionReceipt,
    writeContract
} from 'https://esm.sh/@wagmi/core@latest';
import { injected } from 'https://esm.sh/@wagmi/core@latest/connectors';
import { base } from 'https://esm.sh/@wagmi/core@latest/chains';
import { custom } from 'https://esm.sh/viem@latest';

const CHECK_IN_CONTRACT = {
    chainId: base.id,
    address: '0x0000000000000000000000000000000000000000',
    abi: [
        {
            type: 'function',
            name: 'checkIn',
            stateMutability: 'nonpayable',
            inputs: [],
            outputs: []
        }
    ],
    functionName: 'checkIn',
    args: []
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
window.baseInvadersMiniAppSdk = sdk;

window.addEventListener('base-invaders:game-ready', () => {
    markMiniAppReady();
});

window.addEventListener('load', () => {
    setTimeout(() => {
        markMiniAppReady();
    }, 0);
});
