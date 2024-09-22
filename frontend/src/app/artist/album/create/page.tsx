"use client";
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { upload } from "thirdweb/storage";
import { client } from "@/app/client";
import { addAlbum, AlbumProps } from "@/api/albums.api";
import { toast } from "react-toastify";
import { ConnectButton, darkTheme, useActiveAccount } from "thirdweb/react";
import { useUserRole, useArtistStatus } from "@/contracts/checkRole";
import { ArtistProps, updateArtist } from "@/api/artists.api";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";

const CreateAlbum = () => {
  const account = useActiveAccount();
  const { isArtist } = useUserRole(account);
  const { status } = useArtistStatus(account);
  const router = useRouter();

  // Album state
  const [album, setAlbum] = useState<AlbumProps>({
    address: account?.address || "",
    name: "",
    author: "", // This should be singular "author" as per the initial state definition
    img: "",
  });

  const [artist, setArtist] = useState<ArtistProps>({
    address: account?.address || "",
    albums: [""],
  });

  const [uploadStatus, setUploadStatus] = useState<string>("");

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAlbum((prevAlbum) => ({
      ...prevAlbum,
      [name]: value,
    }));
  };

  // File upload logic
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setUploadStatus("Uploading album cover...");
      try {
        const uris = await upload({
          client,
          files: acceptedFiles,
        });
        const imgCover = uris.replace("ipfs://", "https://ipfs.io/ipfs/");
        setAlbum((prevAlbum) => ({
          ...prevAlbum,
          img: imgCover,
        }));
        setUploadStatus("Upload successful!");
      } catch (error) {
        console.error("Error uploading album cover: ", error);
        setUploadStatus("Upload failed, please try again.");
      }
    },
    [upload]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const albumSuccess = await addAlbum(album);
      if (albumSuccess && artist.address && albumSuccess._id) {
        console.log(albumSuccess._id);
        await updateArtist({
          address: artist.address,
          albums: [albumSuccess._id],
        });
        toast.success("Album created successfully!");
        // router.push("/");
      } else {
        throw new Error("Failed to register album or update artist.");
      }
    } catch (error) {
      console.error("Creation error:", error);
      toast.error("Creation failed, please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black-900 text-white p-6">
      {isArtist ? (
        <div className="w-full max-w-lg bg-gray-800 p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-8 text-center">
            Create An Album
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-lg mb-2">
                Album's Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={album.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 text-black rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label htmlFor="author" className="block text-lg mb-2">
                Author
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={album.author} // Keep the key name consistent with the state
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 text-black rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-lg mb-2">Album Cover</label>
              <div
                {...getRootProps()}
                className="border-dashed border-2 border-gray-400 p-6 text-center cursor-pointer bg-gray-700 rounded-lg"
              >
                <input {...getInputProps()} />
                <p>
                  Drag and drop the album's cover here, or click to select one
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
                className="bg-green-500 text-black px-6 py-3 rounded-full font-semibold hover:bg-green-400 transition-colors duration-300 flex items-center justify-center"
              >
                Create <FaPlus className="ml-2" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-semibold text-center mb-6 text-gray-200">
            Only Registered Artists can create an album
          </h1>
          <ConnectButton
            client={client}
            connectButton={{ label: "Register to continue ->" }}
            theme={darkTheme()}
          />
        </div>
      )}
    </div>
  );
};
export default CreateAlbum;
