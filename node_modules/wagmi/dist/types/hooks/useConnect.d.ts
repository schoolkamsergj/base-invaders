import type { Config, ConnectErrorType, ResolvedRegister } from '@wagmi/core';
import type { Compute } from '@wagmi/core/internal';
import { type ConnectData, type ConnectMutate, type ConnectMutateAsync, type ConnectOptions, type ConnectVariables } from '@wagmi/core/query';
import type { ConfigParameter } from '../types/properties.js';
import type { UseMutationReturnType } from '../utils/query.js';
import { type UseConnectorsReturnType } from './useConnectors.js';
export type UseConnectParameters<config extends Config = Config, context = unknown> = Compute<ConfigParameter<config> & ConnectOptions<config, context>>;
export type UseConnectReturnType<config extends Config = Config, context = unknown> = Compute<UseMutationReturnType<ConnectData<config, config['connectors'][number], boolean>, ConnectErrorType, ConnectVariables<config, config['connectors'][number], boolean>, context, ConnectMutate<config, context>, ConnectMutateAsync<config, context>> & {
    /** @deprecated use `mutate` instead */
    connect: ConnectMutate<config, context>;
    /** @deprecated use `mutateAsync` instead */
    connectAsync: ConnectMutateAsync<config, context>;
    /** @deprecated use `useConnectors` instead */
    connectors: Compute<UseConnectorsReturnType> | config['connectors'];
}>;
/** https://wagmi.sh/react/api/hooks/useConnect */
export declare function useConnect<config extends Config = ResolvedRegister['config'], context = unknown>(parameters?: UseConnectParameters<config, context>): UseConnectReturnType<config, context>;
//# sourceMappingURL=useConnect.d.ts.map