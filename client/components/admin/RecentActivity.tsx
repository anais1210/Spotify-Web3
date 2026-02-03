"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArtistEvent } from "@/hooks";
import { Clock, UserPlus, UserMinus, ExternalLink } from "lucide-react";

interface RecentActivityProps {
  events: ArtistEvent[] | undefined;
  isLoading: boolean;
}

function formatAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatTimestamp(timestamp: string) {
  const date = new Date(parseInt(timestamp) * 1000);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}

export function RecentActivity({ events, isLoading }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Activity
        </CardTitle>
        <CardDescription>Recent artist management events</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
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
                      {event.eventType === "ADDED"
                        ? "Artist Added"
                        : "Artist Removed"}
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
  );
}
