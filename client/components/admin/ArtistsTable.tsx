"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArtistInfo } from "@/hooks";
import {
  Users,
  UserMinus,
  CheckCircle2,
  XCircle,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";

interface ArtistsTableProps {
  artists: ArtistInfo[] | undefined;
  isLoading: boolean;
  onRemoveArtist: (address: string) => void;
  isRemoving: boolean;
}

function formatAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatTimestamp(timestamp: string) {
  const date = new Date(parseInt(timestamp) * 1000);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}

export function ArtistsTable({
  artists,
  isLoading,
  onRemoveArtist,
  isRemoving,
}: ArtistsTableProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);

  const handleRemoveClick = (address: string) => {
    setSelectedArtist(address);
    setConfirmOpen(true);
  };

  const handleConfirmRemove = () => {
    if (selectedArtist) {
      onRemoveArtist(selectedArtist);
    }
    setConfirmOpen(false);
    setSelectedArtist(null);
  };

  return (
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
        {isLoading ? (
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
                {artists.map((artist) => (
                  <tr
                    key={artist.id}
                    className="border-b last:border-0 hover:bg-muted/50"
                  >
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
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveClick(artist.address)}
                          disabled={isRemoving}
                          className="border-red-500/50 text-red-500 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500"
                        >
                          <UserMinus className="w-4 h-4 mr-1" />
                          Remove
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

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-white">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Remove Artist
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Are you sure you want to remove this artist? This will revoke their
              privileges to create albums and mint songs on the platform.
              {selectedArtist && (
                <span className="block mt-3 font-mono text-sm bg-zinc-800 text-zinc-300 p-3 rounded border border-zinc-700">
                  {selectedArtist}
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRemove}
              className="bg-red-600 text-white hover:bg-red-700 border-0"
            >
              Remove Artist
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
