import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 flex flex-col items-center justify-center text-center relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50 rounded-3xl mt-4 border border-emerald-100/50 shadow-sm">

        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2 animate-blob animation-delay-2000"></div>

        <div className="z-10 px-4">
          <span className="inline-block py-1 px-3 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold mb-6 animate-fade-in-up">
            🌱 Community-Driven Food Redistribution
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
            Share Food, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              Share Hope.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Connect with your community to reduce food waste and help those in need. Join NourishNet today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-emerald-600 text-white rounded-full text-lg font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ring-2 ring-emerald-600 ring-offset-2"
            >
              Get Started
            </Link>
            <Link
              href="/listings"
              className="px-8 py-4 bg-white text-emerald-700 border border-emerald-100 rounded-full text-lg font-bold shadow-sm hover:bg-emerald-50 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              Browse Food
            </Link>
          </div>
        </div>
      </section>

      {/* Stats / Info Section */}
      <section className="w-full py-20 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { title: 'Donate Surplus', desc: 'Restaurants, businesses, and individuals can list surplus food instantly.', icon: '🍲' },
            { title: 'Find Food', desc: 'Search for nearby available food and request pickup easily.', icon: '📍' },
            { title: 'Reduce Waste', desc: 'Help the environment and community by bridging the gap.', icon: '🌍' },
          ].map((item, idx) => (
            <div key={idx} className="group p-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Simple CTA */}
      <section className="w-full py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Ready to make a difference?</h2>
        <Link href="/register" className="text-emerald-600 font-bold text-lg hover:underline">Join the movement &rarr;</Link>
      </section>
    </div>
  );
}
