import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { contracts } from "@/lib/contracts";

export function useCreateAlbum() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  const createAlbum = (name: string, symbol: string) => {
    writeContract({
      address: contracts.albumFactory.address,
      abi: contracts.albumFactory.abi,
      functionName: "createAlbum",
      args: [name, symbol],
    });
  };
  return {
    createAlbum,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}
