import { sendTransactionSync, } from '../actions/sendTransactionSync.js';
export function sendTransactionSyncMutationOptions(config, options = {}) {
    return {
        ...options.mutation,
        mutationFn(variables) {
            return sendTransactionSync(config, variables);
        },
        mutationKey: ['sendTransactionSync'],
    };
}
//# sourceMappingURL=sendTransactionSync.js.map