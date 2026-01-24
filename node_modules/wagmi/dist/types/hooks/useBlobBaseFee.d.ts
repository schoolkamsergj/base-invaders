import type { Config, GetBlobBaseFeeErrorType, ResolvedRegister } from '@wagmi/core';
import type { Compute } from '@wagmi/core/internal';
import { type GetBlobBaseFeeData, type GetBlobBaseFeeOptions } from '@wagmi/core/query';
import type { ConfigParameter } from '../types/properties.js';
import { type UseQueryReturnType } from '../utils/query.js';
export type UseBlobBaseFeeParameters<config extends Config = Config, chainId extends config['chains'][number]['id'] = config['chains'][number]['id'], selectData = GetBlobBaseFeeData> = Compute<GetBlobBaseFeeOptions<config, chainId, selectData> & ConfigParameter<config>>;
export type UseBlobBaseFeeReturnType<selectData = GetBlobBaseFeeData> = UseQueryReturnType<selectData, GetBlobBaseFeeErrorType>;
/** https://wagmi.sh/react/api/hooks/useBlobBaseFee */
export declare function useBlobBaseFee<config extends Config = ResolvedRegister['config'], chainId extends config['chains'][number]['id'] = config['chains'][number]['id'], selectData = GetBlobBaseFeeData>(parameters?: UseBlobBaseFeeParameters<config, chainId, selectData>): UseBlobBaseFeeReturnType<selectData>;
//# sourceMappingURL=useBlobBaseFee.d.ts.map