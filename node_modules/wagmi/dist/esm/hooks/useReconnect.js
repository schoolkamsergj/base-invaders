'use client';
import { useMutation } from '@tanstack/react-query';
import { reconnectMutationOptions, } from '@wagmi/core/query';
import { useConfig } from './useConfig.js';
/** https://wagmi.sh/react/api/hooks/useReconnect */
export function useReconnect(parameters = {}) {
    const config = useConfig(parameters);
    const options = reconnectMutationOptions(config, parameters);
    const mutation = useMutation(options);
    return {
        ...mutation,
        connectors: config.connectors,
        reconnect: mutation.mutate,
        reconnectAsync: mutation.mutateAsync,
    };
}
//# sourceMappingURL=useReconnect.js.map