"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddSongDialogProps {
  albumName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSong: (title: string, uri: string) => void;
}

function AddSongDialog({
  albumName,
  open,
  onOpenChange,
  onAddSong,
}: AddSongDialogProps) {
  const [title, setTitle] = useState("");
  const [uri, setUri] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && uri) {
      onAddSong(title, uri);
      setTitle("");
      setUri("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Song to `{albumName}`</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label htmlFor="" className="text-sm font-medium mb-2 block">
              Song Title
            </label>
            <Input
              placeholder="My song title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="" className="text-sm font-medium mb-2 block">
              IPFS URI
            </label>
            <Input
              placeholder="ipfs://Qm..."
              value={uri}
              onChange={(e) => setUri(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {" "}
              IPFS Link to your song metadata
            </p>
          </div>
          <Button type="submit" className="w-full">
            Add Song
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddSongDialog;
