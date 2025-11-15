'use client';

import { Bell, CalendarDays, Menu } from 'lucide-react';
import Image from 'next/image';

export default function DashboardPage() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-0">
            <div className="relative w-full h-8">
              <Image
                src="/dreamy.png"
                alt="login"
                fill
                sizes="(max-width:24px)"
                priority
                className="object-contain"
              />
            </div>
            <span className="text-sm font-semibold text-[#0D224A]">
              DREAMY SOFTWARE
            </span>
          </div>

          {/* Right Side - Icons and Date */}
          <div className="flex items-center space-x-4">
            <button className="p-2  bg-[#5272FF]  rounded-lg transition-colors">
              <Bell size={20} className="text-white " />
            </button>
            <button className="p-2 bg-[#5272FF]   rounded-lg transition-colors">
              <CalendarDays size={20} className='text-white' />
            </button>
            <div className="text-right">
              <p className="text-sm font-medium text-[#0D224A]">
                {currentDate.split(',')[0]}
              </p>
              <p className="text-xs text-gray-500">
                {currentDate.split(',').slice(1).join(',')}
              </p>
            </div>
          </div>
        </div>
      </header>

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