"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useGetAlbum } from "@/hooks";
import { usePlayer, PlayableSong } from "@/contexts/PlayerContext";
import { fetchMetadataFromIPFS, ipfsToHttp, fetchAlbumMetadata, SongMetadata } from "@/lib/pinata";
import { Button } from "@/components/ui/button";
import { Play, Pause, Music2, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";

interface SongWithMetadata {
  id: string;
  tokenId: string;
  uri: string;
  owner: string;
  metadata: SongMetadata | null;
  isLoading: boolean;
}

function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

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

function AlbumPage() {
  const params = useParams();
  const address = params?.address as string;

  const { album, isLoading, error } = useGetAlbum(address);
  const { playSong, playQueue, currentSong, isPlaying, togglePlay } = usePlayer();

  const [songsWithMetadata, setSongsWithMetadata] = useState<SongWithMetadata[]>([]);
  const [albumCover, setAlbumCover] = useState<string | null>(null);
  const [loadingSongs, setLoadingSongs] = useState(false);

  // Fetch album cover
  useEffect(() => {
    async function fetchCover() {
      if (!album) return;

      // Try album metadata first
      const albumMeta = await fetchAlbumMetadata(album.address);
      if (albumMeta?.image) {
        setAlbumCover(ipfsToHttp(albumMeta.image));
        return;
      }

      // Try first song's cover
      if (album.songs && album.songs.length > 0) {
        const firstSong = album.songs[0];
        const songMeta = await fetchMetadataFromIPFS(firstSong.uri);
        if (songMeta?.image) {
          setAlbumCover(ipfsToHttp(songMeta.image));
        }
      }
    }
    fetchCover();
  }, [album]);

  // Fetch song metadata
  useEffect(() => {
    async function fetchSongsMetadata() {
      if (!album?.songs || album.songs.length === 0) {
        setSongsWithMetadata([]);
        return;
      }

      setLoadingSongs(true);

      const songsData: SongWithMetadata[] = await Promise.all(
        album.songs.map(async (song) => {
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
            owner: song.owner,
            metadata,
            isLoading: false,
          };
        })
      );

      setSongsWithMetadata(songsData);
      setLoadingSongs(false);
    }

    fetchSongsMetadata();
  }, [album?.songs]);

  const handlePlaySong = (song: SongWithMetadata) => {
    if (!album) return;

    const playable: PlayableSong = {
      id: song.id,
      tokenId: song.tokenId,
      uri: song.uri,
      albumName: album.name,
      albumAddress: album.address,
      artistAddress: album.artist.address,
    };

    playSong(playable);
  };

  const handlePlayAll = () => {
    if (!album || songsWithMetadata.length === 0) return;

    const playableSongs: PlayableSong[] = songsWithMetadata.map((song) => ({
      id: song.id,
      tokenId: song.tokenId,
      uri: song.uri,
      albumName: album.name,
      albumAddress: album.address,
      artistAddress: album.artist.address,
    }));

    playQueue(playableSongs, 0);
  };

  const isCurrentAlbumPlaying = currentSong?.albumAddress === address && isPlaying;

  // Loading state
  if (isLoading) {
    return (
      <div className="container py-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Error state
  if (error || !album) {
    return (
      <div className="container py-16 text-center">
        <Music2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Album Not Found</h1>
        <p className="text-muted-foreground mb-6">
          This album doesn&apos;t exist or hasn&apos;t been indexed yet.
        </p>
        <Link href="/browse">
          <Button>Browse Albums</Button>
        </Link>
      </div>
    );
  }

  const gradient = getGradientFromAddress(album.address);
  const createdDate = new Date(parseInt(album.createdAt) * 1000).getFullYear();

  return (
    <div className="container py-8">
      {/* Album Header */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        {/* Cover */}
        <div className="w-48 h-48 md:w-64 md:h-64 shrink-0 rounded-lg overflow-hidden shadow-lg">
          {albumCover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={albumCover}
              alt={album.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
              <Music2 className="w-20 h-20 text-white/30" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col justify-end">
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
            Album
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{album.name}</h1>
          <div className="text-muted-foreground mb-6 flex items-center gap-2 flex-wrap">
            <Link
              href={`https://sepolia.etherscan.io/address/${album.artist.address}`}
              target="_blank"
              className="text-foreground font-medium font-mono hover:text-primary flex items-center gap-1"
            >
              {formatAddress(album.artist.address)}
              <ExternalLink className="w-3 h-3" />
            </Link>
            <span>•</span>
            <span>{createdDate}</span>
            <span>•</span>
            <span>{album.totalSongs} songs</span>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              onClick={isCurrentAlbumPlaying ? togglePlay : handlePlayAll}
              size="lg"
              className="gap-2"
              disabled={songsWithMetadata.length === 0}
            >
              {isCurrentAlbumPlaying ? (
                <>
                  <Pause className="w-5 h-5" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Play All
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Songs List */}
      <div>
        {/* Header */}
        <div className="flex items-center gap-4 py-2 text-sm text-muted-foreground border-b border-border">
          <div className="w-8 text-center">#</div>
          <div className="flex-1">Title</div>
          <div className="w-32 text-right hidden sm:block">Owner</div>
        </div>

        {/* Loading Songs */}
        {loadingSongs && (
          <div className="py-8 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        )}

        {/* No Songs */}
        {!loadingSongs && songsWithMetadata.length === 0 && (
          <div className="py-8 text-center text-muted-foreground">
            No songs in this album yet.
          </div>
        )}

        {/* Songs */}
        {!loadingSongs && songsWithMetadata.length > 0 && (
          <div className="mt-2">
            {songsWithMetadata.map((song, index) => {
              const isCurrentSong = currentSong?.id === song.id;
              const songName = song.metadata?.name || `Song #${song.tokenId}`;
              const songCover = song.metadata?.image ? ipfsToHttp(song.metadata.image) : null;

              return (
                <div
                  key={song.id}
                  onClick={() => handlePlaySong(song)}
                  className={`flex items-center gap-4 py-3 px-2 rounded-lg cursor-pointer transition-colors group ${
                    isCurrentSong
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted/50"
                  }`}
                >
                  {/* Track Number / Play Icon */}
                  <div className="w-8 text-center">
                    {isCurrentSong && isPlaying ? (
                      <div className="flex items-center justify-center gap-0.5">
                        <span className="w-1 h-3 bg-primary rounded-full animate-pulse" />
                        <span className="w-1 h-4 bg-primary rounded-full animate-pulse delay-75" />
                        <span className="w-1 h-2 bg-primary rounded-full animate-pulse delay-150" />
                      </div>
                    ) : (
                      <span className="text-muted-foreground group-hover:hidden">
                        {index + 1}
                      </span>
                    )}
                    <Play className="w-4 h-4 hidden group-hover:block mx-auto" />
                  </div>

                  {/* Song Info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Mini Cover */}
                    <div className="w-10 h-10 rounded overflow-hidden bg-muted flex-shrink-0">
                      {songCover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={songCover}
                          alt={songName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                          <Music2 className="w-4 h-4 text-white/50" />
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <div className="min-w-0">
                      <p className={`font-medium truncate ${isCurrentSong ? "text-primary" : ""}`}>
                        {songName}
                      </p>
                      {song.metadata?.attributes && (
                        <p className="text-xs text-muted-foreground truncate">
                          {song.metadata.attributes.find(a => a.trait_type === "Genre")?.value || ""}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Owner */}
                  <div className="w-32 text-right hidden sm:block">
                    <span className="text-sm text-muted-foreground font-mono">
                      {formatAddress(song.owner)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AlbumPage;
