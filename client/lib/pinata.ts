// Pinata IPFS Service
// Docs: https://docs.pinata.cloud/

const PINATA_API_URL = "https://api.pinata.cloud";

// Get API keys from environment variables
const getApiKey = () => process.env.NEXT_PUBLIC_PINATA_API_KEY;
const getApiSecret = () => process.env.NEXT_PUBLIC_PINATA_API_SECRET;
const getPinataGateway = () =>
  process.env.NEXT_PUBLIC_PINATA_GATEWAY || "gateway.pinata.cloud";

export interface SongMetadata {
  name: string;
  description: string;
  image: string; // IPFS URI for cover image
  animation_url: string; // IPFS URI for audio file
  attributes: {
    trait_type: string;
    value: string | number;
  }[];
  external_url?: string;
}

export interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

// Upload a file to Pinata
export async function uploadFileToPinata(
  file: File,
  name?: string,
): Promise<string> {
  const apiKey = getApiKey();
  const apiSecret = getApiSecret();

  if (!apiKey || !apiSecret) {
    throw new Error(
      "Pinata API keys not configured. Please set NEXT_PUBLIC_PINATA_API_KEY and NEXT_PUBLIC_PINATA_API_SECRET in your .env.local file.",
    );
  }

  const formData = new FormData();
  formData.append("file", file);

  const metadata = JSON.stringify({
    name: name || file.name,
  });
  formData.append("pinataMetadata", metadata);

  const options = JSON.stringify({
    cidVersion: 1,
  });
  formData.append("pinataOptions", options);

  const response = await fetch(`${PINATA_API_URL}/pinning/pinFileToIPFS`, {
    method: "POST",
    headers: {
      pinata_api_key: apiKey,
      pinata_secret_api_key: apiSecret,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to upload file to Pinata");
  }

  const data: PinataResponse = await response.json();
  return `ipfs://${data.IpfsHash}`;
}

// Upload JSON metadata to Pinata
export async function uploadMetadataToPinata(
  metadata: SongMetadata,
  name: string,
): Promise<string> {
  const apiKey = getApiKey();
  const apiSecret = getApiSecret();

  if (!apiKey || !apiSecret) {
    throw new Error(
      "Pinata API keys not configured. Please set NEXT_PUBLIC_PINATA_API_KEY and NEXT_PUBLIC_PINATA_API_SECRET in your .env.local file.",
    );
  }

  const response = await fetch(`${PINATA_API_URL}/pinning/pinJSONToIPFS`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      pinata_api_key: apiKey,
      pinata_secret_api_key: apiSecret,
    },
    body: JSON.stringify({
      pinataContent: metadata,
      pinataMetadata: {
        name: `${name}-metadata.json`,
      },
      pinataOptions: {
        cidVersion: 1,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to upload metadata to Pinata");
  }

  const data: PinataResponse = await response.json();
  return `ipfs://${data.IpfsHash}`;
}

// Full upload flow: audio file -> metadata -> return metadata URI
// Songs always use the album's cover image
export async function uploadSongToPinata(params: {
  audioFile: File;
  albumCoverUri?: string; // IPFS URI of album cover
  name: string;
  description: string;
  artistName?: string;
  albumName?: string;
  duration?: number;
  genre?: string;
}): Promise<string> {
  const {
    audioFile,
    albumCoverUri,
    name,
    description,
    artistName,
    albumName,
    duration,
    genre,
  } = params;

  // 1. Upload audio file
  const audioUri = await uploadFileToPinata(audioFile, `${name}-audio`);

  // 2. Use album cover for song image
  const imageUri = albumCoverUri || "";

  // 3. Build attributes array
  const attributes: { trait_type: string; value: string | number }[] = [];

  if (artistName) {
    attributes.push({ trait_type: "Artist", value: artistName });
  }
  if (albumName) {
    attributes.push({ trait_type: "Album", value: albumName });
  }
  if (genre) {
    attributes.push({ trait_type: "Genre", value: genre });
  }
  if (duration) {
    attributes.push({ trait_type: "Duration", value: duration });
  }

  // 4. Create metadata following NFT standard
  const metadata: SongMetadata = {
    name,
    description,
    image: imageUri, // Uses song cover, album cover, or empty
    animation_url: audioUri,
    attributes,
  };

  // 5. Upload metadata
  const metadataUri = await uploadMetadataToPinata(metadata, name);

  return metadataUri;
}

// Validate IPFS URI has a valid CID (basic check)
export function isValidIpfsUri(uri: string): boolean {
  if (!uri || typeof uri !== "string") return false;
  if (!uri.startsWith("ipfs://")) return false;
  const cid = uri.replace("ipfs://", "").trim();
  // CID should be at least 46 characters (CIDv0) or start with 'b' for CIDv1
  return cid.length >= 46 || (cid.startsWith("b") && cid.length >= 32);
}

// Convert IPFS URI to HTTP gateway URL for display
export function ipfsToHttp(ipfsUri: string): string {
  if (!ipfsUri) return "";
  if (ipfsUri.startsWith("ipfs://")) {
    const cid = ipfsUri.replace("ipfs://", "").trim();
    // Don't return a URL if the CID is empty or too short
    if (!cid || cid.length < 32) {
      console.warn("[Pinata] Invalid CID (too short):", cid);
      return "";
    }
    const gateway = getPinataGateway();
    const url = `https://${gateway}/ipfs/${cid}`;
    return url;
  }
  return ipfsUri;
}

// Fetch metadata from IPFS
export async function fetchMetadataFromIPFS(
  uri: string,
): Promise<SongMetadata | null> {
  try {
    const httpUrl = ipfsToHttp(uri);
    const response = await fetch(httpUrl);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

// Cache for album metadata (stored in localStorage)
const ALBUM_METADATA_KEY = "album_metadata_cache";

export function getAlbumMetadataCache(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const cache = localStorage.getItem(ALBUM_METADATA_KEY);
    return cache ? JSON.parse(cache) : {};
  } catch {
    return {};
  }
}

export function setAlbumMetadataCache(
  albumAddress: string,
  metadataUri: string,
): void {
  if (typeof window === "undefined") return;
  try {
    const cache = getAlbumMetadataCache();
    cache[albumAddress.toLowerCase()] = metadataUri;
    localStorage.setItem(ALBUM_METADATA_KEY, JSON.stringify(cache));
  } catch {
    // Ignore localStorage errors
  }
}

export function getAlbumMetadataUri(albumAddress: string): string | null {
  const cache = getAlbumMetadataCache();
  return cache[albumAddress.toLowerCase()] || null;
}

// Album metadata interface
export interface AlbumMetadata {
  name: string;
  description: string;
  image: string;
  symbol: string;
  artistAddress?: string;
}

// Upload album metadata to IPFS
export async function uploadAlbumToPinata(params: {
  coverImage: File;
  name: string;
  symbol: string;
  description?: string;
  artistAddress?: string;
}): Promise<string> {
  const { coverImage, name, symbol, description, artistAddress } = params;

  // 1. Upload cover image
  const imageUri = await uploadFileToPinata(coverImage, `${name}-album-cover`);

  // 2. Create album metadata
  const metadata: AlbumMetadata = {
    name,
    symbol,
    description: description || `${name} - Music Album`,
    image: imageUri,
    artistAddress,
  };

  // 3. Upload metadata
  const apiKey = getApiKey();
  const apiSecret = getApiSecret();

  if (!apiKey || !apiSecret) {
    throw new Error("Pinata API keys not configured.");
  }

  const response = await fetch(`${PINATA_API_URL}/pinning/pinJSONToIPFS`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      pinata_api_key: apiKey,
      pinata_secret_api_key: apiSecret,
    },
    body: JSON.stringify({
      pinataContent: metadata,
      pinataMetadata: {
        name: `${name}-album-metadata.json`,
      },
      pinataOptions: {
        cidVersion: 1,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to upload album metadata");
  }

  const data: PinataResponse = await response.json();
  return `ipfs://${data.IpfsHash}`;
}

// Search Pinata for album metadata by name
async function searchPinataForAlbumMetadata(
  albumName: string,
): Promise<string | null> {
  const apiKey = getApiKey();
  const apiSecret = getApiSecret();

  if (!apiKey || !apiSecret) return null;

  try {
    // Search for pins with matching name pattern
    const searchName = `${albumName}-album-metadata.json`;
    const response = await fetch(
      `${PINATA_API_URL}/data/pinList?metadata[name]=${encodeURIComponent(searchName)}&status=pinned`,
      {
        headers: {
          pinata_api_key: apiKey,
          pinata_secret_api_key: apiSecret,
        },
      },
    );

    if (!response.ok) return null;

    const data = await response.json();
    if (data.rows && data.rows.length > 0) {
      // Return the first matching pin's IPFS hash
      return `ipfs://${data.rows[0].ipfs_pin_hash}`;
    }
    return null;
  } catch {
    return null;
  }
}

// Fetch album metadata - tries cache first, then searches Pinata
export async function fetchAlbumMetadata(
  albumAddress: string,
  albumName?: string,
): Promise<AlbumMetadata | null> {
  // Try cache first
  let uri = getAlbumMetadataUri(albumAddress);

  // If not in cache and we have an album name, search Pinata
  if (!uri && albumName) {
    uri = await searchPinataForAlbumMetadata(albumName);
    // Cache it for future use
    if (uri) {
      setAlbumMetadataCache(albumAddress, uri);
    }
  }

  if (!uri) {
    return null;
  }

  try {
    const httpUrl = ipfsToHttp(uri);
    const response = await fetch(httpUrl);
    if (!response.ok) {
      return null;
    }
    const metadata = await response.json();
    return metadata;
  } catch (error) {
    return null;
  }
}
