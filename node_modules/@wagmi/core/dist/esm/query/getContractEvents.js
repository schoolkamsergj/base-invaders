import { getContractEvents, } from '../actions/getContractEvents.js';
import { filterQueryOptions, structuralSharing } from './utils.js';
export function getContractEventsQueryOptions(config, options = {}) {
    return {
        ...options.query,
        enabled: Boolean(options.abi && (options.query?.enabled ?? true)),
        queryFn: async (context) => {
            if (!options.abi)
                throw new Error('abi is required');
            const [, { scopeKey: _, ...parameters }] = context.queryKey;
            const result = await getContractEvents(config, {
                ...parameters,
                abi: options.abi,
            });
            return result;
        },
        queryKey: getContractEventsQueryKey(options),
        structuralSharing,
    };
}
export function getContractEventsQueryKey(options = {}) {
    return ['getContractEvents', filterQueryOptions(options)];
}
//# sourceMappingURL=getContractEvents.js.map