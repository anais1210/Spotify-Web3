"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

function CallToAction() {
  return (
    <section className="py-24 relative overflow-hidden text-foreground">
      <div className="flex justify-center mb-12">
        <div className="section-divider w-80"></div>
      </div>
      <div className="container">
        {/* CTA Card */}
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute -inset-8 rounded-3xl bg-gradient-to-br from-primary/30 via-transparent to-accent/30 blur-2xl opacity-70" />
          <div className="relative rounded-3xl p-[1px] bg-gradient-to-br from-primary/60 via-white/10 to-accent/40">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="rounded-3xl glass-panel-strong p-8 md:p-12 lg:p-16 text-center"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-pill mb-8"
              >
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                </motion.div>
                <span className="text-foreground text-sm font-semibold tracking-wide">
                  Join the revolution
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6 text-gradient-gold"
              >
                Ready to start collecting?
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto"
              >
                Join thousands of music lovers owning their favorite tracks.
                Support artists directly and build your collection on the
                blockchain.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link href="/browse">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button
                      size="lg"
                      className="cursor-pointer lux-button text-base px-8 py-6 rounded-full font-semibold group transition-all duration-300"
                    >
                      Get Started
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
                      className="cursor-pointer text-base px-8 py-6 rounded-full font-semibold lux-button-outline transition-all duration-300"
                    >
                      Launch as Artist
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex items-center justify-center gap-8 mt-12 pt-8 border-t border-white/10"
              >
                {[
                  { value: "100%", label: "On-chain" },
                  { value: "0%", label: "Platform fees" },
                  { value: "Forever", label: "Ownership" },
                ].map((stat, index) => (
                  <React.Fragment key={stat.label}>
                    {index > 0 && <div className="w-px h-8 bg-white/10" />}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                      className="text-center"
                    >
                      <p className="text-2xl font-heading font-bold text-foreground">
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stat.label}
                      </p>
                    </motion.div>
                  </React.Fragment>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CallToAction;
