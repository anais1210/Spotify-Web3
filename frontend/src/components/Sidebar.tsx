import { FaPlus } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="w-64 p-4 bg-gray-900 flex flex-col justify-between">
      {/* Logo */}
      <div>
        <div className="mb-8">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg"
            alt="Spotify Logo"
            className="w-32 mx-auto"
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
      <div className="mt-auto mb-4">
        <div className="bg-purple-500 text-center py-2 rounded-lg">
          <p className="text-white">Sign up for free</p>
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
