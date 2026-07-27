import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

interface AuthTokenPayload extends JwtPayload {
  id: string;
}

type AuthResult = 
  | { success: true; user: AuthTokenPayload }
  | { success: false; message: string; user?: undefined };

export async function authMiddleware(
  req: NextRequest
): Promise<AuthResult> {
  try {
    const authHeader =
      req.headers.get("authorization");

    if (!authHeader) {
      return {
        success: false,
        message: "No token provided",
      };
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return {
        success: false,
        message: "Invalid token",
      };
    }

    const decoded = jwt.verify(
      token,
      JWT_SECRET
    ) as AuthTokenPayload;

    // Ensure the decoded token is an object with an id
    if (typeof decoded !== 'object' || !decoded.id) {
      return {
        success: false,
        message: "Invalid token payload",
      };
    }

    return {
      success: true,
      user: decoded,
    };
  } catch (error) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }
}