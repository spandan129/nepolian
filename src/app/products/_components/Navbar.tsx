import { Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from "../../assets/logo.png"
import LoginModal from './LoginModal';
import Image from 'next/image';
import "@fontsource/syne";
import React from 'react';
import { supabase } from "../../_lib/Supabase";
import { usePathname } from 'next/navigation';

interface NavbarProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Navbar({ open = false, setOpen }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [accessToken, setAccessToken] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [admin, setAdmin] = useState(false);
    const pathname = usePathname();


    useEffect(() => {
        setIsLoginModalOpen(open);
    }, [open]);

    const handleButtonChange = () => {
        const item = localStorage.getItem('sb-dfixshmncldlfmihbkri-auth-token');
        setAccessToken(!!item);
        if (item) {
            const parsedItem = JSON.parse(item);
            const user = parsedItem.user.email;
            if (user === "kiranadhikari.htd@gmail.com" || user === "spandanbhattarai79@gmail.com") {
                console.log(user);
                setAdmin(true);
            }

        } else {
            setAdmin(false)
        }
    }

    useEffect(() => {
        handleButtonChange();

        supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT' || !session) {
                handleButtonChange();
            } else if (event === 'SIGNED_IN') {
                handleButtonChange();
            }
        });

    }, []);


    const signOutUser = async () => {
        await supabase.auth.signOut();
        setAccessToken(false);
    };

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6 }}
                className="fixed w-full z-50 bg-black/5 backdrop-blur-sm font-syne"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center"
                        >
                            <Link href="/" className="flex items-center space-x-2">
                                <Image src={Logo} className="h-[3rem] w-[6rem] text-white" alt='No image' />
                            </Link>
                        </motion.div>

                        <div className={`hidden md:block ${pathname === '/' || pathname === '/appointment' ? 'text-white' : 'text-black'}`}>
                            <div className="ml-10 flex items-baseline space-x-4">
                                <motion.div whileHover={{ scale: 1.1 }}>
                                    <Link href="/" className=" hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium">
                                        Home
                                    </Link>
                                </motion.div>
                                {admin ? (<motion.div whileHover={{ scale: 1.1 }}>
                                    <Link href="/updateproducts" className=" hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium">
                                        Update Product
                                    </Link>
                                </motion.div>) : (<motion.div whileHover={{ scale: 1.1 }}>
                                    <Link href="/products" className=" hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium">
                                        Product
                                    </Link>
                                </motion.div>)}

                                {admin ? (<><motion.div whileHover={{ scale: 1.1 }}>
                                    <Link href="/addproduct" className=" hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium">
                                        Add Products
                                    </Link>

                                </motion.div>
                                    <motion.div whileHover={{ scale: 1.1 }}>
                                        <Link href="/orders" className=" hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium">
                                            Orders
                                        </Link>
                                    </motion.div></>) : (<><motion.div whileHover={{ scale: 1.1 }}>
                                        <Link href="/cart" className=" hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium">
                                            Cart
                                        </Link>
                                    </motion.div>
                                        <motion.div whileHover={{ scale: 1.1 }}>
                                            <Link href="/contact" className=" hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium">
                                                Contact
                                            </Link>
                                        </motion.div></>)}






                                {accessToken ? <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    onClick={() => (signOutUser(), setAccessToken(false))}
                                    className="hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Logout
                                </motion.button> : <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    onClick={() => setIsLoginModalOpen(true)}
                                    className="hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Login
                                </motion.button>}
                            </div>
                        </div>

                        <div className={`md:hidden ${pathname === '/' || pathname === '/appointment' ? 'text-white' : 'text-black'}`}>
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsOpen(!isOpen)}
                                className=" hover:text-gray-500"
                            >
                                <Menu className="h-6 w-6" />
                            </motion.button>
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="md:hidden bg-white/95 overflow-hidden"
                        >
                            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                                <motion.div
                                    whileHover={{ x: 10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Link
                                        href="/"
                                        className="text-black hover:text-gray-300 block px-3 py-2 rounded-md text-base font-medium"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Home
                                    </Link>
                                </motion.div>

                                {admin ? (<><motion.div
                                    whileHover={{ x: 10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Link
                                        href="/addproducts"
                                        className="text-black hover:text-gray-300 block px-3 py-2 rounded-md text-base font-medium"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Add Products
                                    </Link>
                                </motion.div>

                                    <motion.div
                                        whileHover={{ x: 10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Link
                                            href="/updateproducts"
                                            className="text-black hover:text-gray-300 block px-3 py-2 rounded-md text-base font-medium"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Update Products
                                        </Link>
                                    </motion.div>
                                    <motion.div
                                        whileHover={{ x: 10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Link
                                            href="/orders"
                                            className="text-black hover:text-gray-300 block px-3 py-2 rounded-md text-base font-medium"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Orders
                                        </Link>
                                    </motion.div></>) : (<><motion.div
                                        whileHover={{ x: 10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Link
                                            href="/products"
                                            className="text-black hover:text-gray-300 block px-3 py-2 rounded-md text-base font-medium"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Product
                                        </Link>
                                    </motion.div>
                                        <motion.div
                                            whileHover={{ x: 10 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Link
                                                href="/cart"
                                                className="text-black hover:text-gray-300 block px-3 py-2 rounded-md text-base font-medium"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                Cart
                                            </Link>
                                        </motion.div>
                                        <motion.div
                                            whileHover={{ x: 10 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Link
                                                href="/contact"
                                                className="text-black hover:text-gray-300 block px-3 py-2 rounded-md text-base font-medium"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                Contact
                                            </Link>
                                        </motion.div></>)}






                                {accessToken ? <motion.div
                                    whileHover={{ x: 10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <button
                                        onClick={() => { signOutUser(); setAccessToken(false) }}
                                        className="text-black hover:text-gray-300 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                                    >
                                        Logout
                                    </button>
                                </motion.div> : <motion.div
                                    whileHover={{ x: 10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <button
                                        onClick={() => setIsLoginModalOpen(true)}
                                        className="text-black hover:text-gray-300 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                                    >
                                        Login
                                    </button>
                                </motion.div>}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            <AnimatePresence>
                {isLoginModalOpen && (
                    <LoginModal
                        isOpen={isLoginModalOpen}
                        onClose={() => (setOpen(false), setIsLoginModalOpen(false))}
                    />
                )}
            </AnimatePresence>
        </>
    );
}