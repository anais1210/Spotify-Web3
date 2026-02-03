import { useReadContract, useAccount } from "wagmi";
import { contracts } from "@/lib/contracts";

export function useIsArtist() {
  const { address } = useAccount();
  const { data, isLoading, error } = useReadContract({
    address: contracts.management.address,
    abi: contracts.management.abi,
    functionName: "isArtist",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });
  return {
    isArtist: data as boolean | undefined,
    isLoading,
    error,
  };
}
