"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/lib/api';

const AuthContext = createContext({
    user: null,
    login: () => { },
    logout: () => { },
    isLoading: true
});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            // Don't check on login page
            if (pathname === '/login') {
                setIsLoading(false);
                return;
            }

            const { data } = await api.get('/auth/me');
            setUser(data.user);
        } catch (error) {
            // If 401, interceptor handles redirect usually, but we clear state
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (credentials) => {
        // Login logic handled in LoginPage
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
            setUser(null);
            router.push('/login');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
