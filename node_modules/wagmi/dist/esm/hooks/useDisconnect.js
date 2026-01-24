'use client';
import { useMutation } from '@tanstack/react-query';
import { disconnectMutationOptions, } from '@wagmi/core/query';
import { useConfig } from './useConfig.js';
import { useConnections } from './useConnections.js';
/** https://wagmi.sh/react/api/hooks/useDisconnect */
export function useDisconnect(parameters = {}) {
    const config = useConfig(parameters);
    const options = disconnectMutationOptions(config, parameters);
    const mutation = useMutation(options);
    return {
        ...mutation,
        connectors: useConnections({ config }).map((connection) => connection.connector),
        disconnect: mutation.mutate,
        disconnectAsync: mutation.mutateAsync,
    };
}
//# sourceMappingURL=useDisconnect.js.map