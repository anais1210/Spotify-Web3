import { expect } from "chai";
import hre, { ethers, upgrades } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("Management Contract", function () {
  async function deployManagementContract() {
    const [admin, artist, addr1, addr2] = await ethers.getSigners();

    const Management = await hre.ethers.getContractFactory("Management");
    const management = await upgrades.deployProxy(Management, [admin.address], {
      initializer: "initialize",
    });

    return { admin, artist, addr1, addr2, management };
  }
  it("Should verify admin role", async function () {
    const { management, admin } = await loadFixture(deployManagementContract);
    expect(
      await management.hasRole(await management.ADMIN_ROLE(), admin.address),
    ).to.equal(true);
  });
  it("Should add new Artist", async function () {
    const { management, admin, artist, addr1 } = await loadFixture(
      deployManagementContract,
    );
    await (management.connect(admin) as typeof management).addArtist(
      artist.address,
    );
    await (management.connect(admin) as typeof management).addArtist(
      addr1.address,
    );
    expect(await management.isArtist(artist.address)).to.equal(true);
    expect(await management.isArtist(addr1.address)).to.equal(true);
  });
  it("Should not add new artist as non-admin", async function () {
    const { management, artist, addr1 } = await loadFixture(
      deployManagementContract,
    );

    await expect(
      management.connect(addr1).addArtist(artist.address),
    ).to.be.revertedWithCustomError(
      management,
      "AccessControlUnauthorizedAccount",
    );
  });
  it("Should check isAdmin function", async function () {
    const { management, admin } = await loadFixture(deployManagementContract);
    expect(await management.isAdmin(admin.address)).to.equal(true);
  });
  it("Should remove Artist", async function () {
    const { management, admin, artist } = await loadFixture(
      deployManagementContract,
    );
    await (management.connect(admin) as typeof management).addArtist(
      artist.address,
    );
    expect(await management.isArtist(artist.address)).to.equal(true);
    await (management.connect(admin) as typeof management).removeArtist(
      artist.address,
    );
    expect(await management.isArtist(artist.address)).to.equal(false);
  });
});
