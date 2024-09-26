"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { AlbumProps } from "@/api/albums.api";
import { User } from "@/api/user.api";
import { TitleProps } from "@/api/titles.api";
import Link from "next/link";

// Define the API URL
const api = process.env.NEXT_PUBLIC_API_URL;

const SearchResults = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || ""; // Get query from URL

  const [searchResults, setSearchResults] = useState<{
    albums: AlbumProps[];
    artists: User[];
    titles: TitleProps[];
  }>({
    albums: [],
    artists: [],
    titles: [],
  });

  // Function to fetch search results from albums, artists, and titles
  const fetchSearchResults = async (query: string) => {
    if (!query) return; // If no query, don't search

    try {
      const [albumsRes, artistsRes, titlesRes] = await Promise.all([
        axios.get<AlbumProps[]>(`${api}/album?search=${query}`),
        axios.get<User[]>(`${api}/user/?search?role=artist&query=${query}`),
        axios.get<TitleProps[]>(`${api}/title/?search=${query}`),
      ]);

      setSearchResults({
        albums: albumsRes.data,
        artists: artistsRes.data,
        titles: titlesRes.data,
      });
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  // Fetch search results when query changes
  useEffect(() => {
    if (query) {
      fetchSearchResults(query);
    }
  }, [query]);

  return (
    <div className="min-h-screen p-4 bg-gray-900 text-white">
      <h1 className="text-4xl mb-8">Search Results for "{query}"</h1>

      {searchResults.albums.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold">Albums</h2>
          <ul>
            {searchResults.albums.map((album) => (
              <li key={album._id}>
                <Link href={`/albums/${album._id}`}>{album.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {searchResults.artists.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold">Artists</h2>
          <ul>
            {searchResults.artists.map((artist) => (
              <li key={artist.address}>
                <Link href={`/artists/${artist.address}`}>
                  {artist.lastname}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {searchResults.titles.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold">Titles</h2>
          <ul>
            {searchResults.titles.map((title, idx) => (
              <li key={idx}>
                <Link href={`/titles/${title.name}`}>{title.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {searchResults.albums.length === 0 &&
        searchResults.artists.length === 0 &&
        searchResults.titles.length === 0 && (
          <p className="text-center text-gray-500">No results found</p>
        )}
    </div>
  );
};

export default SearchResults;
