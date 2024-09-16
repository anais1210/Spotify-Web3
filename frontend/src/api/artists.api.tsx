import axios from "axios";
import { toast } from "react-toastify";
import { AlbumProps } from "@/api/albums.api";

const api = process.env.NEXT_PUBLIC_API_URL;

// Define the Artist type
export interface ArtistProps {
  address: string;
  claimCount: number;
  status: string;
  reward?: string;
  album?: AlbumProps[];
}

// Function to fetch Artists
export const fetchArtists = async (
  setArtists: React.Dispatch<React.SetStateAction<ArtistProps[]>>
): Promise<void> => {
  try {
    const response = await axios.get<ArtistProps[]>(`${api}/artist/`);
    setArtists(response.data);
  } catch (err) {
    console.error(err);
  }
};

// Function to add an Artist
export const addArtist = async (
  ArtistData: ArtistProps
  // setArtists: React.Dispatch<React.SetStateAction<ArtistProps>>
): Promise<ArtistProps | null> => {
  try {
    const response = await axios.post<ArtistProps>(
      `${api}/artist/create`,
      ArtistData
    );
    // setArtists(response.data);
    return response.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const fetchArtistByAddress = async (
  address: string
): Promise<ArtistProps | null> => {
  try {
    const response = await axios.get<ArtistProps>(
      `${api}/artist/address/${address}`
    );
    return response.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};
