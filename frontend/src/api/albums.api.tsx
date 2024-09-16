import axios from "axios";
import { toast } from "react-toastify";

const api = process.env.NEXT_PUBLIC_API_URL;

// Define the Album type
export interface AlbumProps {
  _id: string;
  address: string;
  name: string;
  author: string;
  img: string;
  titles: string[];
}

// Function to fetch albums
export const fetchAlbums = async (
  setAlbums: React.Dispatch<React.SetStateAction<AlbumProps[]>>
): Promise<void> => {
  try {
    const response = await axios.get<AlbumProps[]>(`${api}/album/`);
    setAlbums(response.data);
  } catch (err) {
    console.error(err);
  }
};

// Function to add an album
export const addAlbum = async (
  albumData: AlbumProps,
  setAlbums: React.Dispatch<React.SetStateAction<AlbumProps[]>>
): Promise<void> => {
  try {
    const response = await axios.post<AlbumProps>(`${api}/album/`, albumData);
    setAlbums((prevAlbums) => [...prevAlbums, response.data]); // Update the state with the new album
  } catch (err) {
    console.error(err);
  }
};

export const fetchAlbumById = async (
  id: string,
  setAlbum: React.Dispatch<React.SetStateAction<AlbumProps | null>>
): Promise<void> => {
  try {
    const response = await axios.get<AlbumProps>(`${api}/album/${id}`);
    setAlbum(response.data);
  } catch (err) {
    console.error(err);
  }
};
