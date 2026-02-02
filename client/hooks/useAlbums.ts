import { useReadContract } from "wagmi";
import { contracts } from "@/lib/contracts";

export function useAlbums() {
  const { data, isLoading, error } = useReadContract({
    address: contracts.albumFactory.address,
    abi: contracts.albumFactory.abi,
    functionName: "_getDeployedAlbums",
  });
  return {
    albums: data as `0${string}`[] | undefined,
    isLoading,
    error,
  };
}
