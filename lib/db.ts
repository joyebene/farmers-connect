import mongoose from "mongoose";
import '@/models/User';
import '@/models/Product';
import '@/models/Order';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in .env");
}

let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = {
        conn: null,
        promise: null
    };
}

export async function connectDB() {
    if (cached.conn) {
        console.log("Using cached database connection");
        return cached.conn;
    }

    if (!cached.promise) {
        console.log("Creating new database connection");
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false, // Disable command buffering
        }).then((mongoose) => {
            return mongoose;
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}