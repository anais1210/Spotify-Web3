"use client";
import React, { useEffect, useState } from "react";
import { fetchAlbums, AlbumProps } from "@/api/albums.api";
import Link from "next/link";

const Albums = () => {
  const [albums, setAlbums] = useState<AlbumProps[]>([]);
  useEffect(() => {
    fetchAlbums(setAlbums);
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold">Popular albums</h2>
      <div className="grid grid-cols-6 gap-4 mt-4">
        {albums.map((album) => (
          <Link key={album._id} href={`/albums/${album._id}`} passHref={true}>
            <div key={album._id} className="text-center">
              <img
                src={album.img}
                className="w-35 h-35 mx-auto object-cover rounded" // Increase size to 36
              />
              <p className="mt-2 text-sm">{album.name}</p>
              <p className="text-gray-400 text-xs">{album.author}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default Albums;
