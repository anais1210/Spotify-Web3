import { Music } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
function EmptyCollection() {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
        <Music className="w-8 h-8 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold mb-2">
        No songs in your collection yet.
      </h2>
      <p className="text-muted-foreground mb-6">
        Start collecting music from your favorite artists.
      </p>
      <Link href="/browse">
        <Button>Browse Albums</Button>
      </Link>
    </div>
  );
}

export default EmptyCollection;
