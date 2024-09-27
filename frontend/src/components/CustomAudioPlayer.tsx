"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaStepBackward,
  FaStepForward,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";
import Image from "next/image";
import { AlbumProps } from "@/api/albums.api";
import { TitleProps } from "@/api/titles.api";

const CustomAudioPlayer = ({
  src,
  album,
  title,
  songs,
  currentSongIndex,
  onSongChange,
}: {
  src: string;
  album: AlbumProps;
  title: string;
  currentSongIndex: number;
  songs: TitleProps[];
  onSongChange: (index: number) => void;
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Play or pause the audio
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Update progress bar as the audio plays
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setProgress((audioRef.current.currentTime / duration) * 100);
    }
  };

  // Update duration when metadata is loaded
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Handle progress bar changes
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = (e.target.valueAsNumber / 100) * duration;
      audioRef.current.currentTime = newTime;
      setProgress(e.target.valueAsNumber);
    }
  };

  // Handle volume changes
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.volume = e.target.valueAsNumber;
      setVolume(e.target.valueAsNumber);
    }
  };

  // Format time in mm:ss format
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };
  const nextSong = () => {
    const nextIndex = (currentSongIndex + 1) % songs.length;
    onSongChange(nextIndex);
  };

  const prevSong = () => {
    const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    onSongChange(prevIndex);
  };
  return (
    <div className="flex items-center bg-black p-6 rounded-lg w-full ">
      {/* Album Art */}
      <img
        src={album.img!}
        alt="Album Cover"
        width={80}
        height={80}
        className="rounded-lg mr-6"
      />

      {/* Song Info */}
      <div className="mr-6 flex-col">
        <p className="text-white text-lg font-bold">{title}</p>
        <p className="text-gray-400 text-sm">{album.author}</p>
      </div>

      {/* Audio Controls */}
      <div className="flex items-center w-full">
        <audio
          ref={audioRef}
          src={src}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
        />

        {/* Backward Button */}
        <button onClick={prevSong} className="text-white mx-2 text-lg">
          <FaStepBackward />
        </button>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          className="bg-white text-black rounded-full p-3 mx-2"
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>

        {/* Forward Button */}
        <button onClick={nextSong} className="text-white mx-2 text-lg">
          <FaStepForward />
        </button>

        {/* Progress Bar */}
        <input
          type="range"
          value={progress}
          onChange={handleProgressChange}
          className="w-full mx-4"
          style={{ accentColor: "#1DB954" }} // Spotify-like green
        />

        {/* Current Time / Duration */}
        <div className="flex items-center text-gray-400 text-sm mx-2">
          <span>{formatTime(currentTime)}</span>
          <span className="mx-1">/</span> {/* Reduced margin here */}
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume Control */}
      <div className="flex items-center ml-4">
        <button className="text-white">
          {volume > 0 ? <FaVolumeUp /> : <FaVolumeMute />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="ml-2"
          style={{ accentColor: "#1DB954" }}
        />
      </div>
    </div>
  );
};

export default CustomAudioPlayer;
