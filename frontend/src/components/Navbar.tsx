import { FaHome, FaSearch } from "react-icons/fa";
import { ConnectButton, darkTheme, useActiveAccount } from "thirdweb/react";
import { client } from "@/app/client";
const Navbar = () => {
  return (
    <div className="flex items-center justify-between bg-black-900 p-4">
      {/* Left Side - Home Button */}
      <div className="flex items-center space-x-4">
        {/* Home Button */}
        <div className="bg-gray-800 p-4 rounded-full">
          <FaHome className="text-white w-5 h-5" />
        </div>
      </div>

      {/* Middle - Search Bar */}
      <div className="flex items-center bg-gray-800 rounded-full py-4 px-4 w-1/2">
        <FaSearch className="text-gray-400 w-5 h-5" />
        <input
          className="flex-1 bg-transparent outline-none text-white ml-4 focus:border-white "
          placeholder="What do you want to play?"
        />
      </div>

      {/* Right Side - Login and Signup Buttons */}
      <div className="flex space-x-4">
        <ConnectButton
          client={client}
          theme={darkTheme()}
          detailsButton={{
            style: {
              maxHeight: "50px",
            },
          }}
        />
      </div>
    </div>
  );
};

export default Navbar;
