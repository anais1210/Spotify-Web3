import Link from "next/link";
import React from "react";
import { Card } from "../ui/card";
import { Play } from "lucide-react";

export interface AlbumCardProps {
  address: string;
  name: string;
  artist: string;
  coverImage: string;
  songCount?: number;
}

function AlbumCard({
  address,
  name,
  artist,
  coverImage,
  songCount,
}: AlbumCardProps) {
  return (
    <Link href={`/album/${address}`}>
      <Card className="overflow-hidden group cursor-pointer hover-lift border-border/50 hover:border-primary/30 transition-colors rounded-xl">
        {/* Cover image */}
        <div className="aspect-square bg-muted relative overflow-hidden">
          <img
            src={coverImage}
            alt={name}
            className="w-full h-full object-cover img-zoom"
          />
          {/* Play button overlay on hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg">
              <Play className="w-6 h-6 text-white fill-white ml-1" />
            </div>
          </div>
        </div>
        {/* Info */}
        <div className="p-4">
          <h3 className="font-medium truncate group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground truncate">{artist}</p>
          {songCount !== undefined && (
            <p className="text-xs text-muted-foreground mt-2">
              {songCount} {songCount === 1 ? "song" : "songs"}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}

export default AlbumCard;
