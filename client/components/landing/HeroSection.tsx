"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Play, Disc3 } from "lucide-react";
import { motion } from "framer-motion";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (delay: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      delay,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  }),
};

const floatAnimation = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

const floatAnimationReverse = {
  animate: {
    y: [10, -10, 10],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

function HeroSection() {
  return (
    <section className="min-h-[90vh] flex items-center relative overflow-hidden">
      {/* Animated gradient orbs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
        className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary/15 rounded-full blur-[100px]"
      />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div>
            {/* Badge */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-8"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-primary"
              />
              <span className="text-primary text-sm font-medium">
                Web3 Music Platform
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0.1}
              className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tight mb-6 leading-[1.1]"
            >
              Own the music
              <br />
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-primary inline-block"
              >
                you love
              </motion.span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0.2}
              className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-lg"
            >
              Collect unique music NFTs directly from your favorite artists.
              Support creators, own your collection forever.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0.3}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Link href="/browse">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    size="lg"
                    className="cursor-pointer glow-green text-base px-8 py-6 rounded-full font-medium group hover:brightness-110 hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all duration-300"
                  >
                    <Play className="w-5 h-5 mr-2 fill-current group-hover:scale-110 transition-transform" />
                    Explore Music
                  </Button>
                </motion.div>
              </Link>
              <Link href="/artist/dashboard">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="cursor-pointer text-base px-8 py-6 border-border hover:border-primary hover:bg-primary/10 rounded-full font-medium bg-zinc-900/80 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                  >
                    I&apos;m an Artist
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0.4}
              className="flex gap-8 md:gap-12"
            >
              {[
                { value: "1K+", label: "Artists" },
                { value: "50K+", label: "NFTs Minted" },
                { value: "100", label: "ETH Volume" },
              ].map((stat, index) => (
                <React.Fragment key={stat.label}>
                  {index > 0 && <div className="w-px bg-border/50" />}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  >
                    <p className="text-3xl md:text-4xl font-heading font-bold text-white">
                      {stat.value}
                    </p>
                    <p className="text-muted-foreground text-sm">{stat.label}</p>
                  </motion.div>
                </React.Fragment>
              ))}
            </motion.div>
          </div>

          {/* Right: Visual Element */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="hidden lg:flex items-center justify-center relative"
          >
            {/* Vinyl record visualization */}
            <motion.div
              {...floatAnimation}
              className="relative w-[400px] h-[400px]"
            >
              {/* Outer glow ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-primary/20"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 rounded-full border border-primary/30"
              />
              <div className="absolute inset-8 rounded-full border border-primary/20" />

              {/* Main vinyl */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-12 rounded-full bg-gradient-to-br from-zinc-900 to-black border border-white/10 shadow-2xl flex items-center justify-center"
              >
                {/* Grooves */}
                <div className="absolute inset-4 rounded-full border border-white/5" />
                <div className="absolute inset-8 rounded-full border border-white/5" />
                <div className="absolute inset-12 rounded-full border border-white/5" />
                <div className="absolute inset-16 rounded-full border border-white/5" />

                {/* Center label */}
                <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center shadow-lg">
                  <Disc3 className="w-12 h-12 text-white" />
                </div>
              </motion.div>

              {/* Floating music notes */}
              <motion.div
                {...floatAnimationReverse}
                className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl bg-primary/20 backdrop-blur-sm border border-primary/30 flex items-center justify-center"
              >
                <span className="text-2xl">🎵</span>
              </motion.div>
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-4 -left-4 w-14 h-14 rounded-2xl bg-primary/20 backdrop-blur-sm border border-primary/30 flex items-center justify-center"
              >
                <span className="text-xl">🎧</span>
              </motion.div>

              {/* Extra floating element */}
              <motion.div
                animate={{
                  y: [0, 12, 0],
                  x: [0, -5, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute top-1/2 -right-8 w-12 h-12 rounded-xl bg-primary/15 backdrop-blur-sm border border-primary/20 flex items-center justify-center"
              >
                <span className="text-lg">🎶</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
