// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import toast from 'react-hot-toast';
// import Link from 'next/link';
// import { Eye, EyeOff } from 'lucide-react';
// import { login } from '@/app/lib/api/auth';

// interface LoginFormData {
//   email: string;
//   password: string;
//   rememberMe: boolean;
// }

// interface ValidationErrors {
//   email?: string;
//   password?: string;
// }

// export default function LoginForm() {
//   const router = useRouter();
//   const [formData, setFormData] = useState<LoginFormData>({
//     email: '',
//     password: '',
//     rememberMe: false,
//   });
//   const [errors, setErrors] = useState<ValidationErrors>({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const validateForm = (): boolean => {
//     const newErrors: ValidationErrors = {};
//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required.';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = 'Please enter a valid email address.';
//     }
//     if (!formData.password) {
//       newErrors.password = 'Password is required.';
//     } else if (formData.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters.';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));

//     if (errors[name as keyof ValidationErrors]) {
//       setErrors((prev) => ({ ...prev, [name]: undefined }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     setIsLoading(true);

//     try {
//       const payload = {
//         email: formData.email.trim().toLowerCase(),
//         password: formData.password,
//       };

//       const response = await login(payload);
//       // Store token
//       localStorage.setItem('token', response.access);

//       toast.success('Login successful!');
//       router.push('/dashboard');
//     } catch (error: any) {
//       const errorMessage =
//         error.response?.data?.message || 'Login failed. Please check your credentials.';
//       toast.error(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="w-full">
//       <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold text-[#1E293B] mb-2">
//           Log in to your account
//         </h1>
//         <p className="text-[#64748B] text-sm">
//           Start managing your tasks efficiently
//         </p>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-5">
//         {/* Email */}
//         <div>
//           <label
//             htmlFor="email"
//             className="block text-sm font-medium text-[#334155] mb-1.5"
//           >
//             Email
//           </label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             placeholder="Enter your email"
//             className={`w-full px-4 py-2.5 border ${
//               errors.email ? 'border-red-500' : 'border-[#E2E8F0]'
//             } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5272FF] focus:border-transparent transition-all text-[#1E293B] placeholder:text-[#94A3B8]`}
//           />
//           {errors.email && (
//             <p className="text-red-500 text-xs mt-1">{errors.email}</p>
//           )}
//         </div>

//         {/* Password */}
//         <div>
//           <label
//             htmlFor="password"
//             className="block text-sm font-medium text-[#334155] mb-1.5"
//           >
//             Password
//           </label>
//           <div className="relative">
//             <input
//               type={showPassword ? 'text' : 'password'}
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Enter your password"
//               className={`w-full px-4 py-2.5 pr-12 border ${
//                 errors.password ? 'border-red-500' : 'border-[#E2E8F0]'
//               } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5272FF] focus:border-transparent transition-all text-[#1E293B] placeholder:text-[#94A3B8]`}
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#334155] transition-colors"
//             >
//               {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//             </button>
//           </div>
//           {errors.password && (
//             <p className="text-red-500 text-xs mt-1">{errors.password}</p>
//           )}
//         </div>

//         <div className="flex items-center justify-between">
//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               id="rememberMe"
//               name="rememberMe"
//               checked={formData.rememberMe}
//               onChange={handleChange}
//               className="w-4 h-4 text-[#5272FF] border-[#E2E8F0] rounded focus:ring-2 focus:ring-[#5272FF] cursor-pointer"
//             />
//             <label
//               htmlFor="rememberMe"
//               className="ml-2 text-sm text-[#334155] cursor-pointer"
//             >
//               Remember me
//             </label>
//           </div>
//           <Link
//             href="/forgot-password"
//             className="text-sm text-[#5272FF] hover:text-[#4461EE] font-medium transition-colors"
//           >
//             Forgot your password?
//           </Link>
//         </div>
//         <button
//           type="submit"
//           disabled={isLoading}
//           className="w-full bg-[#5272FF] text-white py-3 rounded-lg font-medium hover:bg-[#4461EE] transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#5272FF] focus:ring-offset-2"
//         >
//           {isLoading ? 'Logging in...' : 'Log in'}
//         </button>
//         <p className="text-center text-sm text-[#64748B] mt-6">
//           Don't have an account?{' '}
//           <Link
//             href="/auth/signup"
//             className="text-[#5272FF] hover:text-[#4461EE] font-medium transition-colors"
//           >
//             Register now
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// }



'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import Cookies from 'js-cookie';
import { login } from '@/app/lib/api/auth';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface ValidationErrors {
  email?: string;
  password?: string;
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const payload = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };

      const response = await login(payload);

      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      
      Cookies.set('token', response.access, { expires: 7 }); 

      toast.success('Login successful!');

      router.push(redirectUrl);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#1E293B] mb-2">
          Log in to your account
        </h1>
        <p className="text-[#64748B] text-sm">
          Start managing your tasks efficiently
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#334155] mb-1.5"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className={`w-full px-4 py-2.5 border ${
              errors.email ? 'border-red-500' : 'border-[#E2E8F0]'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5272FF] focus:border-transparent transition-all text-[#1E293B] placeholder:text-[#94A3B8]`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-[#334155] mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={`w-full px-4 py-2.5 pr-12 border ${
                errors.password ? 'border-red-500' : 'border-[#E2E8F0]'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5272FF] focus:border-transparent transition-all text-[#1E293B] placeholder:text-[#94A3B8]`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#334155] transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 text-[#5272FF] border-[#E2E8F0] rounded focus:ring-2 focus:ring-[#5272FF] cursor-pointer"
            />
            <label
              htmlFor="rememberMe"
              className="ml-2 text-sm text-[#334155] cursor-pointer"
            >
              Remember me
            </label>
          </div>
          <Link
            href="/forgot-password"
            className="text-sm text-[#5272FF] hover:text-[#4461EE] font-medium transition-colors"
          >
            Forgot your password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#5272FF] text-white py-3 rounded-lg font-medium hover:bg-[#4461EE] transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#5272FF] focus:ring-offset-2"
        >
          {isLoading ? 'Logging in...' : 'Log in'}
        </button>

        <p className="text-center text-sm text-[#64748B] mt-6">
          Don't have an account?{' '}
          <Link
            href="/auth/signup"
            className="text-[#5272FF] hover:text-[#4461EE] font-medium transition-colors"
          >
            Register now
          </Link>
        </p>
      </form>
    </div>
  );
}