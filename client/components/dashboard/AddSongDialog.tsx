"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMintSong } from "@/hooks/useMintSong";
import { uploadSongToPinata } from "@/lib/pinata";
import {
  Music,
  Loader2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Upload,
  Image as ImageIcon,
  FileAudio,
  X,
} from "lucide-react";

interface AddSongDialogProps {
  albumName: string;
  albumAddress: string;
  artistName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

type UploadStep = "idle" | "uploading" | "minting" | "success" | "error";

function AddSongDialog({
  albumName,
  albumAddress,
  artistName,
  open,
  onOpenChange,
  onSuccess,
}: AddSongDialogProps) {
  // Form state
  const [songName, setSongName] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // Upload state
  const [uploadStep, setUploadStep] = useState<UploadStep>("idle");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [metadataUri, setMetadataUri] = useState<string | null>(null);

  // Refs for file inputs
  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Mint hook
  const {
    mintSong,
    isPending,
    isConfirming,
    isSuccess: isMintSuccess,
    error: mintError,
    hash,
    reset: resetMint,
  } = useMintSong(albumAddress);

  // Reset form function - defined early so it can be used in effects
  const resetForm = () => {
    setSongName("");
    setDescription("");
    setGenre("");
    setAudioFile(null);
    setCoverImage(null);
    setCoverPreview(null);
    setUploadStep("idle");
    setUploadError(null);
    setMetadataUri(null);
    resetMint();
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

  // Auto-mint after upload completes
  useEffect(() => {
    if (metadataUri && uploadStep === "uploading") {
      setUploadStep("minting");
      mintSong(metadataUri);
    }
  }, [metadataUri, uploadStep, mintSong]);

  // Handle mint success
  useEffect(() => {
    if (isMintSuccess) {
      setUploadStep("success");
      const timer = setTimeout(() => {
        resetForm();
        onSuccess?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMintSuccess, onSuccess]);

  // Handle mint error
  useEffect(() => {
    if (mintError) {
      setUploadStep("error");
      setUploadError(
        mintError.message?.includes("User rejected")
          ? "Transaction rejected by user"
          : mintError.message?.includes("OwnableUnauthorizedAccount")
          ? "You are not the owner of this album"
          : "Failed to mint song"
      );
    }
  }, [mintError]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!songName || !audioFile) return;

    setUploadStep("uploading");
    setUploadError(null);

    try {
      const uri = await uploadSongToPinata({
        audioFile,
        coverImage: coverImage || undefined,
        name: songName,
        description: description || `${songName} from ${albumName}`,
        artistName,
        albumName,
        genre: genre || undefined,
      });

      setMetadataUri(uri);
    } catch (err) {
      setUploadStep("error");
      setUploadError(
        err instanceof Error ? err.message : "Failed to upload to IPFS"
      );
    }
  };

  const isLoading = uploadStep === "uploading" || isPending || isConfirming;
  const canSubmit = songName && audioFile && !isLoading && uploadStep !== "success";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-zinc-900 border-2 border-zinc-600 text-white sm:max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Music className="w-5 h-5 text-primary" />
            Add Song to {albumName}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Upload your song and cover art. Files will be stored on IPFS via Pinata.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Song Name */}
          <div>
            <label className="text-sm font-medium mb-2 block text-zinc-300">
              Song Name <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Enter song name"
              value={songName}
              onChange={(e) => setSongName(e.target.value)}
              disabled={isLoading}
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-primary"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium mb-2 block text-zinc-300">
              Description
            </label>
            <Input
              placeholder="Brief description of your song"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-primary"
            />
          </div>

          {/* Genre */}
          <div>
            <label className="text-sm font-medium mb-2 block text-zinc-300">
              Genre
            </label>
            <Input
              placeholder="e.g., Pop, Rock, Electronic"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              disabled={isLoading}
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-primary"
            />
          </div>

          {/* Audio File Upload */}
          <div>
            <label className="text-sm font-medium mb-2 block text-zinc-300">
              Audio File <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              ref={audioInputRef}
              onChange={handleAudioChange}
              accept="audio/*"
              className="hidden"
              disabled={isLoading}
              aria-label="Upload audio file"
            />
            {audioFile ? (
              <div className="flex items-center gap-3 p-3 bg-zinc-800 border border-zinc-700 rounded-lg">
                <FileAudio className="w-8 h-8 text-primary" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{audioFile.name}</p>
                  <p className="text-xs text-zinc-500">
                    {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setAudioFile(null)}
                  disabled={isLoading}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => audioInputRef.current?.click()}
                disabled={isLoading}
                className="w-full h-20 bg-transparent border-zinc-700 border-dashed text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-primary"
              >
                <div className="flex flex-col items-center gap-1">
                  <Upload className="w-6 h-6" />
                  <span className="text-sm">Click to upload audio file</span>
                  <span className="text-xs text-zinc-500">MP3, WAV, FLAC, etc.</span>
                </div>
              </Button>
            )}
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="text-sm font-medium mb-2 block text-zinc-300">
              Cover Image <span className="text-zinc-500">(optional)</span>
            </label>
            <input
              type="file"
              ref={imageInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
              disabled={isLoading}
              aria-label="Upload cover image"
            />
            {coverPreview ? (
              <div className="relative w-32 h-32">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverPreview}
                  alt="Cover preview"
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

          {/* Status Messages */}
          {uploadStep === "success" && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">Song minted successfully!</span>
              </div>
              {hash && (
                <a
                  href={`https://sepolia.etherscan.io/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-400 hover:text-primary flex items-center gap-1 mt-2"
                >
                  View transaction <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}

          {uploadStep === "error" && uploadError && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-red-500">
                <XCircle className="w-5 h-5" />
                <span className="font-medium">{uploadError}</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setUploadStep("idle");
                  setUploadError(null);
                }}
                className="mt-2 text-zinc-400 hover:text-white"
              >
                Try again
              </Button>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
              className="flex-1 bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!canSubmit}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {uploadStep === "uploading" ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading to IPFS...
                </>
              ) : isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Confirm in wallet...
                </>
              ) : isConfirming ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Minting...
                </>
              ) : uploadStep === "success" ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Minted!
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload & Mint
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddSongDialog;
