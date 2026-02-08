import { ethers, upgrades } from "hardhat";
import fs from "fs";

async function deployContract(
  contractName: string,
  initArgs: any[],
  deployer: any,
) {
  const Factory = await ethers.getContractFactory(contractName);
  console.log(
    `Deploying ${contractName} contract with account: `,
    deployer.address,
  );
  const proxy = await upgrades.deployProxy(Factory, initArgs, {
    initializer: "initialize",
  });
  await proxy.waitForDeployment();
  const contractAddress = await proxy.getAddress();

  // Get properly typed contract instance
  const contract = await ethers.getContractAt(contractName, contractAddress);

  return { contract, contractAddress };
}
async function main() {
  const [deployer] = await ethers.getSigners();
  const artistAddress = process.env.ARTIST_ADDRESS;
  //=======================MANAGEMENT CONTRACT==================================================
  const { contract: management, contractAddress: managementAddress } =
    await deployContract("Management", [deployer.address], deployer);

  if (artistAddress) {
    await management.addArtist(artistAddress);
  } else {
    console.log("No ARTIST_ADDRESS in .env - skipping artist addition");
  }

  //=======================HARMONY CONTRACT==================================================
  const { contract: harmony, contractAddress: harmonyAddress } =
    await deployContract("Harmony", [deployer.address], deployer);
  //========================ALBUMFACTORY CONTRACT=================================================

  const { contract: albumFactory, contractAddress: albumFactoryAddress } =
    await deployContract("AlbumFactory", [managementAddress], deployer);

  const addresses = {
    management: managementAddress,
    harmony: harmonyAddress,
    albumFactory: albumFactoryAddress,
    deployer: deployer.address,
  };
  fs.writeFileSync(
    "deployedAddresses.json",
    JSON.stringify(addresses, null, 2),
  );
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
