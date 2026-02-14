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
    description:
      "Purchase NFTs and truly own your favorite music forever on-chain",
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
      <div className="flex justify-center mb-12">
        <div className="section-divider w-80"></div>
      </div>
      <div className="container">
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
            className="text-primary text-sm font-semibold uppercase tracking-[0.25em] mb-3"
          >
            Getting Started
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl md:text-4xl font-heading font-bold mb-4 text-foreground"
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
                className="glass-card p-8 transition-all duration-300 h-full rounded-2xl border border-white/10 hover:border-white/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              >
                {/* Step number badge */}
                <div className="flex items-center justify-between mb-6">
                  <motion.span
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="text-5xl font-heading font-bold text-gradient-gold"
                  >
                    {step.step}
                  </motion.span>
                  {index < steps.length - 1 && (
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                  <ChevronRight className="w-5 h-5 hidden md:block text-muted-foreground" />
                </motion.div>
                  )}
                </div>

                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-14 h-14 mb-6 border border-white/15 bg-white/5 flex items-center justify-center transition-colors rounded-xl"
                >
                  <step.icon className="w-7 h-7" />
                </motion.div>

                {/* Content */}
                <h3 className="font-heading font-semibold text-xl mb-3">
                  {step.title}
                </h3>
                <p className="leading-relaxed text-sm">{step.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default HowItWorks;
