"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import api from '@/lib/api';
import Cookies from 'js-cookie';

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ username: '', password: '' });

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Call Backend API
            await api.post('/auth/login', formData);

            // On success, backend sets HttpOnly cookies. 
            // We can also set a client-side flag if needed, but cookies are safer source of truth.
            // But since cookies are HttpOnly, JS can't read them.
            // We can rely on API success.

            router.push('/');
        } catch (err) {
            console.error("Login failed", err);
            setError(err.response?.data?.error || 'Invalid credentials');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-black p-4">
            {/* Background Ambience */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl opacity-30" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/10 border border-white/10 mb-6 backdrop-blur-md">
                        <ShieldCheck className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Sentinel Auth</h1>
                    <p className="text-white/50">Enter your credentials to access the secure dashboard.</p>
                </div>

                <Card className="backdrop-blur-xl bg-white/5 border-white/10">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <Input
                                label="Username"
                                placeholder="Admin ID"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                                icon={Lock}
                            />
                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            Sign In <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>

                        <div className="text-center text-xs text-white/30">
                            Secured by Sentinel Enterprise Guard
                        </div>
                    </form>
                </Card>
            </motion.div>
        </div>
    );
}
