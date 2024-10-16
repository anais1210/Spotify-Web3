import React, { useState, useRef, useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaStepBackward,
  FaStepForward,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";
import { AlbumProps, fetchAlbumById } from "@/api/albums.api";
import { TitleProps } from "@/api/titles.api";
import { addReward } from "@/api/reward.api";
import { ArtistProps, updateArtist } from "@/api/artists.api";
import { isSubscribe } from "@/api/subscription.api";
import { fetchUserByAddress } from "@/api/user.api";
import { useActiveAccount } from "thirdweb/react";
import { toast } from "react-toastify";

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
  const [points, setPoints] = useState(0);
  const [listeningTime, setListeningTime] = useState(0); // Temps d'écoute réel en secondes
  const [artist, setArtist] = useState<ArtistProps>();
  const account = useActiveAccount();
  const [isSubscribed, setIsSubscribed] = useState(false); // Track subscription status
  const [hasShownToast, setHasShownToast] = useState(false); // Track if toast has been shown

  useEffect(() => {
    const isSub = async () => {
      if (account) {
        const userId = await fetchUserByAddress(account?.address);
        if (userId?._id) {
          const sub = await isSubscribe(userId._id);
          if (sub) {
            console.log(sub);
            setIsSubscribed(true);
          } else {
            setIsSubscribed(false);
          }
        }
      }
    };
    isSub();
  }, []);

  const togglePlayPause = () => {
    if (audioRef.current && (isSubscribed || currentTime < 21)) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentTimeValue = audioRef.current.currentTime;
      setCurrentTime(currentTimeValue);
      setProgress((currentTimeValue / duration) * 100);
      if (!isSubscribed && currentTimeValue >= 20) {
        audioRef.current.pause();
        setIsPlaying(false);
        if (!hasShownToast) {
          toast.info("You need to subscribe to listen to the full song.");
          setHasShownToast(true);
        }
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = (e.target.valueAsNumber / 100) * duration;
      audioRef.current.currentTime = newTime;
      setProgress(e.target.valueAsNumber);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.volume = e.target.valueAsNumber;
      setVolume(e.target.valueAsNumber);
    }
  };

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
  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;

      const handleTimeUpdate = () => {
        if (isPlaying) {
          setListeningTime((prev) => prev + 1); // Incrémente le temps d'écoute
        }
      };

      const interval = setInterval(handleTimeUpdate, 1000); // Vérifie chaque seconde

      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  useEffect(() => {
    const updatePoints = async () => {
      // Ajoute des points tous les 10 secondes d'écoute
      if (listeningTime % 10 === 0 && listeningTime > 0) {
        setPoints((prevPoints) => prevPoints + 1);
        if (album && album._id) {
          const fetchAddress = await fetchAlbumById(album._id);
          if (fetchAddress && fetchAddress.address) {
            const addPoints = await addReward({
              name: `Reward`,
              amount: 2000,
            });
            if (addPoints && addPoints._id) {
              const updateReward = await updateArtist({
                address: fetchAddress.address,
                rewards: [addPoints._id],
              });
              if (updateReward) {
                console.log("success update and add reward");
              }
            }
          }
        }
        console.log(album);
      }
    };
    updatePoints();
  }, [listeningTime]);

  return (
    <div className="flex items-center bg-black p-6 rounded-lg w-full ">
      <img
        src={album.img!}
        alt="Album Cover"
        width={80}
        height={80}
        className="rounded-lg mr-6"
      />
      <div className="mr-6 flex-col">
        <p className="text-white text-lg font-bold">{title}</p>
        <p className="text-gray-400 text-sm">{album.author}</p>
      </div>
      <div className="flex items-center w-full">
        <audio
          ref={audioRef}
          src={src}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
        />
        <button onClick={prevSong} className="text-white mx-2 text-lg">
          <FaStepBackward />
        </button>
        <button
          onClick={togglePlayPause}
          className="bg-white text-black rounded-full p-3 mx-2"
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button onClick={nextSong} className="text-white mx-2 text-lg">
          <FaStepForward />
        </button>
        <input
          type="range"
          value={progress}
          onChange={handleProgressChange}
          className="w-full mx-4"
          style={{ accentColor: "#1DB954" }}
        />
        <div className="flex items-center text-gray-400 text-sm mx-2">
          <span>{formatTime(currentTime)}</span>
          <span className="mx-1">/</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
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
      <div>Points: {points}</div>
    </div>
  );
};

export default CustomAudioPlayer;
