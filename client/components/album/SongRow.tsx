import React from "react";
import { Play } from "lucide-react";
import { Button } from "../ui/button";
interface SongRowProps {
  trackNumber: number;
  title: string;
  duration: string;
  price: string;
  isOwned?: boolean;
  onCollect?: () => void;
  onPlay?: () => void;
}
function SongRow({
  trackNumber,
  title,
  duration,
  price,
  isOwned,
  onCollect,
  onPlay,
}: SongRowProps) {
  return (
    <div className="group flex items-center gap-4 px-4 py-3 rounded-md hover:bg-muted/50 transition">
      {/* Track number play button */}
      <div className="w-8 text-center">
        <span className="group-hover:hidden text-muted-foreground">
          {trackNumber}
        </span>
        <button
          title="play"
          onClick={onPlay}
          className="hidden group-hover:block"
        >
          <Play className="w-4 h-4" />
        </button>
      </div>

      {/* title */}
      <div className="flex-1 min-w-0">
        <p className="truncate font-medium">{title}</p>
      </div>
      {/* duration */}
      <div className="w-16 text-sm text-muted-foreground text-right">
        {duration}
      </div>

      {/* price / colltect button */}
      <div className="w-24">
        {isOwned ? (
          <span className="text-sm text-primary">Owned</span>
        ) : (
          <Button size="sm" variant="outline" onClick={onCollect}>
            {price}
          </Button>
        )}
      </div>
    </div>
  );
}

export default SongRow;
