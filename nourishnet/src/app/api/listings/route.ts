import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import FoodListing from '@/models/FoodListing';

// Helper to verify token
const verifyToken = (req: Request) => {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.split(' ')[1];
    try {
        return jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    } catch (error) {
        return null;
    }
};

export async function POST(req: Request) {
    try {
        await dbConnect();
        const user = verifyToken(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Only Donors (Individual/Business/NGO) should post? Spec isn't strict, but implied.

        const body = await req.json();
        const listing = await FoodListing.create({
            ...body,
            donorId: user.id
        });

        return NextResponse.json(listing, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        await dbConnect();
        // Basic filtering
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status') || 'AVAILABLE';

        const listings = await FoodListing.find({ status }).populate('donorId', 'name email userType address');
        return NextResponse.json(listings);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}
