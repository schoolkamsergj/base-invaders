import { switchConnection, } from '../actions/switchConnection.js';
export function switchConnectionMutationOptions(config, options = {}) {
    return {
        ...options.mutation,
        mutationFn(variables) {
            return switchConnection(config, variables);
        },
        mutationKey: ['switchConnection'],
    };
}
//# sourceMappingURL=switchConnection.js.map