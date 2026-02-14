"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useIsAdmin, useIsArtist } from "@/hooks";
import { useAccount } from "wagmi";
import { Shield, Mic2 } from "lucide-react";

function Header() {
  const pathname = usePathname();
  const { isConnected } = useAccount();
  const { isAdmin } = useIsAdmin();
  const { isArtist } = useIsArtist();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 glass-nav">
      <nav className="container h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <img
            src="/harmony-logo.png"
            width={280}
            height={280}
            alt="Harmony"
            className="h-15 w-auto transition-transform group-hover:scale-105 duration-300 drop-shadow-[0_10px_20px_rgba(214,179,106,0.25)]"
          />
        </Link>

        {/* Center Navigation Links */}
        <div className="flex items-center gap-2">
          <NavLink href="/browse" isActive={isActive("/browse")}>
            Browse
          </NavLink>
          <NavLink href="/collection" isActive={isActive("/collection")}>
            Collection
          </NavLink>
          {isConnected && isArtist && (
            <NavLink
              href="/artist/dashboard"
              isActive={isActive("/artist/dashboard")}
              icon={<Mic2 className="w-4 h-4" />}
            >
              Dashboard
            </NavLink>
          )}
          {isConnected && isAdmin && (
            <NavLink
              href="/admin"
              isActive={isActive("/admin")}
              icon={<Shield className="w-4 h-4" />}
            >
              Admin
            </NavLink>
          )}
        </div>

        {/* Connect Wallet */}
        <div>
          <ConnectButton />
        </div>
      </nav>
    </header>
  );
}

// Minimal NavLink component with active state
function NavLink({
  href,
  isActive,
  children,
  icon,
}: {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`
        px-4 py-2 text-sm font-semibold tracking-wide 
        flex items-center gap-2
        transition-all duration-300 
        ${
          isActive
            ? "text-background shadow-[0_10px_25px_rgba(214,179,106,0.25)]"
            : "text-foreground/80 hover:text-primary"
        }
      `}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}

export default Header;
