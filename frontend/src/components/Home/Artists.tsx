"use client";
import React, { useEffect, useState } from "react";
import { fetchUsersOnRole, User } from "@/api/user.api";
import Link from "next/link";
const Artists = () => {
  const [artists, setArtists] = useState<User[]>([]);

  useEffect(() => {
    fetchUsersOnRole("artist", setArtists);
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold">Popular Artists</h2>
      <div className="grid grid-cols-3 gap-2 mt-4">
        {artists.map((artist) => (
          <Link
            key={artist.address}
            href={`/artist/album/${artist.address}`}
            passHref={true}
          >
            <div key={artist.address} className="text-center">
              <div className="bg-gray-800 rounded-full w-40 h-40 mx-auto overflow-hidden mb-4">
                {/* Larger size and margin at bottom */}
                <img
                  src={artist.profile}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <p className="mt-2 text-sm">
                {artist.firstname} {artist.lastname}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Artists;
