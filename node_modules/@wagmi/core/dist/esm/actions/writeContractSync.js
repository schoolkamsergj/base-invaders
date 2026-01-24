import { writeContractSync as viem_writeContractSync, } from 'viem/actions';
import { getAction } from '../utils/getAction.js';
import { getConnectorClient, } from './getConnectorClient.js';
/** https://wagmi.sh/core/api/actions/writeContractSync */
export async function writeContractSync(config, parameters) {
    const { account, chainId, connector, ...request } = parameters;
    let client;
    if (typeof account === 'object' && account?.type === 'local')
        client = config.getClient({ chainId });
    else
        client = await getConnectorClient(config, {
            account: account ?? undefined,
            assertChainId: false,
            chainId,
            connector,
        });
    const chain = (() => {
        if (!chainId || client.chain?.id === chainId)
            return client.chain;
        return { id: chainId };
    })();
    const action = getAction(client, viem_writeContractSync, 'writeContractSync');
    const receipt = await action({
        ...request,
        ...(account ? { account } : {}),
        assertChainId: !!chainId,
        chain,
    });
    return receipt;
}
//# sourceMappingURL=writeContractSync.js.map