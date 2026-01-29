import { expect } from "chai";
import hre, { ethers, upgrades } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("AlbumFactory Contract", function () {
  async function deployBothContracts() {
    const [admin, artist, listener, addr1, addr2] = await ethers.getSigners();

    // Deploy Management
    const Management = await hre.ethers.getContractFactory("Management");
    const management = await upgrades.deployProxy(Management, [admin.address], {
      initializer: "initialize",
    });

    // Deploy AlbumFactory
    const AlbumFactory = await hre.ethers.getContractFactory("AlbumFactory");
    const albumFactory = await upgrades.deployProxy(
      AlbumFactory,
      [management.target],
      {
        initializer: "initialize",
      },
    );

    // Grant ARTIST role to artist
    await management.connect(admin).addArtist(artist.address);

    return { admin, artist, listener, addr1, addr2, management, albumFactory };
  }

  async function deployWithAlbum() {
    const { artist, listener, addr1, addr2, management, albumFactory } =
      await loadFixture(deployBothContracts);

    // Create an album
    await albumFactory.connect(artist).createAlbum("MANTRA", "MTR");

    // Get the album contract (cast to any for TypeScript)
    const albums = await albumFactory._getDeployedAlbums();
    const HarmonyNFTFactory = await ethers.getContractFactory("HarmonyNFT");
    const album = HarmonyNFTFactory.attach(albums[0]) as any;

    return { artist, listener, addr1, addr2, management, albumFactory, album };
  }
  async function deployWithMintedNFT() {
    const { artist, listener, addr1, addr2, album } = await loadFixture(
      deployWithAlbum,
    );
    await album.connect(artist).safeMint(listener.address, "ipfs://QmTrack1");
    return { artist, listener, addr1, addr2, album };
  }

  describe("Album Creation", function () {
    it("Should allow artist to create an album", async function () {
      const { albumFactory, artist } = await loadFixture(deployBothContracts);

      await albumFactory.connect(artist).createAlbum("MANTRA", "MTR");

      const albums = await albumFactory._getDeployedAlbums();
      expect(albums).to.have.length(1);
    });

    it("Should set artist as album owner", async function () {
      const { albumFactory, artist } = await loadFixture(deployBothContracts);

      await albumFactory.connect(artist).createAlbum("MANTRA", "MTR");

      const albums = await albumFactory._getDeployedAlbums();
      const HarmonyNFTFactory = await ethers.getContractFactory("HarmonyNFT");
      const album = HarmonyNFTFactory.attach(albums[0]) as any;

      expect(await album.owner()).to.equal(artist.address);
    });

    it("Should set correct name and symbol", async function () {
      const { albumFactory, artist } = await loadFixture(deployBothContracts);

      await albumFactory.connect(artist).createAlbum("MANTRA", "MTR");

      const albums = await albumFactory._getDeployedAlbums();
      const HarmonyNFTFactory = await ethers.getContractFactory("HarmonyNFT");
      const album = HarmonyNFTFactory.attach(albums[0]) as any;

      expect(await album.name()).to.equal("MANTRA");
      expect(await album.symbol()).to.equal("MTR");
    });

    it("Should allow artist to create multiple albums", async function () {
      const { albumFactory, artist } = await loadFixture(deployBothContracts);

      await albumFactory.connect(artist).createAlbum("Album 1", "ALB1");
      await albumFactory.connect(artist).createAlbum("Album 2", "ALB2");
      await albumFactory.connect(artist).createAlbum("Album 3", "ALB3");

      const albums = await albumFactory._getDeployedAlbums();
      expect(albums).to.have.length(3);
    });

    it("Should not allow non-artist to create album", async function () {
      const { albumFactory, listener } = await loadFixture(deployBothContracts);

      await expect(
        albumFactory.connect(listener).createAlbum("UNAUTHORIZED", "UNAUTH"),
      ).to.be.revertedWith("Only artists can create albums");
    });
  });

  describe("Song Minting", function () {
    it("Should allow album owner to mint a song", async function () {
      const { artist, listener, album } = await loadFixture(deployWithAlbum);

      const songURI = "ipfs://QmSong1Metadata";
      await album.connect(artist).safeMint(listener.address, songURI);

      expect(await album.ownerOf(0)).to.equal(listener.address);
    });

    it("Should store correct token URI", async function () {
      const { artist, listener, album } = await loadFixture(deployWithAlbum);

      const songURI = "ipfs://QmSong1Metadata";
      await album.connect(artist).safeMint(listener.address, songURI);

      expect(await album.tokenURI(0)).to.equal(songURI);
    });

    it("Should mint multiple songs with correct token IDs", async function () {
      const { artist, listener, addr2, album } = await loadFixture(
        deployWithAlbum,
      );

      const song1URI = "ipfs://QmSong1";
      const song2URI = "ipfs://QmSong2";
      const song3URI = "ipfs://QmSong3";

      await album.connect(artist).safeMint(listener.address, song1URI);
      await album.connect(artist).safeMint(listener.address, song2URI);
      await album.connect(artist).safeMint(addr2.address, song3URI);

      expect(await album.ownerOf(0)).to.equal(listener.address);
      expect(await album.ownerOf(1)).to.equal(listener.address);
      expect(await album.ownerOf(2)).to.equal(addr2.address);

      expect(await album.tokenURI(0)).to.equal(song1URI);
      expect(await album.tokenURI(1)).to.equal(song2URI);
      expect(await album.tokenURI(2)).to.equal(song3URI);
    });

    it("Should not allow non-owner to mint songs", async function () {
      const { listener, album } = await loadFixture(deployWithAlbum);

      await expect(
        album.connect(listener).safeMint(listener.address, "ipfs://QmSong"),
      ).to.be.revertedWithCustomError(album, "OwnableUnauthorizedAccount");
    });

    it("Should return correct token ID when minting", async function () {
      const { artist, listener, album } = await loadFixture(deployWithAlbum);

      const tx = await album
        .connect(artist)
        .safeMint(listener.address, "ipfs://QmSong1");
      const receipt = await tx.wait();

      // Check Transfer event for token ID
      const transferEvent = receipt?.logs.find((log: any) => {
        try {
          return album.interface.parseLog(log)?.name === "Transfer";
        } catch {
          return false;
        }
      });

      const parsedEvent = album.interface.parseLog(transferEvent);
      expect(parsedEvent?.args.tokenId).to.equal(0n);
    });
  });

  describe("Full Flow", function () {
    it("Should complete full album creation and song minting flow", async function () {
      const { artist, listener, management, albumFactory } = await loadFixture(
        deployBothContracts,
      );

      // 1. Verify artist has ARTIST_ROLE
      expect(await management.isArtist(artist.address)).to.be.true;

      // 2. Artist creates album
      await albumFactory.connect(artist).createAlbum("My First Album", "MFA");

      // 3. Get album contract
      const albums = await albumFactory._getDeployedAlbums();
      const HarmonyNFTFactory = await ethers.getContractFactory("HarmonyNFT");
      const album = HarmonyNFTFactory.attach(albums[0]) as any;

      // 4. Verify album metadata
      expect(await album.name()).to.equal("My First Album");
      expect(await album.owner()).to.equal(artist.address);

      // 5. Artist mints songs to listeners
      await album.connect(artist).safeMint(listener.address, "ipfs://QmTrack1");
      await album.connect(artist).safeMint(listener.address, "ipfs://QmTrack2");

      // 6. Verify listeners own the songs
      expect(await album.balanceOf(listener.address)).to.equal(2n);
      expect(await album.tokenURI(0)).to.equal("ipfs://QmTrack1");
      expect(await album.tokenURI(1)).to.equal("ipfs://QmTrack2");
    });
  });
  describe("NFT Operations", function () {
    it("Should transfer NFT between addresses", async function () {
      const { listener, addr1, album } = await loadFixture(deployWithMintedNFT);
      // listener already owns token ID 0 then he transfer it to addr1
      await album
        .connect(listener)
        .transferFrom(listener.address, addr1.address, 0);
      expect(await album.ownerOf(0)).to.equal(addr1.address);
    });
    it("Should approve and transferFrom NFT", async function () {
      // delegate transfer to addr1 by listener
      const { artist, listener, addr1, album } = await loadFixture(
        deployWithMintedNFT,
      );
      // listener owns token 0, approves addr1
      await album.connect(listener).approve(addr1.address, 0);
      //
      await album
        .connect(addr1)
        .transferFrom(listener.address, addr1.address, 0);
      expect(await album.ownerOf(0)).to.equal(addr1.address);
      // now addr1 approves artist to transfer
      await album.connect(addr1).approve(artist.address, 0);
      await album
        .connect(artist)
        .transferFrom(addr1.address, artist.address, 0);
      expect(await album.ownerOf(0)).to.equal(artist.address);
    });
    it("Should transfer ownership of the album contract", async function () {
      const { artist, addr1, album } = await loadFixture(deployWithMintedNFT);
      await album.connect(artist).transferOwnership(addr1.address);
      expect(await album.owner()).to.equal(addr1.address);
    });
  });
});
