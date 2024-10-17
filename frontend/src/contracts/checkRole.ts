"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { readContract } from "thirdweb"; // Adjust imports to your project structure
import { contractStaff as contract } from "./contracts";
import { fetchArtistByAddress } from "@/api/artists.api";

interface UserRole {
  isAdmin: boolean;
  isArtist: boolean;
  walletAddress: string | null;
}

interface ArtistStatus {
  status: string | null; // or specify your status type
  walletAddress: string | null;
}

export const useUserRole = (account: any): UserRole => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isArtist, setIsArtist] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!account) {
        setWalletAddress(null);
        setIsAdmin(false);
        setIsArtist(false);
        return;
      }

      setWalletAddress(account.address);

      try {
        const role = await readContract({
          contract,
          method: "function isStaff(address account) view returns (string)",
          params: [account.address],
        });
        setIsAdmin(role === "admin");
        setIsArtist(role === "artist");
      } catch (error) {
        console.error(
          "Error detecting wallet address or fetching role:",
          error
        );
        toast.error("Error fetching role information.");
      }
    };

    checkUserRole();
  }, [account]);

  return { isAdmin, isArtist, walletAddress };
};
export const useArtistStatus = (account: any): ArtistStatus => {
  const [status, setStatus] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    const checkArtistStatus = async () => {
      if (!account) {
        setWalletAddress(null);
        setStatus(null);
        return;
      }

      setWalletAddress(account.address);

      try {
        const artistData = await fetchArtistByAddress(account.address);
        if (artistData && artistData.status) {
          setStatus(artistData.status); // Assuming `artistData` has a `status` field
        }
      } catch (error) {
        console.error("Error fetching artist status:", error);
        toast.error("Error fetching artist status.");
      }
    };

    checkArtistStatus();
  }, [account]);

  return { status, walletAddress };
};
