import { watchAsset, } from '../actions/watchAsset.js';
export function watchAssetMutationOptions(config, options = {}) {
    return {
        ...options.mutation,
        mutationFn(variables) {
            return watchAsset(config, variables);
        },
        mutationKey: ['watchAsset'],
    };
}
//# sourceMappingURL=watchAsset.js.map