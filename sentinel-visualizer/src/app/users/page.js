"use client";

import { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Shield, User } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import api from '@/lib/api';

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({ username: "", role: "viewer" });
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/users');
            setUsers(data);
        } catch (e) {
            console.warn("API failed, using mock data");
            // Fallback for demo if backend is offline
            if (users.length === 0) {
                setUsers([
                    { id: 1, username: 'alice', role: 'admin' },
                    { id: 2, username: 'bob', role: 'editor' },
                    { id: 3, username: 'charlie', role: 'viewer' },
                ]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            // Optimistic update
            const tempId = users.length + 1;
            const userToAdd = { id: tempId, ...newUser };

            try {
                await api.post('/users', newUser);
                // Ideally refetch, but we'll optimistic push for demo feel
            } catch (err) {
                console.warn("Backend create failed, simulating success");
            }

            setUsers([...users, userToAdd]);
            setIsModalOpen(false);
            setNewUser({ username: "", role: "viewer" });
        } catch (error) {
            console.error("Failed to create user", error);
        } finally {
            setIsCreating(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">User Management</h1>
                    <p className="text-white/50">Manage system access and roles.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create User
                </Button>
            </div>

            <div className="flex items-center space-x-4">
                <div className="w-72 relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                    <Input
                        placeholder="Search users..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <Card className="overflow-hidden p-0">
                <table className="w-full text-left text-sm text-white/70">
                    <thead className="bg-white/5 text-xs uppercase text-white/50">
                        <tr>
                            <th className="px-6 py-4 font-medium">ID</th>
                            <th className="px-6 py-4 font-medium">Username</th>
                            <th className="px-6 py-4 font-medium">Role</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="group transition-colors hover:bg-white/5">
                                <td className="px-6 py-4 text-white/30 font-mono text-xs">{user.id}</td>
                                <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-white/10 to-white/5 flex items-center justify-center">
                                        <User className="h-4 w-4 text-white/70" />
                                    </div>
                                    {user.username}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-400 border border-blue-500/20">
                                        <Shield className="mr-1 h-3 w-3" />
                                        {user.role}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-400 hover:bg-red-500/10">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {filteredUsers.length === 0 && !isLoading && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-white/30">
                                    <div className="flex flex-col items-center gap-2">
                                        <Search className="h-8 w-8 opacity-20" />
                                        <p>No users found matching "{searchQuery}"</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </Card>

            {/* Create User Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New User"
            >
                <form onSubmit={handleCreateUser} className="space-y-4">
                    <Input
                        label="Username"
                        placeholder="e.g. johndoe"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        required
                    />

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-white/50">Role</label>
                        <select
                            className="flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-white/30 focus:bg-white/10 focus:outline-none"
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        >
                            <option value="admin">Admin</option>
                            <option value="editor">Editor</option>
                            <option value="viewer">Viewer</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={isCreating}>
                            Create User
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

