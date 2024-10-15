import axios from "axios";

const api = process.env.NEXT_PUBLIC_API_URL;

export interface SubsProps {
  _id?: string;
  startDate: Date;
  lastPayment: Date;
  status: string;
  userId: string;
}

export const addSubscription = async (
  SubsData: SubsProps
): Promise<SubsProps | null> => {
  try {
    const response = await axios.post<SubsProps>(`${api}/sub/create`, SubsData);
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const isSubscribe = async (
  userId: string
): Promise<SubsProps | null> => {
  try {
    const response = await axios.get<SubsProps>(
      `${api}/sub/isSubscribed/${userId}`
    );
    return response.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};
