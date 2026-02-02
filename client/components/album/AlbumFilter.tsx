import React from "react";
import { Input } from "../ui/input";
interface AlbumFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}
function AlbumFilter({ searchQuery, onSearchChange }: AlbumFilterProps) {
  return (
    <div className="flex gap-4 mb-8">
      <div className="relative flex-1 max-w-md">
        <Input
          placeholder="Search albums or artists..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
}

export default AlbumFilter;
