import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Music2 } from "lucide-react";

// Generate gradient from address
function getGradientFromAddress(address: string): string {
  const gradients = [
    "from-violet-600 to-indigo-900",
    "from-amber-500 to-orange-700",
    "from-cyan-500 to-blue-700",
    "from-pink-500 to-rose-700",
    "from-emerald-500 to-green-800",
    "from-purple-500 to-fuchsia-800",
  ];
  const index = parseInt(address.slice(-2), 16) % gradients.length;
  return gradients[index];
}

interface AlbumRowProps {
  address: string;
  name: string;
  coverImage: string | null;
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
  const gradient = getGradientFromAddress(address);

  return (
    <div className="flex items-center gap-4 p-4 border-b border-border hover:bg-muted/30 transition">
      {/* cover */}
      <div className="w-16 h-16 shrink-0 rounded-md overflow-hidden">
        {coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <Music2 className="w-6 h-6 text-white/50" />
          </div>
        )}
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
