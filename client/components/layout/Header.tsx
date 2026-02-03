"use client";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useIsAdmin, useIsArtist } from "@/hooks";
import { useAccount } from "wagmi";
import { Shield, Mic2 } from "lucide-react";

function Header() {
  const { isConnected } = useAccount();
  const { isAdmin } = useIsAdmin();
  const { isArtist } = useIsArtist();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-border h-16 text-white">
      <nav className="container h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img
            src="/harmony-logo.png"
            width={120}
            height={120}
            alt="Harmony Logo"
            className="h-15 w-auto"
          />
        </Link>

        {/* Center Navigation Links */}
        <div className="flex items-center gap-6">
          <Link
            href="/browse"
            className="text-sm hover:text-primary transition"
          >
            Browse
          </Link>
          <Link
            href="/collection"
            className="text-sm hover:text-primary transition"
          >
            Collection
          </Link>
          {isConnected && isArtist && (
            <Link
              href="/artist/dashboard"
              className="text-sm hover:text-primary transition flex items-center gap-1"
            >
              <Mic2 className="w-4 h-4" />
              Dashboard
            </Link>
          )}
          {isConnected && isAdmin && (
            <Link
              href="/admin"
              className="text-sm hover:text-primary transition flex items-center gap-1"
            >
              <Shield className="w-4 h-4" />
              Admin
            </Link>
          )}
        </div>

        {/* Connect Wallet */}
        <ConnectButton />
      </nav>
    </header>
  );
}
export default Header;
