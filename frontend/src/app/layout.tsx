// import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Make sure to include the styles

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "thirdweb SDK + Next starter",
//   description:
//     "Starter template for using thirdweb SDK with Next.js App router",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-700">
        <ThirdwebProvider>
          <div className="flex bg-black h-screen text-white">
            <Sidebar />
            <div className="flex-1 p-6 overflow-y-auto">
              <Navbar />
              {children}
            </div>
          </div>
          <ToastContainer />
        </ThirdwebProvider>
      </body>
    </html>
  );
}
