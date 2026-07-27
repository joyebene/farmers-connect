import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { authMiddleware } from "@/middleware/auth";

export const GET = async (req: NextRequest) => {
    try {
        await connectDB();

        const authResult = await authMiddleware(req);

        if (!authResult.success) {
            return NextResponse.json({
                success: false,
                message: authResult.message
            }, { status: 401 });
        }

        const user = await User.findById(authResult.user.id).select("-password");

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            }
        });

    } catch (error) {
        console.error("ME_ROUTE_ERROR", error);

        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";

        return NextResponse.json({
            success: false,
            message: errorMessage
        }, { status: 500 });
    }
};

export const DELETE = async (req: NextRequest) => {
    try {
        await connectDB();

        const authResult = await authMiddleware(req);

        if (!authResult.success) {
            return NextResponse.json({
                success: false,
                message: authResult.message
            }, { status: 401 });
        }

        // Find and delete the user
        const deletedUser = await User.findByIdAndDelete(authResult.user.id);

        if (!deletedUser) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        // Clear the refresh token cookie
        const response = NextResponse.json({
            success: true,
            message: "Account deleted successfully"
        });

        response.cookies.set("refreshToken", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            path: "/",
            expires: new Date(0) // Expire the cookie immediately
        });

        return response;

    } catch (error) {
        console.error("DELETE_USER_ERROR", error);
        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json({
            success: false,
            message: errorMessage
        }, { status: 500 });
    }
};

export const PUT = async (req: NextRequest) => {
    try {
        await connectDB();

        const authResult = await authMiddleware(req);

        if (!authResult.success) {
            return NextResponse.json({
                success: false,
                message: authResult.message
            }, { status: 401 });
        }

        const body = await req.json();
        const { fullName, phone, address } = body;

        // Find user and update
        const updatedUser = await User.findByIdAndUpdate(
            authResult.user.id,
            { fullName, phone, address },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: updatedUser._id,
                fullName: updatedUser.fullName,
                email: updatedUser.email,
                phone: updatedUser.phone,
                address: updatedUser.address,
                role: updatedUser.role,
            }
        });

    } catch (error) {
        console.error("UPDATE_PROFILE_ERROR", error);

        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";

        return NextResponse.json({
            success: false,
            message: errorMessage
        }, { status: 500 });
    }
};