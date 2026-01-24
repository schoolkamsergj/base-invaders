'use client';
import { watchBlocks, } from '@wagmi/core';
import { useEffect, useRef } from 'react';
import { useChainId } from './useChainId.js';
import { useConfig } from './useConfig.js';
/** https://wagmi.sh/react/hooks/useWatchBlocks */
export function useWatchBlocks(parameters = {}) {
    const { enabled = true, onBlock, config: _, ...rest } = parameters;
    const config = useConfig(parameters);
    const configChainId = useChainId({ config });
    const chainId = parameters.chainId ?? configChainId;
    const onBlockRef = useRef(onBlock);
    const onErrorRef = useRef(rest.onError);
    onBlockRef.current = onBlock;
    onErrorRef.current = rest.onError;
    // TODO(react@19): cleanup
    // biome-ignore lint/correctness/useExhaustiveDependencies: `rest` changes every render so only including properties in dependency array
    useEffect(() => {
        if (!enabled)
            return;
        if (!onBlockRef.current)
            return;
        return watchBlocks(config, {
            ...rest,
            chainId,
            onBlock: (block, prevBlock) => onBlockRef.current?.(block, prevBlock),
            onError: (error) => onErrorRef.current?.(error),
        });
    }, [
        chainId,
        config,
        enabled,
        ///
        rest.blockTag,
        rest.emitMissed,
        rest.emitOnBegin,
        rest.includeTransactions,
        rest.poll,
        rest.pollingInterval,
        rest.syncConnectedChain,
    ]);
}
//# sourceMappingURL=useWatchBlocks.js.map