import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { authMiddleware } from "@/middleware/auth";
import User from "@/models/User";
import Product from "@/models/Product";

// GET all products with search and pagination for admins
export const GET = async (req: NextRequest) => {
    try {
        await connectDB();

        const authResult = await authMiddleware(req);
        if (!authResult.success) {
            return NextResponse.json({ success: false, message: authResult.message }, { status: 401 });
        }

        const adminUser = await User.findById(authResult.user.id);
        if (!adminUser || adminUser.role !== 'admin') {
            return NextResponse.json({
                success: false,
                message: "Unauthorized: Only admins can access product data."
            }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const searchQuery = searchParams.get('search');

        const skip = (page - 1) * limit;

        const query: {
            $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
        } = {};

        if (searchQuery) {
            const searchRegex = { $regex: searchQuery, $options: 'i' };
            query.$or = [
                { title: searchRegex },
                { description: searchRegex },
            ];
        }

        const [products, totalProducts] = await Promise.all([
            Product.find(query)
                .populate('farmer', 'fullName email') // Show who owns the product
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Product.countDocuments(query)
        ]);

        return NextResponse.json({
            success: true,
            data: {
                products,
                pagination: {
                    total: totalProducts,
                    page,
                    limit,
                    totalPages: Math.ceil(totalProducts / limit),
                },
            },
        });

    } catch (error) {
        console.error("ADMIN_GET_PRODUCTS_ERROR", error);
        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
    }
};

// DELETE a product by ID for admins
export const DELETE = async (req: NextRequest) => {
    try {
        await connectDB();

        const authResult = await authMiddleware(req);
        if (!authResult.success) {
            return NextResponse.json({ success: false, message: authResult.message }, { status: 401 });
        }

        const adminUser = await User.findById(authResult.user.id);
        if (!adminUser || adminUser.role !== 'admin') {
            return NextResponse.json({
                success: false,
                message: "Unauthorized: Only admins can delete products."
            }, { status: 403 });
        }

        const { productId } = await req.json();

        if (!productId) {
            return NextResponse.json({
                success: false,
                message: "Missing required field: productId is required."
            }, { status: 400 });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        await Product.findByIdAndDelete(productId);

        return NextResponse.json({
            success: true,
            message: "Product deleted successfully.",
        });

    } catch (error) {
        console.error("ADMIN_DELETE_PRODUCT_ERROR", error);
        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
    }
};