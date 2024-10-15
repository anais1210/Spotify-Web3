"use client";

import { fetchUserByAddress, User, updateUser } from "@/api/user.api";
import React, { useEffect, useState } from "react";
import { FaUser, FaEnvelope, FaWallet } from "react-icons/fa"; // Importing icons
import Loading from "@/components/Loading"; // Adjust this import based on your project structure
import { toast } from "react-toastify";
import { getUserEmail } from "thirdweb/wallets/in-app";
import { client } from "@/app/client";
interface UserDetailProps {
  params: {
    address: string;
  };
}

const Profile = ({ params }: UserDetailProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // State to handle editing
  const [formData, setFormData] = useState<User>({
    firstname: "",
    lastname: "",
    email: "",
    address: params.address, // Initialize with address
    banned: false,
    role: "user",
    profile: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await fetchUserByAddress(params.address);
        const userEmail = await getUserEmail({ client });
        if (fetchedUser) {
          setUser(fetchedUser);
          setFormData({
            firstname: fetchedUser.firstname || "",
            lastname: fetchedUser.lastname || "",
            email: fetchedUser.email || userEmail || "",
            address: fetchedUser.address || params.address, // Use fetched address
            banned: fetchedUser.banned || false,
            role: fetchedUser.role || "user",
            profile: fetchedUser.profile || "",
          });
        } else {
          console.error("User not found.");
        }
      } catch (error) {
        toast.error("Error fetching user details.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [params.address]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdateClick = async () => {
    if (isEditing) {
      const updatedUser = await updateUser(params.address, formData);
      if (updatedUser) {
        toast.success("User updated successfully!");
        setUser(updatedUser); // Update local user state
        setFormData(updatedUser); // Update form data to reflect changes
      } else {
        toast.error("Error updating user.");
      }
    }
    setIsEditing(!isEditing); // Toggle editing mode
  };

  return (
    <>
      <div className="container mx-auto py-10 min-h-screen flex items-center justify-center relative">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-4xl font-bold text-white mb-6 text-center">
            Profile
          </h1>
          {loading ? (
            <Loading />
          ) : (
            <>
              <div className="mb-4">
                <label
                  className="flex items-center text-gray-300 mb-1"
                  htmlFor="address"
                >
                  <FaWallet className="text-gray-400 mr-2" />
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  value={formData.address}
                  readOnly
                  className="w-full bg-gray-800 text-gray-300 border border-gray-600 rounded p-2"
                  placeholder="Address"
                />
              </div>

              {/* Flex container for Firstname and Lastname */}
              <div className="mb-4 flex space-x-4">
                <div className="flex-1">
                  <label
                    className="flex items-center text-gray-300 mb-1"
                    htmlFor="firstname"
                  >
                    <FaUser className="text-gray-400 mr-2" />
                    Firstname
                  </label>
                  <input
                    id="firstname"
                    name="firstname"
                    type="text"
                    value={formData.firstname}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    className={`w-full bg-gray-800 text-gray-300 border border-gray-600 rounded p-2 transition duration-200 ${
                      isEditing
                        ? "focus:outline-none focus:ring focus:ring-blue-500"
                        : ""
                    }`}
                    placeholder="Firstname"
                  />
                </div>
                <div className="flex-1">
                  <label
                    className="flex items-center text-gray-300 mb-1"
                    htmlFor="lastname"
                  >
                    <FaUser className="text-gray-400 mr-2" />
                    Lastname
                  </label>
                  <input
                    id="lastname"
                    name="lastname"
                    type="text"
                    value={formData.lastname}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    className={`w-full bg-gray-800 text-gray-300 border border-gray-600 rounded p-2 transition duration-200 ${
                      isEditing
                        ? "focus:outline-none focus:ring focus:ring-blue-500"
                        : ""
                    }`}
                    placeholder="Lastname"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label
                  className="flex items-center text-gray-300 mb-1"
                  htmlFor="email"
                >
                  <FaEnvelope className="text-gray-400 mr-2" />
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className={`w-full bg-gray-800 text-gray-300 border border-gray-600 rounded p-2 transition duration-200 ${
                    isEditing
                      ? "focus:outline-none focus:ring focus:ring-blue-500"
                      : ""
                  }`}
                  placeholder="Email"
                />
              </div>

              <button
                onClick={handleUpdateClick}
                className="mt-6 bg-green-600 text-white font-semibold py-2 px-4 rounded hover:bg-green-700 transition-colors duration-200 mx-auto block"
              >
                {isEditing ? "Confirm" : "Update"}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
