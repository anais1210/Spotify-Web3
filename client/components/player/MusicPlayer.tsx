"use client";

import { usePlayer } from "@/contexts/PlayerContext";
import { ipfsToHttp, isValidIpfsUri } from "@/lib/pinata";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Volume1,
  VolumeX,
  Music2,
  Loader2,
  X,
  ListMusic,
  Repeat,
  Shuffle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds === 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function MusicPlayer() {
  const {
    currentSong,
    metadata,
    isPlaying,
    isLoading,
    duration,
    currentTime,
    volume,
    queue,
    queueIndex,
    togglePlay,
    nextSong,
    prevSong,
    seek,
    setVolume,
    clearQueue,
  } = usePlayer();

  const [prevVolume, setPrevVolume] = useState(1);
  const [isHoveringProgress, setIsHoveringProgress] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  // Don't render if no song is loaded
  if (!currentSong) return null;

  // Only use image if it's a valid IPFS URI
  const coverImage =
    metadata?.image && isValidIpfsUri(metadata.image)
      ? ipfsToHttp(metadata.image)
      : null;
  const songName = metadata?.name || "Loading...";
  const hasNext = queueIndex < queue.length - 1;
  const hasPrev = queueIndex > 0 || currentTime > 3;
  const progress = duration ? (currentTime / duration) * 100 : 0;

  // Toggle mute
  const handleMuteToggle = () => {
    if (volume > 0) {
      setPrevVolume(volume);
      setVolume(0);
    } else {
      setVolume(prevVolume || 0.7);
    }
  };

  // Get appropriate volume icon
  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t-2 border-foreground">
      <div className="container max-w-7xl mx-auto">
        {/* Progress bar */}
        <div
          className="h-1 bg-foreground cursor-pointer group relative overflow-hidden transition-all hover:h-1.5"
          onMouseEnter={() => setIsHoveringProgress(true)}
          onMouseLeave={() => setIsHoveringProgress(false)}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            seek(percent * (duration || 0));
          }}
        >
          {/* Progress fill */}
          <div
            className="h-full relative transition-all duration-150 ease-out bg-background"
            style={{
              width: `${progress}%`,
            }}
          >
            {/* Interactive handle */}
            <div
              className={`absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 border-2 border-foreground bg-primary transition-all duration-200 ${
                isHoveringProgress
                  ? "opacity-100 scale-125"
                  : "opacity-0 scale-0"
              }`}
            />
          </div>
        </div>

        <div className="flex items-center gap-6 py-4 px-6">
          {/* Song Info */}
          <div className="flex items-center gap-4 flex-1 min-w-0 max-w-80">
            {/* Album Cover */}
            <div className="relative shrink-0 group">
              <div className="w-16 h-16 overflow-hidden relative border-2 border-foreground">
                {coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={coverImage}
                    alt={songName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-background">
                    <Music2 className="w-7 h-7 text-foreground" />
                  </div>
                )}

                {/* Loading overlay */}
                {isLoading && (
                  <div className="absolute inset-0 bg-foreground flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-background animate-spin" />
                  </div>
                )}
              </div>
            </div>

            {/* Title & Album */}
            <div className="min-w-0 flex-1">
              <p className="font-bold text-base truncate text-foreground mb-0.5">
                {isLoading ? "Loading..." : songName}
              </p>
              <p className="text-sm text-foreground truncate">
                {currentSong.albumName}
              </p>
            </div>
          </div>

          {/* Center Controls */}
          <div className="flex flex-col items-center gap-2 flex-1">
            {/* Main Controls */}
            <div className="flex items-center gap-2">
              {/* Shuffle (placeholder) */}
              <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9 text-foreground transition-all hidden sm:flex border-2 border-transparent hover:border-foreground"
                disabled
              >
                <Shuffle className="w-4 h-4" />
              </Button>

              {/* Previous */}
              <Button
                variant="ghost"
                size="icon"
                onClick={prevSong}
                disabled={!hasPrev || isLoading}
                className="w-10 h-10 text-foreground hover:scale-110 hover:bg-foreground hover:text-background transition-all disabled:opacity-20 disabled:hover:scale-100 border-2 border-transparent hover:border-foreground"
              >
                <SkipBack className="w-5 h-5 fill-current" />
              </Button>

              {/* Play/Pause */}
              <Button
                size="icon"
                onClick={togglePlay}
                disabled={isLoading}
                className="relative w-14 h-14 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 bg-foreground text-background border-2 border-foreground hover:bg-primary hover:text-foreground hover:border-yellow-400"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-6 h-6 fill-current" />
                ) : (
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                )}
              </Button>

              {/* Next */}
              <Button
                variant="ghost"
                size="icon"
                onClick={nextSong}
                disabled={!hasNext || isLoading}
                className="w-10 h-10 text-foreground hover:scale-110 hover:bg-foreground hover:text-background transition-all disabled:opacity-20 disabled:hover:scale-100 border-2 border-transparent hover:border-foreground"
              >
                <SkipForward className="w-5 h-5 fill-current" />
              </Button>

              {/* Repeat (placeholder) */}
              <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9 text-foreground transition-all hidden sm:flex border-2 border-transparent hover:border-foreground"
                disabled
              >
                <Repeat className="w-4 h-4" />
              </Button>
            </div>

            {/* Time display (mobile) */}
            <div className="flex sm:hidden items-center gap-2 text-xs text-foreground font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>•</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Section - Time, Volume, Queue */}
          <div className="flex items-center gap-4 flex-1 justify-end max-w-80">
            {/* Time display (desktop) */}
            <div className="hidden sm:flex items-center gap-2.5 text-sm text-foreground font-mono">
              <span className="w-11 text-right tabular-nums">
                {formatTime(currentTime)}
              </span>
              <span>•</span>
              <span className="w-11 tabular-nums">{formatTime(duration)}</span>
            </div>

            {/* Volume Control */}
            <div className="hidden md:flex items-center gap-3 group">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleMuteToggle}
                className="w-9 h-9 text-foreground hover:bg-foreground hover:text-background transition-all border-2 border-transparent hover:border-foreground"
              >
                <VolumeIcon className="w-5 h-5" />
              </Button>

              {/* Expanding volume slider */}
              <div className="w-0 group-hover:w-24 overflow-hidden transition-all duration-300 ease-out">
                <Slider
                  value={[volume * 100]}
                  max={100}
                  step={1}
                  onValueChange={([value]: number[]) => setVolume(value / 100)}
                  className="w-24 cursor-pointer"
                />
              </div>
            </div>

            {/* Queue button */}
            {queue.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowQueue(!showQueue)}
                className={`relative w-9 h-9 transition-all border-2 ${
                  showQueue
                    ? "text-background bg-foreground border-foreground scale-105"
                    : "text-foreground border-transparent hover:border-foreground hover:bg-foreground hover:text-background"
                }`}
              >
                <ListMusic className="w-5 h-5 relative z-10" />
              </Button>
            )}

            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={clearQueue}
              className="w-9 h-9 text-foreground hover:bg-foreground hover:text-background transition-all border-2 border-transparent hover:border-foreground"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Queue Panel */}
      {showQueue && queue.length > 1 && (
        <div className="absolute bottom-full left-0 right-0 bg-background border-t-2 border-foreground max-h-72 overflow-y-auto scrollbar-hide">
          <div className="container max-w-7xl mx-auto p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <div className="w-8 h-8 border-2 border-foreground flex items-center justify-center">
                  <ListMusic className="w-4 h-4" />
                </div>
                <span>Up Next</span>
                <span className="text-xs">({queue.length} songs)</span>
              </h3>
            </div>

            {/* Queue items */}
            <div className="space-y-1.5">
              {queue.map((song, index) => (
                <div
                  key={song.id}
                  className={`flex items-center gap-4 p-3 transition-all duration-200 border-2 ${
                    index === queueIndex
                      ? "bg-foreground text-background border-foreground"
                      : "border-foreground hover:bg-foreground hover:text-background cursor-pointer"
                  }`}
                >
                  {/* Track number or playing indicator */}
                  <div className="w-6 flex items-center justify-center">
                    <span className="text-xs font-mono font-bold">
                      {index === queueIndex ? "▶" : index + 1}
                    </span>
                  </div>

                  {/* Song info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm truncate transition-colors ${
                        index === queueIndex ? "font-bold" : ""
                      }`}
                    >
                      {song.id.split("-")[1]
                        ? `Song #${song.tokenId}`
                        : song.tokenId}
                    </p>
                    <p className="text-xs truncate">{song.albumName}</p>
                  </div>

                  {/* Playing indicator */}
                  {index === queueIndex && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 bg-current animate-pulse" />
                      <div className="w-1 h-1 bg-current animate-pulse delay-75" />
                      <div className="w-1 h-1 bg-current animate-pulse delay-150" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MusicPlayer;
