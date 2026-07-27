import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export const generateAccessToken = (payload: object) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: "15m",
    });
};

export const generateRefreshToken = (payload: object) => {
    return jwt.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: "7d",
    });
};

export const generateTokens = (payload: object) => {
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { accessToken, refreshToken };
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET);
};

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, JWT_REFRESH_SECRET);
}