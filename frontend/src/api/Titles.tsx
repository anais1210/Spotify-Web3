import axios from "axios";
import { toast } from "react-toastify";

const api = process.env.NEXT_PUBLIC_API_URL;
export interface Title {
  _id: string;
  address: string;
  name: string;
  author: string;
  genre: string;
  audio: string;
  album_img: string;
  tokenID: number;
  album: string;
}

export const fetchTitleById = async (
  id: string,
  setTitles: React.Dispatch<React.SetStateAction<Title[] | null>>
): Promise<void> => {
  try {
    const response = await axios.get<Title[]>(`${api}/title/${id}`);
    setTitles((prevTitles) => [...prevTitles, response.data]);
  } catch (err) {
    console.error(err);
    toast.error("Failed to fetch music data");
  }
};
