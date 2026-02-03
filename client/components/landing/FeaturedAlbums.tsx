"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Play, Music2, ArrowRight, Loader2, Disc3 } from "lucide-react";
import { motion } from "framer-motion";
import { useGetAlbums } from "@/hooks";
import { fetchMetadataFromIPFS, ipfsToHttp, fetchAlbumMetadata } from "@/lib/pinata";

interface AlbumDisplay {
  id: string;
  address: string;
  name: string;
  artist: string;
  gradient: string;
  coverImage: string | null;
}

// Generate consistent gradient based on address
function getGradientFromAddress(address: string): string {
  const gradients = [
    "from-violet-600 to-indigo-900",
    "from-amber-500 to-orange-700",
    "from-cyan-500 to-blue-700",
    "from-pink-500 to-rose-700",
    "from-emerald-500 to-green-800",
    "from-purple-500 to-fuchsia-800",
    "from-red-500 to-pink-700",
    "from-teal-500 to-cyan-700",
  ];
  const index = parseInt(address.slice(-2), 16) % gradients.length;
  return gradients[index];
}

function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

function FeaturedAlbums() {
  const { albums, isLoading } = useGetAlbums(6, 0);
  const [displayAlbums, setDisplayAlbums] = useState<AlbumDisplay[]>([]);

  // Fetch cover images
  useEffect(() => {
    async function fetchCovers() {
      if (!albums || albums.length === 0) {
        setDisplayAlbums([]);
        return;
      }

      const albumsData: AlbumDisplay[] = await Promise.all(
        albums.map(async (album) => {
          let coverImage: string | null = null;

          // Try to get album metadata from cache
          const albumMetadata = await fetchAlbumMetadata(album.address);
          if (albumMetadata?.image) {
            coverImage = ipfsToHttp(albumMetadata.image);
          }

          // If no album cover, try to get from first song
          if (!coverImage && album.songs && album.songs.length > 0) {
            const firstSong = album.songs[0];
            if (firstSong.uri) {
              const songMetadata = await fetchMetadataFromIPFS(firstSong.uri);
              if (songMetadata?.image) {
                coverImage = ipfsToHttp(songMetadata.image);
              }
            }
          }

          return {
            id: album.id,
            address: album.address,
            name: album.name,
            artist: formatAddress(album.artist.address),
            gradient: getGradientFromAddress(album.address),
            coverImage,
          };
        })
      );

      setDisplayAlbums(albumsData);
    }

    fetchCovers();
  }, [albums]);

  // Don't render section if no albums
  if (!isLoading && displayAlbums.length === 0) {
    return (
      <section className="py-24 border-t border-border/30">
        <div className="container">
          <div className="text-center py-12">
            <Disc3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-heading font-bold mb-2">No Albums Yet</h2>
            <p className="text-muted-foreground mb-6">
              Be the first artist to publish music on the platform!
            </p>
            <Link
              href="/artist/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
            >
              Start Creating
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 border-t border-border/30">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-primary text-sm font-medium uppercase tracking-wider mb-2"
            >
              Latest Releases
            </motion.p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold">Featured Albums</h2>
          </div>
          <Link
            href="/browse"
            className="hidden sm:flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
          >
            View all
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}

        {/* Albums grid */}
        {!isLoading && displayAlbums.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6"
          >
            {displayAlbums.map((album) => (
              <motion.div key={album.id} variants={itemVariants}>
                <Link href={`/album/${album.address}`}>
                  <motion.div
                    className="group cursor-pointer"
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {/* Album cover */}
                    <div className={`aspect-square rounded-xl overflow-hidden relative mb-4 shadow-lg group-hover:shadow-xl group-hover:shadow-primary/10 transition-shadow duration-300 ${!album.coverImage ? `bg-gradient-to-br ${album.gradient}` : ''}`}>
                      {album.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={album.coverImage}
                          alt={album.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center opacity-30"
                          whileHover={{ scale: 1.1, opacity: 0.4 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Music2 className="w-16 h-16 text-white" />
                        </motion.div>
                      )}

                      {/* Play overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          whileHover={{ scale: 1 }}
                          className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg"
                        >
                          <Play className="w-5 h-5 text-black fill-black ml-0.5" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Info */}
                    <h3 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                      {album.name}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate font-mono">{album.artist}</p>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Mobile view all link */}
        {displayAlbums.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-8 sm:hidden text-center"
          >
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 text-primary hover:underline underline-offset-4"
            >
              View all albums
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default FeaturedAlbums;
