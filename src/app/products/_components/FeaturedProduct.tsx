import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Products } from './product';

interface FeaturedProductProps {
  product: Products;
  index: number;
}

export const FeaturedProduct: React.FC<FeaturedProductProps> = ({ product, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex-shrink-0 w-64 sm:w-72 md:w-80 p-2 sm:p-4 md:p-6"
    >
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative overflow-hidden aspect-[3.5/4] rounded-lg">
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6 }}
            src={product.image_url}
            alt={product.product_name}
            className="w-full h-full object-cover rounded-lg"
          />
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-4 sm:p-6"
          >
            <div className="text-white">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold">{product.product_name}</h3>
              <p className="text-xs sm:text-sm md:text-base opacity-80 mt-1">
                ${Number(product.price).toFixed(2)}
              </p>
            </div>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
};
