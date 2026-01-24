import type { Config, Connector, ResolvedRegister, SwitchConnectionErrorType } from '@wagmi/core';
import type { Compute } from '@wagmi/core/internal';
import { type SwitchConnectionData, type SwitchConnectionMutate, type SwitchConnectionMutateAsync, type SwitchConnectionOptions, type SwitchConnectionVariables } from '@wagmi/core/query';
import type { ConfigParameter } from '../types/properties.js';
import type { UseMutationReturnType } from '../utils/query.js';
export type UseSwitchConnectionParameters<config extends Config = Config, context = unknown> = Compute<ConfigParameter<config> & SwitchConnectionOptions<config, context>>;
export type UseSwitchConnectionReturnType<config extends Config = Config, context = unknown> = Compute<UseMutationReturnType<SwitchConnectionData<config>, SwitchConnectionErrorType, SwitchConnectionVariables, context, SwitchConnectionMutate<config, context>, SwitchConnectionMutateAsync<config, context>> & {
    /** @deprecated use `useConnections` instead */
    connectors: readonly Connector[];
    /** @deprecated use `mutate` instead */
    switchAccount: SwitchConnectionMutate<config, context>;
    /** @deprecated use `mutateAsync` instead */
    switchAccountAsync: SwitchConnectionMutateAsync<config, context>;
    /** @deprecated use `mutate` instead */
    switchConnection: SwitchConnectionMutate<config, context>;
    /** @deprecated use `mutateAsync` instead */
    switchConnectionAsync: SwitchConnectionMutateAsync<config, context>;
}>;
/** https://wagmi.sh/react/api/hooks/useSwitchConnection */
export declare function useSwitchConnection<config extends Config = ResolvedRegister['config'], context = unknown>(parameters?: UseSwitchConnectionParameters<config, context>): UseSwitchConnectionReturnType<config, context>;
//# sourceMappingURL=useSwitchConnection.d.ts.map