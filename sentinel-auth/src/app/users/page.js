import db from '@/lib/db';
import { deleteUser } from '../actions';
import CreateUserForm from '@/components/CreateUserForm';

export const dynamic = 'force-dynamic';

export default function UsersPage() {
    const users = db.prepare('SELECT * FROM users ORDER BY id DESC').all();

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem' }}>Users & Roles</h1>
                    <p style={{ color: '#94a3b8' }}>Manage identities and their assigned roles</p>
                </div>
            </div>

            <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 350px', gap: '2rem', minHeight: 'auto' }}>

                {/* User List */}
                <div className="card">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td style={{ fontWeight: 500 }}>{user.username}</td>
                                    <td><span className="badge" style={{ background: '#3b82f633', color: '#60a5fa' }}>{user.role}</span></td>
                                    <td>
                                        <form action={deleteUser}>
                                            <input type="hidden" name="id" value={user.id} />
                                            <button type="submit" style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.875rem' }}>
                                                Delete
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Add User Form */}
                <div>
                    <CreateUserForm />
                </div>
            </div>
        </div>
    );
}
