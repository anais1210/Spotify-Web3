import { gql } from "@apollo/client";

// Get all albums with their artists
export const GET_ALBUMS = gql`
  query GetAlbums($first: Int!, $skip: Int!, $orderBy: Album_orderBy, $orderDirection: OrderDirection) {
    albums(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      address
      name
      symbol
      totalSongs
      createdAt
      artist {
        id
        address
      }
    }
  }
`;

// Get a single album by address
export const GET_ALBUM = gql`
  query GetAlbum($id: ID!) {
    album(id: $id) {
      id
      address
      name
      symbol
      totalSongs
      createdAt
      transactionHash
      artist {
        id
        address
        totalAlbums
        totalSongs
      }
      songs {
        id
        tokenId
        uri
        owner
        createdAt
      }
    }
  }
`;

// Get songs by owner (for collection page)
export const GET_SONGS_BY_OWNER = gql`
  query GetSongsByOwner($owner: Bytes!, $first: Int!, $skip: Int!) {
    songs(where: { owner: $owner }, first: $first, skip: $skip, orderBy: createdAt, orderDirection: desc) {
      id
      tokenId
      uri
      owner
      createdAt
      album {
        id
        address
        name
        symbol
        artist {
          id
          address
        }
      }
    }
  }
`;

// Get artist profile with their albums
export const GET_ARTIST = gql`
  query GetArtist($id: ID!) {
    artist(id: $id) {
      id
      address
      totalAlbums
      totalSongs
      createdAt
      albums {
        id
        address
        name
        symbol
        totalSongs
        createdAt
      }
    }
  }
`;

// Get platform stats
export const GET_PLATFORM_STATS = gql`
  query GetPlatformStats {
    platformStats(id: "platform") {
      totalArtists
      totalAlbums
      totalSongs
      totalTransfers
    }
  }
`;

// Get recent songs (for landing page featured)
export const GET_RECENT_SONGS = gql`
  query GetRecentSongs($first: Int!) {
    songs(first: $first, orderBy: createdAt, orderDirection: desc) {
      id
      tokenId
      uri
      owner
      createdAt
      album {
        id
        address
        name
        artist {
          id
          address
        }
      }
    }
  }
`;

// Get albums by artist
export const GET_ALBUMS_BY_ARTIST = gql`
  query GetAlbumsByArtist($artist: Bytes!, $first: Int!, $skip: Int!) {
    albums(where: { artist: $artist }, first: $first, skip: $skip, orderBy: createdAt, orderDirection: desc) {
      id
      address
      name
      symbol
      totalSongs
      createdAt
      songs {
        id
        tokenId
        uri
        owner
      }
    }
  }
`;

// Search albums by name
export const SEARCH_ALBUMS = gql`
  query SearchAlbums($searchTerm: String!, $first: Int!) {
    albums(where: { name_contains_nocase: $searchTerm }, first: $first) {
      id
      address
      name
      symbol
      totalSongs
      createdAt
      artist {
        id
        address
      }
    }
  }
`;

// Get all artists (for admin page)
export const GET_ALL_ARTISTS = gql`
  query GetAllArtists($first: Int!, $skip: Int!) {
    artists(first: $first, skip: $skip, orderBy: createdAt, orderDirection: desc) {
      id
      address
      isActive
      addedBy
      addedAt
      removedAt
      totalAlbums
      totalSongs
      createdAt
      updatedAt
    }
  }
`;

// Get artist events history
export const GET_ARTIST_EVENTS = gql`
  query GetArtistEvents($first: Int!, $skip: Int!) {
    artistEvents(first: $first, skip: $skip, orderBy: timestamp, orderDirection: desc) {
      id
      eventType
      artist {
        id
        address
      }
      triggeredBy
      timestamp
      transactionHash
    }
  }
`;
