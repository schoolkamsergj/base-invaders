import type { MutationOptions } from '@tanstack/query-core';
import { type ReconnectErrorType, type ReconnectParameters, type ReconnectReturnType } from '../actions/reconnect.js';
import type { Config } from '../createConfig.js';
import type { MutationParameter } from '../types/query.js';
import type { Compute } from '../types/utils.js';
import type { Mutate, MutateAsync } from './types.js';
export type ReconnectOptions<context = unknown> = MutationParameter<ReconnectData, ReconnectErrorType, ReconnectVariables, context>;
export declare function reconnectMutationOptions<context>(config: Config, options?: ReconnectOptions<context>): ReconnectMutationOptions;
export type ReconnectMutationOptions = MutationOptions<ReconnectData, ReconnectErrorType, ReconnectVariables>;
export type ReconnectData = Compute<ReconnectReturnType>;
export type ReconnectVariables = ReconnectParameters | undefined;
export type ReconnectMutate<context = unknown> = Mutate<ReconnectData, ReconnectErrorType, ReconnectVariables, context>;
export type ReconnectMutateAsync<context = unknown> = MutateAsync<ReconnectData, ReconnectErrorType, ReconnectVariables, context>;
//# sourceMappingURL=reconnect.d.ts.map