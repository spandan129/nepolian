import { motion } from 'framer-motion';
import { X, LogIn } from 'lucide-react';
import { supabase } from '../../_lib/Supabase';
interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {

    const handleGoogleLogin = async () => {
        try {
            const {  error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location}`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            });

            if (error) {
                throw error;
            }

        } catch (error) {
            console.error('Error:', error);
        }
    };


    if (!isOpen) return null;



    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-syne"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="bg-white/90 backdrop-blur-md rounded-2xl p-8 max-w-md w-full mx-4 relative shadow-2xl border border-white/20"
                onClick={(e) => e.stopPropagation()}
            >
                <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <X className="h-6 w-6" />
                </motion.button>

                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="bg-gradient-to-r from-blue-600 to-blue-400 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                    >
                        <LogIn className="h-8 w-8 text-white" />
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl font-bold text-gray-800 mb-2"
                    >
                        Welcome Back
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-gray-600"
                    >
                        Sign in to continue to your account
                    </motion.p>
                </div>

                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:shadow-md transition-all duration-200 group"
                >
                    <motion.img
                        src="https://www.google.com/favicon.ico"
                        alt="Google"
                        className="w-5 h-5 group-hover:scale-110 transition-transform"
                    />
                    Continue with Google
                </motion.button>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-4 text-center text-sm text-gray-500"
                >
                    By continuing, you agree to our Terms of Service and Privacy Policy
                </motion.p>
            </motion.div>
        </motion.div>
    );
}