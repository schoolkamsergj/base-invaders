import { type GetBlobBaseFeeErrorType as viem_GetBlobBaseFeeErrorType, type GetBlobBaseFeeReturnType as viem_GetBlobBaseFeeReturnType } from 'viem/actions';
import type { Config } from '../createConfig.js';
import type { ChainIdParameter } from '../types/properties.js';
import type { Compute } from '../types/utils.js';
export type GetBlobBaseFeeParameters<config extends Config = Config, chainId extends config['chains'][number]['id'] = config['chains'][number]['id']> = Compute<ChainIdParameter<config, chainId>>;
export type GetBlobBaseFeeReturnType = viem_GetBlobBaseFeeReturnType;
export type GetBlobBaseFeeErrorType = viem_GetBlobBaseFeeErrorType;
/** https://wagmi.sh/core/api/actions/getBlobBaseFee */
export declare function getBlobBaseFee<config extends Config, chainId extends config['chains'][number]['id'] = config['chains'][number]['id']>(config: config, parameters?: GetBlobBaseFeeParameters<config, chainId>): Promise<GetBlobBaseFeeReturnType>;
//# sourceMappingURL=getBlobBaseFee.d.ts.map