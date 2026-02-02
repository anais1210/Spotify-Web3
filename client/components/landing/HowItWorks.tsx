"use client";

import { Wallet, Music, Heart, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Wallet,
    title: "Connect Wallet",
    description: "Link your MetaMask or any Web3 wallet to access the platform",
    step: "01",
  },
  {
    icon: Music,
    title: "Discover Music",
    description: "Browse curated albums from independent artists worldwide",
    step: "02",
  },
  {
    icon: Heart,
    title: "Collect & Own",
    description: "Purchase NFTs and truly own your favorite music forever on-chain",
    step: "03",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

function HowItWorks() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background accent */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"
      />

      <div className="container relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-primary text-sm font-medium uppercase tracking-wider mb-3"
          >
            Getting Started
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl md:text-4xl font-heading font-bold mb-4"
          >
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-muted-foreground text-lg max-w-xl mx-auto"
          >
            Start your music NFT journey in three simple steps
          </motion.p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 relative"
        >
          {/* Connection lines (desktop only) */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="hidden md:block absolute top-24 left-1/3 right-1/3 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent origin-left"
          />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="relative group"
            >
              {/* Card */}
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-zinc-900/50 border border-border/50 rounded-2xl p-8 hover:border-primary/30 transition-colors duration-300 hover:bg-zinc-900/80 h-full"
              >
                {/* Step number badge */}
                <div className="flex items-center justify-between mb-6">
                  <motion.span
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="text-5xl font-heading font-bold text-primary/20 group-hover:text-primary/40 transition-colors"
                  >
                    {step.step}
                  </motion.span>
                  {index < steps.length - 1 && (
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ChevronRight className="w-5 h-5 text-primary/30 hidden md:block" />
                    </motion.div>
                  )}
                </div>

                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-14 h-14 mb-6 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/30 transition-colors"
                >
                  <step.icon className="w-7 h-7 text-primary" />
                </motion.div>

                {/* Content */}
                <h3 className="font-heading font-semibold text-xl mb-3 text-white">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {step.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default HowItWorks;
