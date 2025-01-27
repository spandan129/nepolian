import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Products } from './product';

interface TopPickProps {
  product: Products;
}

export const TopPick: React.FC<TopPickProps> = ({ product }) => {
  return (
    <div
      className="bg-white rounded-lg hover:shadow-md transition-shadow border border-gray-200 flex-shrink-0 w-64 sm:w-72 md:w-80 p-2 sm:p-4 md:p-6"
    >

      <Link href={`/products/${product.id}`} className="flex items-center gap-4 ">
        <div className="w-16 h-16 rounded-full overflow-hidden">
          <motion.img
            whileHover={{ scale: 1.1 }}
            src={product.image_url}
            alt={product.product_name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{product.product_name}</h3>
          <p className="text-sm text-gray-500">${Number(product.price).toFixed(2)}</p>
        </div>
      </Link>
    </div>
  );
};