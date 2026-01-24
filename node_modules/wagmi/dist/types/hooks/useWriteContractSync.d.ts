import type { Config, ResolvedRegister, WriteContractSyncErrorType } from '@wagmi/core';
import { type WriteContractSyncData, type WriteContractSyncMutate, type WriteContractSyncMutateAsync, type WriteContractSyncOptions, type WriteContractSyncVariables } from '@wagmi/core/query';
import type { Abi } from 'viem';
import type { ConfigParameter } from '../types/properties.js';
import type { UseMutationReturnType } from '../utils/query.js';
export type UseWriteContractSyncParameters<config extends Config = Config, context = unknown> = ConfigParameter<config> & WriteContractSyncOptions<config, context>;
export type UseWriteContractSyncReturnType<config extends Config = Config, context = unknown> = UseMutationReturnType<WriteContractSyncData, WriteContractSyncErrorType, WriteContractSyncVariables<Abi, string, readonly unknown[], config, config['chains'][number]['id']>, context, WriteContractSyncMutate<config, context>, WriteContractSyncMutateAsync<config, context>> & {
    /** @deprecated use `mutate` instead */
    writeContractSync: WriteContractSyncMutate<config, context>;
    /** @deprecated use `mutateAsync` instead */
    writeContractSyncAsync: WriteContractSyncMutateAsync<config, context>;
};
/** https://wagmi.sh/react/api/hooks/useWriteContractSync */
export declare function useWriteContractSync<config extends Config = ResolvedRegister['config'], context = unknown>(parameters?: UseWriteContractSyncParameters<config, context>): UseWriteContractSyncReturnType<config, context>;
//# sourceMappingURL=useWriteContractSync.d.ts.map