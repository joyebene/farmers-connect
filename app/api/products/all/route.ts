import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export const GET = async () => {
    try {
        await connectDB();

        // Fetch all products and populate the 'farmer' field with their name and location
        const products = await Product.find({})
            .populate('farmer', 'fullName location') // Select which farmer fields to include
            .sort({ createdAt: -1 }); // Sort by newest first

        return NextResponse.json({
            success: true,
            products,
        });

    } catch (error) {
        console.error("GET_ALL_PRODUCTS_ERROR", error);
        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json({
            success: false,
            message: errorMessage
        }, { status: 500 });
    }
};