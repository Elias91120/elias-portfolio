"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      className="site-nav fixed inset-x-0 top-0 z-[55] h-[2px] origin-left"
      style={{
        scaleX,
        background:
          "linear-gradient(to right, #a78bfa, #38bdf8 55%, #fbbf24)",
      }}
    />
  );
}
