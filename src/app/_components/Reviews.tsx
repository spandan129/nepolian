"use client"
import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const reviews = [
  {
    name: 'Sandesh Karki',
    rating: 5,
    date: 'January 24, 2025',
    text: 'Exceptional service with a great team of professionals. The salon maintains high standards of cleanliness, and the stylists always exceed expectations. Highly recommend for anyone looking for a premium experience.'
  },
  {
    name: 'Bishal Shah',
    rating: 4,
    date: 'January 22, 2025',
    text: 'A well-managed salon with a relaxing vibe. The staff is skilled and attentive to your needs. While slightly on the pricey side, the overall experience and quality make it worthwhile.'
  },
  {
    name: 'Sudeep Khadka',
    rating: 4,
    date: 'January 20, 2025',
    text: 'Impressive styling and friendly staff who make sure you leave satisfied. The atmosphere is cozy, and they use top-notch products. Definitely worth a visit for a polished look.'
  },
  {
    name: 'Anuska Prajapati',
    rating: 4,
    date: 'January 18, 2025',
    text: 'A fantastic place for grooming and hairstyling. The stylists are highly skilled, and the customer service is excellent. A little expensive, but you get value for your money.'
  }
];


export default function Reviews() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    checkScreenSize();

    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setIsScrolled(scrollContainerRef.current.scrollLeft > 0);
    }
  };

  return (
    <div className="bg-[#1C1C1C] pb-24 relative overflow-hidden pt-6 ">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        animate={isLargeScreen ? {
          maxWidth: isScrolled ? '100%' : '80rem',
          transition: {
            type: 'tween',
            duration: 0.5,
            ease: 'easeInOut'
          }
        } : {}}
        className={`
          ${isLargeScreen && !isScrolled ? 'max-w-7xl' : 'w-full'} 
          mx-auto px-4 sm:px-6 lg:px-8
        `}
      >
        <motion.h2
          className="text-4xl md:text-6xl font-bold text-white my-[4rem] lg:my-[0rem] lg:mb-[4rem] tracking-tight text-center  font-syne lg:mt-[4rem] xl:mt-[0rem]"
        >
          Excellence that <br />speaks for itself
        </motion.h2>

        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="scrollbar-hide grid grid-flow-col gap-8 overflow-x-scroll overflow-y-hidden"
        >
          {reviews.map((review, index) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-[#232323] p-8 rounded-lg w-[400px]"
            >
              <div className="flex flex-col h-full">
                <h3 className="text-white text-xl font-bold mb-2">{review.name}</h3>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-2xl ${i < review.rating ? `text-yellow-500` : 'text-gray-600'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-400 mb-4 flex-grow">{review.text}</p>
                <p className="text-gray-600 text-sm">{review.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}