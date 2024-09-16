import axios from "axios";
import { toast } from "react-toastify";

const api = process.env.NEXT_PUBLIC_API_URL;
export interface TitleProps {
  address: string;
  name: string;
  author: string;
  genre: string;
  audio: string;
  album_img: string;
  tokenID: number;
  album: string;
}

export const fetchTitlesById = async (
  id: string,
  setTitles: React.Dispatch<React.SetStateAction<TitleProps[] | null>>
): Promise<void> => {
  try {
    const response = await axios.get<TitleProps[]>(`${api}/title/${id}`);

    setTitles((prevTitles) => {
      // Check if prevTitles is null and handle accordingly
      const updatedTitles = prevTitles
        ? [...prevTitles, ...response.data]
        : response.data;
      return updatedTitles; // Return the updated titles
    });
  } catch (err) {
    console.error(err);
  }
};
