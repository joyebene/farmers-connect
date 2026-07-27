import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export const GET = async () => {
  try {
    await connectDB();

    const farmers = await User.find({ role: "farmer" })
      .select("-password")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        farmers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET_FARMERS_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Internal Server Error",
      },
      { status: 500 }
    );
  }
};