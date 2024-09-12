"use client";
import React, { useEffect, useState } from "react";
import { fetchAlbums, addAlbum } from "@/app/api/Albums";
import { Album } from "@/app/api/Albums";

const Albums = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  useEffect(() => {
    fetchAlbums(setAlbums);
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold">Popular albums</h2>
      <div className="grid grid-cols-6 gap-4 mt-4">
        {albums.map((album) => (
          <div key={album.name} className="text-center">
            <div className="bg-gray-800 w-24 h-24 mx-auto"></div>
            <p className="mt-2 text-sm">{album.author}</p>
            {/* <p className="text-gray-400 text-xs">{album.artist}</p> */}
          </div>
        ))}
      </div>
    </div>
  );
};
export default Albums;
