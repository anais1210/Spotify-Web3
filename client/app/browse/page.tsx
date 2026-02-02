"use client";
import AlbumFilter from "@/components/album/AlbumFilter";
import AlbumGrid from "@/components/album/AlbumGrid";
import React, { useState } from "react";

const DUMMY_ALBUMS = [
  {
    address: "0x123",
    name: "Midnight Dreams",
    artist: "Luna Ray",
    coverImage: "/placeholder.jpg",
    songCount: 12,
  },
  {
    address: "0x456",
    name: "Electric Soul",
    artist: "The Voltage",
    coverImage: "/placeholder.jpg",
    songCount: 8,
  },
  {
    address: "0x789",
    name: "Ocean Waves",
    artist: "Coral Blue",
    coverImage: "/placeholder.jpg",
    songCount: 10,
  },
  {
    address: "0xabc",
    name: "City Lights",
    artist: "Metro Sound",
    coverImage: "/placeholder.jpg",
    songCount: 14,
  },
  {
    address: "0xdef",
    name: "Forest Echo",
    artist: "Wild Nature",
    coverImage: "/placeholder.jpg",
    songCount: 9,
  },
  {
    address: "0x111",
    name: "Desert Wind",
    artist: "Sand Storm",
    coverImage: "/placeholder.jpg",
    songCount: 7,
  },
  {
    address: "0x222",
    name: "Mountain High",
    artist: "Peak Sound",
    coverImage: "/placeholder.jpg",
    songCount: 11,
  },
  {
    address: "0x333",
    name: "River Flow",
    artist: "Aqua Beat",
    coverImage: "/placeholder.jpg",
    songCount: 6,
  },
];
function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAlbums = DUMMY_ALBUMS.filter(
    (album) =>
      album.name.toLocaleLowerCase().includes(searchQuery.toLowerCase()) ||
      album.artist.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  return (
    <div className="container py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-heading font-bold mb-2">Browse Albums</h1>
        <p className="text-muted-foreground">Discover music from independent artists</p>
      </div>
      <AlbumFilter searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <AlbumGrid albums={filteredAlbums} />
    </div>
  );
}

export default BrowsePage;
