"use client";
import usePlayer from "@/hooks/usePlayer";
const Player = () => {
  const player = usePlayer();
  return (
    <div>
      <h1>Player</h1>
    </div>
  );
};
export default Player;
