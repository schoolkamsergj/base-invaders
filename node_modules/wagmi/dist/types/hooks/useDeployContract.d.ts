import type { Config, DeployContractErrorType, ResolvedRegister } from '@wagmi/core';
import type { Compute } from '@wagmi/core/internal';
import { type DeployContractData, type DeployContractMutate, type DeployContractMutateAsync, type DeployContractOptions, type DeployContractVariables } from '@wagmi/core/query';
import type { Abi } from 'viem';
import type { ConfigParameter } from '../types/properties.js';
import type { UseMutationReturnType } from '../utils/query.js';
export type UseDeployContractParameters<config extends Config = Config, context = unknown> = Compute<ConfigParameter<config> & DeployContractOptions<config, context>>;
export type UseDeployContractReturnType<config extends Config = Config, context = unknown> = UseMutationReturnType<DeployContractData, DeployContractErrorType, DeployContractVariables<Abi, config, config['chains'][number]['id']>, context, DeployContractMutate<config, context>, DeployContractMutateAsync<config, context>> & {
    /** @deprecated use `mutate` instead */
    deployContract: DeployContractMutate<config, context>;
    /** @deprecated use `mutateAsync` instead */
    deployContractAsync: DeployContractMutateAsync<config, context>;
};
/** https://wagmi.sh/react/api/hooks/useDeployContract */
export declare function useDeployContract<config extends Config = ResolvedRegister['config'], context = unknown>(parameters?: UseDeployContractParameters<config, context>): UseDeployContractReturnType<config, context>;
//# sourceMappingURL=useDeployContract.d.ts.map