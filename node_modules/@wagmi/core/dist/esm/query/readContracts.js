import { readContracts, } from '../actions/readContracts.js';
import { filterQueryOptions } from './utils.js';
export function readContractsQueryOptions(config, options = {}) {
    return {
        ...options.query,
        queryFn: async (context) => {
            const contracts = [];
            const length = context.queryKey[1].contracts.length;
            for (let i = 0; i < length; i++) {
                const contract = context.queryKey[1].contracts[i];
                const abi = (options.contracts?.[i]).abi;
                contracts.push({ ...contract, abi });
            }
            const { scopeKey: _, ...parameters } = context.queryKey[1];
            return readContracts(config, {
                ...parameters,
                contracts,
            });
        },
        queryKey: readContractsQueryKey(options),
    };
}
export function readContractsQueryKey(options = {}) {
    const contracts = [];
    let hasContractWithoutChainId = false;
    for (const contract of (options.contracts ??
        [])) {
        const { abi: _, ...rest } = contract;
        if (rest.chainId === undefined)
            hasContractWithoutChainId = true;
        const chainId = rest.chainId ?? options.chainId;
        contracts.push({ ...rest, ...(chainId ? { chainId } : {}) });
    }
    const { chainId: _, ...rest } = options;
    return [
        'readContracts',
        filterQueryOptions({
            ...rest,
            ...(hasContractWithoutChainId && options.chainId
                ? { chainId: options.chainId }
                : {}),
            contracts,
        }),
    ];
}
//# sourceMappingURL=readContracts.js.map