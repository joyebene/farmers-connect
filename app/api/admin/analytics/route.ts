import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { authMiddleware } from "@/middleware/auth";
import User from "@/models/User";
import Product from "@/models/Product";
import Order from "@/models/Order";

export const GET = async (req: NextRequest) => {
    try {
        await connectDB();

        // 1. Authenticate and authorize the admin
        const authResult = await authMiddleware(req);
        if (!authResult.success) {
            return NextResponse.json({ success: false, message: authResult.message }, { status: 401 });
        }

        const user = await User.findById(authResult.user.id);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({
                success: false,
                message: "Unauthorized: Only admins can access analytics."
            }, { status: 403 });
        }

        // 2. Fetch user and product counts concurrently
        const [
            totalUsers,
            totalFarmers,
            totalBuyers,
            totalProducts
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: 'farmer' }),
            User.countDocuments({ role: 'buyer' }),
            Product.countDocuments()
        ]);

        // 3. Use an aggregation pipeline for complex order analytics
        const orderAnalytics = await Order.aggregate([
            {
                $group: {
                    _id: null, // Group all orders into a single document
                    totalOrders: { $sum: 1 },
                    totalRevenue: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "delivered"] }, "$totalPrice", 0]
                        }
                    },
                    pendingOrders: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "pending"] }, 1, 0]
                        }
                    },
                    acceptedOrders: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "accepted"] }, 1, 0]
                        }
                    },
                    rejectedOrders: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "rejected"] }, 1, 0]
                        }
                    },
                    deliveredOrders: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "delivered"] }, 1, 0]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0 // Exclude the _id field from the output
                }
            }
        ]);

        // 4. Combine all stats into a single response object
        const stats = {
            users: {
                total: totalUsers,
                farmers: totalFarmers,
                buyers: totalBuyers,
            },
            products: {
                total: totalProducts,
            },
            orders: orderAnalytics[0] || { // Use the result or a default object if no orders exist
                totalOrders: 0,
                totalRevenue: 0,
                pendingOrders: 0,
                acceptedOrders: 0,
                rejectedOrders: 0,
                deliveredOrders: 0,
            }
        };

        return NextResponse.json({
            success: true,
            analytics: stats,
        });

    } catch (error) {
        console.error("ADMIN_ANALYTICS_ERROR", error);
        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
    }
}