'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    
    if (token) {
      router.push('/dashboard');
    } else {
      router.push('/auth/login/');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5272FF] mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}