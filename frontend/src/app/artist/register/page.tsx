"use client";
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { upload } from "thirdweb/storage";
import { client } from "@/app/client";
import { addUser, fetchUserByAddress, User, updateUser } from "@/api/user.api";
import { toast } from "react-toastify";
import { ConnectButton, darkTheme, useActiveAccount } from "thirdweb/react";
import { useUserRole, useArtistStatus } from "@/contracts/checkRole";
import { ArtistProps, addArtist } from "@/api/artists.api";
import { getUserEmail } from "thirdweb/wallets/in-app";
import { useRouter } from "next/navigation";

const ArtistRegistration = () => {
  const account = useActiveAccount();
  const { isAdmin, isArtist, walletAddress } = useUserRole(account);
  const { status } = useArtistStatus(account);
  const router = useRouter();

  const [user, setUser] = useState<User>({
    address: account?.address || "",
    lastname: "",
    firstname: "",
    email: "",
    banned: false,
    role: "artist",
    profile: "",
  });
  const [artist, setArtist] = useState<ArtistProps>({
    address: account?.address || "",
    claimCount: 0,
    status: "pending",
  });
  const [uploadStatus, setUploadStatus] = useState<string>("");

  useEffect(() => {
    const checkEmail = async () => {
      try {
        const userEmail = await getUserEmail({ client });
        setUser((prevUser) => ({
          ...prevUser,
          email: userEmail || "", // Update the email in the user state
        }));
      } catch (error) {
        console.error("Error fetching email:", error);
        // Handle the error if necessary
      }
    };

    checkEmail();
  }, [client]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUser((prevArtist) => ({
      ...prevArtist,
      [name]: value,
    }));
  };

  // Handle file drop
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setUploadStatus("Uploading profile picture...");
      try {
        const uris = await upload({
          client,
          files: acceptedFiles,
        });

        const profilePictureUrl = uris.replace(
          "ipfs://",
          "https://ipfs.io/ipfs/"
        );
        setUser((prevArtist) => ({
          ...prevArtist,
          profile: profilePictureUrl, // Update state with the profile picture URL
        }));
        console.log(profilePictureUrl);
        setUploadStatus("Upload successful!");
      } catch (error) {
        console.error("Error uploading profile picture: ", error);
        setUploadStatus("Upload failed, please try again.");
      }
    },
    [upload]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (account?.address) {
        const email = await getUserEmail({ client });
        if (email) {
          user.email = email;
          console.log(email);
        }
        console.log(user.address);
        const userExist = await fetchUserByAddress(account.address);
        if (user) {
          toast.info(
            "Regular user cannot be artist and user at the same time. Please use another account to be registered as an artist."
          );
          return;
        }
        const userSuccess = await addUser(user);
        const artistSuccess = await addArtist(artist);

        if (userSuccess && artistSuccess != null) {
          toast.success("Artist registered successfully!");
          router.push("/");
        } else {
          throw new Error("Failed to register user or artist.");
        }
      } else {
        toast.error("No address detected.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed, please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black-900 text-white p-6">
      {walletAddress &&
        !isAdmin &&
        !isArtist &&
        status != "pending" &&
        status != "active" && (
          <div className="w-full max-w-lg bg-gray-800 p-8 rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold mb-8 text-center">
              Artist Registration
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="firstname" className="block text-lg mb-2">
                  Firstname
                </label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  value={user.firstname}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 text-black rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label htmlFor="lastname" className="block text-lg mb-2">
                  Lastname
                </label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={user.lastname}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 text-black rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-lg mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={user.email}
                  onChange={handleInputChange}
                  required
                  // readOnly={!user.email}
                  className="w-full px-4 py-2 text-black rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-lg mb-2">Profile Picture</label>
                <div
                  {...getRootProps()}
                  className="border-dashed border-2 border-gray-400 p-6 text-center cursor-pointer bg-gray-700 rounded-lg"
                >
                  <input {...getInputProps()} />
                  <p>
                    Drag and drop a profile picture here, or click to select one
                  </p>
                </div>
                {uploadStatus && (
                  <p
                    className={`mt-2 ${
                      uploadStatus.includes("failed")
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {uploadStatus}
                  </p>
                )}
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-green-500 text-black px-6 py-3 rounded-full font-semibold hover:bg-green-400 transition-colors duration-300"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        )}
      {!walletAddress && (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-semibold text-center mb-6 text-gray-200">
            Connect first to continue registration
          </h1>
          <ConnectButton
            client={client}
            connectButton={{ label: "Register to ontinue ->" }}
            theme={darkTheme()}
            detailsButton={{
              style: {
                maxHeight: "50px",
              },
            }}
          />
        </div>
      )}
      {isAdmin && (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-semibold text-center mb-6 text-gray-200">
            Admin cannot be an artist, please sign in with another account
          </h1>
          <ConnectButton
            client={client}
            connectButton={{ label: "Register to ontinue ->" }}
            theme={darkTheme()}
            detailsButton={{
              style: {
                maxHeight: "50px",
              },
            }}
          />
        </div>
      )}
      {status === "pending" && (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-semibold text-center mb-6 text-gray-200">
            Your registration is pending approval
          </h1>
        </div>
      )}
    </div>
  );
};

export default ArtistRegistration;
