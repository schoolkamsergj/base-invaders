import { sendCalls, } from '../actions/sendCalls.js';
export function sendCallsMutationOptions(config, options = {}) {
    return {
        ...options.mutation,
        mutationFn(variables) {
            return sendCalls(config, variables);
        },
        mutationKey: ['sendCalls'],
    };
}
//# sourceMappingURL=sendCalls.js.map