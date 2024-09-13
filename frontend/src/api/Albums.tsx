import axios from "axios";
import { toast } from "react-toastify";

const api = process.env.NEXT_PUBLIC_API_URL;

// Define the Album type
export interface Album {
  _id: string;
  address: string;
  name: string;
  author: string;
  img: string;
  titles: string[];
}

// Function to fetch albums
export const fetchAlbums = async (
  setAlbums: React.Dispatch<React.SetStateAction<Album[]>>
): Promise<void> => {
  try {
    const response = await axios.get<Album[]>(`${api}/album/`);
    setAlbums(response.data);
  } catch (err) {
    console.error(err);
    toast.error("Failed to fetch music data");
  }
};

// Function to add an album
export const addAlbum = async (
  albumData: Album,
  setAlbums: React.Dispatch<React.SetStateAction<Album[]>>
): Promise<void> => {
  try {
    const response = await axios.post<Album>(`${api}/album/`, albumData);
    setAlbums((prevAlbums) => [...prevAlbums, response.data]); // Update the state with the new album
  } catch (err) {
    console.error(err);
    toast.error("Failed to add album");
  }
};

export const fetchAlbumById = async (
  id: string,
  setAlbum: React.Dispatch<React.SetStateAction<Album | null>>
): Promise<void> => {
  try {
    const response = await axios.get<Album>(`${api}/album/${id}`);
    setAlbum(response.data);
  } catch (err) {
    console.error(err);
    toast.error("Failed to fetch music data");
  }
};
