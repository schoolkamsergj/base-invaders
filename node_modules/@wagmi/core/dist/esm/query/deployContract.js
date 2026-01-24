import { deployContract, } from '../actions/deployContract.js';
export function deployContractMutationOptions(config, options = {}) {
    return {
        ...options.mutation,
        mutationFn(variables) {
            return deployContract(config, variables);
        },
        mutationKey: ['deployContract'],
    };
}
//# sourceMappingURL=deployContract.js.map