"use client";

import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { useQuery } from "@apollo/client/react";
import { contracts } from "@/lib/contracts";
import { GET_ALL_ARTISTS, GET_ARTIST_EVENTS } from "@/lib/graphql/queries";

// Types for artist management
export interface ArtistInfo {
  id: string;
  address: string;
  isActive: boolean;
  addedBy: string | null;
  addedAt: string | null;
  removedAt: string | null;
  totalAlbums: string;
  totalSongs: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArtistEvent {
  id: string;
  eventType: "ADDED" | "REMOVED";
  artist: {
    id: string;
    address: string;
  };
  triggeredBy: string;
  timestamp: string;
  transactionHash: string;
}

interface GetAllArtistsResponse {
  artists: ArtistInfo[];
}

interface GetArtistEventsResponse {
  artistEvents: ArtistEvent[];
}

// Hook to check if current user is admin
export function useIsAdmin() {
  const { address } = useAccount();
  const { data, isLoading, error, refetch } = useReadContract({
    address: contracts.management.address,
    abi: contracts.management.abi,
    functionName: "isAdmin",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  return {
    isAdmin: data as boolean | undefined,
    isLoading,
    error,
    refetch,
  };
}

// Hook to add an artist
export function useAddArtist() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const addArtist = (artistAddress: string) => {
    writeContract({
      address: contracts.management.address,
      abi: contracts.management.abi,
      functionName: "addArtist",
      args: [artistAddress as `0x${string}`],
    });
  };

  return {
    addArtist,
    isPending,
    isConfirming,
    isSuccess,
    error: error || confirmError,
    hash,
    reset,
  };
}

// Hook to remove an artist
export function useRemoveArtist() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const removeArtist = (artistAddress: string) => {
    writeContract({
      address: contracts.management.address,
      abi: contracts.management.abi,
      functionName: "removeArtist",
      args: [artistAddress as `0x${string}`],
    });
  };

  return {
    removeArtist,
    isPending,
    isConfirming,
    isSuccess,
    error: error || confirmError,
    hash,
    reset,
  };
}

// Hook to get all artists from subgraph
export function useGetAllArtists(first: number = 50, skip: number = 0) {
  const { data, loading, error, refetch } = useQuery<GetAllArtistsResponse>(
    GET_ALL_ARTISTS,
    {
      variables: { first, skip },
    }
  );

  return {
    artists: data?.artists,
    isLoading: loading,
    error,
    refetch,
  };
}

// Hook to get artist events history from subgraph
export function useGetArtistEvents(first: number = 50, skip: number = 0) {
  const { data, loading, error, refetch } = useQuery<GetArtistEventsResponse>(
    GET_ARTIST_EVENTS,
    {
      variables: { first, skip },
    }
  );

  return {
    events: data?.artistEvents,
    isLoading: loading,
    error,
    refetch,
  };
}

// Hook to check if a specific address is an artist (for admin verification)
export function useCheckIsArtist(address: string | undefined) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: contracts.management.address,
    abi: contracts.management.abi,
    functionName: "isArtist",
    args: address ? [address as `0x${string}`] : undefined,
    query: {
      enabled: !!address,
    },
  });

  return {
    isArtist: data as boolean | undefined,
    isLoading,
    error,
    refetch,
  };
}
