"use client";
import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Web3Provider from "@/components/providers/Web3Provider";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import Providers from "./Provider";
import { PlayerProvider } from "@/contexts/PlayerContext";
import { MusicPlayer } from "@/components/player";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
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
      <body
        className={`${manrope.className} ${manrope.variable} ${cormorant.variable} font-body`}
      >
        <Web3Provider>
          <Providers>
            <PlayerProvider>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 pt-16 pb-20">{children}</main>
                <Footer />
                <MusicPlayer />
              </div>
            </PlayerProvider>
          </Providers>
        </Web3Provider>
      </body>
    </html>
  );
}
