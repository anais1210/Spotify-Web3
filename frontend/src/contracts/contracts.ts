import { defineChain } from "thirdweb/chains";
import { getContract } from "thirdweb";
import { client } from "@/app/client";

export const contractStaff = getContract({
  client,
  chain: defineChain(80002),
  address: "0x5604b74F621f030926712D8b0F76C57040e0231C",
});
export const contractNFT = getContract({
  client,
  chain: defineChain(80002),
  address: "0x0ACF4163B7f15aB8c819D84caB1Ba8dE7B11ee81",
});

export const contractToken = getContract({
  client,
  chain: defineChain(80002),
  address: "0x57B7d19aEA073A893FA856f37957E7dbAcC6F9bC",
});

export const contractFactory = getContract({
  client,
  chain: defineChain(80002),
  address: "0xf6B28F7B5eFaB82Cf9bf9047ae6523828701Df9B",
});
