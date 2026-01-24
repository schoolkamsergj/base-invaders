import { getContractEvents as viem_getContractEvents, } from 'viem/actions';
import { getAction } from '../utils/getAction.js';
/** https://wagmi.sh/core/actions/getContractEvents */
export async function getContractEvents(config, parameters) {
    const { chainId, ...rest } = parameters;
    const client = config.getClient({ chainId });
    const action = getAction(client, viem_getContractEvents, 'getContractEvents');
    return action(rest);
}
//# sourceMappingURL=getContractEvents.js.map