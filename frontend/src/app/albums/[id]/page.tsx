"use client";
import {
  FaPlay,
  FaPause,
  FaStepBackward,
  FaStepForward,
  FaPlus,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { fetchAlbumById } from "@/api/albums.api";
import { AlbumProps } from "@/api/albums.api";
import { TitleProps, fetchTitleById } from "@/api/titles.api";
import Loading from "@/components/Loading";
import { useActiveAccount } from "thirdweb/react";
import AddSong from "@/components/AddSong";
import Modal from "@/components/Modal";
import CustomAudioPlayer from "@/components/CustomAudioPlayer";

interface AlbumDetailProps {
  params: {
    id: string;
  };
}

const AlbumPage = ({ params }: AlbumDetailProps) => {
  const account = useActiveAccount();
  const [loading, setLoading] = useState(true);
  const [album, setAlbum] = useState<AlbumProps | null>(null);
  const [titles, setTitles] = useState<TitleProps[]>([]);
  const [titleName, setTitleName] = useState("");
  const [owner, setOwner] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState<string | null>(null); // State for selected song
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);

  // TO DO: FIX THE PLAYER BUTTON
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchAlbum = async () => {
      const resultAlbum = await fetchAlbumById(params.id);
      if (resultAlbum) {
        setAlbum(resultAlbum);
        if (resultAlbum.address === account?.address) {
          setOwner(true);
        }
      }
    };

    fetchAlbum();
  }, [params.id, account]);

  useEffect(() => {
    // Check if album address is available and if the account is the owner
    if (album?.address) {
      if (album.address === account?.address) {
        console.log(album.address);
        setOwner(true);
      }
    }

    // Fetch all titles only if album is available
    const fetchAllTitles = async () => {
      if (album?.titles && album.titles.length > 0) {
        try {
          const titlesData = await Promise.all(
            album.titles.map((titleId) => fetchTitleById(titleId))
          );
          setTitles(titlesData.filter((title) => title !== null)); // Filter out any null responses
        } catch (error) {
          console.error("Error fetching titles: ", error);
        }
      }
    };

    fetchAllTitles();
  }, [album, account]);

  const handleAddSong = (newSong: TitleProps) => {
    setTitles((prevTitles) => [...prevTitles, newSong]);
    console.log("New song data:", newSong);
    setIsModalOpen(false); // Close the modal after submission
  };

  const handleSongClick = (songUrl: string, title: string) => {
    setSelectedSong(songUrl);
    setTitleName(title);
    setIsPlaying(true);
  };
  const handlePlayAlbum = () => {
    if (titles.length > 0) {
      const firstSong = titles[0];
      setSelectedSong(firstSong.audio!);
      setTitleName(firstSong.name!);
      setIsPlaying(true);
    }
  };
  const handleSongChange = (index: number) => {
    setSelectedSong(titles[index].audio!);
    setTitleName(titles[index].name!);
    setIsPlaying(true);
    setCurrentSongIndex(index);
  };
  if (!album || !titles) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white px-8">
      {/* Album Header */}
      <div className="p-6 flex justify-between items-start">
        <div className="flex items-center">
          <img
            src={album.img}
            alt={album.name}
            width={224}
            height={224}
            className="w-56 h-56 object-cover rounded-lg shadow-md"
          />
          <div className="ml-6">
            <p className="text-sm uppercase text-gray-400">Album</p>
            <h1 className="text-6xl font-bold">{album.name}</h1>
            <p className="text-lg text-gray-400 mt-2">
              {album.author} • {album.titles!.length} songs
            </p>
          </div>
        </div>

        {owner && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-black py-3 px-6 rounded-full shadow-md transition duration-200 ease-in-out transform hover:scale-105"
          >
            <FaPlus className="mr-2" style={{ verticalAlign: "middle" }} />
            <span className="align-middle">Add Song</span>
          </button>
        )}
      </div>

      {/* Play Button and Options */}
      <div className="flex items-center mb-6">
        <button
          onClick={handlePlayAlbum}
          className="bg-green-500 hover:bg-green-400 text-black py-3 px-6 rounded-full text-2xl font-semibold flex items-center transition duration-200 ease-in-out transform hover:scale-105"
        >
          <span className="mr-2">▶</span> Play
        </button>
      </div>

      {/* Song List */}
      <div className="w-full">
        <table className="table-auto w-full text-left text-gray-400">
          <thead>
            <tr className="uppercase text-xs">
              <th className="pb-3">#</th>
              <th className="pb-3">Title</th>
            </tr>
          </thead>
          <tbody>
            {titles.map((song, index) => (
              <tr
                key={song._id}
                className="hover:bg-gray-800 transition duration-200 ease-in-out transform hover:scale-105 p-5 rounded-full"
              >
                <td className="py-2">{index + 1}</td>
                {/* <td className="py-2">{song.audio}</td> */}
                <td className="py-2 text-lg hover:text-green-400 transition duration-200 ease-in-out">
                  <button
                    onClick={() => handleSongClick(song.audio!, song.name!)}
                    className="w-full text-left"
                  >
                    {song.name}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Audio Player */}
      {selectedSong && (
        <div className="fixed bottom-0 left-0 right-0 p-4">
          <CustomAudioPlayer
            src={selectedSong}
            album={{
              _id: album._id,
              img: album.img,
              name: album.name,
              author: album.author,
            }}
            title={titleName}
            songs={titles}
            currentSongIndex={currentSongIndex}
            onSongChange={handleSongChange}
          />
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl mb-4">Add a New Song</h2>
        <AddSong
          album={{ _id: album._id, name: album.name, author: album.author }}
          onSubmit={handleAddSong}
        />
      </Modal>
    </div>
  );
};

export default AlbumPage;
