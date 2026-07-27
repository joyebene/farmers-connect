import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const farmer = await User.findOne({
      _id: id,
      role: "farmer",
    }).select("-password");

    if (!farmer) {
      return NextResponse.json(
        {
          success: false,
          message: "Farmer not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      farmer,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Server Error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const body = await req.json();

    const farmer = await User.findByIdAndUpdate(
      id,
      {
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        address: body.address,
        profileImage: body.profileImage,
      },
      {
        new: true,
      }
    ).select("-password");

    if (!farmer) {
      return NextResponse.json(
        {
          success: false,
          message: "Farmer not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      farmer,
    });
  } catch (error) {
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