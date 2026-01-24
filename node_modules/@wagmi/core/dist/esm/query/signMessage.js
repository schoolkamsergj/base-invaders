import { signMessage, } from '../actions/signMessage.js';
export function signMessageMutationOptions(config, options = {}) {
    return {
        ...options.mutation,
        mutationFn(variables) {
            return signMessage(config, variables);
        },
        mutationKey: ['signMessage'],
    };
}
//# sourceMappingURL=signMessage.js.map