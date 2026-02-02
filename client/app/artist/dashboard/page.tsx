"use client";
import { useAccount } from "wagmi";
import { useIsArtist, useCreateAlbum } from "@/hooks";

import AddSongDialog from "@/components/dashboard/AddSongDialog";
import AlbumRow from "@/components/dashboard/AlbumRow";
import CreateAlbumDialog from "@/components/dashboard/CreateAlbumDialog";
import StatsCards from "@/components/dashboard/StatsCards";
import { useState } from "react";
import { Disc, Music, Wallet } from "lucide-react";

// Dummy data
const DUMMY_STATS = {
  albums: 3,
  songs: 24,
  earned: "1.5 ETH",
};

const DUMMY_ALBUMS = [
  {
    address: "0x123",
    name: "Midnight Dreams",
    coverImage: "/placeholder.jpg",
    songCount: 12,
  },
  {
    address: "0x456",
    name: "Electric Soul",
    coverImage: "/placeholder.jpg",
    songCount: 8,
  },
  {
    address: "0x789",
    name: "Ocean Waves",
    coverImage: "/placeholder.jpg",
    songCount: 4,
  },
];

function ArtistDashboardPage() {
  const { isConnected } = useAccount();
  const { isArtist, isLoading: isCheckingArtist } = useIsArtist();
  const { createAlbum, isPending, isConfirming, isSuccess } = useCreateAlbum();
  const [addSongDialogOpen, setAddSongDialogOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);

  if (!isConnected) {
    return (
      <div className="container py-32 text-center">
        <h1 className="text-3xl font-heading font-bold mb-4">Connect Your Wallet</h1>
        <p className="text-muted-foreground text-lg">
          Please connect your wallet to access the artist dashboard.
        </p>
      </div>
    );
  }
  // show loading while checking artist status
  if (isCheckingArtist) {
    return (
      <div className="container py-32 text-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  //show message if not an artist
  if (!isArtist) {
    return (
      <div className="container py-32 text-center">
        <h1 className="text-3xl font-heading font-bold mb-4">Not an Artist</h1>
        <p className="text-muted-foreground text-lg">
          Your address is not registered as an artist.
        </p>
      </div>
    );
  }

  const handleCreateAlbum = (name: string, symbol: string) => {
    createAlbum(name, symbol);
  };
  const handleAddSong = (title: string, uri: string) => {
    console.log("add song to :", selectedAlbum, ":", title, uri);
  };

  const openAddSongDialog = (albumName: string) => {
    setSelectedAlbum(albumName);
    setAddSongDialogOpen(true);
  };

  return (
    <div className="container py-16">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-heading font-bold mb-2">Artist Dashboard</h1>
          <p className="text-muted-foreground">Manage your albums and tracks</p>
        </div>
        <CreateAlbumDialog onCreateAlbum={handleCreateAlbum} />
      </div>

      {/* stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatsCards title="Albums" value={DUMMY_STATS.albums} icon={Disc} />
        <StatsCards title="Songs" value={DUMMY_STATS.songs} icon={Music} />
        <StatsCards title="Earned" value={DUMMY_STATS.earned} icon={Wallet} />
      </div>

      {/* album list */}
      <div>
        <h2 className="text-2xl font-heading font-semibold mb-6">My Albums</h2>
        <div className="border border-border/50 rounded-xl overflow-hidden">
          {DUMMY_ALBUMS.map((album) => (
            <AlbumRow
              key={album.address}
              address={album.address}
              name={album.name}
              coverImage={album.coverImage}
              songCount={album.songCount}
              onAddSong={() => openAddSongDialog(album.name)}
            />
          ))}
        </div>
      </div>

      {/* add song dialog */}
      <AddSongDialog
        albumName={selectedAlbum || ""}
        open={addSongDialogOpen}
        onOpenChange={setAddSongDialogOpen}
        onAddSong={handleAddSong}
      />
    </div>
  );
}

export default ArtistDashboardPage;
