"use client";
import React, { useEffect, useState } from "react";
import { fetchUsersOnRole, User } from "@/api/user.api";
import Link from "next/link";

const Artists = () => {
  const [artists, setArtists] = useState<User[]>([]); // Remove `null` as part of the initial state.

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const fetchedArtists = await fetchUsersOnRole("artist");
        if (fetchedArtists) {
          setArtists(fetchedArtists); // Set the artists' state if data is fetched.
        }
      } catch (error) {
        console.error("Error fetching artists:", error);
      }
    };

    fetchArtists();
  }, []); // Empty dependency array to fetch artists only on component mount.

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold">Popular Artists</h2>
      <div className="grid grid-cols-3 gap-2 mt-4">
        {artists.length > 0 ? (
          artists.map((artist) => (
            <Link
              key={artist.address}
              href={`/artist/album/list/${artist.address}`}
              passHref={true}
            >
              <div className="text-center">
                <div className="bg-gray-800 rounded-full w-40 h-40 mx-auto overflow-hidden mb-4">
                  <img
                    src={artist.profile}
                    alt={`${artist.firstname} ${artist.lastname}'s profile`}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <p className="mt-2 text-sm">
                  {artist.firstname} {artist.lastname}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-400">No artists found.</p>
        )}
      </div>
    </div>
  );
};

export default Artists;
