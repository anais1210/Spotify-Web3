import { ethers, upgrades } from "hardhat";
import fs from "fs";

async function main() {
  const deployedAddress = JSON.parse(
    fs.readFileSync("deployedAddresses.json", "utf-8"),
  );
  const contractToUpgrade = process.env.UPGRADE_CONTRACT || "";
  if (!contractToUpgrade || !deployedAddress[contractToUpgrade]) {
    throw new Error("Please specify a valid UPGRADE_CONTRACT in .env file");
  }
  const proxyAddress = deployedAddress[contractToUpgrade];
  if (!proxyAddress) {
    throw new Error(
      `No deployed address found for contract: ${contractToUpgrade}`,
    );
  }
  console.log(`Upgrading ${contractToUpgrade} at address: ${proxyAddress}...`);

  const ContractFactory = await ethers.getContractFactory(contractToUpgrade);
  const upgradedContract = await upgrades.upgradeProxy(
    proxyAddress,
    ContractFactory,
  );
  await upgradedContract.waitForDeployment();
  const upgradedAddress = await upgradedContract.getAddress();
  console.log(
    `${contractToUpgrade} upgraded successfully to: ${upgradedAddress}`,
  );
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
