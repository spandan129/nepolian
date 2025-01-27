"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X} from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  duration?: number;
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const iconMap = {
    success: <Check className="w-5 h-5 text-white" />,
    error: <X className="w-5 h-5 text-white" />
  };

  const bgColorMap = {
    success: 'bg-green-500',
    error: 'bg-red-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={`fixed bottom-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg ${bgColorMap[type]}`}
    >
      <div className="mr-3 rounded-full bg-white/20 p-1.5">
        {iconMap[type]}
      </div>
      <span className="text-white text-sm font-medium">{message}</span>
    </motion.div>
  );
};

const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = (message: string, type: 'success' | 'error', duration = 3000) => {
    const newToast = { message, type, duration };
    setToasts(currentToasts => [...currentToasts, newToast]);
  };

  const removeToast = (index: number) => {
    setToasts(currentToasts => currentToasts.filter((_, i) => i !== index));
  };

  const ToastContainer = () => (
    <AnimatePresence mode="popLayout">
      {toasts.map((toast, index) => (
        <Toast 
          key={index} 
          {...toast} 
          onClose={() => removeToast(index)} 
        />
      ))}
    </AnimatePresence>
  );

  return {
    toast: {
      success: (message: string) => addToast(message, 'success'),
      error: (message: string) => addToast(message, 'error')
    },
    ToastContainer
  };
};

export default useToast;