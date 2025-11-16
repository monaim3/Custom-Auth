'use client';
import Cookies from 'js-cookie';
import { usePathname, useRouter } from 'next/navigation';
import { Home, CheckSquare, User, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getProfile } from '../lib/api/profile';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("dashboard token", token);
    if (!token) {
      router.push('/auth/login');
      return;
    }
    
    // Fetch user profile
  }, [router]);
  useEffect(() => {
  const fetchUserProfile = async () => {
    const data = await getProfile();
    setUser(data);
  };

  fetchUserProfile();
}, []);

  const handleLogout = () => {
    // Remove tokens from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    // Remove token from cookies
    Cookies.remove('token');
    toast.success('Logged out successfully');
    router.push('/auth/login');
  };

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
    },
    {
      name: 'Todos',
      href: '/dashboard/todos',
      icon: CheckSquare,
    },
    {
      name: 'Account Information',
      href: '/dashboard/profile',
      icon: User,
    },
  ];

  return (
    <div className="flex h-screen bg-[#F5F7FA]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0D224A] text-white flex flex-col">
        {/* User Profile Section */}
        <div className="p-6 flex flex-col items-center border-b border-[#1a3a6b]">
          <div className="w-20 h-20 rounded-full bg-gray-400 mb-3 overflow-hidden">
            {user?.profile_image ? (
              <img
                src={user.profile_image}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-400" />
            )}
          </div>
          <h3 className="font-semibold text-base">
            {user?.first_name || 'User'}
          </h3>
          <p className="text-xs text-gray-300">
            {user?.email || 'user@example.com'}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <button
                key={item.name}
                onClick={() => router.push(item.href)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#1a3a6b] text-white'
                    : 'text-gray-300 hover:bg-[#1a3a6b] hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-[#1a3a6b]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-[#1a3a6b] hover:text-white transition-colors"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}