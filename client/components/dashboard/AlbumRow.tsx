import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

interface AlbumRowProps {
  address: string;
  name: string;
  coverImage: string;
  songCount: number;
  onAddSong: () => void;
}
function AlbumRow({
  address,
  name,
  coverImage,
  songCount,
  onAddSong,
}: AlbumRowProps) {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-border hover:bg-muted/30 transition">
      {/* cover */}
      <div className="w-16 h-16 shrink-0">
        <img
          src={coverImage}
          alt={name}
          className="w-full h-full object-cover rounded-md"
        />
      </div>
      {/* info */}
      <div className="flex-1 min-w-0">
        <Link href={`/album/${address}`}>
          <h3 className="font-medium hover:underline truncate">{name}</h3>
        </Link>
        <p className="text-sm text-muted-foreground">{songCount} songs</p>
      </div>
      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={onAddSong}>
          + Song
        </Button>
        <Button size="sm" variant="ghost">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export default AlbumRow;
