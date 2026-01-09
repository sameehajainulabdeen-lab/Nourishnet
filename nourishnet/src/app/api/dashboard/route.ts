import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import FoodListing from '@/models/FoodListing';
import FoodRequest from '@/models/FoodRequest';

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

export async function GET(req: Request) {
    try {
        await dbConnect();
        const user = verifyToken(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let data = {};

        // Check user role from token or DB. The token has role.
        // If we want to be safe, fetch user from DB. But token is ok for this exercise.

        // FETCH DATA
        if (['INDIVIDUAL', 'BUSINESS', 'NGO'].includes(user.role)) {
            // Is a potential donor. Also checks if they made any donations.
            const myListings = await FoodListing.find({ donorId: user.id });
            const myListingIds = myListings.map(l => l._id);
            const incomingRequests = await FoodRequest.find({ listingId: { $in: myListingIds } }).populate('recipientId', 'name email').populate('listingId', 'title');

            data = { ...data, myListings, incomingRequests };
        }

        // Is a potential recipient (everyone can be)
        const myRequests = await FoodRequest.find({ recipientId: user.id }).populate('listingId');
        data = { ...data, myRequests };

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}
