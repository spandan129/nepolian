"use client"
import { motion } from 'framer-motion';
import img7 from "../assets/images2/img7.jpg"

import img2 from "../assets/images2/img2.jpg"
import img3 from "../assets/images2/img3.jpg"
import img4 from "../assets/images2/img4.jpg"
import img5 from "../assets/images2/img5.jpg"
import img6 from "../assets/images2/img6.jpg"

const ThreeImage = () => {

  return (<div className="grid grid-cols-3 gap-2 lg:gap-8 mb-12">
    <motion.img
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      src={img7.src}
      alt="Haircut style 1"
      className="w-full h-72 object-cover rounded-lg"
    />
    <motion.img
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      src={img2.src}
      alt="Haircut style 2"
      className="w-full h-72 object-cover rounded-lg"
    />
    <motion.img
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      src={img3.src}
      alt="Haircut style 3"
      className="w-full h-72 object-cover rounded-lg"
    />
  </div>);
}
const AnotherThreeImage = () => {

  return (<div className="grid grid-cols-3 gap-2 lg:gap-8 mb-12">
    <motion.img
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      src={img4.src}
      alt="Haircut style 1"
      className="w-full h-72 object-cover rounded-lg"
    />
    <motion.img
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      src={img5.src}
      alt="Haircut style 2"
      className="w-full h-72 object-cover rounded-lg"
    />
    <motion.img
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      src={img6.src}
      alt="Haircut style 3"
      className="w-full h-72 object-cover rounded-lg"
    />
  </div>);
}
export default function HaircutFinder() {
  return (
    <div className="bg-[#1E1E1E] py-12   overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-[100vw] overflow-hidden">
        <div className="relative">
          <ThreeImage />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"

          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 font-syne">
              Be the perfect <br />version of yourself
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/contact'}
              className="bg-white text-black px-8 py-3 rounded-full text-lg font-bold tracking-wider hover:bg-gray-200 transition duration-300 font-syne"
            >
              Book An Appointment
            </motion.button>
          </motion.div>
          <div className='mt-16' >
            <AnotherThreeImage />
          </div>
        </div>
      </div>
    </div>
  );
}