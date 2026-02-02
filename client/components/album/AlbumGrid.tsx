import React from "react";
import AlbumCard, { AlbumCardProps } from "./AlbumCard";
interface AlbumGridProps {
  albums: AlbumCardProps[];
}

export default function AlbumGrid({ albums }: AlbumGridProps) {
  if (albums.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">No albums found</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {albums.map((album) => (
        <AlbumCard
          key={album.address}
          address={album.address}
          name={album.name}
          artist={album.artist}
          coverImage={album.coverImage}
          songCount={album.songCount}
        />
      ))}
    </div>
  );
}
