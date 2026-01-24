'use client';
import { useMutation } from '@tanstack/react-query';
import { writeContractMutationOptions, } from '@wagmi/core/query';
import { useConfig } from './useConfig.js';
/** https://wagmi.sh/react/api/hooks/useWriteContract */
export function useWriteContract(parameters = {}) {
    const config = useConfig(parameters);
    const options = writeContractMutationOptions(config, parameters);
    const mutation = useMutation(options);
    return {
        ...mutation,
        writeContract: mutation.mutate,
        writeContractAsync: mutation.mutateAsync,
    };
}
//# sourceMappingURL=useWriteContract.js.map