"use client";
import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Web3Provider from "@/components/providers/Web3Provider";
import { Space_Grotesk, Inter } from "next/font/google";
import Providers from "./Provider";

const inter = Inter({ subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
});

const metadata: Metadata = {
  title: "Harmony Music",
  description: "Discover and share music on the blockchain.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} font-body`}>
        <Web3Provider>
          <Providers>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1 pt-16">{children}</main>
              <Footer />
            </div>
          </Providers>
        </Web3Provider>
      </body>
    </html>
  );
}
