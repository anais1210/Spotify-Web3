"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRemoveArtist } from "@/hooks";
import {
  UserMinus,
  CheckCircle2,
  XCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";

interface RemoveArtistCardProps {
  onSuccess?: () => void;
}

export function RemoveArtistCard({ onSuccess }: RemoveArtistCardProps) {
  const [address, setAddress] = useState("");
  const {
    removeArtist,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
    reset,
  } = useRemoveArtist();

  // Reset form after success
  useEffect(() => {
    if (isSuccess) {
      // Defer state updates to avoid cascading renders
      const timer = setTimeout(() => {
        setAddress("");
        onSuccess?.();
      }, 0);
      const resetTimer = setTimeout(() => reset(), 5000);
      return () => {
        clearTimeout(timer);
        clearTimeout(resetTimer);
      };
    }
  }, [isSuccess, reset, onSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address && address.length === 42) {
      removeArtist(address);
    }
  };

  const isLoading = isPending || isConfirming;

  return (
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="0x..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="font-mono"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            variant="destructive"
            disabled={!address || address.length !== 42 || isLoading}
            className="w-full"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Confirm in wallet...
              </>
            ) : isConfirming ? (
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

          {isSuccess && (
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Artist removed successfully!
                </span>
              </div>
              {hash && (
                <a
                  href={`https://sepolia.etherscan.io/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mt-1"
                >
                  View transaction <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center gap-2 text-destructive">
                <XCircle className="w-4 h-4" />
                <span className="text-sm">
                  {error.message?.includes("User rejected")
                    ? "Transaction rejected"
                    : "Failed to remove artist"}
                </span>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
