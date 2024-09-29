import axios from "axios";

const api = process.env.NEXT_PUBLIC_API_URL;

// Define the Artist type
export interface ArtistProps {
  _id?: string;
  address?: string;
  claimCount?: number;
  status?: string;
  rewards?: string[];
  albums?: string[];
}

// Function to fetch Artists
export const fetchArtists = async (): Promise<ArtistProps[] | null> => {
  try {
    const response = await axios.get<ArtistProps[]>(`${api}/artist/`);
    return response.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};
export const fetchArtistStatus = async (
  status: string,
  setArtists: React.Dispatch<React.SetStateAction<ArtistProps[]>>
): Promise<ArtistProps[] | null> => {
  try {
    const response = await axios.get<ArtistProps[]>(`${api}/artist/`);
    const artistStatus = response.data.filter(
      (artist) => artist.status === status
    );
    setArtists(artistStatus);
    return artistStatus;
  } catch (error) {
    console.error("Error fetching artists:", error);
    return null;
  }
};
export const updateArtist = async (
  artistData: ArtistProps
): Promise<ArtistProps | null> => {
  try {
    const response = await axios.put<ArtistProps>(
      `${api}/artist/address/${artistData.address}`,
      artistData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating artist:", error);
    return null;
  }
};
// Function to add an Artist
export const addArtist = async (
  ArtistData: ArtistProps
): Promise<ArtistProps | null> => {
  try {
    const response = await axios.post<ArtistProps>(
      `${api}/artist/create`,
      ArtistData
    );
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
