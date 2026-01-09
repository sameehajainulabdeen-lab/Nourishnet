import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash: string;
    role: 'INDIVIDUAL' | 'BUSINESS' | 'NGO' | 'ADMIN';
    address?: {
        line1: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    phone?: string;
    isVerified: boolean;
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['INDIVIDUAL', 'BUSINESS', 'NGO', 'ADMIN'], default: 'INDIVIDUAL' },
    address: {
        line1: String,
        city: String,
        state: String,
        postalCode: String,
        country: String
    },
    phone: { type: String },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
