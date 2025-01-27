"use client"
import { motion } from 'framer-motion';

interface ServiceCardProps {
  number: string;
  title: string;
  image: string;
  index: number;
}

export default function ServiceCard({ number, title, image, index }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="relative group overflow-hidden "
    >
      <motion.img
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.6 }}
        src={image}
        alt={title}
        className="w-full h-[400px] object-cover"
      />
      <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.3 }}
          className="text-white"
        >
          <span className="text-sm font-light tracking-wider">{number}</span>
          <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
        </motion.div>
      </div>
    </motion.div>
  );
}