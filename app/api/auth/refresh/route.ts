import { NextRequest, NextResponse } from "next/server";
import { verifyRefreshToken, generateAccessToken } from "@/lib/jwt";
import User from "@/models/User";

export const POST = async (req: NextRequest) => {
    try {
        const refreshToken = req.cookies.get("refreshToken")?.value;

        if (!refreshToken) {
            return NextResponse.json({
                success: false,
                message: "Refresh token not found"
            }, { status: 401 });
        }

        const decoded = verifyRefreshToken(refreshToken) as { id: string, email: string, role: string };

        const user = await User.findById(decoded.id);

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 401 });
        }

        const accessToken = generateAccessToken({
            id: user._id,
            email: user.email,
            role: user.role,
        });

        return NextResponse.json({
            success: true,
            accessToken
        });

    } catch (error) {
        console.error("REFRESH TOKEN ERROR:", error);

        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";

        return NextResponse.json({
            success: false,
            message: errorMessage
        }, { status: 500 });
    }
}