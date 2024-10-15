"use client";
import { FaHome, FaSearch } from "react-icons/fa";
import { ConnectButton, darkTheme } from "thirdweb/react";
import { client } from "@/app/client";
import { fetchTitles, TitleProps } from "@/api/titles.api";
import { fetchAlbums, AlbumProps } from "@/api/albums.api";
import { fetchUsers, User, addUser, fetchUserByAddress } from "@/api/user.api";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
const Navbar = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [titles, setTitles] = useState<TitleProps[]>([]);
  const [artists, setArtists] = useState<User[]>([]);
  const [albums, setAlbums] = useState<AlbumProps[]>([]);
  const [filteredResults, setFilteredResults] = useState<{
    titles: TitleProps[];
    artists: User[];
    albums: AlbumProps[];
  }>({
    titles: [],
    artists: [],
    albums: [],
  });
  useEffect(() => {
    const fetchAllData = async () => {
      const [allTitles, allArtists, allAlbums] = await Promise.all([
        fetchTitles(),
        fetchUsers(),
        fetchAlbums(),
      ]);

      if (allTitles) setTitles(allTitles);
      if (allArtists) setArtists(allArtists);
      if (allAlbums) setAlbums(allAlbums);
    };

    fetchAllData();
  }, []);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter results based on the search query
    if (query) {
      const filteredTitles = titles.filter((title) =>
        title.name.toLowerCase().includes(query.toLowerCase())
      );
      const filteredArtists = artists.filter((artist) => {
        const fullName = `${artist.firstname} ${artist.lastname}`.toLowerCase();
        return fullName.includes(query.toLowerCase());
      });
      const filteredAlbums = albums.filter((album) =>
        album.name.toLowerCase().includes(query.toLowerCase())
      );

      setFilteredResults({
        titles: filteredTitles,
        artists: filteredArtists,
        albums: filteredAlbums,
      });
    } else {
      setFilteredResults({ titles: [], artists: [], albums: [] });
    }
  };

  const handleConnect = async (address: string) => {
    try {
      const exist = await fetchUserByAddress(address);
      if (!exist) {
        const response = await addUser({ address: address });
        console.log("user added");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex items-center justify-between bg-black-900 p-4">
      {/* Left Side - Home Button */}
      <div className="flex items-center space-x-4">
        <Link href="/" passHref>
          <div className="bg-gray-800 p-4 rounded-full">
            <FaHome className="text-white w-5 h-5" />
          </div>
        </Link>
      </div>

      {/* Middle - Search Bar */}
      <div className="relative flex items-center bg-gray-800 rounded-full py-4 px-4 w-1/2">
        <FaSearch className="text-gray-400 w-5 h-5" />
        <input
          className="flex-1 bg-transparent outline-none text-white ml-4"
          placeholder="What do you want to play?"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        {/* Search Results Dropdown */}
        {searchQuery && (
          <div className="absolute top-12 left-0 w-full bg-white text-black p-4 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
            {filteredResults.titles.length > 0 && (
              <div>
                <h3 className="font-bold">Titles</h3>
                <ul>
                  {filteredResults.titles.map((title) => (
                    <li key={title._id}>
                      <Link href={`/titles/${title.name}`}>{title.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {filteredResults.artists.length > 0 && (
              <div>
                <h3 className="font-bold mt-4">Artists</h3>
                <ul>
                  {filteredResults.artists.map((artist) => (
                    <li key={artist._id}>
                      <Link href={`/artists/${artist.address}`}>
                        {artist.firstname} {artist.lastname}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {filteredResults.albums.length > 0 && (
              <div>
                <h3 className="font-bold mt-4">Albums</h3>
                <ul>
                  {filteredResults.albums.map((album) => (
                    <li key={album._id}>
                      <Link href={`/albums/${album._id}`}>{album.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {filteredResults.titles.length === 0 &&
              filteredResults.artists.length === 0 &&
              filteredResults.albums.length === 0 && (
                <p className="text-center text-gray-500">No results found</p>
              )}
          </div>
        )}
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
          onConnect={(wallet) => {
            handleConnect(wallet.getAccount()?.address!);
          }}
        />
      </div>
    </div>
  );
};

export default Navbar;
