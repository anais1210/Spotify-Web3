import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { AlbumCreated } from "../generated/AlbumFactory/AlbumFactory";
import { Album, Artist, PlatformStats } from "../generated/schema";
import { HarmonyNFT } from "../generated/templates";

export function handleAlbumCreated(event: AlbumCreated): void {
  // Create or load the artist entity
  let artistId = event.params.artist;
  let artist = Artist.load(artistId);

  if (artist == null) {
    // Artist doesn't exist yet - create them
    // This shouldn't normally happen as ArtistAdded should fire first
    // But handle it for safety
    artist = new Artist(artistId);
    artist.address = artistId;
    artist.isActive = true; // They must be active to create an album
    artist.addedBy = null;
    artist.addedAt = null;
    artist.removedAt = null;
    artist.totalAlbums = BigInt.fromI32(0);
    artist.totalSongs = BigInt.fromI32(0);
    artist.createdAt = event.block.timestamp;
    artist.updatedAt = event.block.timestamp;

    // Update platform stats for new artist
    let stats = getOrCreatePlatformStats();
    stats.totalArtists = stats.totalArtists.plus(BigInt.fromI32(1));
    stats.save();
  }

  // Update artist stats
  artist.totalAlbums = artist.totalAlbums.plus(BigInt.fromI32(1));
  artist.updatedAt = event.block.timestamp;
  artist.save();

  // Create the album entity
  let albumId = event.params.albumAddress;
  let album = new Album(albumId);
  album.address = albumId;
  album.name = event.params.name;
  album.symbol = event.params.symbol;
  album.artist = artistId;
  album.totalSongs = BigInt.fromI32(0);
  album.createdAt = event.params.timestamp;
  album.createdAtBlock = event.block.number;
  album.transactionHash = event.transaction.hash;
  album.save();

  // Update platform stats
  let stats = getOrCreatePlatformStats();
  stats.totalAlbums = stats.totalAlbums.plus(BigInt.fromI32(1));
  stats.save();

  // Create a data source template to track this album's songs
  HarmonyNFT.create(event.params.albumAddress);
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
