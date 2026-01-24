import { showCallsStatus, } from '../actions/showCallsStatus.js';
export function showCallsStatusMutationOptions(config, options = {}) {
    return {
        ...options.mutation,
        mutationFn(variables) {
            return showCallsStatus(config, variables);
        },
        mutationKey: ['showCallsStatus'],
    };
}
//# sourceMappingURL=showCallsStatus.js.map