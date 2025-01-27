"use client"
import React, { useState } from 'react';

import { toast, Toaster } from 'react-hot-toast';
import { ChevronDown } from 'lucide-react';
import "@fontsource/syne";
import { supabase } from "../_lib/Supabase";
import Navbar from '../products/_components/Navbar';
const AddProduct = () => {
    const [openLogin, setOpenLogin] = useState(false);
    const [formData, setFormData] = useState({
        product_name: '',
        description: '',
        price: '',
        imageUrl: '',
        category: '',
        quantity: ''
    });

    const [uploading, setUploading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;

        const file = e.target.files[0];
        setUploading(true);

        try {

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const { error } = await supabase.storage
                .from('products')
                .upload(fileName, file);


            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(fileName);

            setFormData(prev => ({ ...prev, imageUrl: publicUrl }));
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Failed to upload image.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const productData = {
            product_name: formData.product_name,
            description: formData.description,
            price: parseFloat(formData.price),
            image_url: formData.imageUrl,
            category: formData.category,
            created_at: new Date().toISOString(),
            available: formData.quantity
        };

        try {
            const { error } = await supabase
                .from('products')
                .insert([productData]);

            if (error) throw error;

            toast.success('Product added successfully!');
            setFormData({
                product_name: '',
                description: '',
                price: '',
                imageUrl: '',
                category: '',
                quantity: ''
            });
        } catch (error) {
            console.error('Error saving product:', error);
            toast.error('Failed to add product.');
        }
    };

    const categories = [
        'Hair Products',
        'Skin Products',
        'Nail Products',
        'Makeup',
        'Fragrances',
        'Body Care',
        'Hair Tools',
        'Beauty Accessories',
        'Exclusive Deals',
        'Top Picks',
        'New Arrivals',
    ];

    return (
        <>
            <Navbar open={openLogin} setOpen={setOpenLogin} />
            <div className="min-h-screen px-4 py-12 bg-white flex justify-center items-center font-syne">
                <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8 max-sm:mt-20 ">
                    <div className="border-b border-black pb-4">
                        <h2 className="text-3xl tracking-tight">New Product</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="space-y-2">
                            <label htmlFor="product_name" className="text-sm uppercase tracking-wide">
                                Name
                            </label>
                            <input
                                type="text"
                                id="product_name"
                                name="product_name"
                                value={formData.product_name}
                                onChange={handleInputChange}
                                className="w-full px-0 py-2 bg-transparent border-0 border-b border-gray-300 focus:border-gray-700 focus:ring-0 focus:outline-none"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="price" className="text-sm uppercase tracking-wide">
                                Price
                            </label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                className="w-full px-0 py-2 bg-transparent border-0 border-b border-gray-300 focus:border-gray-700 focus:ring-0 focus:outline-none"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="price" className="text-sm uppercase tracking-wide">
                                Available
                            </label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                className="w-full px-0 py-2 bg-transparent border-0 border-b border-gray-300 focus:border-gray-700 focus:ring-0 focus:outline-none"
                                required
                            />
                        </div>

                        <div className="space-y-2 relative">
                            <label htmlFor="category" className="text-sm uppercase tracking-wide">
                                Category
                            </label>
                            <div className="relative">
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-0 py-2 bg-transparent border-0 border-b border-gray-300 hover:border-gray-500 focus:border-gray-700 focus:ring-0 focus:outline-none appearance-none cursor-pointer pr-8"
                                    required={true}
                                >
                                    <option value="" disabled className="text-gray-500">
                                        &nbsp; &nbsp;Select a category
                                    </option>
                                    {categories.map((category) => (
                                        <option
                                            key={category}
                                            value={category}
                                            className="bg-white text-black py-2"
                                        >
                                            &nbsp; &nbsp;{category}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                    <ChevronDown size={20} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="image" className="text-sm uppercase tracking-wide">
                                Image
                            </label>
                            <input
                                type="file"
                                id="image"
                                onChange={handleImageUpload}
                                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-gray-100 hover:file:bg-gray-200"
                            />
                            {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
                            {formData.imageUrl && (
                                <p className="text-sm">✓ Image uploaded</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="description" className="text-sm uppercase tracking-wide">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full px-0 py-2 bg-transparent border-0 border-b border-gray-300 focus:border-gray-700 focus:ring-0 focus:outline-none min-h-[100px]"
                            required
                        ></textarea>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            className="w-full md:w-auto px-6 py-3 bg-black text-white hover:bg-gray-800 disabled:bg-gray-400"
                            disabled={uploading}
                        >
                            {uploading ? 'Uploading...' : 'Add Product'}
                        </button>
                    </div>
                </form>
                <Toaster />
            </div>
        </>
    );
};

export default AddProduct;