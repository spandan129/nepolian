"use client";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import '@fontsource/dancing-script';

const Char = ({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) => {
  const opacity = useTransform(progress, range, [0, 1]);
  return <motion.span style={{ opacity }}>{children}</motion.span>;
};

const Word = ({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) => {
  const amount = range[1] - range[0];
  const step = amount / children.length;

  return (
    <span className="relative mr-3 mt-3 inline-block">
      <span className="absolute opacity-20">{children}</span>
      {children.split("").map((char, i) => {
        const start = range[0] + i * step;
        const end = range[0] + (i + 1) * step;
        return (
          <Char key={`c_${i}`} progress={progress} range={[start, end]}>
            {char}
          </Char>
        );
      })}
    </span>
  );
};

const AnimatedParagraph = ({ text }: { text: string }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.8", "start 0.3"],
  });

  const words = text.split(" ");
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  return (
    <motion.p
      ref={container}
      style={{ y }}
      className="flex flex-wrap  text-[24px] sm:text-[2rem] md:text-[3.5rem]  leading-[1.1] font-luxora-book text-[#D8DCE8] "
    >
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        );
      })}
    </motion.p>
  );
};

export default function ScrollText() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  return (
    <div ref={containerRef} className="min-h-[40vw] bg-[#1C1C1C] relative font-syne">
      <motion.div
        style={{ y: backgroundY }}
        className="sticky top-0  flex flex-col max-w-screen justify-center px-2 sm:px-2 md:px-16 lg:px-24 mx-auto pt-10 sm:pt-20 pb-8 sm:pb-16 px-4 sm:px-16 w-full"
      >
        <motion.div
          style={{ y: contentY }}
          className="mb-8 sm:mb-14  mx-auto w-full mt-12 lg:mt-6"
        >
          <AnimatedParagraph text="We offer a range of personalized services tailored to meet your needs and match your unique style.
Hurry up and book your appointment today — let us bring out your best look!" />
        </motion.div>
      </motion.div>


    </div>
  );
}
