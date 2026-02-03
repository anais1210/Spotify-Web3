"use client";

import { useQuery } from "@apollo/client/react";
import {
  GET_ALBUMS,
  GET_ALBUM,
  GET_SONGS_BY_OWNER,
  GET_ARTIST,
  GET_PLATFORM_STATS,
  GET_RECENT_SONGS,
  GET_ALBUMS_BY_ARTIST,
  SEARCH_ALBUMS,
} from "@/lib/graphql/queries";

// Types for the subgraph entities
export interface Artist {
  id: string;
  address: string;
  totalAlbums: string;
  totalSongs: string;
  createdAt: string;
  albums?: Album[];
}

export interface Album {
  id: string;
  address: string;
  name: string;
  symbol: string;
  totalSongs: string;
  createdAt: string;
  transactionHash?: string;
  artist: Artist;
  songs?: Song[];
}

export interface Song {
  id: string;
  tokenId: string;
  uri: string;
  owner: string;
  createdAt: string;
  album: Album;
}

export interface PlatformStats {
  totalArtists: string;
  totalAlbums: string;
  totalSongs: string;
  totalTransfers: string;
}

// Query response types
interface GetAlbumsResponse {
  albums: Album[];
}

interface GetAlbumResponse {
  album: Album | null;
}

interface GetSongsResponse {
  songs: Song[];
}

interface GetArtistResponse {
  artist: Artist | null;
}

interface GetPlatformStatsResponse {
  platformStats: PlatformStats | null;
}

// Hook to fetch all albums
export function useGetAlbums(first: number = 20, skip: number = 0) {
  const { data, loading, error, refetch } = useQuery<GetAlbumsResponse>(
    GET_ALBUMS,
    {
      variables: {
        first,
        skip,
        orderBy: "createdAt",
        orderDirection: "desc",
      },
    },
  );

  return {
    albums: data?.albums,
    isLoading: loading,
    error,
    refetch,
  };
}

// Hook to fetch a single album
export function useGetAlbum(address: string) {
  const { data, loading, error, refetch } = useQuery<GetAlbumResponse>(
    GET_ALBUM,
    {
      variables: { id: address.toLowerCase() },
      skip: !address,
    },
  );

  return {
    album: data?.album ?? undefined,
    isLoading: loading,
    error,
    refetch,
  };
}

// Hook to fetch songs owned by a specific address
export function useGetOwnedSongs(
  owner: string | undefined,
  first: number = 50,
  skip: number = 0,
) {
  const { data, loading, error, refetch } = useQuery<GetSongsResponse>(
    GET_SONGS_BY_OWNER,
    {
      variables: {
        owner: owner?.toLowerCase(),
        first,
        skip,
      },
      skip: !owner,
    },
  );

  return {
    songs: data?.songs,
    isLoading: loading,
    error,
    refetch,
  };
}

// Hook to fetch artist profile
export function useGetArtist(address: string | undefined) {
  const { data, loading, error, refetch } = useQuery<GetArtistResponse>(
    GET_ARTIST,
    {
      variables: { id: address?.toLowerCase() },
      skip: !address,
    },
  );

  return {
    artist: data?.artist ?? undefined,
    isLoading: loading,
    error,
    refetch,
  };
}

// Hook to fetch platform stats
export function useGetPlatformStats() {
  const { data, loading, error, refetch } =
    useQuery<GetPlatformStatsResponse>(GET_PLATFORM_STATS);

  return {
    stats: data?.platformStats ?? undefined,
    isLoading: loading,
    error,
    refetch,
  };
}

// Hook to fetch recent songs for featured section
export function useGetRecentSongs(first: number = 10) {
  const { data, loading, error, refetch } = useQuery<GetSongsResponse>(
    GET_RECENT_SONGS,
    {
      variables: { first },
    },
  );

  return {
    songs: data?.songs,
    isLoading: loading,
    error,
    refetch,
  };
}

// Hook to fetch albums by artist
export function useGetAlbumsByArtist(
  artist: string | undefined,
  first: number = 20,
  skip: number = 0,
) {
  const { data, loading, error, refetch } = useQuery<GetAlbumsResponse>(
    GET_ALBUMS_BY_ARTIST,
    {
      variables: {
        artist: artist?.toLowerCase(),
        first,
        skip,
      },
      skip: !artist,
    },
  );
  console.log(data);
  return {
    albums: data?.albums,
    isLoading: loading,
    error,
    refetch,
  };
}

// Hook to search albums
export function useSearchAlbums(searchTerm: string, first: number = 20) {
  const { data, loading, error, refetch } = useQuery<GetAlbumsResponse>(
    SEARCH_ALBUMS,
    {
      variables: {
        searchTerm,
        first,
      },
      skip: !searchTerm || searchTerm.length < 2,
    },
  );

  return {
    albums: data?.albums,
    isLoading: loading,
    error,
    refetch,
  };
}
