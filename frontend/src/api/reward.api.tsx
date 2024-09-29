import axios from "axios";

const api = process.env.NEXT_PUBLIC_API_URL;

export interface RewardProps {
  _id?: string;
  address?: string;
  name?: string;
  claim?: boolean;
  tokenId?: number;
  amount?: number;
}
export const addReward = async (
  RewardData: RewardProps
): Promise<RewardProps | null> => {
  try {
    const response = await axios.post<RewardProps>(
      `${api}/artist/reward/create/`,
      RewardData
    );
    return response.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};
