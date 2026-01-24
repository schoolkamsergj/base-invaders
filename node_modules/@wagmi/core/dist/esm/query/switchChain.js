import { switchChain, } from '../actions/switchChain.js';
export function switchChainMutationOptions(config, options = {}) {
    return {
        ...options.mutation,
        mutationFn(variables) {
            return switchChain(config, variables);
        },
        mutationKey: ['switchChain'],
    };
}
//# sourceMappingURL=switchChain.js.map