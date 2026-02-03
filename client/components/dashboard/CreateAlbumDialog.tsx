"use client";
import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  X,
  Upload,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { uploadAlbumToPinata, setAlbumMetadataCache } from "@/lib/pinata";

interface CreateAlbumDialogProps {
  onCreateAlbum: (name: string, symbol: string) => void;
  isPending?: boolean;
  isConfirming?: boolean;
  isSuccess?: boolean;
  error?: Error | null;
  hash?: `0x${string}`;
  artistAddress?: string;
  onAlbumCreated?: (albumAddress: string) => void;
}

type UploadStep = "idle" | "uploading" | "creating" | "success" | "error";

function CreateAlbumDialog({
  onCreateAlbum,
  isPending = false,
  isConfirming = false,
  isSuccess = false,
  error,
  hash,
  artistAddress,
}: CreateAlbumDialogProps) {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [uploadStep, setUploadStep] = useState<UploadStep>("idle");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [pendingMetadataUri, setPendingMetadataUri] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);

  // Reset form function - defined early so it can be used in effects
  const resetForm = () => {
    setName("");
    setSymbol("");
    setDescription("");
    setCoverImage(null);
    setCoverPreview(null);
    setUploadStep("idle");
    setUploadError(null);
    setPendingMetadataUri(null);
  };

  // Handle cover image preview
  useEffect(() => {
    if (coverImage) {
      const url = URL.createObjectURL(coverImage);
      setCoverPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setCoverPreview(null);
    }
  }, [coverImage]);

  // Handle success - show success message then close
  useEffect(() => {
    if (isSuccess && hash) {
      const showTimer = setTimeout(() => setUploadStep("success"), 0);
      const closeTimer = setTimeout(() => {
        setOpen(false);
        resetForm();
      }, 3000);
      return () => {
        clearTimeout(showTimer);
        clearTimeout(closeTimer);
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, hash]);

  // Handle contract error
  useEffect(() => {
    if (error) {
      setUploadStep("error");
      setUploadError(
        error.message?.includes("User rejected")
          ? "Transaction rejected by user"
          : "Failed to create album"
      );
    }
  }, [error]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !symbol || !coverImage) return;

    setUploadStep("uploading");
    setUploadError(null);

    try {
      // Upload album metadata to IPFS
      const metadataUri = await uploadAlbumToPinata({
        coverImage,
        name,
        symbol: symbol.toUpperCase(),
        description: description || undefined,
        artistAddress,
      });

      setPendingMetadataUri(metadataUri);
      setUploadStep("creating");

      // Create album on blockchain
      onCreateAlbum(name, symbol.toUpperCase());
    } catch (err) {
      setUploadStep("error");
      setUploadError(
        err instanceof Error ? err.message : "Failed to upload to IPFS"
      );
    }
  };

  // Save metadata URI to cache when album is created successfully
  useEffect(() => {
    if (isSuccess && hash && pendingMetadataUri) {
      // We'll need to get the album address from logs or subgraph
      // For now, we store it with the transaction hash as key temporarily
      // The actual mapping will happen when we fetch the album from subgraph
      const pendingKey = `pending_${hash}`;
      setAlbumMetadataCache(pendingKey, pendingMetadataUri);
    }
  }, [isSuccess, hash, pendingMetadataUri]);

  const isLoading = uploadStep === "uploading" || isPending || isConfirming;
  const canSubmit = name && symbol && coverImage && !isLoading && uploadStep !== "success";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <Plus className="w-4 h-4 mr-2" />
          Create Album
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 text-white border-2 border-zinc-600 shadow-2xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">Create New Album</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Create a new album NFT collection with cover art stored on IPFS.
          </DialogDescription>
        </DialogHeader>

        {/* Success State */}
        {uploadStep === "success" ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Album Created!</h3>
            <p className="text-sm text-zinc-400 mb-4">
              Your album has been successfully created on the blockchain.
            </p>
            {hash && (
              <a
                href={`https://sepolia.etherscan.io/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-sm hover:underline"
              >
                View transaction on Etherscan
              </a>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* Error Display */}
            {uploadStep === "error" && uploadError && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm">{uploadError}</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setUploadStep("idle");
                    setUploadError(null);
                  }}
                  className="ml-auto text-red-400 hover:text-red-300"
                >
                  Try again
                </Button>
              </div>
            )}

            {/* Cover Image Upload */}
            <div>
              <label className="text-sm font-medium mb-2 block text-zinc-300">
                Album Cover <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                ref={imageInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
                disabled={isLoading}
                aria-label="Upload album cover"
              />
              {coverPreview ? (
                <div className="relative w-32 h-32">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverPreview}
                    alt="Album cover preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setCoverImage(null)}
                    disabled={isLoading}
                    className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-zinc-800 rounded-full text-zinc-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={isLoading}
                  className="w-32 h-32 bg-transparent border-zinc-700 border-dashed text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-primary"
                >
                  <div className="flex flex-col items-center gap-1">
                    <ImageIcon className="w-6 h-6" />
                    <span className="text-xs">Add cover</span>
                  </div>
                </Button>
              )}
            </div>

            {/* Album Name */}
            <div>
              <label className="text-sm font-medium mb-2 block text-zinc-300">
                Album Name <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="My Awesome Album"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-primary"
              />
            </div>

            {/* Symbol */}
            <div>
              <label className="text-sm font-medium mb-2 block text-zinc-300">
                Symbol <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="ALBUM"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                maxLength={5}
                disabled={isLoading}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-primary uppercase"
              />
              <p className="text-xs text-zinc-500 mt-1">
                Short identifier (3-5 characters)
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium mb-2 block text-zinc-300">
                Description
              </label>
              <Input
                placeholder="Describe your album..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-primary"
              />
            </div>

            {/* Transaction Status */}
            {isLoading && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/30">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
                <div>
                  <p className="text-sm font-medium text-white">
                    {uploadStep === "uploading"
                      ? "Uploading to IPFS..."
                      : isPending
                      ? "Waiting for wallet confirmation..."
                      : "Confirming transaction..."}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {uploadStep === "uploading"
                      ? "Storing your album cover on IPFS"
                      : isPending
                      ? "Please confirm the transaction in your wallet"
                      : "This may take a few seconds"}
                  </p>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={!canSubmit}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {uploadStep === "uploading"
                    ? "Uploading..."
                    : isPending
                    ? "Confirm in Wallet..."
                    : "Creating..."}
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Create Album
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default CreateAlbumDialog;
