import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { ToastContainer } from "react-toastify";
const Layout = () => {
  return (
    <div className="flex bg-black h-screen text-white">
      <ToastContainer />
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <Navbar />
      </div>
    </div>
  );
};
export default Layout;
