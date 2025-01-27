"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import "@fontsource/syne";
import Navbar from '../products/_components/Navbar';

const ContactPage = () => {
    const [openLogin, setOpenLogin] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [submitStatus, setSubmitStatus] = useState<{
        success: boolean | null, 
        message: string
    }>({
        success: null,
        message: ''
    });

    const generateEmailHtml = (data: typeof formData) => {
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f4f4f4;
                }
                .container {
                    background-color: white;
                    border-radius: 10px;
                    padding: 30px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }
                .header {
                    background-color: #000;
                    color: white;
                    text-align: center;
                    padding: 15px;
                    border-radius: 5px 5px 0 0;
                }
                .contact-details {
                    margin-top: 20px;
                }
                .contact-details p {
                    margin: 10px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>New Contact Form Submission</h1>
                </div>
                <div class="contact-details">
                    <p><strong>Name:</strong> ${data.name}</p>
                    <p><strong>Email:</strong> ${data.email}</p>
                    <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
                    <p><strong>Message:</strong></p>
                    <p>${data.message}</p>
                </div>
            </div>
        </body>
        </html>
        `;
    };

    const sendEmail = async (data: typeof formData) => {
        const apiKey = process.env.NEXT_PUBLIC_API_KEY;

        try {
            const response = await axios.post(
                'https://api.brevo.com/v3/smtp/email',
                {
                    sender: {
                        name: 'Nepolian Hair and Beauty Academy',
                        email: 'nepolianhairandbeautyacademy@gmail.com'
                    },
                    to: [{ email: "kiranadhikari.htd@gmail.com" }],
                    replyTo: {
                        email: data.email,
                        name: data.name
                    },
                    subject: `New Contact Form Submission from ${data.name}`,
                    htmlContent: generateEmailHtml(data)
                },
                {
                    headers: {
                        'api-key': apiKey,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            );

            return {
                success: true,
                message: 'Message sent successfully',
                data: response.data
            };
        } catch (error) {
            console.error('Error sending email:', error);
            return {
                success: false,
                message: 'Failed to send message',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const result = await sendEmail(formData);
            
            setSubmitStatus({
                success: result.success,
                message: result.message
            });

            if (result.success) {
                // Reset form on successful submission
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    message: ''
                });
            }
        } catch (error) {
            setSubmitStatus({
                success: false,
                message: `An unexpected error occurred ${error}`
            });
        }
    };

    return (
        <>
            <Navbar open={openLogin} setOpen={setOpenLogin} />
            <div className="min-h-screen bg-white flex items-center justify-center p-8 font-syne">
                <div className="max-w-4xl w-full">
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-6xl font-bold text-black mt-12">Contact Nepolian</h1>
                        <p className="text-xl text-gray-700 mt-4">Get in touch with us</p>
                    </motion.div>

                    <motion.form
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-12"
                    >
                        <div>
                            <label className="block text-xl text-black mb-2">What is your name?</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full text-2xl border-b-2 border-black pb-2 focus:outline-none focus:border-gray-600"
                            />
                        </div>

                        <div>
                            <label className="block text-xl text-black mb-2">What is your email address?</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="w-full text-2xl border-b-2 border-black pb-2 focus:outline-none focus:border-gray-600"
                            />
                        </div>

                        <div>
                            <label className="block text-xl text-black mb-2">What is your phone number?</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full text-2xl border-b-2 border-black pb-2 focus:outline-none focus:border-gray-600"
                            />
                        </div>

                        <div>
                            <label className="block text-xl text-black mb-2">What would you like to tell us?</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                required
                                rows={4}
                                className="w-full text-2xl border-b-2 border-black pb-2 focus:outline-none focus:border-gray-600"
                            />
                        </div>

                        {submitStatus.success !== null && (
                            <div className={`
                                mt-4 p-4 rounded 
                                ${submitStatus.success 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }
                            `}>
                                {submitStatus.message}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-black text-white text-2xl py-4 hover:bg-gray-800 transition-colors"
                        >
                            Send Message
                        </button>
                    </motion.form>
                </div>
            </div>
        </>
    );
};

export default ContactPage;