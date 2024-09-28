"use client";
import { FaPlus, FaUser } from "react-icons/fa";
import { FaListCheck, FaMedal, FaMusic } from "react-icons/fa6";

import Link from "next/link";
import Image from "next/image";
import { useUserRole } from "@/contracts/checkRole";
import { useActiveAccount } from "thirdweb/react";

const Sidebar = () => {
  const account = useActiveAccount();
  const { isAdmin, isArtist, walletAddress } = useUserRole(account);

  return (
    <div className="w-64 p-4 bg-gray-900 flex flex-col justify-between">
      {/* Logo */}
      <div>
        <Link href="/" passHref>
          <div className="mb-8">
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg"
              alt="Spotify Logo"
              className="w-32 mx-auto"
              width={120}
              height={40}
            />
          </div>
        </Link>
        {account?.address && (
          <div className="mb-8">
            <h2 className="text-xl font-bold">Account</h2>
            <Link href={`/profile/${account?.address}`}>
              <button className="mt-4 flex items-center justify-between w-full py-2 px-4 bg-gray-800 rounded-lg">
                <span>Profile</span>

                <FaUser />
              </button>
            </Link>
            {isArtist && (
              <Link href={`/artist/reward/${account?.address}`}>
                <button className="mt-4 flex items-center justify-between w-full py-2 px-4 bg-gray-800 rounded-lg">
                  <span>Rewards</span>
                  <FaMedal />
                </button>
              </Link>
            )}
          </div>
        )}

        {/* Library Section */}
        {isArtist && (
          <div className="mb-8">
            <h2 className="text-xl font-bold">Your Library</h2>
            <Link href="/artist/album/create">
              <button className="mt-4 flex items-center justify-between w-full py-2 px-4 bg-gray-800 rounded-lg">
                <span>Create an album</span>
                <FaPlus />
              </button>
            </Link>
            <Link href={`/artist/album/list/${account?.address}`}>
              <button className="mt-4 flex items-center justify-between w-full py-2 px-4 bg-gray-800 rounded-lg">
                <span>My Albums</span>
                <FaMusic />
              </button>
            </Link>
          </div>
        )}
        {isAdmin && (
          <div className="mb-8">
            <hr className="border-t border-gray-600 m-4" />
            <Link href="/admin/addAdmin" passHref>
              <button className="mt-4 flex items-center justify-between w-full py-2 px-4 bg-gray-800 rounded-lg">
                <span>Add Admin</span>
                <FaPlus />
              </button>
            </Link>
            <Link href="/admin/pendingArtist" passHref>
              <button className="mt-4 flex items-center justify-between w-full py-2 px-4 bg-gray-800 rounded-lg">
                <span>List of Artists</span>
                <FaListCheck />
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Subscription Section */}
      {!isArtist && (
        <div className="mt-auto mb-4">
          <div className="mt-4">
            <Link href="/subscription" passHref>
              <div className="bg-purple-500 text-center py-2 rounded-lg">
                <p className="text-white">Prenium Subscription</p>
              </div>
            </Link>
          </div>
          <div className="mt-4">
            <Link href="/artist/register" passHref>
              <div className="bg-green-700 text-center py-2 rounded-lg">
                <p className="text-white">I'm a new Rising Star </p>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
export default Sidebar;
