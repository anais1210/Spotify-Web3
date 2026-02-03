import { BigInt, Bytes, dataSource } from "@graphprotocol/graph-ts";
import { SongMinted, Transfer } from "../generated/templates/HarmonyNFT/HarmonyNFT";
import { Song, Album, Artist, Transfer as TransferEntity, PlatformStats } from "../generated/schema";

export function handleSongMinted(event: SongMinted): void {
  let albumAddress = dataSource.address();
  let songId = albumAddress.toHexString() + "-" + event.params.tokenId.toString();

  // Create the song entity
  let song = new Song(songId);
  song.tokenId = event.params.tokenId;
  song.album = albumAddress;
  song.owner = event.params.to;
  song.uri = event.params.uri;
  song.createdAt = event.params.timestamp;
  song.createdAtBlock = event.block.number;
  song.transactionHash = event.transaction.hash;
  song.save();

  // Update album stats
  let album = Album.load(albumAddress);
  if (album != null) {
    album.totalSongs = album.totalSongs.plus(BigInt.fromI32(1));
    album.save();

    // Update artist stats
    let artist = Artist.load(album.artist);
    if (artist != null) {
      artist.totalSongs = artist.totalSongs.plus(BigInt.fromI32(1));
      artist.updatedAt = event.block.timestamp;
      artist.save();
    }
  }

  // Update platform stats
  let stats = getOrCreatePlatformStats();
  stats.totalSongs = stats.totalSongs.plus(BigInt.fromI32(1));
  stats.save();
}

export function handleTransfer(event: Transfer): void {
  let albumAddress = dataSource.address();

  // Create transfer record
  let transferId = event.transaction.hash.concatI32(event.logIndex.toI32());
  let transfer = new TransferEntity(transferId);
  transfer.album = albumAddress;
  transfer.tokenId = event.params.tokenId;
  transfer.from = event.params.from;
  transfer.to = event.params.to;
  transfer.blockNumber = event.block.number;
  transfer.blockTimestamp = event.block.timestamp;
  transfer.transactionHash = event.transaction.hash;
  transfer.save();

  // Update song owner (only if not a mint - from != 0x0)
  let zeroAddress = Bytes.fromHexString("0x0000000000000000000000000000000000000000");
  if (event.params.from != zeroAddress) {
    let songId = albumAddress.toHexString() + "-" + event.params.tokenId.toString();
    let song = Song.load(songId);
    if (song != null) {
      song.owner = event.params.to;
      song.save();
    }

    // Update platform stats for transfers
    let stats = getOrCreatePlatformStats();
    stats.totalTransfers = stats.totalTransfers.plus(BigInt.fromI32(1));
    stats.save();
  }
}

function getOrCreatePlatformStats(): PlatformStats {
  let stats = PlatformStats.load("platform");
  if (stats == null) {
    stats = new PlatformStats("platform");
    stats.totalArtists = BigInt.fromI32(0);
    stats.totalAlbums = BigInt.fromI32(0);
    stats.totalSongs = BigInt.fromI32(0);
    stats.totalTransfers = BigInt.fromI32(0);
  }
  return stats;
}
