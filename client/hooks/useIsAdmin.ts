import { useReadContract, useAccount } from "wagmi";
import { contracts } from "@/lib/contracts";

export function useIsAadmin() {
  const { address } = useAccount();
  const { data, isLoading, error } = useReadContract({
    address: contracts.management.address,
    abi: contracts.management.abi,
    functionName: "isAdmin",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });
  return {
    iaAdmin: data as boolean | undefined,
    isLoading,
    error,
  };
}
