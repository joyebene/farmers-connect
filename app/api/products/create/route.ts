import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import User from "@/models/User";
import { authMiddleware } from "@/middleware/auth";

export const POST = async (req: NextRequest) => {
    try {
        await connectDB();

        const authResult = await authMiddleware(req);
        if (!authResult.success) {
            return NextResponse.json({
                success: false,
                message: authResult.message
            }, { status: 401 });
        }

        const user = await User.findById(authResult.user.id);
        if (!user || user.role !== 'farmer') {
            return NextResponse.json({
                success: false,
                message: "Unauthorized: Only farmers can create products."
            }, { status: 403 });
        }

        const body = await req.json();
        const { title, description, price, quantity, category, images, location } = body;

        if (!title || !description || !price || !quantity || !category) {
            return NextResponse.json({
                success: false,
                message: "Missing required fields: title, description, price, quantity, and category are required."
            }, { status: 400 });
        }

        const newProduct = new Product({
            title,
            description,
            price,
            quantity,
            category,
            images: images || [],
            location: location || user.address, // Default to farmer's address if not provided
            farmer: user._id,
        });

        await newProduct.save();

        return NextResponse.json({
            success: true,
            message: "Product created successfully!",
            product: newProduct,
        }, { status: 201 });

    } catch (error) {
        console.error("CREATE_PRODUCT_ERROR", error);
        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json({
            success: false,
            message: errorMessage
        }, { status: 500 });
    }
};