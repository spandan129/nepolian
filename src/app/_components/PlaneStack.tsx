"use client"
import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import "@fontsource/syne";

export const ServicesSection = () => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true })

  const services = [
    {
      title: "Comprehensive Hair Services",
      description: "Offering expert hair cutting, braiding, dreadlocks, color treatments, and keratin smoothing solutions for all hair types."
    },
    {
      title: "Advanced Skin & Nail Care",
      description: "Premium skin treatments and nail services designed to enhance your natural beauty and boost confidence."
    },
    {
      title: "Professional Mentorship Program",
      description: "Learn essential skills including advanced cutting techniques, color theory, hair styling, client consultation, and salon management."
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 50 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  }

  return (
    <div className="bg-[#1C1C1C] py-16 px-4 sm:px-6 lg:px-12">
      <div ref={sectionRef} className="max-w-[75rem] mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-white text-center font-syne text-4xl lg:text-5xl mb-12 font-bold tracking-tight"
        >
          Our Signature Services
        </motion.h1>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="bg-[#232323] rounded-xl p-6 "
            >
              <div className="flex items-center mb-4">
                <h2 className="text-white font-syne text-xl font-semibold mr-2  transition-colors">
                  {service.title}
                </h2>
              
              </div>
              <p className="text-[#A0A0A0] font-syne leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default ServicesSection