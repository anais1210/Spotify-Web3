"use client";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { sepolia, hardhat, mainnet } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Harmony Music",
  projectId: "WALLETCONNECT_PROJECT_ID",
  chains: [
    hardhat,
    sepolia,
    //mainnet
  ],
  transports: {
    [hardhat.id]: http("http://127.0.0.1:8545"),
    [sepolia.id]: http(),
  },
  ssr: true,
});
