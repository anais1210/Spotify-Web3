"use client";

import CollectionGrid from "@/components/collection/CollectionGrid";
import EmptyCollection from "@/components/collection/EmptyCollection";

const DUMMY_OWNED_SONGS = [
  {
    tokenId: "1",
    title: "Starlight Symphony",
    albumName: "Midnight Dreams",
    albumAddress: "0x123",
    coverImage: "/placeholder.jpg",
  },
  {
    tokenId: "2",
    title: "Echoes of Tomorrow",
    albumName: "Midnight Dreams",
    albumAddress: "0x123",
    coverImage: "/placeholder.jpg",
  },
  {
    tokenId: "5",
    title: "Electric Pulse",
    albumName: "Electric Soul",
    albumAddress: "0x456",
    coverImage: "/placeholder.jpg",
  },
];

function CollectionPage() {
  const ownedSongs = DUMMY_OWNED_SONGS;
  //   const ownedSongs: typeof DUMMY_OWNED_SONGS = []; // Empty array to test

  const handlePlay = (tokenId: string) => {
    console.log("Play song:", tokenId);
  };
  return (
    <div className="container py-16">
      {/* header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-heading font-bold mb-2">My Collection</h1>
          <p className="text-muted-foreground">Your owned music NFTs</p>
        </div>
        {ownedSongs.length > 0 && (
          <p className="text-muted-foreground">
            {ownedSongs.length} {ownedSongs.length === 1 ? "song" : "songs"}
          </p>
        )}
      </div>
      {/* content */}
      {ownedSongs.length === 0 ? (
        <EmptyCollection />
      ) : (
        <CollectionGrid songs={ownedSongs} onPlay={handlePlay} />
      )}
    </div>
  );
}

export default CollectionPage;
