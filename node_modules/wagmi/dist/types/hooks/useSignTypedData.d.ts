import type { SignTypedDataErrorType } from '@wagmi/core';
import type { Compute } from '@wagmi/core/internal';
import { type SignTypedDataData, type SignTypedDataMutate, type SignTypedDataMutateAsync, type SignTypedDataOptions, type SignTypedDataVariables } from '@wagmi/core/query';
import type { ConfigParameter } from '../types/properties.js';
import type { UseMutationReturnType } from '../utils/query.js';
export type UseSignTypedDataParameters<context = unknown> = Compute<ConfigParameter & SignTypedDataOptions<context>>;
export type UseSignTypedDataReturnType<context = unknown> = Compute<UseMutationReturnType<SignTypedDataData, SignTypedDataErrorType, SignTypedDataVariables, context, SignTypedDataMutate<context>, SignTypedDataMutateAsync<context>> & {
    /** @deprecated use `mutate` instead */
    signTypedData: SignTypedDataMutate<context>;
    /** @deprecated use `mutateAsync` instead */
    signTypedDataAsync: SignTypedDataMutateAsync<context>;
}>;
/** https://wagmi.sh/react/api/hooks/useSignTypedData */
export declare function useSignTypedData<context = unknown>(parameters?: UseSignTypedDataParameters<context>): UseSignTypedDataReturnType<context>;
//# sourceMappingURL=useSignTypedData.d.ts.map