'use client';
import { useMutation } from '@tanstack/react-query';
import { switchChainMutationOptions, } from '@wagmi/core/query';
import { useChains } from './useChains.js';
import { useConfig } from './useConfig.js';
/** https://wagmi.sh/react/api/hooks/useSwitchChain */
export function useSwitchChain(parameters = {}) {
    const config = useConfig(parameters);
    const options = switchChainMutationOptions(config, parameters);
    const mutation = useMutation(options);
    return {
        ...mutation,
        chains: useChains({ config }),
        switchChain: mutation.mutate,
        switchChainAsync: mutation.mutateAsync,
    };
}
//# sourceMappingURL=useSwitchChain.js.map