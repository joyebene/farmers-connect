import { NextResponse } from 'next/server';

export const POST = async () => {
  try {
    const response = NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    );

    // Clear the cookie by setting an expired date
    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      path: '/',
      expires: new Date(0), // Set to a past date
    });

    return response;
  } catch (error) {
    console.error('LOGOUT ERROR:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
};