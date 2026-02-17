import db from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function Dashboard() {
    let policyCount = 0;
    let userCount = 0;
    let recentLogs = [];
    let error = null;

    try {
        policyCount = db.prepare('SELECT count(*) as count FROM policies').get().count;
        userCount = db.prepare('SELECT count(*) as count FROM users').get().count;
        recentLogs = db.prepare('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 5').all();
    } catch (e) {
        console.error('Dashboard DB Error:', e);
        error = e.message;
    }

    if (error) {
        return (
            <div className="container" style={{ color: 'var(--danger)' }}>
                <h1>Error Loading Dashboard</h1>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="container">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Dashboard</h1>
                <p style={{ color: '#94a3b8' }}>System Overview</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="card">
                    <h3 style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Active Policies</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{policyCount}</p>
                </div>
                <div className="card">
                    <h3 style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Users</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{userCount}</p>
                </div>
                <div className="card">
                    <h3 style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Total Requests</h3>
                    {/* Simple count for now, maybe optimize later */}
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                        {db.prepare('SELECT count(*) as count FROM audit_logs').get().count}
                    </p>
                </div>
            </div>

            <h2 style={{ marginBottom: '1rem' }}>Recent Activity</h2>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Action</th>
                            <th>Resource</th>
                            <th>Decision</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentLogs.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                                    No activity recorded yet.
                                </td>
                            </tr>
                        ) : (
                            recentLogs.map((log) => (
                                <tr key={log.id}>
                                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                                    <td><code>{JSON.parse(log.request_payload).action}</code></td>
                                    <td><code>{JSON.parse(log.request_payload).resource}</code></td>
                                    <td>
                                        <span className={`badge ${log.decision === 'ALLOW' ? 'badge-success' : 'badge-danger'}`}>
                                            {log.decision}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
