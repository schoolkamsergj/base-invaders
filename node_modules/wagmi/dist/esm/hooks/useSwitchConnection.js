'use client';
import { useMutation } from '@tanstack/react-query';
import { switchConnectionMutationOptions, } from '@wagmi/core/query';
import { useConfig } from './useConfig.js';
import { useConnections } from './useConnections.js';
/** https://wagmi.sh/react/api/hooks/useSwitchConnection */
export function useSwitchConnection(parameters = {}) {
    const config = useConfig(parameters);
    const options = switchConnectionMutationOptions(config, parameters);
    const mutation = useMutation(options);
    return {
        ...mutation,
        connectors: useConnections({ config }).map((connection) => connection.connector),
        switchAccount: mutation.mutate,
        switchAccountAsync: mutation.mutateAsync,
        switchConnection: mutation.mutate,
        switchConnectionAsync: mutation.mutateAsync,
    };
}
//# sourceMappingURL=useSwitchConnection.js.map