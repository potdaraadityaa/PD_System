"use client";

import { useState, useEffect } from 'react';
import { Plus, Trash2, ShieldCheck, ShieldAlert, Power } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api';
import clsx from 'clsx';

export default function PoliciesPage() {
    const [policies, setPolicies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                try {
                    const { data } = await api.get('/policies');
                    setPolicies(data);
                } catch (e) {
                    console.warn("API failed, using mock data");
                    setPolicies([
                        { id: 1, name: 'Admin Full Access', description: 'Allows everything for admins', effect: 'ALLOW', active: true },
                        { id: 2, name: 'Guest Read Only', description: 'Guests can only read public', effect: 'ALLOW', active: true },
                        { id: 3, name: 'Block Delete', description: 'Prevent deletions globally', effect: 'DENY', active: false },
                    ]);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPolicies();
    }, []);

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Policy Management</h1>
                    <p className="text-white/50">Define and control access rules.</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Policy
                </Button>
            </div>

            <div className="flex items-center space-x-4">
                <div className="w-72">
                    <Input placeholder="Search policies..." />
                </div>
            </div>

            <Card className="overflow-hidden p-0">
                <table className="w-full text-left text-sm text-white/70">
                    <thead className="bg-white/5 text-xs uppercase text-white/50">
                        <tr>
                            <th className="px-6 py-4 font-medium">Policy Name</th>
                            <th className="px-6 py-4 font-medium">Effect</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {policies.map((policy) => (
                            <tr key={policy.id} className="group transition-colors hover:bg-white/5">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-white">{policy.name}</div>
                                    <div className="text-xs text-white/40">{policy.description}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className={clsx("inline-flex items-center gap-1 font-mono text-xs font-bold", policy.effect === 'ALLOW' ? 'text-green-500' : 'text-red-500')}>
                                        {policy.effect === 'ALLOW' ? <ShieldCheck className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
                                        {policy.effect}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className={clsx("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border", policy.active ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-white/5 text-white/40 border-white/10')}>
                                        <div className={clsx("mr-1.5 h-1.5 w-1.5 rounded-full", policy.active ? "bg-green-400 animate-pulse" : "bg-white/20")} />
                                        {policy.active ? 'Active' : 'Inactive'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Power className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
}
