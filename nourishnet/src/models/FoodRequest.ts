import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFoodRequest extends Document {
    listingId: mongoose.Types.ObjectId;
    recipientId: mongoose.Types.ObjectId;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
    message: string;
    createdAt: Date;
    updatedAt?: Date;
}

const FoodRequestSchema: Schema = new Schema({
    listingId: { type: Schema.Types.ObjectId, ref: 'FoodListing', required: true },
    recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED'], default: 'PENDING' },
    message: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date
});

const FoodRequest: Model<IFoodRequest> = mongoose.models.FoodRequest || mongoose.model<IFoodRequest>('FoodRequest', FoodRequestSchema);
export default FoodRequest;
