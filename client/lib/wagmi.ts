"use client";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { sepolia, hardhat, mainnet } from "wagmi/chains";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  console.warn("Missing NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID in .env.local");
}

export const config = getDefaultConfig({
  appName: "Harmony Music",
  projectId: projectId || "placeholder",
  chains: [
    // hardhat,
    sepolia,
    //mainnet
  ],
  transports: {
    [sepolia.id]: http(),
    // [hardhat.id]: http("http://127.0.0.1:8545"),
  },
  ssr: true,
});
