import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Message from "@/models/Message";

export async function GET() {
  try {
    await connectDB();

    const messages = await Message.find()
      .populate("farmer", "fullName email phone")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      messages,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}