import Sidebar from '@/components/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen pt-28">
        <Sidebar />
        <main className="flex-1 overflow-y-auto px-12 pb-20">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}