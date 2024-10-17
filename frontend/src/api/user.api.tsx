import axios from "axios";
import { toast } from "react-toastify";
import { ArtistProps } from "@/api/artists.api";
import { TitleProps } from "@/api/titles.api";
import { SubsProps } from "@/api/subscription.api";

const api = process.env.NEXT_PUBLIC_API_URL;

// Define the User type
export interface User {
  _id?: string;
  address?: string;
  lastname?: string;
  firstname?: string;
  email?: string;
  banned?: boolean;
  like?: TitleProps[];
  follow?: ArtistProps[];
  subscription?: string;
  role?: string;
  profile?: string;
}

// Function to fetch Users
export const fetchUsers = async (): Promise<User[] | null> => {
  try {
    const response = await axios.get<User[]>(`${api}/user/`);
    return response.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};
export const fetchUsersOnRole = async (
  role: string
): Promise<User[] | null> => {
  try {
    const response = await axios.get<User[]>(`${api}/user/`);
    const userRole = response.data.filter((user) => user.role === role);
    return userRole;
  } catch (error) {
    console.error("Error fetching users:", error);
    return null;
  }
};

export const addUser = async (UserData: User): Promise<User | null> => {
  try {
    const response = await axios.post<User>(`${api}/user/create`, UserData);
    return response.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const fetchUserById = async (
  id: string,
  setUser: React.Dispatch<React.SetStateAction<User | null>>
): Promise<void> => {
  try {
    const response = await axios.get<User>(`${api}/user/id/${id}`);
    setUser(response.data);
  } catch (err) {
    console.error(err);
  }
};

export const fetchUserByAddress = async (
  address: string
): Promise<User | null> => {
  try {
    const response = await axios.get<User>(`${api}/user/${address}`);
    return response.data;
  } catch (err) {
    console.error(err);
    return null; // Return null in case of an error
  }
};

export const updateUser = async (
  address: string,
  userData: User // Accept the user data to be updated
): Promise<User | null> => {
  try {
    const response = await axios.patch<User>(
      `${api}/user/update/${address}`,
      userData
    );
    return response.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};
