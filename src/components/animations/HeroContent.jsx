"use client";

import { motion } from "framer-motion";
import { TextReveal, FadeIn, MagneticButton } from "./PremiumAnimations";

export default function HeroContent({ children }) {
  return (
    <>
      {/* Badge */}
      <FadeIn delay={0.1} direction="down">
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 sm:px-5 py-2.5 sm:py-3 rounded-full border border-orange-500/20 shadow-lg mb-4">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-green-600 font-bold tracking-wide text-xs sm:text-sm">
            🇮🇳 Made in India for Growing Sales Teams
          </span>
        </div>
      </FadeIn>

      {/* Heading */}
      <div className="!text-4xl lg:!text-6xl font-extrabold leading-tight text-gray-900 mb-6">
        <TextReveal delay={0.2}>
          Track Every Call.
        </TextReveal>
        <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 bg-clip-text text-transparent block">
          <TextReveal delay={0.6}>
            Close Every Deal.
          </TextReveal>
        </span>
      </div>

      {/* Description */}
      <FadeIn delay={0.8} direction="up">
        <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-8">
          Trackly automatically logs all your{" "}
          <span className="font-semibold text-gray-900">SIM calls</span> - no
          VoIP, no number change. Get complete visibility into your team's daily
          calls.
        </p>
      </FadeIn>

      <FadeIn delay={1.0} direction="up">
        {children}
      </FadeIn>
    </>
  );
}

export function HeroImage({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, x: 50, rotateY: 15 }}
      animate={{ opacity: 1, scale: 1, x: 0, rotateY: 0 }}
      transition={{
        delay: 0.4,
        duration: 1.2,
        type: "spring",
        stiffness: 50,
        damping: 20
      }}
      className="flex justify-center md:justify-end relative perspective-1000"
      style={{ perspective: "1000px" }}
    >
      {children}
    </motion.div>
  );
}
