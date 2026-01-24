'use client';
import { watchBlockNumber, } from '@wagmi/core';
import { useEffect, useRef } from 'react';
import { useChainId } from './useChainId.js';
import { useConfig } from './useConfig.js';
/** https://wagmi.sh/react/api/hooks/useWatchBlockNumber */
export function useWatchBlockNumber(parameters = {}) {
    const { enabled = true, onBlockNumber, config: _, ...rest } = parameters;
    const config = useConfig(parameters);
    const configChainId = useChainId({ config });
    const chainId = parameters.chainId ?? configChainId;
    const onBlockNumberRef = useRef(onBlockNumber);
    const onErrorRef = useRef(rest.onError);
    onBlockNumberRef.current = onBlockNumber;
    onErrorRef.current = rest.onError;
    // TODO(react@19): cleanup
    // biome-ignore lint/correctness/useExhaustiveDependencies: `rest` changes every render so only including properties in dependency array
    useEffect(() => {
        if (!enabled)
            return;
        if (!onBlockNumberRef.current)
            return;
        return watchBlockNumber(config, {
            ...rest,
            chainId,
            onBlockNumber: (blockNumber, prevBlockNumber) => onBlockNumberRef.current?.(blockNumber, prevBlockNumber),
            onError: (error) => onErrorRef.current?.(error),
        });
    }, [
        chainId,
        config,
        enabled,
        ///
        rest.emitMissed,
        rest.emitOnBegin,
        rest.poll,
        rest.pollingInterval,
        rest.syncConnectedChain,
    ]);
}
//# sourceMappingURL=useWatchBlockNumber.js.map