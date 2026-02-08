"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode,
} from "react";
import {
  SongMetadata,
  fetchMetadataFromIPFS,
  fetchAlbumMetadata,
  ipfsToHttp,
  isValidIpfsUri,
} from "@/lib/pinata";

export interface PlayableSong {
  id: string;
  tokenId: string;
  uri: string;
  albumName: string;
  albumAddress: string;
  artistAddress: string;
}

interface PlayerState {
  currentSong: PlayableSong | null;
  metadata: SongMetadata | null;
  isPlaying: boolean;
  isLoading: boolean;
  duration: number;
  currentTime: number;
  volume: number;
  queue: PlayableSong[];
  queueIndex: number;
}

interface PlayerContextType extends PlayerState {
  playSong: (song: PlayableSong) => void;
  playQueue: (songs: PlayableSong[], startIndex?: number) => void;
  togglePlay: () => void;
  pause: () => void;
  resume: () => void;
  nextSong: () => void;
  prevSong: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  clearQueue: () => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<PlayerState>({
    currentSong: null,
    metadata: null,
    isPlaying: false,
    isLoading: false,
    duration: 0,
    currentTime: 0,
    volume: 0.7,
    queue: [],
    queueIndex: -1,
  });

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio();
      audioRef.current.volume = state.volume;

      // Event listeners
      audioRef.current.addEventListener("loadedmetadata", () => {
        setState((prev) => ({
          ...prev,
          duration: audioRef.current?.duration || 0,
          isLoading: false,
        }));
      });

      audioRef.current.addEventListener("timeupdate", () => {
        setState((prev) => ({
          ...prev,
          currentTime: audioRef.current?.currentTime || 0,
        }));
      });

      audioRef.current.addEventListener("ended", () => {
        // Auto-play next song in queue
        setState((prev) => {
          if (prev.queueIndex < prev.queue.length - 1) {
            const nextIndex = prev.queueIndex + 1;
            const nextSong = prev.queue[nextIndex];
            loadAndPlaySong(nextSong, nextIndex);
            return { ...prev, queueIndex: nextIndex };
          }
          return { ...prev, isPlaying: false };
        });
      });

      audioRef.current.addEventListener("error", () => {
        setState((prev) => ({ ...prev, isLoading: false, isPlaying: false }));
      });

      return () => {
        audioRef.current?.pause();
        audioRef.current = null;
      };
    }
  }, []);

  // Update volume when state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.volume;
    }
  }, [state.volume]);

  const loadAndPlaySong = async (song: PlayableSong, queueIndex: number) => {
    setState((prev) => ({
      ...prev,
      currentSong: song,
      metadata: null,
      isLoading: true,
      isPlaying: false,
      queueIndex,
    }));

    try {
      // Fetch metadata from IPFS
      const metadata = await fetchMetadataFromIPFS(song.uri);
      if (!metadata) {
        throw new Error("Failed to load song metadata");
      }

      // If song doesn't have a valid image, try to get album cover
      const hasValidImage = isValidIpfsUri(metadata.image);
      if (!hasValidImage && song.albumAddress && song.albumName) {
        const albumMeta = await fetchAlbumMetadata(
          song.albumAddress,
          song.albumName,
        );
        if (albumMeta?.image && isValidIpfsUri(albumMeta.image)) {
          metadata.image = albumMeta.image;
        } else {
          console.log("[Player] No valid album cover found");
          metadata.image = ""; // Clear invalid image
        }
      }

      setState((prev) => ({ ...prev, metadata }));

      // Get audio URL and play
      const audioUrl = ipfsToHttp(metadata.animation_url);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.load();
        await audioRef.current.play();
        setState((prev) => ({ ...prev, isPlaying: true, isLoading: false }));
      }
    } catch (error) {
      console.error("Error loading song:", error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const playSong = (song: PlayableSong) => {
    setState((prev) => ({
      ...prev,
      queue: [song],
      queueIndex: 0,
    }));
    loadAndPlaySong(song, 0);
  };

  const playQueue = (songs: PlayableSong[], startIndex = 0) => {
    if (songs.length === 0) return;
    setState((prev) => ({
      ...prev,
      queue: songs,
      queueIndex: startIndex,
    }));
    loadAndPlaySong(songs[startIndex], startIndex);
  };

  const togglePlay = () => {
    if (!audioRef.current || !state.currentSong) return;

    if (state.isPlaying) {
      audioRef.current.pause();
      setState((prev) => ({ ...prev, isPlaying: false }));
    } else {
      audioRef.current.play();
      setState((prev) => ({ ...prev, isPlaying: true }));
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setState((prev) => ({ ...prev, isPlaying: false }));
    }
  };

  const resume = () => {
    if (audioRef.current && state.currentSong) {
      audioRef.current.play();
      setState((prev) => ({ ...prev, isPlaying: true }));
    }
  };

  const nextSong = () => {
    if (state.queueIndex < state.queue.length - 1) {
      const nextIndex = state.queueIndex + 1;
      loadAndPlaySong(state.queue[nextIndex], nextIndex);
    }
  };

  const prevSong = () => {
    // If more than 3 seconds into song, restart it
    if (state.currentTime > 3) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
      return;
    }

    if (state.queueIndex > 0) {
      const prevIndex = state.queueIndex - 1;
      loadAndPlaySong(state.queue[prevIndex], prevIndex);
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setState((prev) => ({ ...prev, currentTime: time }));
    }
  };

  const setVolume = (volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    setState((prev) => ({ ...prev, volume: clampedVolume }));
  };

  const clearQueue = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    setState({
      currentSong: null,
      metadata: null,
      isPlaying: false,
      isLoading: false,
      duration: 0,
      currentTime: 0,
      volume: state.volume,
      queue: [],
      queueIndex: -1,
    });
  };

  return (
    <PlayerContext.Provider
      value={{
        ...state,
        playSong,
        playQueue,
        togglePlay,
        pause,
        resume,
        nextSong,
        prevSong,
        seek,
        setVolume,
        clearQueue,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
