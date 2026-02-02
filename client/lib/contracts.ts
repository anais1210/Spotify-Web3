import ManagementABI from "./abis/Management.json";
import AlbumFactoryABI from "./abis/AlbumFactory.json";
import HarmonyNFTABI from "./abis/HarmonyNFT.json";

const DEPLOYED_ADDRESSES = {
  management: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  albumFactory: "0x0165878A594ca255338adfa4d48449f69242Eb8F",
  harmony: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
};

export const contracts = {
  management: {
    address: DEPLOYED_ADDRESSES.management as `0x${string}`,
    abi: ManagementABI.abi,
  },
  albumFactory: {
    address: DEPLOYED_ADDRESSES.albumFactory as `0x${string}`,
    abi: AlbumFactoryABI.abi,
  },
  harmonyNFT: {
    abi: AlbumFactoryABI.abi,
  },
};
