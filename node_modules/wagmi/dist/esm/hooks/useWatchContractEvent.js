'use client';
import { deepEqual, watchContractEvent, } from '@wagmi/core';
import { useEffect, useRef } from 'react';
import { useChainId } from './useChainId.js';
import { useConfig } from './useConfig.js';
/** https://wagmi.sh/react/api/hooks/useWatchContractEvent */
export function useWatchContractEvent(parameters = {}) {
    const { enabled = true, onLogs, config: _, ...rest } = parameters;
    const config = useConfig(parameters);
    const configChainId = useChainId({ config });
    const chainId = parameters.chainId ?? configChainId;
    const onLogsRef = useRef(onLogs);
    const onErrorRef = useRef(rest.onError);
    onLogsRef.current = onLogs;
    onErrorRef.current = rest.onError;
    const abiRef = useRef(rest.abi);
    const addressRef = useRef(rest.address);
    const argsRef = useRef(rest.args);
    if (!abiRef.current || !deepEqual(abiRef.current, rest.abi))
        abiRef.current = rest.abi;
    if (!addressRef.current || !deepEqual(addressRef.current, rest.address))
        addressRef.current = rest.address;
    if (!argsRef.current || !deepEqual(argsRef.current, rest.args))
        argsRef.current = rest.args;
    // TODO(react@19): cleanup
    // biome-ignore lint/correctness/useExhaustiveDependencies: `rest` changes every render so only including properties in dependency array
    useEffect(() => {
        if (!enabled)
            return;
        if (!onLogsRef.current)
            return;
        return watchContractEvent(config, {
            ...rest,
            chainId,
            onLogs: (logs) => onLogsRef.current?.(logs),
            onError: (error) => onErrorRef.current?.(error),
        });
    }, [
        chainId,
        config,
        enabled,
        ///
        abiRef.current,
        addressRef.current,
        argsRef.current,
        rest.batch,
        rest.eventName,
        rest.fromBlock,
        rest.poll,
        rest.pollingInterval,
        rest.strict,
        rest.syncConnectedChain,
    ]);
}
//# sourceMappingURL=useWatchContractEvent.js.map