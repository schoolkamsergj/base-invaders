'use client';
import { getBlobBaseFeeQueryOptions, } from '@wagmi/core/query';
import { useQuery } from '../utils/query.js';
import { useChainId } from './useChainId.js';
import { useConfig } from './useConfig.js';
/** https://wagmi.sh/react/api/hooks/useBlobBaseFee */
export function useBlobBaseFee(parameters = {}) {
    const config = useConfig(parameters);
    const chainId = useChainId({ config });
    const options = getBlobBaseFeeQueryOptions(config, {
        ...parameters,
        chainId: parameters.chainId ?? chainId,
    });
    return useQuery(options);
}
//# sourceMappingURL=useBlobBaseFee.js.map