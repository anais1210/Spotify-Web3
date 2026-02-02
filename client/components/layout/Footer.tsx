import React from "react";
import Link from "next/link";
function Footer() {
  return (
    <footer className="border-t border-border py-8 text-muted-foreground">
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm">© 2025 Harmony. Built on Ethereum.</p>
        <div className="flex items-center gap-6">
          <Link href="#" className="text-sm hover:text-foreground transition">
            Github
          </Link>
          <Link href="#" className="text-sm hover:text-foreground transition">
            Twitter
          </Link>
          <Link href="#" className="text-sm hover:text-foreground transition">
            Discord
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
