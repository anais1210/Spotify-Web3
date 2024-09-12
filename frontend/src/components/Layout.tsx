import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
const Layout = () => {
  return (
    <div className="flex bg-black h-screen text-white">
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Top Bar with Search and User Buttons */}
        <Navbar />
      </div>
    </div>
  );
};
export default Layout;
