import React from "react";
import SongRow from "./SongRow";
interface Song {
  id: string;
  title: string;
  duration: string;
  price: string;
  isOwned?: boolean;
}
interface SongListProps {
  songs: Song[];
  onCollect?: (songId: string) => void;
  onPlay?: (songId: string) => void;
}

function SongList({ songs, onCollect, onPlay }: SongListProps) {
  return (
    <div>
      <div className="flex items-center gap-4 py-2 text-sm text-muted-foreground border-b border-border">
        <div className="w-8 text-center">#</div>
        <div className="flex-1">Title</div>
        <div className="w-16 text-right">Duration</div>
        <div className="w-24">Price</div>
      </div>
      {/* songs */}

      <div className="mt-2">
        {songs.map((song, index) => (
          <SongRow
            key={song.id}
            trackNumber={index + 1}
            title={song.title}
            duration={song.duration}
            price={song.price}
            isOwned={song.isOwned}
            onCollect={() => onCollect?.(song.id)}
            onPlay={() => onPlay?.(song.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default SongList;
