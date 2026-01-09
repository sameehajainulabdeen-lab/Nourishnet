import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFoodListing extends Document {
    title: string;
    description: string;
    imageUrls: string[];
    quantity: string;
    expiryDate: Date;
    pickupLocation: {
        type: 'Point';
        coordinates: number[]; // [lng, lat]
    };
    status: 'AVAILABLE' | 'RESERVED' | 'PICKED_UP' | 'EXPIRED';
    donorId: mongoose.Types.ObjectId;
    createdAt: Date;
}

const FoodListingSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: String,
    imageUrls: [String],
    quantity: String,
    expiryDate: Date,
    pickupLocation: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], index: '2dsphere' }
    },
    status: { type: String, enum: ['AVAILABLE', 'RESERVED', 'PICKED_UP', 'EXPIRED'], default: 'AVAILABLE' },
    donorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

const FoodListing: Model<IFoodListing> = mongoose.models.FoodListing || mongoose.model<IFoodListing>('FoodListing', FoodListingSchema);
export default FoodListing;
