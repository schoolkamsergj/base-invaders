'use client';
import { useMutation } from '@tanstack/react-query';
import { writeContractSyncMutationOptions, } from '@wagmi/core/query';
import { useConfig } from './useConfig.js';
/** https://wagmi.sh/react/api/hooks/useWriteContractSync */
export function useWriteContractSync(parameters = {}) {
    const config = useConfig(parameters);
    const options = writeContractSyncMutationOptions(config, parameters);
    const mutation = useMutation(options);
    return {
        ...mutation,
        writeContractSync: mutation.mutate,
        writeContractSyncAsync: mutation.mutateAsync,
    };
}
//# sourceMappingURL=useWriteContractSync.js.map