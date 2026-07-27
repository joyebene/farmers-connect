import mongoose, { Document, model, models, Schema } from "mongoose";

export interface IProduct extends Document {
    title: string;
    description: string;
    price: number;
    quantity: number;
    category: string;
    images: string[];
    farmer: mongoose.Types.ObjectId;
    location?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    images: [{
        type: String
    }],

    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    location: {
        type: String,
    }

}, { timestamps: true });

const Product = models.Product || model<IProduct>("Product", ProductSchema);

export default Product;