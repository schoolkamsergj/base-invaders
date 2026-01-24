'use client';
import { useMutation } from '@tanstack/react-query';
import { deployContractMutationOptions, } from '@wagmi/core/query';
import { useConfig } from './useConfig.js';
/** https://wagmi.sh/react/api/hooks/useDeployContract */
export function useDeployContract(parameters = {}) {
    const config = useConfig(parameters);
    const options = deployContractMutationOptions(config, parameters);
    const mutation = useMutation(options);
    return {
        ...mutation,
        deployContract: mutation.mutate,
        deployContractAsync: mutation.mutateAsync,
    };
}
//# sourceMappingURL=useDeployContract.js.map