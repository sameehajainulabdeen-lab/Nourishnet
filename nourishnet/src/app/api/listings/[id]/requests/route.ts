import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import FoodRequest from '@/models/FoodRequest';
import FoodListing from '@/models/FoodListing';

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

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const user = verifyToken(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params; // listingId
        const body = await req.json();

        // Check if listing exists
        const listing = await FoodListing.findById(id);
        if (!listing) {
            return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
        }

        if (listing.status !== 'AVAILABLE') {
            return NextResponse.json({ error: 'Listing is not available' }, { status: 400 });
        }

        // Check if user is the donor (cannot request own food)
        if (listing.donorId.toString() === user.id) {
            return NextResponse.json({ error: 'You cannot request your own donation' }, { status: 400 });
        }

        // Check if user already requested
        const existingReq = await FoodRequest.findOne({ listingId: id, recipientId: user.id });
        if (existingReq) {
            return NextResponse.json({ error: 'Request already exists' }, { status: 400 });
        }

        const request = await FoodRequest.create({
            listingId: id,
            recipientId: user.id,
            message: body.message || 'I would like to request this food.',
            status: 'PENDING'
        });

        return NextResponse.json(request, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}
