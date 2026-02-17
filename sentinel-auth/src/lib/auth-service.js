import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || 'super-secret-default-key-change-in-prod'
);

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

export class AuthService {
    /**
     * Verify password against hash
     */
    static async verifyPassword(password, hash) {
        return bcrypt.compare(password, hash);
    }

    /**
     * Create Access Token
     */
    static async signAccessToken(payload) {
        return new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime(ACCESS_TOKEN_EXPIRY)
            .sign(SECRET_KEY);
    }

    /**
     * Create Refresh Token
     */
    static async signRefreshToken(payload) {
        return new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime(REFRESH_TOKEN_EXPIRY)
            .sign(SECRET_KEY);
    }

    /**
     * Verify Token
     */
    static async verifyToken(token) {
        try {
            const { payload } = await jwtVerify(token, SECRET_KEY);
            return payload;
        } catch (err) {
            return null;
        }
    }

    /**
     * Get Current Session (from cookies)
     */
    static async getSession() {
        const cookieStore = await cookies();
        const token = cookieStore.get('access_token')?.value;
        if (!token) return null;
        return this.verifyToken(token);
    }

    /**
     * Set Auth Cookies
     */
    static async setAuthCookies(user) {
        const accessToken = await this.signAccessToken({
            sub: user.id,
            username: user.username,
            role: user.role
        });

        // In a real app, refresh token might be stored in DB to allow revocation
        const refreshToken = await this.signRefreshToken({ sub: user.id });

        const cookieStore = await cookies();

        // Access Token
        cookieStore.set('access_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 15 * 60, // 15 mins
            path: '/',
        });

        // Refresh Token
        cookieStore.set('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/',
        });
    }

    /**
     * Clear Auth Cookies
     */
    static async clearCookies() {
        const cookieStore = await cookies();
        cookieStore.delete('access_token');
        cookieStore.delete('refresh_token');
    }
}
