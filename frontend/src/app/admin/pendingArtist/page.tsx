"use client";
import React, { useEffect, useState } from "react";
import { fetchUserByAddress, fetchUsersOnRole, User } from "@/api/user.api";
import { ArtistProps, fetchArtists, updateArtist } from "@/api/artists.api";
import { toast } from "react-toastify";
import { prepareContractCall } from "thirdweb";
import { contractStaff as contract } from "@/contracts/contracts";
import { darkTheme, TransactionButton, useActiveAccount } from "thirdweb/react";
const PendingArtists = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const account = useActiveAccount();
  const [allArtist, setAllArtist] = useState<(User & ArtistProps)[]>([]);

  useEffect(() => {
    const fetchAllArtists = async () => {
      try {
        const artists = await fetchArtists();
        if (artists) {
          const artistDetailsPromises = artists.map(async (artist) => {
            const user = await fetchUserByAddress(artist.address!);
            return {
              ...artist,
              user: user,
            };
          });
          const artistDetails = await Promise.all(artistDetailsPromises);
          setAllArtist(artistDetails);
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
      <h2 className="text-3xl font-bold mb-8">All Artists</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-700">
              <th className="py-3 px-6 text-left font-semibold">Firstname</th>
              <th className="py-3 px-6 text-left font-semibold">Lastname</th>
              <th className="py-3 px-6 text-left font-semibold">Address</th>
              <th className="py-3 px-6 text-left font-semibold">Email</th>
              <th className="py-3 px-6 text-left font-semibold">Profile</th>
              <th className="py-3 px-6 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allArtist.length > 0 ? (
              allArtist.map((artist) => (
                <tr
                  key={artist.address}
                  className="bg-gray-800 border-b border-gray-700"
                >
                  <td className="py-3 px-6">
                    {artist.user?.firstname || "N/A"}
                  </td>
                  <td className="py-3 px-6">
                    {artist.user?.lastname || "N/A"}
                  </td>
                  <td className="py-3 px-6">{artist.address}</td>
                  <td className="py-3 px-6">{artist.user?.email || "N/A"}</td>
                  <td className="py-3 px-6">
                    {artist.user?.profile ? (
                      <img
                        src={artist.user.profile}
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      "No Profile"
                    )}
                  </td>
                  <td className="py-3 px-6 text-center">
                    {artist.status === "pending" ? (
                      <>
                        <TransactionButton
                          transaction={() =>
                            prepareContractCall({
                              contract: contract,
                              method:
                                "function addStaff(address account, string memory role)",
                              params: [artist.address, "artist"],
                            })
                          }
                          onTransactionConfirmed={async () => {
                            alert("Artist added successfully!");
                            setIsModalOpen(false);
                            handleResponse(artist, "confirmed");
                          }}
                          onError={(error) => alert(`Error: ${error.message}`)}
                          theme={darkTheme()}
                          className="bg-green-500 text-black px-4 py-2 rounded-full hover:bg-green-400"
                        >
                          Confirm
                        </TransactionButton>
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
                <td colSpan={6} className="py-6 text-center text-gray-400">
                  No pending artist found.
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
