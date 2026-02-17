import Link from 'next/link';
// We can use a client component for active states if needed, but keeping it simple for now.

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div style={{ paddingBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', color: '#fff' }}>Sentinel<span style={{ color: 'var(--primary)' }}>Auth</span></h2>
                <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Admin Portal</p>
            </div>

            <nav className="sidebar-nav">
                <Link href="/" className="nav-link">
                    Dashboard
                </Link>
                <Link href="/policies" className="nav-link">
                    Policies
                </Link>
                <Link href="/users" className="nav-link">
                    Users & Roles
                </Link>
                <Link href="/audit" className="nav-link">
                    Audit Logs
                </Link>
                <Link href="/simulator" className="nav-link">
                    Simulator
                </Link>
            </nav>
        </aside>
    );
}
