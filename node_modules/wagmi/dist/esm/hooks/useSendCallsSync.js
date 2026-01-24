'use client';
import { useMutation } from '@tanstack/react-query';
import { sendCallsSyncMutationOptions, } from '@wagmi/core/query';
import { useConfig } from './useConfig.js';
/** https://wagmi.sh/react/api/hooks/useSendCallsSync */
export function useSendCallsSync(parameters = {}) {
    const config = useConfig(parameters);
    const options = sendCallsSyncMutationOptions(config, parameters);
    const mutation = useMutation(options);
    return {
        ...mutation,
        sendCallsSync: mutation.mutate,
        sendCallsSyncAsync: mutation.mutateAsync,
    };
}
//# sourceMappingURL=useSendCallsSync.js.map