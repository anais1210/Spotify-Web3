"use client";

import { useState, useEffect } from "react";
import { useGetAlbums, useSearchAlbums } from "@/hooks";
import { fetchMetadataFromIPFS, ipfsToHttp, fetchAlbumMetadata } from "@/lib/pinata";
import AlbumFilter from "@/components/album/AlbumFilter";
import { Card } from "@/components/ui/card";
import { Play, Music2, Loader2, Disc3 } from "lucide-react";
import Link from "next/link";

interface AlbumWithCover {
  address: string;
  name: string;
  artist: string;
  coverImage: string | null;
  songCount: number;
  gradient: string;
}

// Generate consistent gradient based on address
function getGradientFromAddress(address: string): string {
  const gradients = [
    "from-violet-600 to-indigo-900",
    "from-amber-500 to-orange-700",
    "from-cyan-500 to-blue-700",
    "from-pink-500 to-rose-700",
    "from-emerald-500 to-green-800",
    "from-purple-500 to-fuchsia-800",
    "from-red-500 to-pink-700",
    "from-teal-500 to-cyan-700",
  ];
  const index = parseInt(address.slice(-2), 16) % gradients.length;
  return gradients[index];
}

// Truncate address for display
function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [albumsWithCovers, setAlbumsWithCovers] = useState<AlbumWithCover[]>([]);
  const [loadingCovers, setLoadingCovers] = useState(false);

  // Fetch albums from subgraph
  const { albums, isLoading, error } = useGetAlbums(50, 0);
  const { albums: searchResults, isLoading: isSearching } = useSearchAlbums(searchQuery, 50);

  // Use search results if searching, otherwise use all albums
  const displayAlbums = searchQuery.length >= 2 ? searchResults : albums;

  // Fetch cover images for albums
  useEffect(() => {
    async function fetchCovers() {
      if (!displayAlbums || displayAlbums.length === 0) {
        setAlbumsWithCovers([]);
        return;
      }

      setLoadingCovers(true);

      const albumsData: AlbumWithCover[] = await Promise.all(
        displayAlbums.map(async (album) => {
          let coverImage: string | null = null;

          // Try to get album metadata from cache
          const albumMetadata = await fetchAlbumMetadata(album.address);
          if (albumMetadata?.image) {
            coverImage = ipfsToHttp(albumMetadata.image);
          }

          // If no album cover, try to get from first song
          if (!coverImage && album.songs && album.songs.length > 0) {
            const firstSong = album.songs[0];
            if (firstSong.uri) {
              const songMetadata = await fetchMetadataFromIPFS(firstSong.uri);
              if (songMetadata?.image) {
                coverImage = ipfsToHttp(songMetadata.image);
              }
            }
          }

          return {
            address: album.address,
            name: album.name,
            artist: formatAddress(album.artist.address),
            coverImage,
            songCount: parseInt(album.totalSongs) || 0,
            gradient: getGradientFromAddress(album.address),
          };
        })
      );

      setAlbumsWithCovers(albumsData);
      setLoadingCovers(false);
    }

    fetchCovers();
  }, [displayAlbums]);

  const isPageLoading = isLoading || (searchQuery.length >= 2 && isSearching);

  return (
    <div className="container py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-heading font-bold mb-2">Browse Albums</h1>
        <p className="text-muted-foreground">
          Discover music from independent artists on the blockchain
        </p>
      </div>

      <AlbumFilter searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Loading State */}
      {isPageLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-20">
          <p className="text-red-500">Failed to load albums. Please try again.</p>
        </div>
      )}

      {/* Empty State */}
      {!isPageLoading && !error && albumsWithCovers.length === 0 && (
        <div className="text-center py-20">
          <Disc3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Albums Found</h3>
          <p className="text-muted-foreground">
            {searchQuery
              ? "No albums match your search. Try a different term."
              : "No albums have been created yet. Be the first artist to publish!"}
          </p>
        </div>
      )}

      {/* Albums Grid */}
      {!isPageLoading && albumsWithCovers.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {albumsWithCovers.map((album) => (
            <Link key={album.address} href={`/album/${album.address}`}>
              <Card className="overflow-hidden group cursor-pointer hover-lift border-border/50 hover:border-primary/30 transition-colors rounded-xl">
                {/* Cover image */}
                <div className="aspect-square bg-muted relative overflow-hidden">
                  {album.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={album.coverImage}
                      alt={album.name}
                      className="w-full h-full object-cover img-zoom"
                    />
                  ) : (
                    <div
                      className={`w-full h-full bg-gradient-to-br ${album.gradient} flex items-center justify-center`}
                    >
                      <Music2 className="w-12 h-12 text-white/50" />
                    </div>
                  )}
                  {/* Play button overlay on hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg">
                      <Play className="w-6 h-6 text-white fill-white ml-1" />
                    </div>
                  </div>
                </div>
                {/* Info */}
                <div className="p-4">
                  <h3 className="font-medium truncate group-hover:text-primary transition-colors">
                    {album.name}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate font-mono">
                    {album.artist}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {album.songCount} {album.songCount === 1 ? "song" : "songs"}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default BrowsePage;
