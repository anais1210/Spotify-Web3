"use client";
import AlbumHeader from "@/components/album/AlbumHeader";
import SongList from "@/components/album/SongList";
import React from "react";

const DUMMY_ALBUM = {
  address: "0x123",
  name: "Midnight Dreams",
  artist: "Luna Ray",
  coverImage: "/placeholder.jpg",
  year: 2024,
  songs: [
    {
      id: "1",
      title: "Intro - Night Falls",
      duration: "1:23",
      price: "0.01 ETH",
      isOwned: false,
    },
    {
      id: "2",
      title: "Starlight Symphony",
      duration: "4:12",
      price: "0.01 ETH",
      isOwned: true,
    },
    {
      id: "3",
      title: "Dancing in the Dark",
      duration: "3:45",
      price: "0.01 ETH",
      isOwned: false,
    },
    {
      id: "4",
      title: "Moonlit Path",
      duration: "5:01",
      price: "0.01 ETH",
      isOwned: false,
    },
    {
      id: "5",
      title: "Dreams Collide",
      duration: "3:33",
      price: "0.01 ETH",
      isOwned: false,
    },
    {
      id: "6",
      title: "Echoes of Tomorrow",
      duration: "4:28",
      price: "0.01 ETH",
      isOwned: true,
    },
    {
      id: "7",
      title: "Fade to Dawn",
      duration: "6:15",
      price: "0.01 ETH",
      isOwned: false,
    },
  ],
};

interface AlbumPageProps {
  params: {
    address: string;
  };
}
function AlbumPage({ params }: AlbumPageProps) {
  // in real app, fetch album data using params.address
  const album = DUMMY_ALBUM;

  const handlePlayAll = () => {
    console.log("play all songs");
  };
  const handleCollectAlbum = () => {
    console.log("collect entire album");
  };
  const handleCollectSong = (songId: string) => {
    console.log("collect song: ", songId);
  };
  const handlePlaySong = (songId: string) => {
    console.log("play song: ", songId);
  };
  return (
    <div className="container py-8">
      <AlbumHeader
        name={album.name}
        artist={album.artist}
        coverImage={album.coverImage}
        year={album.year}
        songCount={album.songs.length}
        onPlayAll={handlePlayAll}
        onCollect={handleCollectAlbum}
      />
      <SongList
        songs={album.songs}
        onCollect={handleCollectSong}
        onPlay={handlePlaySong}
      />
    </div>
  );
}

export default AlbumPage;
