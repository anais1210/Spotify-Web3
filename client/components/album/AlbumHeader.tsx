import React from "react";
import { Button } from "../ui/button";
interface AlbumHeaderProps {
  name: string;
  artist: string;
  coverImage: string;
  year: number;
  songCount?: number;
  onPlayAll?: () => void;
  onCollect?: () => void;
}
function AlbumHeader({
  name,
  artist,
  coverImage,
  year,
  songCount,
  onPlayAll,
  onCollect,
}: AlbumHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row gap-8 mb-8">
      <div className="w-48 h-48 md:h-64 shrink-0">
        <img
          src={coverImage}
          alt={name}
          className="w-full h-full object-cover rounded-lg shadow-lg"
        />
      </div>

      {/* album info */}
      <div className="flex flex-col justify-end">
        <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
          Album
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{name}</h1>
        <p className="text-muted-foreground mb-6">
          {" "}
          by <span className="text-foreground font-medium">{artist}</span>
          <span className="mx-2">•</span>
          {year}
          <span className="mx-2">•</span>
          {songCount} songs
        </p>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button onClick={onPlayAll} variant="outline" size="lg">
            Play All
          </Button>
          <Button onClick={onCollect} variant="outline" size="lg">
            Collect Album
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AlbumHeader;
