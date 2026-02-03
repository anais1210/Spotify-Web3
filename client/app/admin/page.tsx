"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  useIsAdmin,
  useAddArtist,
  useRemoveArtist,
  useGetAllArtists,
  useGetArtistEvents,
  useCheckIsArtist,
  ArtistInfo,
} from "@/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  RefreshCw,
  UserPlus,
  UserMinus,
  Users,
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";

function AdminPage() {
  const { isConnected } = useAccount();
  const { isAdmin, isLoading: isCheckingAdmin } = useIsAdmin();

  // Add artist state
  const [newArtistAddress, setNewArtistAddress] = useState("");
  const {
    addArtist,
    isPending: isAddPending,
    isConfirming: isAddConfirming,
    isSuccess: isAddSuccess,
    error: addError,
    hash: addHash,
    reset: resetAdd,
  } = useAddArtist();

  // Remove artist state
  const [removeArtistAddress, setRemoveArtistAddress] = useState("");
  const {
    removeArtist,
    isPending: isRemovePending,
    isConfirming: isRemoveConfirming,
    isSuccess: isRemoveSuccess,
    error: removeError,
    hash: removeHash,
    reset: resetRemove,
  } = useRemoveArtist();

  // Check if address is already an artist
  const { isArtist: isNewAddressArtist, isLoading: isCheckingNewAddress } =
    useCheckIsArtist(newArtistAddress.length === 42 ? newArtistAddress : undefined);

  // Fetch artists from subgraph
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

  // Refetch after successful transactions
  useEffect(() => {
    if (isAddSuccess || isRemoveSuccess) {
      const timer = setTimeout(() => {
        refetchArtists();
        refetchEvents();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isAddSuccess, isRemoveSuccess, refetchArtists, refetchEvents]);

  // Reset form after success
  useEffect(() => {
    if (isAddSuccess) {
      setNewArtistAddress("");
      const timer = setTimeout(() => resetAdd(), 5000);
      return () => clearTimeout(timer);
    }
  }, [isAddSuccess, resetAdd]);

  useEffect(() => {
    if (isRemoveSuccess) {
      setRemoveArtistAddress("");
      const timer = setTimeout(() => resetRemove(), 5000);
      return () => clearTimeout(timer);
    }
  }, [isRemoveSuccess, resetRemove]);

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

  const handleAddArtist = (e: React.FormEvent) => {
    e.preventDefault();
    if (newArtistAddress && newArtistAddress.length === 42) {
      addArtist(newArtistAddress);
    }
  };

  const handleRemoveArtist = (e: React.FormEvent) => {
    e.preventDefault();
    if (removeArtistAddress && removeArtistAddress.length === 42) {
      removeArtist(removeArtistAddress);
    }
  };

  const handleQuickRemove = (address: string) => {
    removeArtist(address);
  };

  const handleRefresh = () => {
    refetchArtists();
    refetchEvents();
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // Count active artists
  const activeArtists = artists?.filter((a) => a.isActive) || [];

  return (
    <div className="container py-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-heading font-bold mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Manage artists and platform settings</p>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Artists</p>
                <p className="text-2xl font-bold">{artists?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Artists</p>
                <p className="text-2xl font-bold">{activeArtists.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <Clock className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Recent Events</p>
                <p className="text-2xl font-bold">{events?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Add Artist Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Add Artist
            </CardTitle>
            <CardDescription>
              Grant artist privileges to a wallet address
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddArtist} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="0x..."
                  value={newArtistAddress}
                  onChange={(e) => setNewArtistAddress(e.target.value)}
                  className="font-mono"
                  disabled={isAddPending || isAddConfirming}
                />
                {newArtistAddress.length === 42 && !isCheckingNewAddress && (
                  <p className={`text-sm mt-2 ${isNewAddressArtist ? "text-orange-500" : "text-green-500"}`}>
                    {isNewAddressArtist
                      ? "This address is already an artist"
                      : "This address is not yet an artist"}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={
                  !newArtistAddress ||
                  newArtistAddress.length !== 42 ||
                  isAddPending ||
                  isAddConfirming ||
                  isNewAddressArtist
                }
                className="w-full"
              >
                {isAddPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Confirm in wallet...
                  </>
                ) : isAddConfirming ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Artist
                  </>
                )}
              </Button>

              {/* Transaction Status */}
              {isAddSuccess && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-green-500">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Artist added successfully!</span>
                  </div>
                  {addHash && (
                    <a
                      href={`https://sepolia.etherscan.io/tx/${addHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mt-1"
                    >
                      View transaction <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}

              {addError && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="flex items-center gap-2 text-destructive">
                    <XCircle className="w-4 h-4" />
                    <span className="text-sm">
                      {addError.message?.includes("User rejected")
                        ? "Transaction rejected"
                        : "Failed to add artist"}
                    </span>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Remove Artist Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserMinus className="w-5 h-5" />
              Remove Artist
            </CardTitle>
            <CardDescription>
              Revoke artist privileges from a wallet address
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRemoveArtist} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="0x..."
                  value={removeArtistAddress}
                  onChange={(e) => setRemoveArtistAddress(e.target.value)}
                  className="font-mono"
                  disabled={isRemovePending || isRemoveConfirming}
                />
              </div>

              <Button
                type="submit"
                variant="destructive"
                disabled={
                  !removeArtistAddress ||
                  removeArtistAddress.length !== 42 ||
                  isRemovePending ||
                  isRemoveConfirming
                }
                className="w-full"
              >
                {isRemovePending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Confirm in wallet...
                  </>
                ) : isRemoveConfirming ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <UserMinus className="w-4 h-4 mr-2" />
                    Remove Artist
                  </>
                )}
              </Button>

              {/* Transaction Status */}
              {isRemoveSuccess && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-green-500">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Artist removed successfully!</span>
                  </div>
                  {removeHash && (
                    <a
                      href={`https://sepolia.etherscan.io/tx/${removeHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mt-1"
                    >
                      View transaction <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}

              {removeError && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="flex items-center gap-2 text-destructive">
                    <XCircle className="w-4 h-4" />
                    <span className="text-sm">
                      {removeError.message?.includes("User rejected")
                        ? "Transaction rejected"
                        : "Failed to remove artist"}
                    </span>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Artists List */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Registered Artists
          </CardTitle>
          <CardDescription>
            All artists registered on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingArtists ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading artists...</p>
            </div>
          ) : artists && artists.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Address
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Albums
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Songs
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Added
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {artists.map((artist: ArtistInfo) => (
                    <tr key={artist.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <a
                          href={`https://sepolia.etherscan.io/address/${artist.address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-sm hover:text-primary flex items-center gap-1"
                        >
                          {formatAddress(artist.address)}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                      <td className="py-3 px-4">
                        {artist.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/10 text-red-500 text-xs rounded-full">
                            <XCircle className="w-3 h-3" />
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm">{artist.totalAlbums}</td>
                      <td className="py-3 px-4 text-sm">{artist.totalSongs}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {artist.addedAt ? formatTimestamp(artist.addedAt) : "-"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {artist.isActive && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleQuickRemove(artist.address)}
                            disabled={isRemovePending || isRemoveConfirming}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <UserMinus className="w-4 h-4" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No artists registered yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Recent artist management events
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingEvents ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading events...</p>
            </div>
          ) : events && events.length > 0 ? (
            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {event.eventType === "ADDED" ? (
                      <div className="p-2 bg-green-500/10 rounded-full">
                        <UserPlus className="w-4 h-4 text-green-500" />
                      </div>
                    ) : (
                      <div className="p-2 bg-red-500/10 rounded-full">
                        <UserMinus className="w-4 h-4 text-red-500" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium">
                        {event.eventType === "ADDED" ? "Artist Added" : "Artist Removed"}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {formatAddress(event.artist.address)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {formatTimestamp(event.timestamp)}
                    </p>
                    <a
                      href={`https://sepolia.etherscan.io/tx/${event.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline flex items-center justify-end gap-1"
                    >
                      View tx <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No events recorded yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminPage;
