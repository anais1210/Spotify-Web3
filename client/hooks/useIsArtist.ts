import { useReadContract, useAccount } from "wagmi";
import { contracts } from "@/lib/contracts";

export function useIsArtist() {
  const { address } = useAccount();
  const { data, isLoading, error } = useReadContract({
    address: contracts.albumFactory.address,
    abi: contracts.albumFactory.abi,
    functionName: "isArtist",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });
  return {
    albums: data as boolean | undefined,
    isLoading,
    error,
  };
}
