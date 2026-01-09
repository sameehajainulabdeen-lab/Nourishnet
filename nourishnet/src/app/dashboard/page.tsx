'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function DashboardPage() {
    const { user, token, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'donor' | 'recipient'>('donor');

    useEffect(() => {
        if (!isAuthenticated && typeof window !== 'undefined') {
            router.push('/login');
        } else if (token) {
            fetchDashboard();
        }
    }, [token, isAuthenticated]);

    const fetchDashboard = async () => {
        try {
            const res = await axios.get('/api/dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(res.data);
            // Auto-switch tab based on role default
            if (user?.role === 'INDIVIDUAL') setActiveTab('recipient');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRespond = async (reqId: string, status: 'ACCEPTED' | 'REJECTED') => {
        try {
            await axios.post(`/api/requests/${reqId}/respond`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchDashboard(); // Refresh
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-600"></div>
        </div>
    );

    if (!data) return <div className="p-4 text-center text-red-500">Error loading dashboard</div>;

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <div className="mb-8 p-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl shadow-xl text-white">
                <h1 className="text-3xl font-bold mb-2">Welcome Back, {user?.name}!</h1>
                <p className="opacity-90">Manage your donations and requests from here.</p>
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 mb-8 border-b border-gray-200">
                {((data.myListings && data.myListings.length > 0) || user?.role !== 'INDIVIDUAL') && (
                    <button
                        onClick={() => setActiveTab('donor')}
                        className={`pb-3 px-2 font-semibold text-lg transition-colors ${activeTab === 'donor' ? 'border-b-4 border-emerald-500 text-emerald-700' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        My Donations
                    </button>
                )}
                <button
                    onClick={() => setActiveTab('recipient')}
                    className={`pb-3 px-2 font-semibold text-lg transition-colors ${activeTab === 'recipient' ? 'border-b-4 border-emerald-500 text-emerald-700' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    My Requests
                </button>
            </div>

            <div className="grid grid-cols-1 gap-8">

                {/* Donor Section */}
                {activeTab === 'donor' && (
                    <div className="animate-fade-in">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Listings Column */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center text-sm">📋</span>
                                    My Listings
                                </h2>
                                {data.myListings?.length === 0 ? <p className="text-gray-500 italic">No listings created yet.</p> : (
                                    <ul className="space-y-4">
                                        {data.myListings?.map((l: any) => (
                                            <li key={l._id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-all">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-bold text-gray-900">{l.title}</span>
                                                    <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase ${l.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>{l.status}</span>
                                                </div>
                                                <span className="text-xs text-gray-500">Posted: {new Date(l.createdAt).toLocaleDateString()}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Incoming Requests Column */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center text-sm">📩</span>
                                    Incoming Requests
                                </h2>
                                {data.incomingRequests?.length === 0 ? <p className="text-gray-500 italic">No requests received yet.</p> : (
                                    <div className="space-y-4">
                                        {data.incomingRequests?.map((req: any) => (
                                            <div key={req._id} className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                                                <div className="flex justify-between mb-2">
                                                    <h3 className="font-semibold text-gray-900">{req.listingId?.title}</h3>
                                                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${req.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                                                            req.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                                        }`}>{req.status}</span>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-1"><span className="font-medium">From:</span> {req.recipientId?.name}</p>
                                                <p className="text-sm text-gray-600 mb-4 bg-gray-50 p-2 rounded italic">"{req.message}"</p>

                                                {req.status === 'PENDING' && (
                                                    <div className="flex gap-3">
                                                        <button onClick={() => handleRespond(req._id, 'ACCEPTED')} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition">Accept</button>
                                                        <button onClick={() => handleRespond(req._id, 'REJECTED')} className="flex-1 bg-white border border-red-200 text-red-600 py-2 rounded-lg text-sm font-semibold hover:bg-red-50 transition">Reject</button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Recipient Section */}
                {activeTab === 'recipient' && (
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
                        <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                            <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm">📤</span>
                            My Requests
                        </h2>
                        {data.myRequests?.length === 0 ? <p className="text-gray-500 italic">You haven't requested any food yet.</p> : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {data.myRequests?.map((req: any) => (
                                    <div key={req._id} className="p-6 border border-gray-100 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-md transition-all">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="font-bold text-gray-900">{req.listingId?.title}</h3>
                                            <span className={`text-xs px-3 py-1 rounded-full font-bold ${req.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                                                    req.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                                }`}>{req.status}</span>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-2">Message sent:</p>
                                        <p className="text-gray-700 bg-white p-3 rounded-lg border border-gray-100 text-sm mb-2">{req.message}</p>
                                        <p className="text-xs text-gray-400 text-right">{new Date(req.createdAt).toLocaleDateString()}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}
