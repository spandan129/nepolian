"use client"
import { motion } from 'framer-motion';
import ServiceCard from './ServiceCard';
import HairCut from "../assets/images/haircut.jpg";
import Facial from "../assets/images/facial.jpg";
import Keratin from "../assets/images/keratin.jpg";
import ColorTreatment from "../assets/images/colortreatment.jpg";
import Brades from "../assets/images/brades.jpg";
import Curls from "../assets/images/curls.jpg";



const services = [
  {
    number: '01',
    title: 'Haircuts',
    image: HairCut
  },
  {
    number: '02',
    title: 'Color Treatment',
    image: ColorTreatment
  },
  {
    number: '03',
    title: 'Facial',
    image: Facial
  },
  {
    number: '04',
    title: 'Keratin Smooth',
    image: Keratin
  },
  {
    number: '05',
    title: 'Braids',
    image: Brades
  },
  {
    number: '06',
    title: 'Curl Hair',
    image: Curls
  }
];

export default function Services() {
  return (
    <div className=" bg-z px-4 sm:px-6 md:px-8 lg:px-16 pb-[4.5rem] lg:pb-[5rem]">
      <div className="max-w-7xl mx-auto lg:px-8">
        <motion.div className="text-center py-12 pt-[4.3rem]">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-syne">
            Elevate your <br />grooming experience
          </h1>
        </motion.div>

        {/* Horizontal scroll for small and medium screens */}
        <div className="overflow-x-auto lg:hidden">
          <div className="flex space-x-4 pb-4">
            {services.map((service, index) => (
              <div key={service.number} className="flex-shrink-0 w-64">
                <ServiceCard
                  number={service.number}
                  title={service.title}
                  image={service.image.src}
                  index={index}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Grid layout for large screens */}
        <div className="hidden lg:grid grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={service.number}
              number={service.number}
              title={service.title}
              image={service.image.src}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}