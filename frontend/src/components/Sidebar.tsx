import { FaPlus } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
const Sidebar = () => {
  return (
    <div className="w-64 p-4 bg-gray-900 flex flex-col justify-between">
      {/* Logo */}
      <div>
        <div className="mb-8">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg"
            alt="Spotify Logo"
            className="w-32 mx-auto"
            width={120}
            height={40}
          />
        </div>

        {/* Library Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold">Your Library</h2>
          <button className="mt-4 flex items-center justify-between w-full py-2 px-4 bg-gray-800 rounded-lg">
            <span>Create your first playlist</span>
            <FaPlus />
          </button>
          <button className="mt-4 flex items-center justify-between w-full py-2 px-4 bg-gray-800 rounded-lg">
            <span>Browse podcasts</span>
          </button>
        </div>

        {/* Links */}
      </div>

      {/* Subscription Section */}
      <Link href="/subscription" passHref>
        <div className="mt-auto mb-4">
          <div className="bg-purple-500 text-center py-2 rounded-lg">
            <p className="text-white">Prenium Subscription</p>
          </div>
        </div>
      </Link>
    </div>
  );
};
export default Sidebar;
