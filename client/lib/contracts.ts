import ManagementABI from "./abis/Management.json";
import AlbumFactoryABI from "./abis/AlbumFactory.json";
import HarmonyNFTABI from "./abis/HarmonyNFT.json";

// Sepolia deployed addresses (from deployedAddresses.json)
const DEPLOYED_ADDRESSES = {
  management: "0x732D55203CD9bd474d1125aeca18619c8bebA55F",
  albumFactory: "0x05ffd27905dcAC3171Ccc80d40eDaF93DB523c3B",
  harmony: "0x24120Dbe0C367dAFdd65f05860F9b3E03d905F8c",
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
    abi: HarmonyNFTABI.abi,
  },
};
