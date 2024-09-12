import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Albums from "@/components/Home/Albums";
import Artists from "@/components/Home/Artists";

export default function Home() {
  return (
    <div className="bg-black h-screen text-white flex">
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Top Bar with Search and User Buttons */}
        <Navbar />
        {/* Popular Artists */}
        <Artists />
        {/* Popular Albums */}
        <Albums />
      </div>
    </div>
  );
}
