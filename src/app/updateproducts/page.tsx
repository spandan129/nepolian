"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '../_lib/Supabase';
import { Search, Edit2, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import "@fontsource/syne";
import Navbar from '../products/_components/Navbar';

const categories = [
    'Hair Products', 'Skin Products', 'Nail Products', 'Makeup',
    'Fragrances', 'Body Care', 'Hair Tools',
    'Beauty Accessories', 'Exclusive Deals', 'Top Picks', 'New Arrivals'
];

interface Product {
    id: number;
    product_name: string;
    description: string;
    price: number;
    image_url: string;
    category: string;
    available: number;
}

export default function ProductManagement() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8;
    const [openLogin, setOpenLogin] = useState(false);

    const fetchProducts = async () => {
        const { data } = await supabase.from('products').select('*');
        setProducts(data || []);
        setFilteredProducts(data || []);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        const filtered = products.filter(product =>
            product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
        setCurrentPage(1);
    }, [searchTerm, products]);

    const updateProduct = async () => {
        if (!selectedProduct) return;

        const { error } = await supabase
            .from('products')
            .update({
                product_name: selectedProduct.product_name,
                description: selectedProduct.description,
                price: selectedProduct.price,
                category: selectedProduct.category,
                available: selectedProduct.available
            })
            .eq('id', selectedProduct.id);

        if (!error) {
            fetchProducts();
            setIsUpdateModalOpen(false);
        }
    };

    const deleteProduct = async (id: number) => {
        // First, fetch the product to get its image URL
        const { data: product, error: fetchError } = await supabase
            .from('products')
            .select('image_url')
            .eq('id', id)
            .single();

        if (fetchError) {
            console.error('Error fetching product:', fetchError);
            return;
        }

        // Extract the filename from the S3 URL
        const fileName = product.image_url.split('/').pop();

        // Delete the image from S3
        const { error: deleteImageError } = await supabase.storage
            .from('products') // replace with your actual bucket name
            .remove([fileName]);

        if (deleteImageError) {
            console.error('Error deleting image:', deleteImageError);
        }

        // Delete the product from the database
        await supabase.from('products').delete().eq('id', id);

        // Refresh the product list
        fetchProducts();
    };

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <><Navbar open={openLogin} setOpen={setOpenLogin} />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8 font-syne">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Search Bar */}
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="relative max-w-md mx-auto"
                    >
                        <Search className="absolute left-3 mt-7 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full mt-14 pl-12 pr-4 py-3 bg-white rounded-xl shadow-sm focus:outline-none focus:ring-2 transition-all duration-300"
                        />
                    </motion.div>

                    {/* Product Grid */}
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                    >
                        <AnimatePresence>
                            {currentProducts.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                                >
                                    <div className="relative h-56 sm:h-48 w-full overflow-hidden rounded-t-xl">
                                        <Image
                                            src={product.image_url}
                                            alt={product.product_name}
                                            fill
                                            className="object-cover transition-transform duration-300 hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-4 space-y-3">
                                        <h3 className="font-medium text-gray-900 truncate">{product.product_name}</h3>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="font-semibold text-gray-900">${product.price.toFixed(2)}</span>
                                            <span className="text-gray-500">Stock: {product.available}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => {
                                                    setSelectedProduct(product);
                                                    setIsUpdateModalOpen(true);
                                                }}
                                                className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                <Edit2 className="h-4 w-4 mr-1" />
                                                Edit
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => deleteProduct(product.id)}
                                                className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4 mr-1" />
                                                Delete
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-center gap-2 mt-8"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                Previous
                            </motion.button>
                            <div className="flex gap-2">
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <motion.button
                                        key={i}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => paginate(i + 1)}
                                        className={`w-10 h-10 text-sm font-medium rounded-lg transition-all duration-200 ${currentPage === i + 1
                                            ? 'bg-gray-900 text-white shadow-md'
                                            : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
                                            }`}
                                    >
                                        {i + 1}
                                    </motion.button>
                                ))}
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                Next
                            </motion.button>
                        </motion.div>
                    )}
                </div>

                {/* Update Modal */}
                <AnimatePresence>
                    {isUpdateModalOpen && selectedProduct && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                            onClick={() => setIsUpdateModalOpen(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                transition={{ type: "spring", duration: 0.5 }}
                                className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative"
                                onClick={e => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => setIsUpdateModalOpen(false)}
                                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                                <h2 className="text-2xl font-semibold mb-6">Update Product</h2>
                                <div className="space-y-4">
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <input
                                            type="text"
                                            placeholder="Product Name"
                                            value={selectedProduct.product_name}
                                            onChange={(e) => setSelectedProduct({
                                                ...selectedProduct,
                                                product_name: e.target.value
                                            })}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 transition-all duration-300"
                                        />
                                    </motion.div>
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <textarea
                                            placeholder="Description"
                                            value={selectedProduct.description}
                                            onChange={(e) => setSelectedProduct({
                                                ...selectedProduct,
                                                description: e.target.value
                                            })}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 transition-all duration-300 h-32 resize-none"
                                        />
                                    </motion.div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <motion.div
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <input
                                                type="number"
                                                placeholder="Price"
                                                value={selectedProduct.price}
                                                onChange={(e) => setSelectedProduct({
                                                    ...selectedProduct,
                                                    price: Number(e.target.value)
                                                })}
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 transition-all duration-300"
                                            />
                                        </motion.div>
                                        <motion.div
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.4 }}
                                        >
                                            <input
                                                type="number"
                                                placeholder="Stock"
                                                value={selectedProduct.available}
                                                onChange={(e) => setSelectedProduct({
                                                    ...selectedProduct,
                                                    available: Number(e.target.value)
                                                })}
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 transition-all duration-300"
                                            />
                                        </motion.div>
                                    </div>
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <select
                                            value={selectedProduct.category}
                                            onChange={(e) => setSelectedProduct({
                                                ...selectedProduct,
                                                category: e.target.value
                                            })}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2  transition-all duration-300"
                                        >
                                            {categories.map((category) => (
                                                <option key={category} value={category}>
                                                    {category}
                                                </option>
                                            ))}
                                        </select>
                                    </motion.div>
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                        className="flex gap-4 pt-4"
                                    >
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={updateProduct}
                                            className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
                                        >
                                            Update
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setIsUpdateModalOpen(false)}
                                            className="flex-1 px-6 py-3 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
                                        >
                                            Cancel
                                        </motion.button>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}