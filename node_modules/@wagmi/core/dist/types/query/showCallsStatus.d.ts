import type { MutateOptions, MutationOptions } from '@tanstack/query-core';
import { type ShowCallsStatusErrorType, type ShowCallsStatusParameters, type ShowCallsStatusReturnType } from '../actions/showCallsStatus.js';
import type { Config } from '../createConfig.js';
import type { MutationParameter } from '../types/query.js';
import type { Compute } from '../types/utils.js';
export type ShowCallsStatusOptions<context = unknown> = MutationParameter<ShowCallsStatusData, ShowCallsStatusErrorType, ShowCallsStatusVariables, context>;
export declare function showCallsStatusMutationOptions<config extends Config, context>(config: config, options?: ShowCallsStatusOptions<context>): ShowCallsStatusMutationOptions;
export type ShowCallsStatusMutationOptions = MutationOptions<ShowCallsStatusData, ShowCallsStatusErrorType, ShowCallsStatusVariables>;
export type ShowCallsStatusData = Compute<ShowCallsStatusReturnType>;
export type ShowCallsStatusVariables = ShowCallsStatusParameters;
export type ShowCallsStatusMutate<context = unknown> = (variables: ShowCallsStatusVariables, options?: Compute<MutateOptions<ShowCallsStatusData, ShowCallsStatusErrorType, Compute<ShowCallsStatusVariables>, context>> | undefined) => void;
export type ShowCallsStatusMutateAsync<context = unknown> = (variables: ShowCallsStatusVariables, options?: Compute<MutateOptions<ShowCallsStatusData, ShowCallsStatusErrorType, Compute<ShowCallsStatusVariables>, context>> | undefined) => Promise<ShowCallsStatusData>;
//# sourceMappingURL=showCallsStatus.d.ts.map