import { reconnect, } from '../actions/reconnect.js';
export function reconnectMutationOptions(config, options = {}) {
    return {
        ...options.mutation,
        mutationFn(variables) {
            return reconnect(config, variables);
        },
        mutationKey: ['reconnect'],
    };
}
//# sourceMappingURL=reconnect.js.map