'use client';
import { getContractEventsQueryOptions, } from '@wagmi/core/query';
import { useQuery } from '../utils/query.js';
import { useChainId } from './useChainId.js';
import { useConfig } from './useConfig.js';
/** https://wagmi.sh/react/api/hooks/useContractEvents */
export function useContractEvents(parameters = {}) {
    const config = useConfig(parameters);
    const chainId = useChainId({ config });
    const options = getContractEventsQueryOptions(config, {
        ...parameters,
        chainId: parameters.chainId ?? chainId,
    });
    return useQuery(options);
}
//# sourceMappingURL=useContractEvents.js.map