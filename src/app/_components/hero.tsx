"use client"
import { motion } from 'framer-motion';
// import img1 from "../assets/images2/img1.jpg"
import img1 from "../assets/images/main.png"

export default function Hero() {
  return (
    <div className="relative h-screen font-helvetica">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url("${img1.src}")`,
        }}
      >
        <div className="absolute inset-0 bg-black/90">
          <div className="flex flex-col items-center justify-center h-full text-white text-center px-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-8xl font-bold mb-6 font-syne"
            >
              Discover a New You
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl mb-8 max-w-2xl font-light tracking-wide "
            >
              Experience grooming that enhances your appearance and empowers your confidence.
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/contact'}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="bg-white text-black px-8 py-3 rounded-full text-lg font-syne font-bold tracking-wider hover:bg-gray-200 transition duration-300"
            >
              BOOK AN APPOINTMENT
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}