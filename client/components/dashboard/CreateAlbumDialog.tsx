"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CreateAlbumDialogProps {
  onCreateAlbum: (name: string, symbol: string) => void;
  isPending?: boolean;
  isConfirming?: boolean;
  isSuccess?: boolean;
  error?: Error | null;
  hash?: `0x${string}`;
}

function CreateAlbumDialog({
  onCreateAlbum,
  isPending = false,
  isConfirming = false,
  isSuccess = false,
  error,
  hash,
}: CreateAlbumDialogProps) {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [open, setOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle success - show success message then close
  useEffect(() => {
    if (isSuccess && hash) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setOpen(false);
        setShowSuccess(false);
        setName("");
        setSymbol("");
      }, 3000);
      return () => clearTimeout(timer);
    }
    if (open) {
      setShowSuccess(false);
    }
  }, [isSuccess, hash, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && symbol && !isPending && !isConfirming) {
      onCreateAlbum(name, symbol.toUpperCase());
    }
  };

  const isLoading = isPending || isConfirming;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <Plus className="w-4 h-4 mr-2" />
          Create Album
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black text-white border-zinc-700">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Album</DialogTitle>
          <DialogDescription>
            Create a new album NFT collection. This will deploy a smart contract
            on the blockchain.
          </DialogDescription>
        </DialogHeader>

        {/* Success State */}
        {showSuccess ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Album Created!</h3>
            <p className="text-sm text-muted-foreground mb-4">
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
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm">
                  {error.message.includes("User rejected")
                    ? "Transaction was rejected"
                    : error.message.slice(0, 100)}
                </p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-2 block">
                Album Name
              </label>
              <Input
                placeholder="My Awesome Album"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                className="bg-zinc-800 border-zinc-700 focus:border-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Symbol</label>
              <Input
                placeholder="ALBUM"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                maxLength={5}
                disabled={isLoading}
                className="bg-zinc-800 border-zinc-700 focus:border-primary uppercase"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Short identifier for your album (3-5 characters, e.g., ALBUM)
              </p>
            </div>

            {/* Transaction Status */}
            {isLoading && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/30">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
                <div>
                  <p className="text-sm font-medium">
                    {isPending
                      ? "Waiting for wallet confirmation..."
                      : "Confirming transaction..."}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isPending
                      ? "Please confirm the transaction in MetaMask"
                      : "This may take a few seconds"}
                  </p>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isLoading || !name || !symbol}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isPending ? "Confirm in Wallet..." : "Creating..."}
                </>
              ) : (
                "Create Album"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default CreateAlbumDialog;
