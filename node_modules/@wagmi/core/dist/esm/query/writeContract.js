import { writeContract, } from '../actions/writeContract.js';
export function writeContractMutationOptions(config, options = {}) {
    return {
        ...options.mutation,
        mutationFn(variables) {
            return writeContract(config, variables);
        },
        mutationKey: ['writeContract'],
    };
}
//# sourceMappingURL=writeContract.js.map