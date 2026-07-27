import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { authMiddleware } from "@/middleware/auth";
import User from "@/models/User";


export const GET = async (req: NextRequest) => {
    try {
        await connectDB();

        // 1. Authenticate and authorize the admin
        const authResult = await authMiddleware(req);
        if (!authResult.success) {
            return NextResponse.json({ success: false, message: authResult.message }, { status: 401 });
        }

        const adminUser = await User.findById(authResult.user.id);
        if (!adminUser || adminUser.role !== 'admin') {
            return NextResponse.json({
                success: false,
                message: "Unauthorized: Only admins can access user data."
            }, { status: 403 });
        }

        // 2. Get query parameters for filtering, searching, and pagination
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const role = searchParams.get('role');
        const searchQuery = searchParams.get('search');

        const skip = (page - 1) * limit;

        // 3. Build the query object
        const query: {
            role?: string;
            $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
        } = {};

        if (role && ['admin', 'farmer', 'buyer'].includes(role)) {
            query.role = role;
        }

        if (searchQuery) {
            const searchRegex = { $regex: searchQuery, $options: 'i' }; // Case-insensitive search
            query.$or = [
                { fullName: searchRegex },
                { email: searchRegex },
            ];
        }

        // 4. Execute queries concurrently for efficiency
        const [users, totalUsers] = await Promise.all([
            User.find(query)
                .select('-password') // Exclude password from the result
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            User.countDocuments(query)
        ]);

        // 5. Return the paginated response
        return NextResponse.json({
            success: true,
            data: {
                users,
                pagination: {
                    total: totalUsers,
                    page,
                    limit,
                    totalPages: Math.ceil(totalUsers / limit),
                },
            },
        });

    } catch (error) {
        console.error("ADMIN_GET_USERS_ERROR", error);
        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
    }
};