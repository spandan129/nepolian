import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Products } from './product';
import { ArrowRight } from 'lucide-react';

interface NewProductProps {
  product: Products;
}

export const NewProduct: React.FC<NewProductProps> = ({ product }) => {
  return (
    <div className='flex-shrink-0 w-[120%] md:w-[75%] lg:w-[65%] xl:w-1/2 2xl:w-1/3 p-2 sm:p-4 md:p-6'>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="group relative bg-gray-100 rounded-xl p-6 hover:bg-gray-200 transition-colors"
      >
        <Link href={`/products/${product.id}`}>
          <div className="flex justify-between items-start">
            <div className="max-w-[60%]">
              <motion.h3
                whileHover={{ x: 5 }}
                className="text-md md:text-lg font-semibold text-gray-900 mb-2"
              >
                {product.product_name}
              </motion.h3>
              <p className="text-sm text-gray-600 mb-4">New Arrivals</p>
              <p className="text-lg md:text-xl font-bold text-gray-900">
                ${Number(product.price).toFixed(2)}
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-24 h-24 rounded-lg overflow-hidden"
            >
              <motion.img
                src={product.image_url}
                alt={product.product_name}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileHover={{ opacity: 1, x: 0 }}
            className="absolute bottom-6 right-6 text-blue-600"
          >
            <ArrowRight size={20} />
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
};