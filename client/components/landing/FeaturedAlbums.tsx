"use client";

import Link from "next/link";
import { Play, Music2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const albums = [
  { id: 1, name: "Midnight Dreams", artist: "Luna Nova", gradient: "from-violet-600 to-indigo-900" },
  { id: 2, name: "Electric Soul", artist: "The Voltage", gradient: "from-amber-500 to-orange-700" },
  { id: 3, name: "Ocean Waves", artist: "Coastal", gradient: "from-cyan-500 to-blue-700" },
  { id: 4, name: "Urban Nights", artist: "Metro Sound", gradient: "from-pink-500 to-rose-700" },
  { id: 5, name: "Forest Echo", artist: "Woodland", gradient: "from-emerald-500 to-green-800" },
  { id: 6, name: "Neon Lights", artist: "Synthwave", gradient: "from-purple-500 to-fuchsia-800" },
];

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
              Trending Now
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

        {/* Albums grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6"
        >
          {albums.map((album) => (
            <motion.div key={album.id} variants={itemVariants}>
              <Link href="/browse">
                <motion.div
                  className="group cursor-pointer"
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {/* Album cover with gradient */}
                  <div className={`aspect-square rounded-xl overflow-hidden relative mb-4 bg-gradient-to-br ${album.gradient} shadow-lg group-hover:shadow-xl group-hover:shadow-primary/10 transition-shadow duration-300`}>
                    {/* Music icon */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center opacity-30"
                      whileHover={{ scale: 1.1, opacity: 0.4 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Music2 className="w-16 h-16 text-white" />
                    </motion.div>

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
                  <p className="text-xs text-muted-foreground truncate">{album.artist}</p>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile view all link */}
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
      </div>
    </section>
  );
}

export default FeaturedAlbums;
