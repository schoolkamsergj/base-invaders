import { type GetBlobBaseFeeErrorType, type GetBlobBaseFeeParameters, type GetBlobBaseFeeReturnType } from '../actions/getBlobBaseFee.js';
import type { Config } from '../createConfig.js';
import type { ScopeKeyParameter } from '../types/properties.js';
import type { QueryOptions, QueryParameter } from '../types/query.js';
import type { Compute, ExactPartial } from '../types/utils.js';
export type GetBlobBaseFeeOptions<config extends Config, chainId extends config['chains'][number]['id'], selectData = GetBlobBaseFeeData> = Compute<ExactPartial<GetBlobBaseFeeParameters<config, chainId>> & ScopeKeyParameter> & QueryParameter<GetBlobBaseFeeQueryFnData, GetBlobBaseFeeErrorType, selectData, GetBlobBaseFeeQueryKey<config, chainId>>;
export declare function getBlobBaseFeeQueryOptions<config extends Config, chainId extends config['chains'][number]['id'], selectData = GetBlobBaseFeeData>(config: config, options?: GetBlobBaseFeeOptions<config, chainId, selectData>): GetBlobBaseFeeQueryOptions<config, chainId, selectData>;
export type GetBlobBaseFeeQueryFnData = GetBlobBaseFeeReturnType;
export type GetBlobBaseFeeData = GetBlobBaseFeeQueryFnData;
export declare function getBlobBaseFeeQueryKey<config extends Config, chainId extends config['chains'][number]['id']>(options?: Compute<ExactPartial<GetBlobBaseFeeParameters<config, chainId>> & ScopeKeyParameter>): readonly ["blobBaseFee", {
    chainId?: config["chains"][number]["id"] | (chainId extends config["chains"][number]["id"] ? chainId : undefined) | undefined;
    scopeKey?: string | undefined | undefined;
}];
export type GetBlobBaseFeeQueryKey<config extends Config, chainId extends config['chains'][number]['id']> = ReturnType<typeof getBlobBaseFeeQueryKey<config, chainId>>;
export type GetBlobBaseFeeQueryOptions<config extends Config, chainId extends config['chains'][number]['id'], selectData = GetBlobBaseFeeData> = QueryOptions<GetBlobBaseFeeQueryFnData, GetBlobBaseFeeErrorType, selectData, GetBlobBaseFeeQueryKey<config, chainId>>;
//# sourceMappingURL=getBlobBaseFee.d.ts.map