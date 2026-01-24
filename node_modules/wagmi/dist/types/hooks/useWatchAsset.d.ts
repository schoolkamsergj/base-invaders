import type { WatchAssetErrorType } from '@wagmi/core';
import type { Compute } from '@wagmi/core/internal';
import { type WatchAssetData, type WatchAssetMutate, type WatchAssetMutateAsync, type WatchAssetOptions, type WatchAssetVariables } from '@wagmi/core/query';
import type { ConfigParameter } from '../types/properties.js';
import type { UseMutationReturnType } from '../utils/query.js';
export type UseWatchAssetParameters<context = unknown> = Compute<ConfigParameter & WatchAssetOptions<context>>;
export type UseWatchAssetReturnType<context = unknown> = Compute<UseMutationReturnType<WatchAssetData, WatchAssetErrorType, WatchAssetVariables, context, WatchAssetMutate<context>, WatchAssetMutateAsync<context>> & {
    /** @deprecated use `mutate` instead */
    watchAsset: WatchAssetMutate<context>;
    /** @deprecated use `mutateAsync` instead */
    watchAssetAsync: WatchAssetMutateAsync<context>;
}>;
/** https://wagmi.sh/react/api/hooks/useWatchAsset */
export declare function useWatchAsset<context = unknown>(parameters?: UseWatchAssetParameters<context>): UseWatchAssetReturnType<context>;
//# sourceMappingURL=useWatchAsset.d.ts.map