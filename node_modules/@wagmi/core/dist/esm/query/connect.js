import { connect, } from '../actions/connect.js';
export function connectMutationOptions(config, options = {}) {
    return {
        ...options.mutation,
        mutationFn: async (variables) => {
            return connect(config, variables);
        },
        mutationKey: ['connect'],
    };
}
//# sourceMappingURL=connect.js.map