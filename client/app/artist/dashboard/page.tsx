"use client";
import { useAccount } from "wagmi";
import {
  useIsArtist,
  useCreateAlbum,
  useGetAlbumsByArtist,
  useGetArtist,
} from "@/hooks";

import AddSongDialog from "@/components/dashboard/AddSongDialog";
import AlbumRow from "@/components/dashboard/AlbumRow";
import CreateAlbumDialog from "@/components/dashboard/CreateAlbumDialog";
import StatsCards from "@/components/dashboard/StatsCards";
import { useState, useEffect } from "react";
import { Disc, Music, Wallet, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

function ArtistDashboardPage() {
  const { address, isConnected } = useAccount();
  const { isArtist, isLoading: isCheckingArtist } = useIsArtist();
  const { createAlbum, isPending, isConfirming, isSuccess, error, hash } =
    useCreateAlbum();
  const [addSongDialogOpen, setAddSongDialogOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<{
    name: string;
    address: string;
  } | null>(null);

  // Fetch real data from The Graph
  const {
    albums,
    isLoading: isLoadingAlbums,
    refetch: refetchAlbums,
  } = useGetAlbumsByArtist(address);

  const {
    artist,
    isLoading: isLoadingArtist,
    refetch: refetchArtist,
  } = useGetArtist(address);

  // Refetch data when album creation is successful
  useEffect(() => {
    if (isSuccess) {
      // Wait a bit for The Graph to index the new album
      const timer = setTimeout(() => {
        refetchAlbums();
        refetchArtist();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, refetchAlbums, refetchArtist]);

  if (!isConnected) {
    return (
      <div className="container py-32 text-center">
        <h1 className="text-3xl font-heading font-bold mb-4">
          Connect Your Wallet
        </h1>
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

  // show message if not an artist
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

  const openAddSongDialog = (albumName: string, albumAddress: string) => {
    setSelectedAlbum({ name: albumName, address: albumAddress });
    setAddSongDialogOpen(true);
  };

  const handleSongMinted = () => {
    refetchAlbums();
    refetchArtist();
  };

  const handleRefresh = () => {
    refetchAlbums();
    refetchArtist();
  };

  // Calculate stats from real data
  const totalAlbums = artist?.totalAlbums
    ? parseInt(artist.totalAlbums)
    : albums?.length || 0;
  const totalSongs = artist?.totalSongs ? parseInt(artist.totalSongs) : 0;

  return (
    <div className="container py-16">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-heading font-bold mb-2">
            Artist Dashboard
          </h1>
          <p className="text-muted-foreground">Manage your albums and tracks</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            className="cursor-pointer"
            title="Refresh data"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoadingAlbums ? "animate-spin" : ""}`}
            />
          </Button>
          <CreateAlbumDialog
            onCreateAlbum={handleCreateAlbum}
            isPending={isPending}
            isConfirming={isConfirming}
            isSuccess={isSuccess}
            error={error}
            hash={hash}
          />
        </div>
      </div>

      {/* stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatsCards title="Albums" value={totalAlbums} icon={Disc} />
        <StatsCards title="Songs" value={totalSongs} icon={Music} />
        <StatsCards title="Earned" value="--" icon={Wallet} />
      </div>

      {/* album list */}
      <div>
        <h2 className="text-2xl font-heading font-semibold mb-6">My Albums</h2>

        {isLoadingAlbums ? (
          <div className="border border-border/50 rounded-xl p-8 text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">
              Loading albums from The Graph...
            </p>
          </div>
        ) : albums && albums.length > 0 ? (
          <div className="border border-border/50 rounded-xl overflow-hidden">
            {albums.map((album) => (
              <AlbumRow
                key={album.id}
                address={album.address}
                name={album.name}
                coverImage="/placeholder.jpg"
                songCount={parseInt(album.totalSongs || "0")}
                onAddSong={() => openAddSongDialog(album.name, album.address)}
              />
            ))}
          </div>
        ) : (
          <div className="border border-border/50 rounded-xl p-12 text-center">
            <Disc className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No albums yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first album to start uploading songs!
            </p>
            <p className="text-xs text-muted-foreground">
              Note: It may take a few seconds for new albums to appear after
              creation.
            </p>
          </div>
        )}
      </div>

      {/* add song dialog */}
      <AddSongDialog
        albumName={selectedAlbum?.name || ""}
        albumAddress={selectedAlbum?.address || ""}
        open={addSongDialogOpen}
        onOpenChange={setAddSongDialogOpen}
        onSuccess={handleSongMinted}
      />
    </div>
  );
}

export default ArtistDashboardPage;
// import {
//   dehydrate,
//   HydrationBoundary,
//   QueryClient,
// } from "@tanstack/react-query";
// import { gql, request } from "graphql-request";
// import Data from "@/components/Data";
// const query = gql`
//   {
//     artists(first: 5) {
//       id
//       address
//       albums {
//         id
//       }
//       totalAlbums
//     }
//     albums(first: 5) {
//       id
//       address
//       name
//       symbol
//     }
//   }
// `;
// const url =
//   "https://api.studio.thegraph.com/query/1724437/harmony/version/latest";
// const headers = { Authorization: "Bearer 5204039d99a75b77919e865715c517a5" };
// export default async function HomePage() {
//   const queryClient = new QueryClient();
//   await queryClient.prefetchQuery({
//     queryKey: ["data"],
//     async queryFn() {
//       return await request(url, query, {}, headers);
//     },
//   });
//   return (
//     // Neat! Serialization is now as easy as passing props.
//     // HydrationBoundary is a Client Component, so hydration will happen there.
//     <HydrationBoundary state={dehydrate(queryClient)}>
//       <Data />
//     </HydrationBoundary>
//   );
// }
