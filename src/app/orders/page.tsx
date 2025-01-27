"use client"
import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import {
    AlertCircle,
    CheckCircle,
    CreditCard,
    MapPin,
    Package,
    Phone,
    Search,
    User,
    X,
    Filter,
    Calendar,
    Loader2,
    Truck,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { supabase } from '../_lib/Supabase';
import "@fontsource/syne";
import Navbar from '../products/_components/Navbar';

interface Product {
    price: number;
    quantity: number;
    product_id: number;
    name?: string;
}

interface DeliveryDetails {
    user_id: string;
    district: string;
    province: string;
    full_name: string;
    local_area: string;
    contact_number: string;
}

interface Order {
    id: number;
    created_at: string;
    payment_method: string;
    status: string;
    total_amount: number;
    transaction_uuid: string;
    products: Product[];
    delivery_details: DeliveryDetails;
    payment: boolean;
    product_delivered: boolean;
}

function App() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
    const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
    const [deliveryStatusFilter, setDeliveryStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('transaction_id');
    const [showDialog, setShowDialog] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [openLogin, setOpenLogin] = useState(false);

    // Pagination states
    const [page, setPage] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);
    const ORDERS_PER_PAGE = 10;

    useEffect(() => {
        fetchOrders();
    }, [page, statusFilter, paymentMethodFilter, paymentStatusFilter, deliveryStatusFilter]);

    async function fetchOrders() {
        try {
            setLoading(true);
            let query = supabase.from('orders').select('*', { count: 'exact' });

            // Apply filters
            if (statusFilter !== 'all') {
                query = query.eq('status', statusFilter);
            }

            if (paymentMethodFilter !== 'all') {
                query = query.eq('payment_method', paymentMethodFilter);
            }

            if (paymentStatusFilter !== 'all') {
                query = query.eq('payment', paymentStatusFilter === 'paid');
            }

            if (deliveryStatusFilter !== 'all') {
                query = query.eq('status', deliveryStatusFilter);
            }

            // Search conditions
            if (searchQuery) {
                if (searchType === 'transaction_id') {
                    query = query.ilike('transaction_uuid', `%${searchQuery}%`);

                } else if (searchType === 'customer_name') {
                    // Use ->> operator to access text value, and ILIKE for case-insensitive partial matching
                    query = query.ilike('delivery_details->>full_name', `%${searchQuery}%`);
                }
            }

            // Pagination
            const from = (page - 1) * ORDERS_PER_PAGE;
            const to = from + ORDERS_PER_PAGE - 1;

            const { data, error, count } = await query
                .order('created_at', { ascending: false })
                .range(from, to);

            if (error) throw error;

            setOrders(data || []);
            setTotalOrders(count || 0);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    }

    const markAsDelivered = async (orderId: number, event: React.MouseEvent) => {
        event.stopPropagation();
        try {
            const { error } = await supabase
                .from('orders')
                .update({
                    payment: true,
                    status: 'product_delivered'
                })
                .eq('id', orderId);

            if (error) throw error;

            // Update local state
            setOrders(orders.map(order =>
                order.id === orderId
                    ? { ...order, payment: true, status: 'product_delivered' }
                    : order
            ));

            if (selectedOrder?.id === orderId) {
                setSelectedOrder(prev =>
                    prev ? { ...prev, payment: true, status: 'product_delivered' } : null
                );
            }

            toast.success('Order marked as delivered');
        } catch (error) {
            console.error('Error marking order as delivered:', error);
            toast.error('Failed to mark order as delivered');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending_payment':
                return 'bg-amber-100 text-amber-800 border border-amber-200';
            case 'pending_delivery':
                return 'bg-blue-100 text-blue-800 border border-blue-200';
            case 'product_delivered':
                return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
            default:
                return 'bg-gray-100 text-gray-800 border border-gray-200';
        }
    };

    const handleOrderClick = (order: Order) => {
        setSelectedOrder(order);
        setShowDialog(true);
    };

    // Pagination handlers
    const handleNextPage = () => {
        if (page * ORDERS_PER_PAGE < totalOrders) {
            setPage(prev => prev + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(prev => prev - 1);
        }
    };

    return (
        <>
            <Navbar open={openLogin} setOpen={setOpenLogin}/>
            <div className="min-h-screen bg-gray-50/50 font-syne">
                <Toaster position="top-right" />

                {/* Header */}
                <header className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 py-6 ">
                        <div className="flex justify-between items-center">
                            <h1 className="text-3xl font-bold text-gray-900  mt-[7rem]">Orders Management</h1>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <Filter className="w-4 h-4" />
                                Filters
                            </button>
                        </div>
                    </div>
                </header>

                {/* Search and Filters */}
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="mb-6">
                        <div className="flex items-center gap-2">
                            <div className="relative flex-grow ">
                                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-10 w-full h-10 rounded-lg border-gray-200 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <select
                                className="h-10 px-4 rounded-lg border-gray-200 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                value={searchType}
                                onChange={(e) => setSearchType(e.target.value)}
                            >
                                <option value="transaction_id">Transaction ID</option>
                                <option value="customer_name">Customer Name</option>
                            </select>
                            <button
                                onClick={fetchOrders}
                                className="h-10 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-900 flex items-center gap-2"
                            >
                                <Search className="w-5 h-5" />
                                Search
                            </button>
                        </div>
                    </div>

                    {showFilters && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 animate-in slide-in-from-top">
                            <select
                                className="h-12 rounded-lg p-3 border-gray-200 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="pending_payment">Pending Payment</option>
                                <option value="pending_delivery">Pending Delivery</option>
                                <option value="product_delivered">Product Delivered</option>
                            </select>

                            <select
                                className="h-12 rounded-lg p-3 border-gray-200 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                value={paymentMethodFilter}
                                onChange={(e) => setPaymentMethodFilter(e.target.value)}
                            >
                                <option value="all">All Payment Methods</option>
                                <option value="cod">Cash on Delivery</option>
                                <option value="esewa">eSewa</option>
                            </select>

                            <select
                                className="h-12 rounded-lg p-3 border-gray-200 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                value={paymentStatusFilter}
                                onChange={(e) => setPaymentStatusFilter(e.target.value)}
                            >
                                <option value="all">All Payment Status</option>
                                <option value="paid">Paid</option>
                                <option value="unpaid">Unpaid</option>
                            </select>

                            <select
                                className="h-12 rounded-lg p-3 border-gray-200 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                value={deliveryStatusFilter}
                                onChange={(e) => setDeliveryStatusFilter(e.target.value)}
                            >
                                <option value="all">All Delivery Status</option>
                                <option value="product_delivered">Delivered</option>
                                <option value="pending_delivery">Pending Delivery</option>
                            </select>
                        </div>
                    )}

                    {/* Orders Table */}
                    <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Info</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-8 text-center">
                                                <div className="flex items-center justify-center gap-2 text-gray-500">
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Loading orders...
                                                </div>
                                            </td>
                                        </tr>
                                    ) : orders.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                                No orders found
                                            </td>
                                        </tr>
                                    ) : (
                                        orders.map((order) => (
                                            <tr
                                                key={order.id}
                                                onClick={() => handleOrderClick(order)}
                                                className="hover:bg-gray-50 cursor-pointer transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-gray-900">#{order.id}</span>
                                                        <div className="flex items-center gap-1 text-xs text-gray-500 font-mono">
                                                            <Calendar className="w-3 h-3" />
                                                            {new Date(order.created_at).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {order.delivery_details.full_name}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {order.delivery_details.district}, {order.delivery_details.province}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusColor(order.status)}`}>
                                                        {order.status.replace(/_/g, ' ').toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-sm text-gray-900 capitalize">
                                                            {order.payment_method}
                                                        </span>
                                                        <span className={`inline-flex items-center text-xs ${order.payment ? 'text-emerald-600' : 'text-red-600'}`}>
                                                            {order.payment ? (
                                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                            ) : (
                                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                            )}
                                                            {order.payment ? 'Paid' : 'Unpaid'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-medium text-gray-900 font-mono">
                                                        Rs. {order.total_amount.toLocaleString()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {order.status !== "product_delivered" && (
                                                        <button
                                                            onClick={(e) => markAsDelivered(order.id, e)}
                                                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                                                        >
                                                            <Truck className="w-4 h-4" />
                                                            Mark Delivered
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-between items-center px-6 py-4 bg-gray-50">
                            <span className="text-sm text-gray-700">
                                Showing {((page - 1) * ORDERS_PER_PAGE) + 1} to {Math.min(page * ORDERS_PER_PAGE, totalOrders)} of {totalOrders} orders
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handlePreviousPage}
                                    disabled={page === 1}
                                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </button>
                                <button
                                    onClick={handleNextPage}
                                    disabled={page * ORDERS_PER_PAGE >= totalOrders}
                                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Details Dialog */}
                {showDialog && selectedOrder && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-scroll shadow-xl">
                            <div className="flex flex-col h-full">
                                {/* Dialog Header */}
                                <div className="flex justify-between items-center p-6 border-b">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">Order #{selectedOrder.id}</h2>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Created on {new Date(selectedOrder.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowDialog(false)}
                                        className="text-gray-400 hover:text-gray-500 transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Dialog Content */}
                                <div className="p-6 overflow-y-auto">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Left Column */}
                                        <div className="space-y-6">
                                            {/* Order Status */}
                                            <div>
                                                <h3 className="text-lg font-semibold mb-3">Order Status</h3>
                                                <div className="space-y-3">
                                                    <span className={`px-3 py-1 inline-flex text-sm font-medium rounded-full ${getStatusColor(selectedOrder.status)}`}>
                                                        {selectedOrder.status.replace(/_/g, ' ').toUpperCase()}
                                                    </span>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <Truck className={`w-5 h-5 ${selectedOrder.product_delivered ? 'text-emerald-500' : 'text-gray-400'}`} />
                                                        <span className={`text-sm ${selectedOrder.product_delivered ? 'text-emerald-700' : 'text-gray-600'}`}>
                                                            {selectedOrder.product_delivered ? 'Product Delivered' : 'Delivery Pending'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Customer Details */}
                                            <div>
                                                <h3 className="text-lg font-semibold mb-3">Customer Details</h3>
                                                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <User className="w-5 h-5 text-gray-400" />
                                                        <span className="text-gray-700">{selectedOrder.delivery_details.full_name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Phone className="w-5 h-5 text-gray-400" />
                                                        <span className="text-gray-700 font-mono">{selectedOrder.delivery_details.contact_number}</span>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                                        <span className="text-gray-700">
                                                            {selectedOrder.delivery_details.local_area}<br />
                                                            {selectedOrder.delivery_details.district}, {selectedOrder.delivery_details.province}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column */}
                                        <div className="space-y-6">
                                            {/* Payment Details */}
                                            <div>
                                                <h3 className="text-lg font-semibold mb-3">Payment Details</h3>
                                                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <CreditCard className="w-5 h-5 text-gray-400" />
                                                        <span className="text-gray-700 capitalize">{selectedOrder.payment_method}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Package className="w-5 h-5 text-gray-400" />
                                                        <span className="text-gray-700 text-sm font-mono">{selectedOrder.transaction_uuid}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        {selectedOrder.payment ? (
                                                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                                                        ) : (
                                                            <AlertCircle className="w-5 h-5 text-red-500" />
                                                        )}
                                                        <span className={selectedOrder.payment ? 'text-emerald-700' : 'text-red-700'}>
                                                            {selectedOrder.payment ? 'Payment Completed' : 'Payment Pending'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Products */}
                                            <div>
                                                <h3 className="text-lg font-semibold mb-3">Products</h3>
                                                <div className="space-y-3">
                                                    {selectedOrder.products.map((product, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex justify-between items-center bg-gray-50 p-4 rounded-lg"
                                                        >
                                                            <div>
                                                                <p className="font-medium text-gray-900">{product.name || `Product #${product.product_id}`}</p>
                                                                <p className="text-sm text-gray-500 mt-1">
                                                                    Quantity: {product.quantity}
                                                                </p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-medium text-gray-900 font-mono">Rs. {product.price.toLocaleString()}</p>
                                                                <p className="text-sm text-gray-500 mt-1 font-mono">
                                                                    Total: Rs. {(product.price * product.quantity).toLocaleString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Dialog Footer */}
                                <div className="border-t p-6 bg-gray-50">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-700 font-medium">Total Amount</span>
                                        <span className="text-xl font-bold text-gray-900 font-mono">
                                            Rs. {selectedOrder.total_amount.toLocaleString()}
                                        </span>
                                    </div>
                                    {selectedOrder.status !== "product_delivered" && (
                                        <button
                                            onClick={(e) => markAsDelivered(selectedOrder.id, e)}
                                            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                                        >
                                            <Truck className="w-4 h-4" />
                                            Mark as Delivered
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}


            </div>
        </>
    );
}

export default App;