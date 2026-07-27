import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { authMiddleware } from "@/middleware/auth";


// GET a single product by ID (Public)
export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string}>}) => {
    try {
        await connectDB();
        const { id } = await params;
        

        console.log('Fetching product with ID:', id);

        const product = await Product.findById(id).populate('farmer', 'fullName location');

        if (!product) {
            console.log('Product not found in database for ID:', id);
            return NextResponse.json({
                success: false,
                message: "Product not found"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            product,
        });

    } catch (error) {
        console.error("GET_PRODUCT_ERROR", error);
        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json({
            success: false,
            message: errorMessage
        }, { status: 500 });
    }
};

// UPDATE a product (Protected: Farmer only)
export const PUT = async (req: NextRequest, { params }: { params: Promise<{ id: string}>}) => {
    try {
        await connectDB();
        const { id } = await params;

        const authResult = await authMiddleware(req);
        if (!authResult.success) {
            return NextResponse.json({ success: false, message: authResult.message }, { status: 401 });
        }

        const product = await Product.findById(id);
        if (!product) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        // Check if the logged-in user is the owner of the product
        if (product.farmer.toString() !== authResult.user.id) {
            return NextResponse.json({ success: false, message: "Unauthorized: You can only update your own products." }, { status: 403 });
        }

        const body = await req.json();
        const { title, description, price, quantity, category, images, location } = body;

        const updatedProduct = await Product.findByIdAndUpdate(id, {
            title, description, price, quantity, category, images, location
        }, { new: true, runValidators: true });

        return NextResponse.json({
            success: true,
            message: "Product updated successfully!",
            product: updatedProduct,
        });

    } catch (error) {
        console.error("UPDATE_PRODUCT_ERROR", error);
        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
    }
};

// DELETE a product (Protected: Farmer only)
export const DELETE = async (req: NextRequest,{ params } : {params: Promise<{ id: string }>}) => {
    try {
        await connectDB();
        const { id } = await params;

        const authResult = await authMiddleware(req);
        if (!authResult.success) {
            return NextResponse.json({ success: false, message: authResult.message }, { status: 401 });
        }

        const product = await Product.findById(id);
        if (!product) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        // Check if the logged-in user is the owner of the product
        if (product.farmer.toString() !== authResult.user.id) {
            return NextResponse.json({ success: false, message: "Unauthorized: You can only delete your own products." }, { status: 403 });
        }

        await Product.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: "Product deleted successfully!",
        });

    } catch (error) {
        console.error("DELETE_PRODUCT_ERROR", error);
        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
    }
};