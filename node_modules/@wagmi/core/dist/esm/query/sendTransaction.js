import { sendTransaction, } from '../actions/sendTransaction.js';
export function sendTransactionMutationOptions(config, options = {}) {
    return {
        ...options.mutation,
        mutationFn(variables) {
            return sendTransaction(config, variables);
        },
        mutationKey: ['sendTransaction'],
    };
}
//# sourceMappingURL=sendTransaction.js.map