"use client";

import { usePlayer } from "@/contexts/PlayerContext";
import { ipfsToHttp } from "@/lib/pinata";
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
import { useState, useMemo } from "react";

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds === 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Generate vibrant gradient colors from album address
function getGradientColors(address: string): { from: string; to: string; accent: string } {
  const gradients = [
    { from: "#8B5CF6", to: "#EC4899", accent: "#A855F7" }, // Purple to Pink
    { from: "#06B6D4", to: "#3B82F6", accent: "#0EA5E9" }, // Cyan to Blue
    { from: "#F59E0B", to: "#EF4444", accent: "#F97316" }, // Amber to Red
    { from: "#10B981", to: "#06B6D4", accent: "#14B8A6" }, // Emerald to Cyan
    { from: "#EC4899", to: "#8B5CF6", accent: "#D946EF" }, // Pink to Purple
    { from: "#3B82F6", to: "#8B5CF6", accent: "#6366F1" }, // Blue to Purple
  ];
  const index = parseInt(address.slice(-2), 16) % gradients.length;
  return gradients[index];
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

  // Memoize gradient colors based on album address
  const gradientColors = useMemo(() => {
    return currentSong ? getGradientColors(currentSong.albumAddress) : null;
  }, [currentSong?.albumAddress]);

  // Don't render if no song is loaded
  if (!currentSong || !gradientColors) return null;

  const coverImage = metadata?.image ? ipfsToHttp(metadata.image) : null;
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
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Gradient background with blur */}
      <div
        className="absolute inset-0 opacity-95"
        style={{
          background: `linear-gradient(135deg, ${gradientColors.from}15 0%, ${gradientColors.to}20 100%)`,
        }}
      />
      <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-xl" />

      {/* Animated glow effect */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 20% 50%, ${gradientColors.from}40 0%, transparent 50%),
                       radial-gradient(ellipse at 80% 50%, ${gradientColors.to}30 0%, transparent 50%)`,
        }}
      />

      <div className="relative container max-w-screen-xl mx-auto">
        {/* Progress bar - Interactive */}
        <div
          className="h-1.5 bg-zinc-800/50 -mt-px cursor-pointer group relative overflow-hidden"
          onMouseEnter={() => setIsHoveringProgress(true)}
          onMouseLeave={() => setIsHoveringProgress(false)}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            seek(percent * (duration || 0));
          }}
        >
          {/* Background track */}
          <div className="absolute inset-0 bg-zinc-800/50" />

          {/* Progress fill with gradient */}
          <div
            className="h-full relative transition-all duration-100"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${gradientColors.from}, ${gradientColors.to})`,
            }}
          >
            {/* Glowing edge */}
            <div
              className={`absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full transition-all duration-200 ${
                isHoveringProgress ? "opacity-100 scale-100" : "opacity-0 scale-0"
              }`}
              style={{
                background: gradientColors.accent,
                boxShadow: `0 0 10px ${gradientColors.accent}, 0 0 20px ${gradientColors.accent}50`,
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 py-3 px-4">
          {/* Song Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0 max-w-[280px]">
            {/* Cover with glow */}
            <div className="relative flex-shrink-0 group">
              <div
                className="absolute inset-0 rounded-lg blur-lg opacity-50 transition-opacity group-hover:opacity-70"
                style={{
                  background: `linear-gradient(135deg, ${gradientColors.from}, ${gradientColors.to})`,
                }}
              />
              <div className="w-14 h-14 rounded-lg overflow-hidden relative shadow-lg">
                {coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={coverImage}
                    alt={songName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${gradientColors.from}, ${gradientColors.to})`,
                    }}
                  >
                    <Music2 className="w-6 h-6 text-white/70" />
                  </div>
                )}

                {/* Loading overlay */}
                {isLoading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
              </div>
            </div>

            {/* Title & Album */}
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate text-white">
                {isLoading ? "Loading..." : songName}
              </p>
              <p className="text-xs text-zinc-400 truncate hover:text-zinc-300 transition-colors cursor-pointer">
                {currentSong.albumName}
              </p>
            </div>
          </div>

          {/* Center Controls */}
          <div className="flex flex-col items-center gap-1 flex-1">
            {/* Main Controls */}
            <div className="flex items-center gap-1">
              {/* Shuffle (placeholder) */}
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 text-zinc-500 hover:text-white transition-colors hidden sm:flex"
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
                className="w-9 h-9 text-zinc-300 hover:text-white hover:scale-105 transition-all disabled:opacity-30 disabled:hover:scale-100"
              >
                <SkipBack className="w-5 h-5 fill-current" />
              </Button>

              {/* Play/Pause - Colorful button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                disabled={isLoading}
                className="w-12 h-12 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                style={{
                  background: `linear-gradient(135deg, ${gradientColors.from}, ${gradientColors.to})`,
                  boxShadow: isPlaying
                    ? `0 0 20px ${gradientColors.from}60, 0 0 40px ${gradientColors.to}30`
                    : "none",
                }}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-5 h-5 text-white fill-current" />
                ) : (
                  <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                )}
              </Button>

              {/* Next */}
              <Button
                variant="ghost"
                size="icon"
                onClick={nextSong}
                disabled={!hasNext || isLoading}
                className="w-9 h-9 text-zinc-300 hover:text-white hover:scale-105 transition-all disabled:opacity-30 disabled:hover:scale-100"
              >
                <SkipForward className="w-5 h-5 fill-current" />
              </Button>

              {/* Repeat (placeholder) */}
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 text-zinc-500 hover:text-white transition-colors hidden sm:flex"
                disabled
              >
                <Repeat className="w-4 h-4" />
              </Button>
            </div>

            {/* Time display (mobile) */}
            <div className="flex sm:hidden items-center gap-2 text-xs text-zinc-400">
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Section - Time, Volume, Queue */}
          <div className="flex items-center gap-3 flex-1 justify-end max-w-[320px]">
            {/* Time only (desktop) */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400 font-mono">
              <span className="w-10 text-right">{formatTime(currentTime)}</span>
              <span>/</span>
              <span className="w-10">{formatTime(duration)}</span>
            </div>

            {/* Volume Control - Always visible horizontal slider */}
            <div className="hidden md:flex items-center gap-2 group">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleMuteToggle}
                className="w-8 h-8 text-zinc-400 hover:text-white transition-colors"
              >
                <VolumeIcon className="w-4 h-4" />
              </Button>

              {/* Horizontal volume slider - expands on hover */}
              <div className="w-0 group-hover:w-20 overflow-hidden transition-all duration-300 ease-out">
                <Slider
                  value={[volume * 100]}
                  max={100}
                  step={1}
                  onValueChange={([value]: number[]) => setVolume(value / 100)}
                  className="w-20 cursor-pointer"
                />
              </div>
            </div>

            {/* Queue button */}
            {queue.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowQueue(!showQueue)}
                className={`w-8 h-8 transition-colors ${
                  showQueue ? "text-white" : "text-zinc-400 hover:text-white"
                }`}
                style={showQueue ? { color: gradientColors.accent } : {}}
              >
                <ListMusic className="w-4 h-4" />
              </Button>
            )}

            {/* Close */}
            <Button
              variant="ghost"
              size="icon"
              onClick={clearQueue}
              className="w-8 h-8 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Queue Panel (when expanded) */}
      {showQueue && queue.length > 1 && (
        <div className="absolute bottom-full left-0 right-0 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800/50 max-h-64 overflow-y-auto">
          <div className="container max-w-screen-xl mx-auto p-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <ListMusic className="w-4 h-4" style={{ color: gradientColors.accent }} />
              Queue ({queue.length} songs)
            </h3>
            <div className="space-y-1">
              {queue.map((song, index) => (
                <div
                  key={song.id}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                    index === queueIndex
                      ? "bg-white/10"
                      : "hover:bg-white/5 cursor-pointer"
                  }`}
                >
                  <span
                    className="w-5 text-center text-xs font-mono"
                    style={index === queueIndex ? { color: gradientColors.accent } : { color: "#71717a" }}
                  >
                    {index === queueIndex ? "▶" : index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${index === queueIndex ? "text-white font-medium" : "text-zinc-300"}`}>
                      {song.id.split("-")[1] ? `Song #${song.tokenId}` : song.tokenId}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">{song.albumName}</p>
                  </div>
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
