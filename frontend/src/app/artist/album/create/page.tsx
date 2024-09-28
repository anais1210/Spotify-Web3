"use client";
import { useState, useCallback } from "react";
import { client } from "@/app/client";
import { addAlbum, AlbumProps } from "@/api/albums.api";
import { toast } from "react-toastify";
import { contractFactory as contract } from "@/contracts/contracts";
import {
  ConnectButton,
  darkTheme,
  TransactionButton,
  useActiveAccount,
} from "thirdweb/react";
import { useUserRole, useArtistStatus } from "@/contracts/checkRole";
import { ArtistProps, updateArtist } from "@/api/artists.api";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import { prepareContractCall } from "thirdweb";
import FileUpload from "@/components/FileUpload";

const CreateAlbum = () => {
  const account = useActiveAccount();
  const { isArtist } = useUserRole(account);
  const { status } = useArtistStatus(account);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Album state
  const [album, setAlbum] = useState<AlbumProps>({
    address: account?.address || "",
    name: "",
    author: "",
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

  // Form submission handler
  const handleSubmit = async () => {
    try {
      const artistAddress = await artist.address;
      if (artistAddress) {
        const albumSuccess = await addAlbum(album);
        console.log(albumSuccess?._id);
        console.log(artist.address);
        if (albumSuccess && artist.address && albumSuccess._id) {
          console.log(albumSuccess?._id);
          console.log(artist.address);
          await updateArtist({
            address: artist.address,
            albums: [albumSuccess._id],
          });
          toast.success("Album created successfully!");
          router.push(`/artist/album/list/${artistAddress}`);
        }
      } else {
        throw new Error("Failed to register album or update artist.");
      }
    } catch (error) {
      console.error("Creation error:", error);
      toast.error("Creation failed, please try again.");
    }
  };
  const handleFileUpload = (imgCover: string) => {
    setAlbum((prevAlbum) => ({
      ...prevAlbum,
      img: imgCover,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black-900 text-white p-6">
      {isArtist ? (
        <div className="w-full max-w-lg bg-gray-800 p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-8 text-center">
            Create An Album
          </h1>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
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
                value={album.author}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 text-black rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-lg mb-2">Album Cover</label>
              <FileUpload onFileUpload={handleFileUpload} />
            </div>
            <div className="text-center">
              <TransactionButton
                transaction={async () => {
                  const tx = prepareContractCall({
                    contract: contract,
                    method:
                      "function createAlbum(string memory name, string memory symbol, address staffContractAddress)",
                    params: [
                      album.name,
                      album.name,
                      process.env.STAFF_ADDRESS ||
                        "0x5604b74F621f030926712D8b0F76C57040e0231C",
                    ],
                  });
                  console.log("tx", tx);
                  return tx;
                }}
                onTransactionConfirmed={async () => {
                  alert("Album created successfully!");
                  setIsModalOpen(false);
                  await handleSubmit();
                }}
                onError={(error) => alert(`${error.message}`)}
                theme={darkTheme()}
                className="bg-green-500 text-black px-4 py-2 rounded-full hover:bg-green-400"
              >
                Create
              </TransactionButton>
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
