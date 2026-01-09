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

        const { id } = await params;
        const { status } = await req.json(); // ACCEPTED or REJECTED

        if (!['ACCEPTED', 'REJECTED'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const request = await FoodRequest.findById(id).populate('listingId');
        if (!request) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        const listing = request.listingId as any; // populated
        if (listing.donorId.toString() !== user.id) {
            return NextResponse.json({ error: 'Not authorized to respond to this request' }, { status: 403 });
        }

        request.status = status;
        request.updatedAt = new Date();
        await request.save();

        if (status === 'ACCEPTED') {
            // Update listing status
            await FoodListing.findByIdAndUpdate(listing._id, { status: 'RESERVED' });
            // Suggestion: Reject other pending requests? For now, keep simple.
        }

        return NextResponse.json(request);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}
