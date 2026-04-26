import Sidebar from '@/components/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex flex-col md:flex-row min-h-screen bg-[#E5E1E6] pt-24 md:pt-28 selection:bg-[#635BFF] selection:text-white">
        
        {/* Sidebar - Handles its own responsive width */}
        <Sidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden p-4 sm:p-8 lg:p-12 pb-24 md:pb-20">
          <div className="animate-in fade-in duration-1000">
            {children}
          </div>
        </main>
        
      </div>
    </ProtectedRoute>
  );
}