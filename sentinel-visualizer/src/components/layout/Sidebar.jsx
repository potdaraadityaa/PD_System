"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    GitGraph,
    Share2,
    Users,
    ShieldCheck,
    Settings
} from "lucide-react";
import clsx from "clsx";

const NAV_ITEMS = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Auth Flow", href: "/visualize", icon: GitGraph },
    { name: "Graph View", href: "/graph", icon: Share2 },
    { name: "Users", href: "/users", icon: Users },
    { name: "Policies", href: "/policies", icon: ShieldCheck },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/10 bg-black text-white">
            <div className="flex h-16 items-center px-6">
                <div className="text-xl font-bold tracking-tighter">
                    SENTINEL <span className="text-white/40">VISUALIZER</span>
                </div>
            </div>

            <nav className="flex flex-col gap-2 px-4 py-6">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "group relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                                isActive ? "text-white" : "text-white/50 hover:text-white"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeNav"
                                    className="absolute inset-0 rounded-lg bg-white/10"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}

                            <item.icon className="relative z-10 h-5 w-5" />
                            <span className="relative z-10">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="absolute bottom-0 w-full p-6 space-y-3">
                {user ? (
                    <>
                        <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-4">
                            <div className="h-10 w-10 bg-gradient-to-tr from-white/20 to-transparent rounded-full flex items-center justify-center font-bold text-white/50">
                                {user.username[0].toUpperCase()}
                            </div>
                            <div className="text-xs overflow-hidden">
                                <div className="font-semibold text-white truncate">{user.username}</div>
                                <div className="text-white/40 capitalize truncate">{user.role}</div>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="w-full flex items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 py-2 text-xs font-medium text-red-500 hover:bg-red-500/20 transition-colors"
                        >
                            Sign Out
                        </button>
                    </>
                ) : (
                    <div className="p-4 text-center text-xs text-white/40">
                        Not signed in
                    </div>
                )}
            </div>
        </aside>
    );
}
