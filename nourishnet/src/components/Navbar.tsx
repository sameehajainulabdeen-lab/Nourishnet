'use client';

import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { logout } from '@/redux/features/authSlice';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        router.push('/login');
    };

    return (
        <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-100 shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-emerald-200 shadow-lg group-hover:scale-105 transition-transform">
                            N
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
                            NourishNet
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/listings" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">
                            Find Food
                        </Link>

                        {isAuthenticated ? (
                            <>
                                {user?.role !== 'INDIVIDUAL' && (
                                    <Link href="/listings/create" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">
                                        Donate
                                    </Link>
                                )}
                                <Link href="/dashboard" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">
                                    Dashboard
                                </Link>
                                <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                                    <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                                        {user?.name}
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="text-sm font-medium text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link href="/login" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-5 py-2.5 rounded-full bg-emerald-600 text-white font-medium shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-600 hover:text-gray-900 focus:outline-none"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in-down">
                    <div className="px-4 pt-2 pb-6 space-y-1">
                        <Link href="/listings" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-600">
                            Find Food
                        </Link>
                        {isAuthenticated ? (
                            <>
                                {user?.role !== 'INDIVIDUAL' && (
                                    <Link href="/listings/create" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-600">
                                        Donate
                                    </Link>
                                )}
                                <Link href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-600">
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-600">
                                    Login
                                </Link>
                                <Link href="/register" className="block px-3 py-2 rounded-md text-base font-medium text-emerald-600 hover:bg-emerald-50">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
