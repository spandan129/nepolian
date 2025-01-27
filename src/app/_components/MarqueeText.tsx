"use client"
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function MarqueeText() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Adjust the transform ranges for smoother transition
  const x1 = useTransform(scrollYProgress, [0, 1], [0, -1050]);
  const x2 = useTransform(scrollYProgress, [0, 1], [-1050, 0]);

  // Create a transition configuration for smoother animation
  const transition = {
    type: "tween", // Use tween for a smooth linear motion
    ease: "linear", // Consistent speed throughout the animation
    duration: 0.5 // Adjust duration for desired smoothness
  };

  return (
    <div 
      ref={containerRef} 
      className="bg-[#1E1E1E] text-white py-12 pt-[5rem] overflow-hidden font-syne"
    >
      <div className="flex flex-col gap-4">
        <motion.div
          style={{ x: x1 }}
          transition={transition}
          className="whitespace-nowrap flex gap-4 text-3xl md:text-7xl font-bold tracking-tighter"
        >
          {["Transform, Renew, Repeat — Transform, Renew, Repeat — Transform, Renew, Repeat —"].map((text, index) => (
            <span key={index}>{text}</span>
          )).concat(
            ["Transform, Renew, Repeat — Transform, Renew, Repeat — Transform, Renew, Repeat —"].map((text, index) => (
              <span key={`repeat-${index}`}>{text}</span>
            ))
          )}
        </motion.div>
        <motion.div
          style={{ x: x2 }}
          transition={transition}
          className="whitespace-nowrap flex gap-4 text-3xl md:text-7xl font-bold tracking-tighter"
        >
          {["Experience the Edge — Experience the Edge — Experience the Edge —"].map((text, index) => (
            <span key={index}>{text}</span> 
          )).concat(
            ["Experience the Edge — Experience the Edge — Experience the Edge —"].map((text, index) => (
              <span key={`repeat-${index}`}>{text}</span>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
}