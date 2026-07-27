import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { hashPassword } from "@/lib/hash";
import { generateTokens } from "@/lib/jwt";

import { validateEmail, validatePassword } from "@/utils/validators";

export const POST = async (req: NextRequest) => {
    try {
        await connectDB();

        const body = await req.json();

        const { fullName, email, password, phone, address, role } = body

        //validate required fields
        if (!fullName || !email || !password || !phone || !address || !role) {
            return NextResponse.json({
                success: false,
                message: "All fields are required"
            },
                { status: 400 }
            )
        }

        //validate email
        if (!validateEmail(email)) {
            return NextResponse.json({
                success: false,
                message: "Invalid email"
            },
                { status: 400 }
            )
        }

        //validate password
        if (!validatePassword(password)) {
            return NextResponse.json({
                success: false,
                message: "Password must be at least 6 characters"
            },
                { status: 400 }
            )
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });

        if (existingUser) {
            return NextResponse.json({
                success: false,
                message: "User with this email already exists",
            },
                { status: 409 }
            )
        }

        //hash password
        const hashedPassword = await hashPassword(password);

        //create user
        const user = await User.create({
            fullName,
            email: email.toLowerCase(),
            password: hashedPassword,
            phone,
            address,
            role: role || "buyer",
        });

        //generate tokens
        const { accessToken, refreshToken } = generateTokens({
            id: user._id,
            email: user.email,
            role: user.role
        });

        const response = NextResponse.json({
            success: true,
            message: "Registration successful",
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
            },
            accessToken,
        }, { status: 201 });

        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("REGISTER ERROR", error);

        const errorMessage = error instanceof Error ? error.message : "Internal server error";

        return NextResponse.json({
            success: false,
            message: errorMessage
        },
            { status: 500 }
        )
    }
}