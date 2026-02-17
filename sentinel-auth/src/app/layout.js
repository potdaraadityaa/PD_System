import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata = {
    title: 'Sentinel Administration',
    description: 'Centralized Authorization Management',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <div className="dashboard-grid">
                    <Sidebar />
                    <main className="main-content">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}
