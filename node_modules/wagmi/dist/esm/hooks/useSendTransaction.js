'use client';
import { useMutation } from '@tanstack/react-query';
import { sendTransactionMutationOptions, } from '@wagmi/core/query';
import { useConfig } from './useConfig.js';
/** https://wagmi.sh/react/api/hooks/useSendTransaction */
export function useSendTransaction(parameters = {}) {
    const config = useConfig(parameters);
    const options = sendTransactionMutationOptions(config, parameters);
    const mutation = useMutation(options);
    return {
        ...mutation,
        sendTransaction: mutation.mutate,
        sendTransactionAsync: mutation.mutateAsync,
    };
}
//# sourceMappingURL=useSendTransaction.js.map