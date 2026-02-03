"use client";

import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { contracts } from "@/lib/contracts";

export function useMintSong(albumAddress: string | undefined) {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const mintSong = (uri: string) => {
    if (!albumAddress || !address) return;

    writeContract({
      address: albumAddress as `0x${string}`,
      abi: contracts.harmonyNFT.abi,
      functionName: "safeMint",
      args: [address, uri],
    });
  };

  return {
    mintSong,
    isPending,
    isConfirming,
    isSuccess,
    error: error || confirmError,
    hash,
    reset,
  };
}
