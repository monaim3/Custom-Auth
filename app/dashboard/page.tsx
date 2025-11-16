'use client';
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Main Content */}
      <div className="p-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-[#1E293B] mb-4">
            Welcome to Dashboard
          </h1>
          <p className="text-gray-600">
            Select "Todos" from the sidebar to manage your tasks.
          </p>
        </div>
      </div>
    </div>
  );
}