"use client";
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from "react-icons/fa";
import { useState, useEffect } from "react";
import { fetchAlbumById } from "@/api/albums.api";
import { AlbumProps } from "@/api/albums.api";
import { TitleProps, fetchTitlesById } from "@/api/titles.api";
import Image from "next/image";
import Loading from "@/components/Loading";

interface AlbumDetailProps {
  params: {
    id: string;
  };
}

const AlbumPage = ({ params }: AlbumDetailProps) => {
  const [loading, setLoading] = useState(true);

  const [album, setAlbum] = useState<AlbumProps | null>(null);
  const [titles, setTitles] = useState<TitleProps[] | null>([]);

  useEffect(() => {
    // Fetch album details by album ID
    const fetchAlbum = async () => {
      await fetchAlbumById(params.id, setAlbum);
    };

    fetchAlbum();
  }, [params.id]);

  useEffect(() => {
    // Fetch titles only after the album is fetched
    if (album) {
      const fetchAllTitles = async () => {
        for (const titleId of album.titles) {
          await fetchTitlesById(titleId, setTitles);
        }
      };
      fetchAllTitles();
    }
  }, [album]);

  if (!album || !titles) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Album Header */}
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Image
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
              {album.author} • {album.titles.length} songs
            </p>
          </div>
        </div>

        {/* Play Button and Options */}
        <div className="flex items-center mb-6">
          <button className="bg-green-500 hover:bg-green-400 text-black py-3 px-6 rounded-full text-2xl font-semibold flex items-center">
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
                <th className="pb-3 text-right">Duration</th>
              </tr>
            </thead>
            <tbody>
              {titles.map((song, index) => (
                <tr key={index} className="hover:bg-gray-800">
                  <td className="py-2">{index + 1}</td>
                  <td className="py-2">{song.name}</td>
                  {/* <td className="py-2 text-right">{song.duration}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AlbumPage;
