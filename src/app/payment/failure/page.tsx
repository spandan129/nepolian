"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, ShoppingCart, AlertCircle } from 'lucide-react';
import "@fontsource/syne";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      when: "beforeChildren",
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

const iconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20
    }
  }
};

function Page() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-syne">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center"
          variants={itemVariants}
        >
          {/* Failed Icon */}
          <motion.div
            variants={iconVariants}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-red-100 rounded-full blur-xl opacity-50"></div>
              <div className="relative bg-red-50 rounded-full p-6">
                <XCircle className="w-16 h-16 text-red-500" />
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div variants={itemVariants} className="space-y-4 mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Payment Failed
            </h1>
            <div className="flex items-center justify-center gap-2 text-amber-600 bg-amber-50 py-3 px-4 rounded-2xl">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm font-medium">
                Your transaction was cancelled
              </p>
            </div>
          </motion.div>

          {/* Action Button */}
          <motion.div variants={itemVariants}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.href = 'http://localhost:3000/cart'}
              className="w-full bg-gray-900 text-white py-3 px-6 rounded-2xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 group"
            >
              <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Return to Cart
            </motion.button>

            <motion.p 
              variants={itemVariants}
              className="text-sm text-gray-500 mt-4"
            >
              Dont worry, no charges were made to your account.
            </motion.p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Page;