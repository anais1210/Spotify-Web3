"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useGetOwnedSongs } from "@/hooks";
import { fetchMetadataFromIPFS, ipfsToHttp, SongMetadata } from "@/lib/pinata";
import { usePlayer, PlayableSong } from "@/contexts/PlayerContext";
import EmptyCollection from "@/components/collection/EmptyCollection";
import { Music2, Play, Loader2, Disc3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SongWithMetadata {
  id: string;
  tokenId: string;
  uri: string;
  albumAddress: string;
  albumName: string;
  metadata: SongMetadata | null;
}

// Generate gradient from address
function getGradientFromAddress(address: string): string {
  const gradients = [
    "from-violet-600 to-indigo-900",
    "from-amber-500 to-orange-700",
    "from-cyan-500 to-blue-700",
    "from-pink-500 to-rose-700",
    "from-emerald-500 to-green-800",
    "from-purple-500 to-fuchsia-800",
  ];
  const index = parseInt(address.slice(-2), 16) % gradients.length;
  return gradients[index];
}

function CollectionPage() {
  const { address, isConnected } = useAccount();
  const { songs, isLoading, error } = useGetOwnedSongs(address);
  const { playSong, currentSong, isPlaying } = usePlayer();

  const [songsWithMetadata, setSongsWithMetadata] = useState<SongWithMetadata[]>([]);
  const [loadingMetadata, setLoadingMetadata] = useState(false);

  // Fetch metadata for all songs
  useEffect(() => {
    async function fetchMetadata() {
      if (!songs || songs.length === 0) {
        setSongsWithMetadata([]);
        return;
      }

      setLoadingMetadata(true);

      const songsData: SongWithMetadata[] = await Promise.all(
        songs.map(async (song) => {
          let metadata: SongMetadata | null = null;
          try {
            metadata = await fetchMetadataFromIPFS(song.uri);
          } catch {
            // Ignore errors
          }
          return {
            id: song.id,
            tokenId: song.tokenId,
            uri: song.uri,
            albumAddress: song.album.address,
            albumName: song.album.name,
            metadata,
          };
        })
      );

      setSongsWithMetadata(songsData);
      setLoadingMetadata(false);
    }

    fetchMetadata();
  }, [songs]);

  const handlePlay = (song: SongWithMetadata) => {
    const playable: PlayableSong = {
      id: song.id,
      tokenId: song.tokenId,
      uri: song.uri,
      albumName: song.albumName,
      albumAddress: song.albumAddress,
      artistAddress: "", // We don't have this in the song data
    };
    playSong(playable);
  };

  // Not connected
  if (!isConnected) {
    return (
      <div className="container py-32 text-center">
        <Disc3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-3xl font-heading font-bold mb-4">Connect Your Wallet</h1>
        <p className="text-muted-foreground text-lg">
          Connect your wallet to see your music collection.
        </p>
      </div>
    );
  }

  const isPageLoading = isLoading || loadingMetadata;
  const ownedSongs = songsWithMetadata;

  return (
    <div className="container py-16">
      {/* header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-heading font-bold mb-2">My Collection</h1>
          <p className="text-muted-foreground">Your owned music NFTs</p>
        </div>
        {ownedSongs.length > 0 && (
          <p className="text-muted-foreground">
            {ownedSongs.length} {ownedSongs.length === 1 ? "song" : "songs"}
          </p>
        )}
      </div>

      {/* Loading */}
      {isPageLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      )}

      {/* Error */}
      {error && !isPageLoading && (
        <div className="text-center py-20">
          <p className="text-red-500">Failed to load collection. Please try again.</p>
        </div>
      )}

      {/* Empty */}
      {!isPageLoading && !error && ownedSongs.length === 0 && <EmptyCollection />}

      {/* Songs Grid */}
      {!isPageLoading && !error && ownedSongs.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {ownedSongs.map((song) => {
            const coverImage = song.metadata?.image ? ipfsToHttp(song.metadata.image) : null;
            const songName = song.metadata?.name || `Song #${song.tokenId}`;
            const gradient = getGradientFromAddress(song.albumAddress);
            const isCurrentSong = currentSong?.id === song.id;

            return (
              <div
                key={song.id}
                className="group relative rounded-xl overflow-hidden bg-zinc-900/50 hover:bg-zinc-800/50 transition-all cursor-pointer"
                onClick={() => handlePlay(song)}
              >
                {/* Cover */}
                <div className="aspect-square relative">
                  {coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={coverImage}
                      alt={songName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                      <Music2 className="w-12 h-12 text-white/30" />
                    </div>
                  )}

                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      size="icon"
                      className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90"
                    >
                      <Play className="w-5 h-5 fill-current" />
                    </Button>
                  </div>

                  {/* Now playing indicator */}
                  {isCurrentSong && isPlaying && (
                    <div className="absolute bottom-2 right-2 bg-primary rounded-full p-1.5">
                      <div className="flex items-center gap-0.5">
                        <span className="w-1 h-3 bg-white rounded-full animate-pulse" />
                        <span className="w-1 h-4 bg-white rounded-full animate-pulse delay-75" />
                        <span className="w-1 h-2 bg-white rounded-full animate-pulse delay-150" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className={`font-medium text-sm truncate ${isCurrentSong ? "text-primary" : "text-white"}`}>
                    {songName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{song.albumName}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CollectionPage;
