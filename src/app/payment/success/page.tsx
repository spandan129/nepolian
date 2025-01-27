"use client"
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Copy,
  Loader2,
  ArrowLeft,
  Receipt,
  CreditCard,
  Tag,
  Fingerprint
} from 'lucide-react';
import "@fontsource/syne";
import {supabase} from "../../_lib/Supabase"
import { SupabaseClient } from '@supabase/supabase-js';

interface PaymentData {
  transaction_code: string;
  status: string;
  total_amount: string;
  transaction_uuid: string;
  product_code: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

const successIconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
      duration: 1.5
    }
  }
};

function Page() {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const data = urlParams.get('data');

    if (data) {
      try {
        const decodedData = JSON.parse(atob(data));
        setPaymentData(decodedData);
        setShowConfetti(true);
      } catch (error) {
        console.error('Error parsing payment data:', error);
      }
    }
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  async function updateOrderStatus(supabase: SupabaseClient, transactionUuid: string, newStatus: string, amount: number) {
    try {
      console.log(amount);
      const { data, error } = await supabase
        .from('orders')
        .update({
          status: newStatus,
          payment: true
        })
        .eq('transaction_uuid', transactionUuid)
        .eq('status', 'pending_payment');

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // Example usage in your payment success component:
  useEffect(() => {
    if (paymentData) {
      updateOrderStatus(
        supabase,
        paymentData.transaction_uuid,
        'pending_delivery',
        parseFloat(paymentData.total_amount)
      );
    }
  }, [paymentData]);

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Loader2 className="w-12 h-12 text-blue-600" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-2 md:p-4 font-syne">
      {showConfetti && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 pointer-events-none"
        >
          {/* Add confetti effect here if desired */}
        </motion.div>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-xl"
      >
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl shadow-2xl p-4 sm:p-8 md:p-12 relative overflow-hidden"
        >
          {/* Success Icon */}
          <motion.div
            variants={successIconVariants}
            className="flex justify-center mb-10"
          >
            <div className="bg-green-50 rounded-full p-6">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>
          </motion.div>

          {/* Amount Section */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-12 "
          >
            <h1 className="text-xl font-bold text-gray-900 mb-3">
              Payment Successful, Your Order has been placed..
            </h1>
            <div className="text-5xl font-bold text-blue-600 tracking-tight font-serif">
              ₹{paymentData.total_amount}
            </div>
          </motion.div>

          {/* Details Grid */}
          <motion.div
            variants={itemVariants}
            className="grid gap-6"
          >
            {/* Transaction ID */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-blue-50 rounded-2xl p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Fingerprint className="w-6 h-6 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600 min-w-[105px]">Transaction ID</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900 ">{paymentData.transaction_uuid}</span>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => copyToClipboard(paymentData.transaction_uuid)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <AnimatePresence mode="wait">
                      {copied ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="copy"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Copy className="w-5 h-5" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Status */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-green-50 rounded-2xl p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">Status</span>
                </div>
                <span className="px-4 py-1.5 bg-green-500 text-white rounded-full text-sm font-medium">
                  {paymentData.status}
                </span>
              </div>
            </motion.div>

            {/* Transaction Code */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-purple-50 rounded-2xl p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Receipt className="w-6 h-6 text-purple-600" />
                  <span className="text-sm font-medium text-gray-600">Transaction Code</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{paymentData.transaction_code}</span>
              </div>
            </motion.div>

            {/* Product Code */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-orange-50 rounded-2xl p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Tag className="w-6 h-6 text-orange-600" />
                  <span className="text-sm font-medium text-gray-600">Product Code</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{paymentData.product_code}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Back Button */}
          <motion.div
            variants={itemVariants}
            className="mt-10"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.href = '/'}
              className="w-full bg-gray-900 text-white py-3 rounded-2xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 font-syne"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Page;