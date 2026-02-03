export { useAlbums } from "./useAlbums";
export { useIsArtist } from "./useIsArtist";
export { useCreateAlbum } from "./useCreateAlbum";
export { useMintSong } from "./useMintSong";

// Admin hooks
export {
  useIsAdmin,
  useAddArtist,
  useRemoveArtist,
  useGetAllArtists,
  useGetArtistEvents,
  useCheckIsArtist,
} from "./useAdmin";
export type { ArtistInfo, ArtistEvent } from "./useAdmin";

// Subgraph hooks
export {
  useGetAlbums,
  useGetAlbum,
  useGetOwnedSongs,
  useGetArtist,
  useGetPlatformStats,
  useGetRecentSongs,
  useGetAlbumsByArtist,
  useSearchAlbums,
} from "./useSubgraph";

export type { Album, Song, Artist, PlatformStats } from "./useSubgraph";
