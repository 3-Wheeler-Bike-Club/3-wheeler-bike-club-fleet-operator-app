import { publicClient } from "@/utils/client";
import { useEffect, useState } from "react"

export function useGetBlockTime(blockNumber: bigint) {
    const [blockTime, setBlockTime] = useState< bigint | undefined>(undefined);

    useEffect(() => {
        async function getBlockTime() {
            const block = await publicClient.getBlock({
                blockNumber: blockNumber,
            });
            setBlockTime(block.timestamp);
        }
        getBlockTime();
    }, [blockNumber]);

    return { blockTime };
}
