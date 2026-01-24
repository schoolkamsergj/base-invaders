import type { Config, ResolvedRegister, SendTransactionSyncErrorType } from '@wagmi/core';
import type { Compute } from '@wagmi/core/internal';
import { type SendTransactionSyncData, type SendTransactionSyncMutate, type SendTransactionSyncMutateAsync, type SendTransactionSyncOptions, type SendTransactionSyncVariables } from '@wagmi/core/query';
import type { ConfigParameter } from '../types/properties.js';
import type { UseMutationReturnType } from '../utils/query.js';
export type UseSendTransactionSyncParameters<config extends Config = Config, context = unknown> = Compute<ConfigParameter<config> & SendTransactionSyncOptions<config, context>>;
export type UseSendTransactionSyncReturnType<config extends Config = Config, context = unknown> = Compute<UseMutationReturnType<SendTransactionSyncData, SendTransactionSyncErrorType, SendTransactionSyncVariables<config, config['chains'][number]['id']>, context, SendTransactionSyncMutate<config, context>, SendTransactionSyncMutateAsync<config, context>> & {
    /** @deprecated use `mutate` instead */
    sendTransactionSync: SendTransactionSyncMutate<config, context>;
    /** @deprecated use `mutateAsync` instead */
    sendTransactionSyncAsync: SendTransactionSyncMutateAsync<config, context>;
}>;
/** https://wagmi.sh/react/api/hooks/useSendTransactionSync */
export declare function useSendTransactionSync<config extends Config = ResolvedRegister['config'], context = unknown>(parameters?: UseSendTransactionSyncParameters<config, context>): UseSendTransactionSyncReturnType<config, context>;
//# sourceMappingURL=useSendTransactionSync.d.ts.map