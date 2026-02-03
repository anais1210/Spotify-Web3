import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { ArtistAdded, ArtistRemoved } from "../generated/Management/Management";
import { Artist, ArtistEvent, PlatformStats } from "../generated/schema";

export function handleArtistAdded(event: ArtistAdded): void {
  let artistId = event.params.artist;

  // Create or update artist entity
  let artist = Artist.load(artistId);
  if (artist == null) {
    artist = new Artist(artistId);
    artist.address = artistId;
    artist.totalAlbums = BigInt.fromI32(0);
    artist.totalSongs = BigInt.fromI32(0);
    artist.createdAt = event.params.timestamp;
  }

  artist.isActive = true;
  artist.addedBy = event.params.addedBy;
  artist.addedAt = event.params.timestamp;
  artist.removedAt = null;
  artist.updatedAt = event.block.timestamp;
  artist.save();

  // Create artist event record
  let eventId = event.transaction.hash.concatI32(event.logIndex.toI32());
  let artistEvent = new ArtistEvent(eventId);
  artistEvent.artist = artistId;
  artistEvent.eventType = "ADDED";
  artistEvent.admin = event.params.addedBy;
  artistEvent.timestamp = event.params.timestamp;
  artistEvent.blockNumber = event.block.number;
  artistEvent.transactionHash = event.transaction.hash;
  artistEvent.save();

  // Update platform stats
  let stats = getOrCreatePlatformStats();
  stats.totalArtists = stats.totalArtists.plus(BigInt.fromI32(1));
  stats.save();
}

export function handleArtistRemoved(event: ArtistRemoved): void {
  let artistId = event.params.artist;

  // Update artist entity
  let artist = Artist.load(artistId);
  if (artist != null) {
    artist.isActive = false;
    artist.removedAt = event.params.timestamp;
    artist.updatedAt = event.block.timestamp;
    artist.save();
  }

  // Create artist event record
  let eventId = event.transaction.hash.concatI32(event.logIndex.toI32());
  let artistEvent = new ArtistEvent(eventId);
  artistEvent.artist = artistId;
  artistEvent.eventType = "REMOVED";
  artistEvent.admin = event.params.removedBy;
  artistEvent.timestamp = event.params.timestamp;
  artistEvent.blockNumber = event.block.number;
  artistEvent.transactionHash = event.transaction.hash;
  artistEvent.save();

  // Update platform stats
  let stats = getOrCreatePlatformStats();
  if (stats.totalArtists.gt(BigInt.fromI32(0))) {
    stats.totalArtists = stats.totalArtists.minus(BigInt.fromI32(1));
  }
  stats.save();
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
