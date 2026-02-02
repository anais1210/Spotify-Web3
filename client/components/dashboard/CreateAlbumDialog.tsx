"use client";
import { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
interface CreateAlbumDialogProps {
  onCreateAlbum: (name: string, symbol: string) => void;
}
function CreateAlbumDialog({ onCreateAlbum }: CreateAlbumDialogProps) {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && symbol) {
      onCreateAlbum(name, symbol);
      setName("");
      setSymbol("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Album
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Album</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label htmlFor="" className="text-sm font-medium mb-2 block">
              Album Name
            </label>
            <Input
              placeholder="My Awesome Album"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="" className="text-sm font-medium mb-2 block">
              Symbol
            </label>
            <Input
              placeholder="My Awesome Album"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Short identifier for your album (3-5 characters)
            </p>
          </div>
          <Button type="submit" className="w-full">
            Create Album
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateAlbumDialog;
