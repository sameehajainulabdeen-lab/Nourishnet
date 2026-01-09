'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/redux/features/authSlice';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('/api/auth/login', { email, password });
            dispatch(setCredentials(res.data));
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">Welcome Back</h1>
                    <p className="text-gray-500 mt-2">Sign in to continue sharing goodness.</p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-md">
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-gray-800 bg-gray-50 focus:bg-white"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-gray-800 bg-gray-50 focus:bg-white"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                    >
                        Sign In
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-600">
                    Don't have an account? <Link href="/register" className="text-emerald-600 font-semibold hover:underline">Register now</Link>
                </p>
            </div>
        </div>
    );
}
