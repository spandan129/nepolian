"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Trash2, Plus, Minus } from "lucide-react";
// import Esewa from "./_components/esewa.svg";
import "@fontsource/syne";
import Navbar from "../products/_components/Navbar";
// import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';
import Cash from "./_components/image-removebg-preview.png";
import useToast from "./_components/toastContainer";
import axios from "axios";


const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Product {
    id: number;
    created_at: string;
    product_name: string;
    description: string;
    price: number;
    image_url: string;
    category: string;
    quantity?: number;
    available?: number;
}

const nepalProvinces = {
    1: {
        name: "Province No. 1",
        districts: ["Bhojpur", "Dhankuta", "Ilam", "Jhapa", "Khotang", "Morang", "Okhaldhunga", "Panchthar", "Sankhuwasabha", "Solukhumbu", "Sunsari", "Taplejung", "Tehrathum", "Udayapur"]
    },
    2: {
        name: "Madhesh Province",
        districts: ["Bara", "Dhanusha", "Mahottari", "Parsa", "Rautahat", "Sarlahi", "Saptari", "Siraha"]
    },
    3: {
        name: "Bagmati Province",
        districts: ["Bhaktapur", "Chitwan", "Dhading", "Dolakha", "Kathmandu", "Kavrepalanchok", "Lalitpur", "Makwanpur", "Nuwakot", "Ramechhap", "Rasuwa", "Sindhuli", "Sindhupalchok"]
    },
    4: {
        name: "Gandaki Province",
        districts: ["Gorkha", "Kaski", "Lamjung", "Manang", "Mustang", "Myagdi", "Nawalparasi (West)", "Parbat", "Syangja", "Tanahun"]
    },
    5: {
        name: "Lumbini Province",
        districts: ["Arghakhanchi", "Banke", "Bardiya", "Dang", "Gulmi", "Kapilvastu", "Nawalparasi (East)", "Palpa", "Pyuthan", "Rolpa", "Rukum (East)", "Rupandehi"]
    },
    6: {
        name: "Karnali Province",
        districts: ["Dailekh", "Dolpa", "Humla", "Jajarkot", "Jumla", "Kalikot", "Mugu", "Rukum (West)", "Salyan", "Surkhet"]
    },
    7: {
        name: "Sudurpashchim Province",
        districts: ["Achham", "Baitadi", "Bajhang", "Bajura", "Dadeldhura", "Darchula", "Doti", "Kailali", "Kanchanpur"]
    }
};

export default function CartPage() {
    const [cartItems, setCartItems] = useState<Product[]>([]);
    const [total, setTotal] = useState(0);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'esewa' | 'cod' | null>(null);
    const [addressStep, setAddressStep] = useState(false);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [localArea, setLocalArea] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [fullName, setFullName] = useState("");
    const [userId, setUserId] = useState('');
    const [openLogin, setOpenLogin] = useState(false);
    const authSubscriptionRef = useRef<unknown>(null);
    const { toast, ToastContainer } = useToast();


    const handleLogin = () => {
        const item = localStorage.getItem('sb-dfixshmncldlfmihbkri-auth-token');
        if (item) {
            const parsedItem = JSON.parse(item);
            console.log(parsedItem.user.id);
            setUserId(parsedItem.user.id)
        } else {
            setUserId('')
        }

    }

    useEffect(() => {

        handleLogin();
    }, []);


    useEffect(() => {
        const items = localStorage.getItem("cart");
        if (items) {
            const parsedItems = JSON.parse(items).map((item: Product) => ({
                ...item,
                quantity: item.quantity || 1
            }));
            setCartItems(parsedItems);
        }
    }, []);

    useEffect(() => {
        const newTotal = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
        setTotal(newTotal);
    }, [cartItems]);

    const removeFromCart = (id: number) => {
        const updatedCart = cartItems.filter((item) => item.id !== id);
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const updateQuantity = (id: number, newQuantity: number) => {
        const updatedCart = cartItems.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
        );
        setCartItems(updatedCart);
    };

    const checkProductAvailability = async () => {

        const availabilityChecks = async () => {
            for (const item of cartItems) {
                const { data, error } = await supabase
                    .from('products')
                    .select('available')
                    .eq('id', item.id)
                    .single();

                if (error || !data) {
                    toast.error(`Product ${item.product_name} not found`);
                    return false;
                }

                if ((item.quantity || 1) > data?.available) {
                    console.log("insufficient stock")
                    toast.error(`Insufficient stock for ${item.product_name}`);
                    return false;
                }

            }
            return true;

        }

        try {
            const availabilty = await availabilityChecks();
            return availabilty;
        } catch (error) {
            console.log(error)
            return false;
        }
    };

    const sendEmail = async (subject: string, htmlContent: string) => {

        try {
            const apiKey = process.env.NEXT_PUBLIC_API_KEY;

            const response = await axios.post(
                'https://api.brevo.com/v3/smtp/email',
                {
                    sender: {
                        name: 'Nepolian Hair and Beauty Academy',
                        email: 'nepolianhairandbeautyacademy@gmail.com'
                    },
                    to: [{ email: "kiranadhikari.htd@gmail.com" }],
                    subject: subject,
                    htmlContent: htmlContent
                },
                {
                    headers: {
                        'api-key': apiKey,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            );

            console.log('Email sent successfully!');
            console.log(response.data);
        } catch (error) {
            console.log('Email sending mail', error);
        }
    };

    const saveOrderToSupabase = async () => {
        // First, check product availability
        console.log('Checking Availability')
        const isAvailable = await checkProductAvailability();


        if (!isAvailable) return { status: false, uuid: "" };


        // Generate unique transaction UUID
        const newTransactionUuid = uuidv4();

        // Prepare order details
        const orderDetails = {
            transaction_uuid: newTransactionUuid,
            total_amount: total,
            status: paymentMethod === 'cod' ? 'pending_delivery' : 'pending_payment',
            payment: false,
            payment_method: paymentMethod,
            delivery_details: {
                user_id: userId,
                full_name: fullName,
                province: selectedProvince,
                district: selectedDistrict,
                local_area: localArea,
                contact_number: contactNumber
            },
            products: cartItems.map(item => ({
                product_id: item.id,
                product_name: item.product_name,
                quantity: item.quantity,
                price: item.price
            }))
        };

        // Save order to Supabase
        const { error } = await supabase
            .from('orders')
            .insert(orderDetails)
            .select();

        if (error) {
            toast.error('Error saving order');
            return { status: false, uuid: "" };
        }

        // Update product quantities
        const updatePromises = cartItems.map(async (item) => {
            // First, fetch the current available quantity
            const { data, error: fetchError } = await supabase
                .from('products')
                .select('available')
                .eq('id', item.id)
                .single();

            if (fetchError) {
                console.error(`Error fetching product ${item.id} quantity:`, fetchError);
                return;
            }

            // Update with new available quantity
            const { error: updateError } = await supabase
                .from('products')
                .update({
                    available: (data.available || 0) - (item.quantity || 1)
                })
                .eq('id', item.id);

            if (updateError) {
                console.error(`Error updating product ${item.id} quantity:`, updateError);
            }
        });

        await Promise.all(updatePromises);

        const subject = `User ${orderDetails.delivery_details.full_name} has placed an order of transaction id: ${orderDetails.transaction_uuid} of price ${orderDetails.total_amount}`
        const htmlcomtent = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>New Order Notification</title><style>body {font-family: Arial, sans-serif;background-color: #f5f5f5;margin: 0;padding: 0;}.email-container {background-color: #ffffff;max-width: 600px;margin: 20px auto;border-radius: 8px;box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);overflow: hidden;}.header {background-color: #0044cc;color: #ffffff;padding: 20px;text-align: center;}.header h1 {margin: 0;font-size: 24px;}.content {padding: 20px;color: #333333;}.content p {margin: 0 0 16px;font-size: 16px;line-height: 1.5;}.button-container {      text-align: center;      margin: 20px 0;    }    .button {      background-color: #0044cc;      color: #ffffff;      text-decoration: none;      padding: 12px 24px;      border-radius: 6px;      font-size: 16px;      display: inline-block    }    .footer {      background-color: #f1f1f1;      color: #777777;      text-align: center;      padding: 10px;      font-size: 14px;    }    .footer a {      color: #0044cc;      text-decoration: none;    }  </style></head><body><div class="email-container"><div class="header"><h1>Order Notification</h1> </div> <div class="content"><p>Dear Admin,</p><p>You have a new order placed on your website.</p><p>To review the order details, please click the button below:</p><div class="button-container"><a href="https://nepolian.com.np/orders" class="button">View Orders</a></div><p>If you have any questions, feel free to contact support.</p></div><div class="footer"><p>© 2025 Nepolian.com.np. All rights reserved.</p><p><a href="https://nepolian.com.np">Visit our website</a></p></div></div></body></html>`
        await sendEmail(subject, htmlcomtent);

        return { status: true, uuid: newTransactionUuid }
    };
    const handleCashOnDelivery = () => {
        if (userId === "") {
            setOpenLogin(true);

        } else {
            setPaymentMethod('cod');
            setAddressStep(true);
        }

    };


    // const initiateEsewaPayment = async (uuid: any) => {

    //     const merchantCode = process.env.NEXT_PUBLIC_ESEWA_SCD || "EPAYTEST";
    //     const amount = Math.round(total);
    //     const productCode = "EPAYTEST";
    //     const successUrl = "http://localhost:3000/payment/success";
    //     const failureUrl = "http://localhost:3000/payment/failure";



    //     const parameters = {
    //         amount: amount.toString(),
    //         tax_amount: "0",
    //         total_amount: `${total}`,
    //         transaction_uuid: uuid,
    //         product_code: productCode,
    //         product_service_charge: "0",
    //         product_delivery_charge: "0",
    //         success_url: successUrl,
    //         failure_url: failureUrl,
    //         signed_field_names: "total_amount,transaction_uuid,product_code",
    //     };

    //     const signature = generateSignature(parameters);

    //     const form = document.createElement("form");
    //     form.method = "POST";
    //     form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

    //     Object.entries(parameters).forEach(([key, value]) => {
    //         const input = document.createElement("input");
    //         input.type = "hidden";
    //         input.name = key;
    //         input.value = value;
    //         form.appendChild(input);
    //     });

    //     const signatureInput = document.createElement("input");
    //     signatureInput.type = "hidden";
    //     signatureInput.name = "signature";
    //     signatureInput.value = signature;
    //     form.appendChild(signatureInput);

    //     document.body.appendChild(form);
    //     form.submit();
    // };


    const confirmPayment = async () => {
        const orderSaved = await saveOrderToSupabase();
        const status = orderSaved.status;
        if (!status) {
            return;
        }

        if (paymentMethod === 'esewa') {
            // await initiateEsewaPayment(orderSaved.uuid);

        } else if (paymentMethod === 'cod') {
            localStorage.removeItem('cart')
            setCartItems([]);
            toast.success('Order placed successfully! We will contact you for delivery. Thankyou!')
        }

        setShowConfirmModal(false);

    };

    useEffect(() => {
        authSubscriptionRef.current = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_OUT' || !session) {
                handleLogin();
            } else if (event === 'SIGNED_IN') {
                console.log('User has signed in');
                handleLogin();
            }
        });

    }, []);

    // function generateSignature(parameters: Record<string, string>): string {
    //     const secretKey = process.env.NEXT_PUBLIC_ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q";
    //     const signatureString = `total_amount=${parameters.total_amount},transaction_uuid=${parameters.transaction_uuid},product_code=${parameters.product_code}`;
    //     const hash = CryptoJS.HmacSHA256(signatureString, secretKey)
    //     return CryptoJS.enc.Base64.stringify(hash);
    // }
    const proceedToConfirmation = () => {
        if (validateAddressForm()) {
            setShowConfirmModal(true);
            setAddressStep(false);
        }
    };

    // const handlePaymentConfirmation = () => {
    //     if (userId === "") {
    //         setOpenLogin(true);
    //     } else {
    //         setAddressStep(true);
    //     }

    // };

    const validateAddressForm = () => {
        if (!selectedProvince || !selectedDistrict || !localArea || !contactNumber || !fullName) {
            toast.error("Please fill out all address details");
            return false;
        }

        // Additional validation
        if (!/^\d{10}$/.test(contactNumber)) {
            toast.error("Please enter a valid 10-digit contact number");
            return false;
        }

        return true;
    };


    const renderAddressForm = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-syne">
            <div className="bg-white p-6 rounded-lg shadow-xl w-[500px]">
                <h2 className="text-xl font-bold mb-4">Delivery Address</h2>

                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full p-2 border rounded"
                    />

                    <input
                        type="text"
                        placeholder="Contact Number"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        className="w-full p-2 border rounded"
                    />

                    <select
                        value={selectedProvince}
                        onChange={(e) => {
                            setSelectedProvince(e.target.value);
                            setSelectedDistrict("");
                        }}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Select Province</option>
                        {Object.entries(nepalProvinces).map(([key, province]) => (
                            <option key={key} value={province.name}>
                                {province.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        disabled={!selectedProvince}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Select District</option>
                        {selectedProvince &&
                            Object.values(nepalProvinces)
                                .find(p => p.name === selectedProvince)
                                ?.districts.map(district => (
                                    <option key={district} value={district}>
                                        {district}
                                    </option>
                                ))
                        }
                    </select>

                    <input
                        type="text"
                        placeholder="Local Area/Address"
                        value={localArea}
                        onChange={(e) => setLocalArea(e.target.value)}
                        className="w-full p-2 border rounded"
                    />

                    <div className="flex justify-between">
                        <button
                            onClick={() => {
                                setAddressStep(false);
                                setPaymentMethod(null);
                            }}
                            className="px-4 py-2 bg-gray-200 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={proceedToConfirmation}
                            className="px-4 py-2 bg-green-600 text-white rounded"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div className="h-[5vw]">
                <Navbar open={openLogin} setOpen={setOpenLogin} />

            </div>
            <ToastContainer />
            <div className="w-[95vw] bg-white font-syne ">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold text-gray-800 mb-8 mt-8 md:mt-0"
                    >
                        Your Shopping Cart
                    </motion.h1>

                    {cartItems.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-xl text-gray-600">Your cart is empty</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-4"
                                >
                                    {cartItems.map((item, index) => (
                                        <motion.div
                                            key={`${item.id}-${index}`}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center space-x-4 transition-colors duration-200">
                                                <div className="relative w-[100px] h-[100px]">
                                                    <Image
                                                        src={item.image_url}
                                                        alt={item.product_name}
                                                        fill
                                                        className="rounded-lg object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-gray-800">
                                                        {item.product_name}
                                                    </h3>
                                                    <p className="text-gray-600">
                                                        {item.description}
                                                    </p>
                                                    <div className="flex items-center mt-2">
                                                        <div className="flex items-center mr-4">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                                                                className="h-8 w-8 flex items-center justify-center border rounded-l-md"
                                                            >
                                                                <Minus className="h-4 w-4" />
                                                            </button>
                                                            <span className="h-8 w-8 flex items-center justify-center border-y">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                                                                className="h-8 w-8 flex items-center justify-center border rounded-r-md"
                                                            >
                                                                <Plus className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                        <p className="text-lg font-bold text-gray-900 w-[95px]">
                                                            NPR <a className="font-helvetica">{(item.price * (item.quantity || 1)).toLocaleString()}</a>
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="h-10 w-10 inline-flex items-center justify-center rounded-md sm:bg-red-600/20 sm:hover:bg-red-900/30 text-red-500 transition-colors duration-200"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>

                            <div className="lg:col-span-1">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="lg:sticky lg:top-[5vw]"
                                >
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                            Order Summary
                                        </h2>
                                        <div className="space-y-2 mb-6">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                    Subtotal
                                                </span>
                                                <span className="font-semibold text-gray-600">
                                                    NPR <a className="font-helvetica font-[700]">{total.toLocaleString()}</a>
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                    Shipping
                                                </span>
                                                <span className="font-semibold text-gray-800">
                                                    Free
                                                </span>
                                            </div>
                                            <div className="border-t border-gray-200 pt-2 mt-2">
                                                <div className="flex justify-between">
                                                    <span className="text-lg font-bold text-gray-800">
                                                        Total
                                                    </span>
                                                    <span className="text-lg font-bold text-gray-800">
                                                        NPR <a className="font-helvetica font-[700]">{total.toLocaleString()}</a>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <button
                                                onClick={() => (handleCashOnDelivery())}
                                                className="w-full h-11 px-4 inline-flex items-center justify-center rounded-md bg-blue-600 font-medium text-white hover:bg-blue-700 transition-colors duration-200"
                                            >
                                                <div className="relative w-10 h-10 mr-2 ">
                                                    <div className="absolute bg-white w-6 h-6 top-2 left-2 rounded-[20px]"></div>
                                                    <Image
                                                        src={Cash.src}
                                                        alt="eSewa"
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>
                                                Cash on Delivery
                                            </button>

                                            {/* <button
                                                onClick={() => {
                                                    setPaymentMethod('esewa');
                                                    handlePaymentConfirmation();
                                                }}
                                                className="w-full h-11 px-4 inline-flex items-center justify-center rounded-md bg-green-600 font-medium text-white hover:bg-green-700 transition-colors duration-200"
                                            >
                                                <div className="relative w-16 h-10 mr-2">
                                                    <Image
                                                        src={Esewa.src}
                                                        alt="eSewa"
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>
                                                Pay with eSewa
                                            </button> */}
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    )}
                </div>
            </div>


            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
                    <div className="bg-white p-6 rounded-lg shadow-xl">
                        <h2 className="text-xl font-bold mb-4 font-syne">
                            {paymentMethod === 'cod'
                                ? 'Confirm Cash on Delivery'
                                : 'Confirm eSewa Payment'}
                        </h2>
                        <p className="mb-4 font-syne">
                            {paymentMethod === 'cod'
                                ? 'Are you sure you want to place this orders for Cash on Delivery? You cant undo it...'
                                : `Are you sure you want to purchase items totaling NPR ${total.toLocaleString()}?`}
                        </p>
                        <div className="flex justify-between">
                            <button
                                onClick={() => {
                                    setShowConfirmModal(false);
                                    setPaymentMethod(null);
                                }}
                                className="px-4 py-2 bg-gray-200 rounded font-syne"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmPayment}
                                className="px-4 py-2 bg-green-600 text-white rounded font-syne"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>

                </div>

            )}
            {addressStep && renderAddressForm()}
        </>
    )

}