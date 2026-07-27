import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import { authMiddleware } from '@/middleware/auth';

export const GET = async (req: NextRequest) => {
  try {
    await connectDB();

    // Authenticate the user and get their ID
    const authResult = await authMiddleware(req);
    if (!authResult.success) {
      return NextResponse.json({ success: false, message: authResult.message }, { status: 401 });
    }
    
    const farmerId = authResult.user.id;

    // Find all products where the 'farmer' field matches the authenticated user's ID
    const products = await Product.find({ farmer: farmerId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, products });

  } catch (error) {
    console.error("GET_MY_PRODUCTS_ERROR", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
};