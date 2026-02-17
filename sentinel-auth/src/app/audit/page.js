import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export default function AuditPage() {
    const logs = db.prepare(`
    SELECT l.*, p.name as policy_name 
    FROM audit_logs l 
    LEFT JOIN policies p ON l.policy_id_matched = p.id 
    ORDER BY l.timestamp DESC 
    LIMIT 100
  `).all();

    return (
        <div className="container">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem' }}>Audit Logs</h1>
                <p style={{ color: '#94a3b8' }}>History of authorization decisions</p>
            </div>

            <div className="card">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Subject</th>
                            <th>Action</th>
                            <th>Resource</th>
                            <th>Decision</th>
                            <th>Reason</th>
                            <th>Policy</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map(log => {
                            const payload = JSON.parse(log.request_payload);
                            return (
                                <tr key={log.id}>
                                    <td style={{ whiteSpace: 'nowrap', fontSize: '0.875rem' }}>{new Date(log.timestamp).toLocaleString()}</td>
                                    <td>
                                        {/* Try to extract subject name safely */}
                                        {payload.subject?.role || JSON.stringify(payload.subject) || '-'}
                                    </td>
                                    <td><code>{payload.action}</code></td>
                                    <td><code>{payload.resource}</code></td>
                                    <td>
                                        <span className={`badge ${log.decision === 'ALLOW' ? 'badge-success' : 'badge-danger'}`}>
                                            {log.decision}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{log.reason}</td>
                                    <td style={{ fontSize: '0.875rem' }}>{log.policy_name || '-'}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
