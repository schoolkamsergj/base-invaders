import { getBlobBaseFee as viem_getBlobBaseFee, } from 'viem/actions';
import { getAction } from '../utils/getAction.js';
/** https://wagmi.sh/core/api/actions/getBlobBaseFee */
export function getBlobBaseFee(config, parameters = {}) {
    const { chainId } = parameters;
    const client = config.getClient({ chainId });
    const action = getAction(client, viem_getBlobBaseFee, 'getBlobBaseFee');
    return action({});
}
//# sourceMappingURL=getBlobBaseFee.js.map