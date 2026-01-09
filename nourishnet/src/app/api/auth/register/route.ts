import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { name, email, password, role, address, phone } = await req.json();

        if (!email || !password || !name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            passwordHash,
            role: role || 'INDIVIDUAL',
            address,
            phone
        });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );

        // Return user without password
        const userObj = user.toObject();
        const { passwordHash: _ph, ...userWithoutPass } = userObj;

        return NextResponse.json({ token, user: userWithoutPass }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}
