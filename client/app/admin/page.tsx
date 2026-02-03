"use client";

import { useAccount } from "wagmi";
import {
  useIsAdmin,
  useRemoveArtist,
  useGetAllArtists,
  useGetArtistEvents,
} from "@/hooks";
import { Button } from "@/components/ui/button";
import { RefreshCw, Shield } from "lucide-react";
import {
  AdminStats,
  AddArtistCard,
  RemoveArtistCard,
  ArtistsTable,
  RecentActivity,
} from "@/components/admin";

function AdminPage() {
  const { isConnected } = useAccount();
  const { isAdmin, isLoading: isCheckingAdmin } = useIsAdmin();

  // Remove artist hook for quick remove in table
  const {
    removeArtist,
    isPending: isRemovePending,
    isConfirming: isRemoveConfirming,
  } = useRemoveArtist();

  // Fetch data from subgraph
  const {
    artists,
    isLoading: isLoadingArtists,
    refetch: refetchArtists,
  } = useGetAllArtists();

  const {
    events,
    isLoading: isLoadingEvents,
    refetch: refetchEvents,
  } = useGetArtistEvents(20);

  // Loading states
  if (!isConnected) {
    return (
      <div className="container py-32 text-center">
        <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-3xl font-heading font-bold mb-4">
          Connect Your Wallet
        </h1>
        <p className="text-muted-foreground text-lg">
          Please connect your wallet to access the admin panel.
        </p>
      </div>
    );
  }

  if (isCheckingAdmin) {
    return (
      <div className="container py-32 text-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Verifying admin access...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container py-32 text-center">
        <Shield className="w-16 h-16 text-destructive mx-auto mb-4" />
        <h1 className="text-3xl font-heading font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground text-lg">
          You do not have admin privileges to access this page.
        </p>
      </div>
    );
  }

  const handleRefresh = () => {
    refetchArtists();
    refetchEvents();
  };

  const handleSuccess = () => {
    // Delay refetch to allow blockchain to update
    setTimeout(() => {
      refetchArtists();
      refetchEvents();
    }, 5000);
  };

  const handleQuickRemove = (address: string) => {
    removeArtist(address);
  };

  // Calculate stats
  const activeArtists = artists?.filter((a) => a.isActive) || [];

  return (
    <div className="container py-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-heading font-bold mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">
            Manage artists and platform settings
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          className="cursor-pointer"
          title="Refresh data"
        >
          <RefreshCw
            className={`w-4 h-4 ${isLoadingArtists || isLoadingEvents ? "animate-spin" : ""}`}
          />
        </Button>
      </div>

      {/* Stats */}
      <AdminStats
        totalArtists={artists?.length || 0}
        activeArtists={activeArtists.length}
        recentEvents={events?.length || 0}
      />

      {/* Add/Remove Artist Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <AddArtistCard onSuccess={handleSuccess} />
        <RemoveArtistCard onSuccess={handleSuccess} />
      </div>

      {/* Artists Table */}
      <ArtistsTable
        artists={artists}
        isLoading={isLoadingArtists}
        onRemoveArtist={handleQuickRemove}
        isRemoving={isRemovePending || isRemoveConfirming}
      />

      {/* Recent Activity */}
      <RecentActivity events={events} isLoading={isLoadingEvents} />
    </div>
  );
}

export default AdminPage;
