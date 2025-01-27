import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Products } from './product';

interface FeaturedProductProps {
  product: Products;
  index: number;
}

export const CategoryProduct: React.FC<FeaturedProductProps> = ({ product, index }) => {
  console.log(product);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      className="flex-shrink-0 w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 p-2"
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
            initial={{ opacity: 1 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-black bg-opacity-40 flex items-end justify-center pb-4"
          >
            <div className="text-white text-center">
              <h3 className="text-md font-bold font-syne">{product.product_name}</h3>
              <p className="text-xl font-syne">${Number(product.price).toFixed(2)}</p>
            </div>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
};