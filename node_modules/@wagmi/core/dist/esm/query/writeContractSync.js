import { writeContractSync, } from '../actions/writeContractSync.js';
export function writeContractSyncMutationOptions(config, options = {}) {
    return {
        ...options.mutation,
        mutationFn(variables) {
            return writeContractSync(config, variables);
        },
        mutationKey: ['writeContractSync'],
    };
}
//# sourceMappingURL=writeContractSync.js.map