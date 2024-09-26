import axios from "axios";
import { toast } from "react-toastify";

const api = process.env.NEXT_PUBLIC_API_URL;

// Define the Album type
export interface AlbumProps {
  _id?: string;
  address?: string;
  name?: string;
  author?: string;
  img?: string;
  titles?: string[];
}

// Function to fetch albums
export const fetchAlbums = async (): Promise<AlbumProps[] | null> => {
  try {
    const response = await axios.get<AlbumProps[]>(`${api}/album/`);
    return response.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

// Function to add an album
export const addAlbum = async (
  AlbumData: AlbumProps
): Promise<AlbumProps | null> => {
  try {
    const response = await axios.post<AlbumProps>(
      `${api}/album/create`,
      AlbumData
    );
    return response.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};
export const fetchAlbumById = async (
  id: string
): Promise<AlbumProps | null> => {
  try {
    const response = await axios.get<AlbumProps>(`${api}/album/${id}`);
    return response.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const updateAlbum = async (
  id: string,
  albumData: AlbumProps
): Promise<AlbumProps | null> => {
  try {
    const response = await axios.put<AlbumProps>(
      `${api}/album/update/${id}`,
      albumData
    );
    console.log(response, albumData._id);
    return response.data;
  } catch (error) {
    console.error("Error updating artist:", error);
    return null;
  }
};
