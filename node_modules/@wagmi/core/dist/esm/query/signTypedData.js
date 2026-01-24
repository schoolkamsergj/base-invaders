import { signTypedData, } from '../actions/signTypedData.js';
export function signTypedDataMutationOptions(config, options = {}) {
    return {
        ...options.mutation,
        mutationFn(variables) {
            return signTypedData(config, variables);
        },
        mutationKey: ['signTypedData'],
    };
}
//# sourceMappingURL=signTypedData.js.map