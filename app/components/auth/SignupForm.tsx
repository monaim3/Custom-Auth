'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { signup } from '@/app/lib/api/auth';

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Please enter a valid name format.';
    } else if (!/^[a-zA-Z\s]{2,}$/.test(formData.firstName.trim())) {
      newErrors.firstName = 'Please enter a valid name format.';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Please enter a valid name format.';
    } else if (!/^[a-zA-Z\s]{2,}$/.test(formData.lastName.trim())) {
      newErrors.lastName = 'Please enter a valid name format.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = '6 characters minimum.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
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
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };
      const response = await signup(payload);

      localStorage.setItem('token', response.token);
      
      toast.success('Account created successfully!');
      
      router.push('/auth/login/');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#1E293B] mb-2">
          Create your account
        </h1>
        <p className="text-[#64748B] text-sm">
          Start managing your tasks efficiently
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-[#334155] mb-1.5">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="john"
              className={`w-full px-4 py-2.5 border ${
                errors.firstName ? 'border-red-500' : 'border-[#E2E8F0]'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5272FF] focus:border-transparent transition-all text-[#1E293B] placeholder:text-[#94A3B8]`}
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-[#334155] mb-1.5">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="doe"
              className={`w-full px-4 py-2.5 border ${
                errors.lastName ? 'border-red-500' : 'border-[#E2E8F0]'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5272FF] focus:border-transparent transition-all text-[#1E293B] placeholder:text-[#94A3B8]`}
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#334155] mb-1.5">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            className={`w-full px-4 py-2.5 border ${
              errors.email ? 'border-red-500' : 'border-[#E2E8F0]'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5272FF] focus:border-transparent transition-all text-[#1E293B] placeholder:text-[#94A3B8]`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[#334155] mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••"
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


        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#334155] mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••"
              className={`w-full px-4 py-2.5 pr-12 border ${
                errors.confirmPassword ? 'border-red-500' : 'border-[#E2E8F0]'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5272FF] focus:border-transparent transition-all text-[#1E293B] placeholder:text-[#94A3B8]`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#334155] transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#5272FF] text-white py-3 rounded-lg font-medium hover:bg-[#4461EE] transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#5272FF] focus:ring-offset-2"
        >
          {isLoading ? 'Creating account...' : 'Sign Up'}
        </button>
        <p className="text-center text-sm text-[#64748B] mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-[#5272FF] hover:text-[#4461EE] font-medium transition-colors">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}