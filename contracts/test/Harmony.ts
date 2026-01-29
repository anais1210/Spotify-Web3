import { expect } from "chai";
import hre, { ethers, upgrades } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("Harmony Contract", function () {
  async function deployHarmonyContract() {
    const [admin, artist, addr1, addr2] = await ethers.getSigners();

    const Harmony = await hre.ethers.getContractFactory("Harmony");
    const harmony = await upgrades.deployProxy(Harmony, [admin.address], {
      initializer: "initialize",
    });

    return { admin, artist, addr1, addr2, harmony };
  }

  it("Should mint tokens to artist", async function () {
    const { harmony, admin, artist } = await loadFixture(deployHarmonyContract);
    await (harmony.connect(admin) as typeof harmony).mint(artist.address, 1000);
    expect(await harmony.balanceOf(artist.address)).to.equal(1000);
  });
  it("Should verify token name and symbol", async function () {
    const { harmony } = await loadFixture(deployHarmonyContract);
    expect(await harmony.name()).to.equal("HARMONY");
    expect(await harmony.symbol()).to.equal("MONY");
  });
  it("Should burn own tokens", async function () {
    const { harmony, admin, addr1 } = await loadFixture(deployHarmonyContract);
    await harmony.connect(addr1).mint(addr1, 1000);
    await harmony.connect(addr1).burn(500);
    expect(await harmony.balanceOf(addr1)).to.equal(500);
  });
  it("Should burnFrom with allowance", async function () {
    const { harmony, addr1, admin } = await loadFixture(deployHarmonyContract);
    await harmony.connect(addr1).mint(addr1, 1000);
    await harmony.connect(addr1).approve(admin.address, 500);
    await harmony.connect(admin).burnFrom(addr1.address, 500);
    expect(await harmony.balanceOf(addr1)).to.equal(500);
  });
  it("Should transfer tokens between accounts", async function () {
    const { harmony, addr1, addr2 } = await loadFixture(deployHarmonyContract);
    await harmony.connect(addr1).mint(addr1, 1000);
    await harmony.connect(addr2).mint(addr2, 1000);
    await harmony.connect(addr1).transfer(addr2.address, 500);
    expect(await harmony.balanceOf(addr1.address)).to.equal(500);
    expect(await harmony.balanceOf(addr2.address)).to.equal(1500);
  });
});
