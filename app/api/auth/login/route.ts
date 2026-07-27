import { connectDB } from "@/lib/db";
import { comparePassword } from "@/lib/hash";
import { generateTokens } from "@/lib/jwt";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        await connectDB();

        const body = await req.json();

        const { email, password } = body;

        //check if body is null
        if (!email || !password) {
            return NextResponse.json({
                success: false,
                message: "Email and Password are required!"
            }, { status: 400 })
        }

        // Find user
        const user = await User.findOne({
            email: email.toLowerCase(),
        }).select("+password");

            // Check if user exists
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid email or password",
        },
        { status: 401 }
      );
    }

       // Compare password
    const isPasswordCorrect =
      await comparePassword(
        password,
        user.password
      );

      if (!isPasswordCorrect) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid email or password",
        },
        { status: 401 }
      );
    }

    const { accessToken, refreshToken } = generateTokens({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
        accessToken,
      },
      { status: 200 }
    );

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      path: "/",
    });

    return response; 


    } catch (error) {
         console.error(
      "LOGIN ERROR:",
      error
    );

    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
      },
      { status: 500 }
    );
    }
}