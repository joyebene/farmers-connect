import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Message from "@/models/Message";
import User from "@/models/User";
import { authMiddleware } from "@/middleware/auth";


export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      farmerId,
      fullName,
      phone,
      email,
      message,
    } = body;

    // Validation
    if (!farmerId || !fullName || !phone || !message) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Farmer, full name, phone number and message are required.",
        },
        { status: 400 }
      );
    }

    // Check if farmer exists
    const farmer = await User.findOne({
      _id: farmerId,
      role: "farmer",
    });

    if (!farmer) {
      return NextResponse.json(
        {
          success: false,
          message: "Farmer not found.",
        },
        { status: 404 }
      );
    }

    // Create message
    const newMessage = await Message.create({
      farmer: farmerId,
      fullName,
      phone,
      email,
      message,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully.",
        data: newMessage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("SEND_MESSAGE_ERROR:", error);

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
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Authenticate farmer
    const authResult = await authMiddleware(req);

    if (!authResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: authResult.message,
        },
        { status: 401 }
      );
    }

    // Fetch only this farmer's messages
    const messages = await Message.find({
      farmer: authResult.user.id,
    })
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET_MESSAGES_ERROR:", error);

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
}