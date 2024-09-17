"use client";
import React, { useEffect, useState } from "react";
import { fetchUsersOnRole, User } from "@/api/user.api";
import { ArtistProps, fetchArtists, updateArtist } from "@/api/artists.api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Toast notifications
import { ToastContainer } from "react-toastify";

const PendingArtists = () => {
  const [pendingUserArtists, setPendingUserArtists] = useState<
    (User & ArtistProps)[]
  >([]);

  useEffect(() => {
    const fetchAllArtists = async () => {
      try {
        // Fetch all users with the role "artist"
        const users = await fetchUsersOnRole("artist");

        // Fetch all artists
        const artists = await fetchArtists();

        // Combine the user and artist data based on their address
        if (users && artists) {
          const combinedData = users.map((user) => ({
            ...user,
            ...artists.find((artist) => artist.address === user.address),
          }));

          setPendingUserArtists(combinedData);
          console.log(combinedData);
        }
      } catch (err) {
        console.error("Error fetching pending artists:", err);
        toast.error("Failed to fetch pending artists.");
      }
    };

    fetchAllArtists();
  }, []);

  const handleResponse = async (artist: ArtistProps, status: string) => {
    try {
      const updatedArtist = { ...artist, status };
      const response = await updateArtist(updatedArtist);

      if (response) {
        toast.success(
          `Artist ${
            status === "confirmed" ? "confirmed" : "rejected"
          } successfully!`
        );
      } else {
        throw new Error("Failed to update the artist.");
      }
    } catch (error) {
      console.error(
        `Error ${status === "confirmed" ? "pending" : "rejecting"} artist:`,
        error
      );
      toast.error(
        `Failed to ${status === "confirmed" ? "confirm" : "reject"} the artist.`
      );
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gray-900 text-white">
      <ToastContainer />
      <h2 className="text-3xl font-bold mb-8">Pending Artists</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-700">
              <th className="py-3 px-6 text-left font-semibold">Firstname</th>
              <th className="py-3 px-6 text-left font-semibold">Lastname</th>
              <th className="py-3 px-6 text-left font-semibold">Email</th>
              <th className="py-3 px-6 text-left font-semibold">Profile</th>
              <th className="py-3 px-6 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingUserArtists.length > 0 ? (
              pendingUserArtists.map((artist) => (
                <tr
                  key={artist.address}
                  className="bg-gray-800 border-b border-gray-700"
                >
                  <td className="py-3 px-6">{artist.firstname}</td>
                  <td className="py-3 px-6">{artist.lastname}</td>
                  <td className="py-3 px-6">{artist.email}</td>
                  <td className="py-3 px-6">
                    <img
                      src={artist.profile}
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </td>
                  <td className="py-3 px-6 text-center">
                    {artist.status === "pending" ? (
                      <>
                        <button
                          onClick={() => handleResponse(artist, "confirmed")}
                          className="bg-green-500 text-black px-4 py-2 rounded-full mr-2 hover:bg-green-400"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleResponse(artist, "rejected")}
                          className="bg-red-500 text-black px-4 py-2 rounded-full hover:bg-red-400"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-400">{artist.status}</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-400">
                  No pending artists found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingArtists;
