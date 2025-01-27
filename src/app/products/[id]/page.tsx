"use client"
import React, { useEffect, useState } from 'react';
import { useParams } from "next/navigation";
import { ShoppingCart, ChevronLeft } from 'lucide-react';
import { Product } from '../_components/product';
import "@fontsource/syne";
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../_components/Navbar';

import { supabase } from "../../_lib/Supabase";
import { motion } from 'framer-motion';

export default function ProductDetail() {
    const params = useParams();
    const id = params.id as string;
    const [product, setProduct] = useState<Product | null>(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openLogin, setOpenLogin] = useState(false);
    const [isClient, setIsClient] = useState(false);

    const addtoCart = (product: Product) => {
        try {
            const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');

            const isProductInCart = cartItems.some((item: Product) => item.id === product.id);

            if (isProductInCart) {
                toast.error('Product already in cart');
                return;
            }

            localStorage.setItem('cart', JSON.stringify([...cartItems, product]));
            toast.success('Product added to cart');
        } catch (error) {
            console.error('Error managing cart:', error);
            toast.error('Failed to add product to cart');
        }
    };

    useEffect(() => {
        setIsClient(true);

        const fetchProduct = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) {
                    throw error;
                }

                if (data) {
                    setProduct(data);
                } else {
                    setError('Product not found');
                }
            } catch (err) {
                console.error('Error fetching product:', err);
                setError(err instanceof Error ? err.message : 'Failed to load product');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const handleBack = () => {
        window.history.back();
    };

    if (!isClient) {
        return null;
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg"
                >
                    <ChevronLeft size={20} />
                    Back to Products
                </button>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                <p className="text-gray-600 mb-4">Product not found</p>
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg"
                >
                    <ChevronLeft size={20} />
                    Back to Products
                </button>
            </div>
        );
    }

    return (
        <>
            <Navbar open={openLogin} setOpen={setOpenLogin} />
            <div className="bg-white min-h-screen flex items-center justify-center p-4 font-syne">
                <div className="container max-w-6xl mx-auto mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
                        {/* Image Container */}
                        <div className="flex items-center justify-center">
                            <div className="w-full max-w-md aspect-square overflow-hidden md:rounded-2xl md:shadow-lg">
                                <motion.img
                                    src={product.image_url}
                                    alt={product.product_name}
                                    onLoad={() => setImageLoaded(true)}
                                    className={`w-full h-full object-cover transition-opacity duration-500 
                                    ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                                />
                                {!imageLoaded && (
                                    <div className="absolute inset-0 bg-gray-100 animate-pulse"></div>
                                )}
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex flex-col justify-center space-y-6">
                            <div>
                                <h1 className="text-4xl font-[600] text-gray-900 tracking-tight">
                                    {product.product_name}
                                </h1>
                                <p className="text-gray-500 mt-2 text-lg">{product.category}</p>
                            </div>

                            <div className="text-gray-900">
                                <p className="text-2xl mb-4 font-helvetica font-bold">
                                    ${Number(product.price).toFixed(2)}
                                </p>
                                <p className="text-gray-700 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    disabled={product.available === 0}
                                    onClick={() => addtoCart(product)}
                                    className={`flex items-center justify-center gap-2 
                                    bg-black text-white 
                                    px-6 sm:px-4 lg:px-6 py-3 rounded-lg 
                                    
                                    ${product.available === 0 ? "bg-gray-800" : "hover:bg-gray-800 "}
                                    transition-colors 
                                    w-full sm:w-auto`}
                                >
                                    <ShoppingCart size={20} />
                                    {product.available === 0 ? "Out of Stock" : "Add to Cart"}
                                </button>
                                <button
                                    className="flex items-center justify-center gap-2 
                                    border border-gray-300 
                                    text-gray-700 
                                    px-6 sm:px-4 lg:px-6 py-3 rounded-lg 
                                    hover:bg-gray-100 
                                    transition-colors 
                                    w-full sm:w-auto"
                                    onClick={handleBack}
                                >
                                    <ChevronLeft size={20} />
                                    Back to Products
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <Toaster />
            </div>
        </>
    );
}