'use client';
import { useMutation } from '@tanstack/react-query';
import { sendCallsMutationOptions, } from '@wagmi/core/query';
import { useConfig } from './useConfig.js';
/** https://wagmi.sh/react/api/hooks/useSendCalls */
export function useSendCalls(parameters = {}) {
    const config = useConfig(parameters);
    const options = sendCallsMutationOptions(config, parameters);
    const mutation = useMutation(options);
    return {
        ...mutation,
        sendCalls: mutation.mutate,
        sendCallsAsync: mutation.mutateAsync,
    };
}
//# sourceMappingURL=useSendCalls.js.map