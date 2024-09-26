"use client";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { addTitle, TitleProps } from "@/api/titles.api";
import { AlbumProps, updateAlbum } from "@/api/albums.api";
import FileUpload from "./FileUpload";
import { useActiveAccount } from "thirdweb/react";
import { toast, ToastContainer } from "react-toastify";

interface AddSongProps {
  album: AlbumProps;
  onSubmit: (songData: TitleProps) => void;
}

const AddSong: React.FC<AddSongProps> = ({ album, onSubmit }) => {
  const account = useActiveAccount();

  const [songTitle, setSongTitle] = useState<string>("");
  const [audioUrl, setAudioUrl] = useState<string>("");

  const [uploadStatus, setUploadStatus] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (songTitle) {
      // if (audioUrl && songTitle) {
      const songData: TitleProps = {
        address: account?.address || "",
        name: songTitle,
        author: album.author,
        album: album._id,
        // audio: audioUrl,
      };

      try {
        const addedSong = await addTitle(songData);
        if (addedSong && album._id && addedSong._id) {
          const update = await updateAlbum(album._id, {
            titles: [addedSong._id],
          });
          if (update) {
            onSubmit(addedSong);
            setSongTitle("");
            setAudioUrl("");
            toast.success("Song added successfully");
          }
        } else {
          console.error("Failed to add song");
        }
      } catch (error) {
        console.error("Error adding song:", error);
      }
    } else {
      console.error("Please provide a song title ");
    }
  };

  const handleFileUpload = (uploadedAudioUrl: string) => {
    setAudioUrl(uploadedAudioUrl);
  };

  return (
    <div>
      <ToastContainer />

      <form onSubmit={handleSubmit}>
        {/* Song Title Input */}
        <div className="mb-4">
          <label className="block text-gray-300">Song Title</label>
          <input
            type="text"
            value={songTitle}
            onChange={(e) => setSongTitle(e.target.value)}
            className="border text-black rounded w-full py-2 px-3"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg mb-2">Audio File</label>
          <FileUpload onFileUpload={handleFileUpload} />
        </div>

        <button
          type="submit"
          className="flex items-center bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-black py-3 px-6 rounded-full shadow-md transition duration-200 ease-in-out transform hover:scale-105"
        >
          <FaPlus className="mr-2" style={{ verticalAlign: "middle" }} />
          <span className="align-middle">Add Song</span>
        </button>
      </form>
    </div>
  );
};

export default AddSong;
