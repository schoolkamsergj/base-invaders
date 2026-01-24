'use client';
import { useMutation } from '@tanstack/react-query';
import { sendTransactionSyncMutationOptions, } from '@wagmi/core/query';
import { useConfig } from './useConfig.js';
/** https://wagmi.sh/react/api/hooks/useSendTransactionSync */
export function useSendTransactionSync(parameters = {}) {
    const config = useConfig(parameters);
    const options = sendTransactionSyncMutationOptions(config, parameters);
    const mutation = useMutation(options);
    return {
        ...mutation,
        sendTransactionSync: mutation.mutate,
        sendTransactionSyncAsync: mutation.mutateAsync,
    };
}
//# sourceMappingURL=useSendTransactionSync.js.map