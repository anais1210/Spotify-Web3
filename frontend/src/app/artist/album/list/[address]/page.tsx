"use client";

import { useEffect, useState } from "react";
import { fetchArtistByAddress } from "@/api/artists.api";
import { fetchAlbumById, AlbumProps } from "@/api/albums.api";
import Link from "next/link";
interface ArtistDetailProps {
  params: {
    address: string;
  };
}

const ArtistAlbum = ({ params }: ArtistDetailProps) => {
  const [albumsId, setAlbumsId] = useState([""]);
  const [message, setMessage] = useState("");
  const [albums, setAlbums] = useState<AlbumProps[]>([]);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const fetchedAlbums = await fetchArtistByAddress(params.address);
        if (fetchedAlbums?.albums) {
          setAlbumsId(fetchedAlbums.albums);
        } else {
          setAlbumsId([]);
          setMessage("You don't have any albums yet.");
        }
        console.log(fetchedAlbums?.albums);
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    };

    fetchAlbums();
  }, [params.address]);
  useEffect(() => {
    const fetchAlbumDetails = async () => {
      const albumDetailsPromises = albumsId.map((albumId) =>
        fetchAlbumById(albumId)
      );
      const albumDetails = await Promise.all(albumDetailsPromises);
      setAlbums(albumDetails.filter((album) => album !== null) as AlbumProps[]);
    };

    if (albumsId.length > 0) {
      fetchAlbumDetails();
    }
  }, [albumsId]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Albums</h1>
      {message ? (
        <p className="text-center text-white">{message}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {albums.map((album) => (
            <Link href={`/albums/${album._id}`} key={album._id}>
              <div
                key={album._id}
                className="bg-gray-800 p-4 rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-200 cursor-pointer"
              >
                {/* Album Cover */}
                {album.img ? (
                  <img
                    src={album.img}
                    alt={album.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-600 rounded-lg mb-4 flex items-center justify-center text-white text-2xl">
                    No Image
                  </div>
                )}

                {/* Album Info */}
                <h2 className="text-xl font-semibold text-white mb-2">
                  {album.name}
                </h2>
                <p className="text-gray-400">{album.author}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtistAlbum;
