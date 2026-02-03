// Pinata IPFS Service
// Docs: https://docs.pinata.cloud/

const PINATA_API_URL = "https://api.pinata.cloud";

// Get API keys from environment variables
const getApiKey = () => process.env.NEXT_PUBLIC_PINATA_API_KEY;
const getApiSecret = () => process.env.NEXT_PUBLIC_PINATA_API_SECRET;

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
  name?: string
): Promise<string> {
  const apiKey = getApiKey();
  const apiSecret = getApiSecret();

  if (!apiKey || !apiSecret) {
    throw new Error(
      "Pinata API keys not configured. Please set NEXT_PUBLIC_PINATA_API_KEY and NEXT_PUBLIC_PINATA_API_SECRET in your .env.local file."
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
  name: string
): Promise<string> {
  const apiKey = getApiKey();
  const apiSecret = getApiSecret();

  if (!apiKey || !apiSecret) {
    throw new Error(
      "Pinata API keys not configured. Please set NEXT_PUBLIC_PINATA_API_KEY and NEXT_PUBLIC_PINATA_API_SECRET in your .env.local file."
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

// Full upload flow: audio file -> cover image -> metadata -> return metadata URI
export async function uploadSongToPinata(params: {
  audioFile: File;
  coverImage?: File;
  name: string;
  description: string;
  artistName?: string;
  albumName?: string;
  duration?: number;
  genre?: string;
}): Promise<string> {
  const {
    audioFile,
    coverImage,
    name,
    description,
    artistName,
    albumName,
    duration,
    genre,
  } = params;

  // 1. Upload audio file
  const audioUri = await uploadFileToPinata(audioFile, `${name}-audio`);

  // 2. Upload cover image if provided
  let imageUri = "";
  if (coverImage) {
    imageUri = await uploadFileToPinata(coverImage, `${name}-cover`);
  }

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
    image: imageUri || "ipfs://QmdefaultImageHash", // Default placeholder if no image
    animation_url: audioUri,
    attributes,
  };

  // 5. Upload metadata
  const metadataUri = await uploadMetadataToPinata(metadata, name);

  return metadataUri;
}

// Convert IPFS URI to HTTP gateway URL for display
export function ipfsToHttp(ipfsUri: string): string {
  if (!ipfsUri) return "";
  if (ipfsUri.startsWith("ipfs://")) {
    const cid = ipfsUri.replace("ipfs://", "");
    return `https://gateway.pinata.cloud/ipfs/${cid}`;
  }
  return ipfsUri;
}
