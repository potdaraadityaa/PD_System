import db from '@/lib/db';
import { deletePolicy, togglePolicy } from '../actions';
import CreatePolicyForm from '@/components/CreatePolicyForm';

export const dynamic = 'force-dynamic';

export default function PoliciesPage() {
    const policies = db.prepare('SELECT * FROM policies ORDER BY id DESC').all();

    return (
        <div className="container">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem' }}>Policies</h1>
                <p style={{ color: '#94a3b8' }}>Define access rules</p>
            </div>

            <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 350px', gap: '2rem', minHeight: 'auto' }}>

                {/* Policy List */}
                <div className="card">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Effect</th>
                                <th>Action</th>
                                <th>Resource</th>
                                <th>Status</th>
                                <th>Manage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {policies.map(policy => (
                                <tr key={policy.id}>
                                    <td>
                                        <div style={{ fontWeight: 500 }}>{policy.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{policy.description}</div>
                                    </td>
                                    <td>
                                        <span className={`badge ${policy.effect === 'ALLOW' ? 'badge-success' : 'badge-danger'}`}>
                                            {policy.effect}
                                        </span>
                                    </td>
                                    <td><code>{policy.action_pattern}</code></td>
                                    <td><code>{policy.resource_pattern}</code></td>
                                    <td>
                                        <form action={togglePolicy} style={{ display: 'inline' }}>
                                            <input type="hidden" name="id" value={policy.id} />
                                            <input type="hidden" name="is_active" value={policy.is_active} />
                                            <button type="submit"
                                                style={{
                                                    background: policy.is_active ? 'var(--success)' : '#475569',
                                                    border: 'none',
                                                    width: '10px',
                                                    height: '10px',
                                                    borderRadius: '50%',
                                                    cursor: 'pointer'
                                                }}
                                                title="Toggle Status"
                                            />
                                        </form>
                                    </td>
                                    <td>
                                        <form action={deletePolicy}>
                                            <input type="hidden" name="id" value={policy.id} />
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

                {/* Add Policy Form */}
                <div>
                    <CreatePolicyForm />
                </div>
            </div>
        </div>
    );
}
