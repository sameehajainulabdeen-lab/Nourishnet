'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Link from 'next/link';

// ... imports
interface FoodListing {
    _id: string;
    title: string;
    description: string;
    quantity: string;
    expiryDate: string;
    status: string;
    donorId: {
        _id: string;
        name: string;
        address: { city: string; state: string; };
    };
}

export default function ListingsPage() {
    const [listings, setListings] = useState<FoodListing[]>([]);
    const { token, isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        try {
            const res = await axios.get('/api/listings');
            setListings(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRequest = async (id: string) => {
        if (!isAuthenticated || !token) {
            alert('Please login to request food');
            return;
        }
        try {
            await axios.post(`/api/listings/${id}/requests`, { message: 'I need this food.' }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Request sent successfully!');
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to request');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-600"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900">Available Food</h1>
                    <p className="text-gray-500 mt-2">Browse local donations and help reduce waste.</p>
                </div>
                {isAuthenticated && (
                    <Link href="/listings/create" className="hidden md:inline-block px-6 py-2.5 bg-emerald-600 text-white rounded-full font-semibold shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:shadow-xl transition-all">
                        + Donate Food
                    </Link>
                )}
            </div>

            {listings.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
                    <p className="text-xl text-gray-500 font-medium">No listings available right now. Check back later!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {listings.map((listing) => {
                        const isOwner = user?._id === listing.donorId._id;

                        return (
                            <div key={listing._id} className="group flex flex-col bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">

                                {/* Image Placeholder */}
                                <div className="h-48 bg-gray-100 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
                                    {/* Simulate Image */}
                                    <div className="w-full h-full flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500">
                                        🍲
                                    </div>
                                    <span className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur text-emerald-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                        {listing.status}
                                    </span>
                                </div>

                                <div className="p-6 flex-grow flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <h2 className="text-xl font-bold text-gray-900 line-clamp-1">{listing.title}</h2>
                                    </div>

                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{listing.description}</p>

                                    <div className="space-y-2 mb-6 text-sm text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <span className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs">📦</span>
                                            <span className="font-medium text-gray-700">{listing.quantity}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs">⏳</span>
                                            <span>Exp: {new Date(listing.expiryDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs">👤</span>
                                            <span>{listing.donorId?.name} ({listing.donorId?.address?.city || 'Local'})</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        {isOwner ? (
                                            <button
                                                disabled
                                                className="w-full bg-gray-100 text-gray-400 py-3 rounded-xl font-bold shadow-none cursor-not-allowed border border-gray-200"
                                            >
                                                Your Donation
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleRequest(listing._id)}
                                                className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-md hover:bg-emerald-700 hover:shadow-lg transition-all active:scale-95"
                                            >
                                                Request Food
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
}
