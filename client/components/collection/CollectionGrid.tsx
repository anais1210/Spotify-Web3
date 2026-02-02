import React from "react";
import OwnedSongCard from "./OwnedSongCard";

interface OwnedSong {
  tokenId: string;
  title: string;
  albumName: string;
  albumAddress: string;
  coverImage: string;
}

interface CollectionGridProps {
  songs: OwnedSong[];
  onPlay?: (tokenId: string) => void;
}

function CollectionGrid({ songs, onPlay }: CollectionGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {songs.map((song) => (
        <OwnedSongCard
          key={song.tokenId}
          tokenId={song.tokenId}
          title={song.title}
          albumName={song.albumName}
          albumAddress={song.albumAddress}
          coverImage={song.coverImage}
          onPlay={() => onPlay?.(song.tokenId)}
        />
      ))}
    </div>
  );
}

export default CollectionGrid;
