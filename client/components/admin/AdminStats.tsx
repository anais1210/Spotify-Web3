"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, CheckCircle2, Clock } from "lucide-react";

interface AdminStatsProps {
  totalArtists: number;
  activeArtists: number;
  recentEvents: number;
}

export function AdminStats({
  totalArtists,
  activeArtists,
  recentEvents,
}: AdminStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Artists</p>
              <p className="text-2xl font-bold">{totalArtists}</p>
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
              <p className="text-2xl font-bold">{activeArtists}</p>
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
              <p className="text-2xl font-bold">{recentEvents}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
