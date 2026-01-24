import { getBlobBaseFee, } from '../actions/getBlobBaseFee.js';
import { filterQueryOptions } from './utils.js';
export function getBlobBaseFeeQueryOptions(config, options = {}) {
    return {
        ...options.query,
        queryFn: async (context) => {
            const [, { scopeKey: _, ...parameters }] = context.queryKey;
            const blobBaseFee = await getBlobBaseFee(config, parameters);
            return blobBaseFee ?? null;
        },
        queryKey: getBlobBaseFeeQueryKey(options),
    };
}
export function getBlobBaseFeeQueryKey(options = {}) {
    return ['blobBaseFee', filterQueryOptions(options)];
}
//# sourceMappingURL=getBlobBaseFee.js.map