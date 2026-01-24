import { disconnect, } from '../actions/disconnect.js';
export function disconnectMutationOptions(config, options = {}) {
    return {
        ...options.mutation,
        mutationFn: async (variables) => {
            return disconnect(config, variables);
        },
        mutationKey: ['disconnect'],
    };
}
//# sourceMappingURL=disconnect.js.map