import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ReduxProvider } from '@/redux/provider';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NourishNet',
  description: 'Community-Driven Food Redistribution',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <Navbar />
          <main className="container mx-auto p-4 min-h-screen">
            {children}
          </main>
        </ReduxProvider>
      </body>
    </html>
  );
}
