import { Document, model, models, Schema } from "mongoose";

export interface IUser extends Document {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    profileImage?: string;
    role: "farmer" | "admin";
    createdAt: Date;
}

const UserSchema = new Schema<IUser>({
    fullName: {
        type: String,
        required: true,
        tri: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true,
        select: false
    },

    phone: {
        type: String
    },

    address: {
        type: String
    },

    profileImage: {
        type: String
    },

    role: {
        type: String,
        enum: ["farmer", "admin"],
        default: "farmer"
    },
}, { timestamps: true });

const User = models.User || model<IUser>("User", UserSchema);

export default User;