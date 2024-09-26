import axios from "axios";

const api = process.env.NEXT_PUBLIC_API_URL;
export interface TitleProps {
  _id?: string;
  address?: string;
  name?: string;
  author?: string;
  genre?: string;
  audio?: string;
  tokenID?: number;
  album?: string;
}

export const fetchTitleById = async (
  id: string
): Promise<TitleProps | null> => {
  try {
    const response = await axios.get<TitleProps>(`${api}/title/${id}`);
    return response.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const fetchTitles = async (): Promise<TitleProps[] | null> => {
  try {
    const response = await axios.get<TitleProps[]>(`${api}/title/`);
    return response.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};
export const addTitle = async (
  TitleData: TitleProps
): Promise<TitleProps | null> => {
  try {
    const response = await axios.post<TitleProps>(
      `${api}/title/create`,
      TitleData
    );
    return response.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};
