'use client';
import { useMutation } from '@tanstack/react-query';
import { signTypedDataMutationOptions, } from '@wagmi/core/query';
import { useConfig } from './useConfig.js';
/** https://wagmi.sh/react/api/hooks/useSignTypedData */
export function useSignTypedData(parameters = {}) {
    const config = useConfig(parameters);
    const options = signTypedDataMutationOptions(config, parameters);
    const mutation = useMutation(options);
    return {
        ...mutation,
        signTypedData: mutation.mutate,
        signTypedDataAsync: mutation.mutateAsync,
    };
}
//# sourceMappingURL=useSignTypedData.js.map