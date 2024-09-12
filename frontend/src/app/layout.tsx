import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar"; // Import the Sidebar

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "thirdweb SDK + Next starter",
  description:
    "Starter template for using thirdweb SDK with Next.js App router",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThirdwebProvider>
          <div className="flex bg-black h-screen text-white">
            {/* Sidebar */}
            <Sidebar />
            {/* Main Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {/* Top Bar with Search and User Buttons */}
              <Navbar />
              {children} {/* Render the main content here */}
            </div>
          </div>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
