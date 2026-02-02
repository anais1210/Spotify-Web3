import { Card } from "@/components/ui/card";
import { Play } from "lucide-react";
import Link from "next/link";

interface OwnedSongCardProps {
  tokenId: string;
  title: string;
  albumName: string;
  albumAddress: string;
  coverImage: string;
  onPlay?: () => void;
}

function OwnedSongCard({
  tokenId,
  title,
  albumName,
  albumAddress,
  coverImage,
  onPlay,
}: OwnedSongCardProps) {
  return (
    <Card className="overflow-hidden group hover-lift border-border/50 hover:border-primary/30 transition-colors rounded-xl">
      <div className="aspect-square bg-muted relative overflow-hidden">
        <img
          src={coverImage}
          alt={title}
          className="w-full h-full object-cover img-zoom"
        />
        {/* Play button overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            type="button"
            aria-label="Play song"
            onClick={onPlay}
            className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
          >
            <Play className="w-6 h-6 text-white fill-white ml-1" />
          </button>
        </div>
      </div>
      {/* Info */}
      <div className="p-4">
        <h3 className="font-medium truncate group-hover:text-primary transition-colors">
          {title}
        </h3>
        <Link href={`/album/${albumAddress}`}>
          <p className="text-sm text-muted-foreground truncate hover:text-primary transition-colors">
            {albumName}
          </p>
        </Link>
        <p className="text-xs text-muted-foreground mt-2">Token #{tokenId}</p>
      </div>
    </Card>
  );
}

export default OwnedSongCard;
