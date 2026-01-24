'use client';
import { useMutation } from '@tanstack/react-query';
import { showCallsStatusMutationOptions, } from '@wagmi/core/query';
import { useConfig } from './useConfig.js';
/** https://wagmi.sh/react/api/hooks/useShowCallsStatus */
export function useShowCallsStatus(parameters = {}) {
    const config = useConfig(parameters);
    const options = showCallsStatusMutationOptions(config, parameters);
    const mutation = useMutation(options);
    return {
        ...mutation,
        showCallsStatus: mutation.mutate,
        showCallsStatusAsync: mutation.mutateAsync,
    };
}
//# sourceMappingURL=useShowCallsStatus.js.map