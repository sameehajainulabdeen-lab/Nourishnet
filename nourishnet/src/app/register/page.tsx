'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/redux/features/authSlice';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'INDIVIDUAL',
        address: { line1: '', city: '', state: '', postalCode: '', country: '' },
        phone: ''
    });
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: { ...prev.address, [addressField]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('/api/auth/register', formData);
            dispatch(setCredentials(res.data));
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="flex justify-center items-center py-10 min-h-[90vh]">
            <div className="w-full max-w-2xl bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">Join NourishNet</h1>
                    <p className="text-gray-500 mt-2">Create an account to start your journey.</p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-md">
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input name="name" placeholder="John Doe" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-gray-800 bg-gray-50 focus:bg-white" required />
                    </div>

                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input name="email" type="email" placeholder="john@example.com" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-gray-800 bg-gray-50 focus:bg-white" required />
                    </div>

                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input name="password" type="password" placeholder="••••••••" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-gray-800 bg-gray-50 focus:bg-white" required />
                    </div>

                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">I am a...</label>
                        <select name="role" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-gray-800 bg-gray-50 focus:bg-white">
                            <option value="INDIVIDUAL">Individual Donor/Recipient</option>
                            <option value="BUSINESS">Business (Restaurant/Store)</option>
                            <option value="NGO">NGO / Charity</option>
                        </select>
                    </div>

                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input name="phone" placeholder="+1 234 567 890" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-gray-800 bg-gray-50 focus:bg-white" />
                    </div>

                    <div className="md:col-span-2 mt-2">
                        <h3 className="font-semibold text-gray-900 border-b pb-2 mb-4">Address Details</h3>
                    </div>

                    <div className="md:col-span-2">
                        <input name="address.line1" placeholder="Address Line 1" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-gray-800 bg-gray-50 focus:bg-white" />
                    </div>

                    <input name="address.city" placeholder="City" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-gray-800 bg-gray-50 focus:bg-white" />
                    <input name="address.state" placeholder="State/Province" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-gray-800 bg-gray-50 focus:bg-white" />
                    <input name="address.postalCode" placeholder="Postal Code" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-gray-800 bg-gray-50 focus:bg-white" />
                    <input name="address.country" placeholder="Country" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-gray-800 bg-gray-50 focus:bg-white" />

                    <div className="md:col-span-2 mt-6">
                        <button type="submit" className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
                            Create Account
                        </button>
                    </div>
                </form>
                <p className="mt-8 text-center text-sm text-gray-600">
                    Already have an account? <Link href="/login" className="text-emerald-600 font-semibold hover:underline">Login here</Link>
                </p>
            </div>
        </div>
    );
}
