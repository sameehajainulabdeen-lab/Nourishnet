'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function CreateListingPage() {
    const { token, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        quantity: '',
        expiryDate: '',
    });

    if (!isAuthenticated && typeof window !== 'undefined') {
        router.push('/login');
        // return null; // Logic handled by effect usually, but this is simple check
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('/api/listings', {
                ...formData,
                // Mocking location for now as per requirements "Geo-search (basic)"
                pickupLocation: { type: 'Point', coordinates: [0, 0] }
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            router.push('/listings');
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to create listing');
        }
    };

    return (
        <div className="flex justify-center py-10">
            <div className="w-full max-w-3xl bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
                <div className="border-b border-gray-100 pb-6 mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">Donate Food</h1>
                    <p className="text-gray-500 mt-2">Fill in the details to share your surplus food.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                            <input name="title" placeholder="e.g., 50 Loaves of Fresh Bread" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-gray-800 bg-gray-50 focus:bg-white" required />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                            <textarea rows={4} name="description" placeholder="Describe the food, condition, and pickup instructions..." onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-gray-800 bg-gray-50 focus:bg-white" />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
                            <input name="quantity" placeholder="e.g., 5 kg" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-gray-800 bg-gray-50 focus:bg-white" required />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
                            <input type="date" name="expiryDate" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-gray-800 bg-gray-50 focus:bg-white" required />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
                            Post Donation Listing
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
