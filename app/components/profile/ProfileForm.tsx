'use client';

import { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import { getProfile, updateProfile, updateProfileWithImage } from '@/app/lib/api/profile';


interface ProfileFormData {
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  contact_number: string;
  birthday: string;
  bio: string;
}

export default function ProfileForm() {
  const [formData, setFormData] = useState<ProfileFormData>({
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    contact_number: '',
    birthday: '',
    bio: '',
  });
  const [originalData, setOriginalData] = useState<ProfileFormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [profileImage, setProfileImage] = useState<string>('');
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string>('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsFetching(true);
    try {
      const userData = await getProfile();
      console.log("User Data:", userData);
      const profileData = {
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        address: userData.address,
        contact_number: userData.contact_number,
        birthday: userData.birthday,
        bio: userData.bio,
      };
      setFormData(profileData);
      setOriginalData(profileData);
      setProfileImage(userData.profile_image);
      setPreviewPhoto(userData.profile_image);
    } catch (error: any) {
      toast.error('Failed to load profile data');
      console.error(error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB for S3)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size should be less than 10MB');
        return;
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a valid image file (JPEG, PNG, GIF, WebP)');
        return;
      }

      setNewImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast.success('Image selected. Click "Save Changes" to upload.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (newImageFile) {
        const formDataToSend = new FormData();
        formDataToSend.append('first_name', formData.first_name);
        formDataToSend.append('last_name', formData.last_name);
        formDataToSend.append('address', formData.address);
        formDataToSend.append('contact_number', formData.contact_number);
        formDataToSend.append('birthday', formData.birthday);
        formDataToSend.append('bio', formData.bio);
        formDataToSend.append('profile_image', newImageFile);

        const updatedUser = await updateProfileWithImage(formDataToSend);
        setProfileImage(updatedUser.profile_image);
        setPreviewPhoto(updatedUser.profile_image);
      } else {
        const updateData = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          address: formData.address,
          contact_number: formData.contact_number,
          birthday: formData.birthday,
          bio: formData.bio,
        };

        await updateProfile(updateData);
      }

      toast.success('Profile updated successfully!');
      setNewImageFile(null);
      fetchProfile(); // Refresh profile data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (originalData) {
      setFormData(originalData);
      setPreviewPhoto(profileImage);
      setNewImageFile(null);
      toast.success('Changes cancelled');
    }
  };

  if (isFetching) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5272FF]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#1E293B] border-b-2 border-[#1E293B] inline-block pb-1">
          Account Information
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Photo Upload Section */}
        <div className="mb-8 flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-300 overflow-hidden">
              {previewPhoto ? (
                <img
                  src={previewPhoto}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                  <Camera size={32} className="text-gray-500" />
                </div>
              )}
            </div>
            <label
              htmlFor="photoInput"
              className="absolute bottom-0 right-0 w-8 h-8 bg-[#5272FF] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#4461EE] transition-colors"
            >
              <Camera size={16} className="text-white" />
            </label>
          </div>

          <label
            htmlFor="photoUpload"
            className="px-6 py-2.5 bg-[#5272FF] text-white rounded-lg font-medium hover:bg-[#4461EE] transition-colors cursor-pointer inline-flex items-center space-x-2"
          >
            <Camera size={18} />
            <span>Upload New Photo</span>
          </label>
          <input
            type="file"
            id="photoUpload"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
          <input
            type="file"
            id="photoInput"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* First Name and Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="first_name"
                className="block text-sm font-medium text-[#334155] mb-2"
              >
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5272FF] focus:border-transparent transition-all text-[#1E293B]"
              />
            </div>

            <div>
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-[#334155] mb-2"
              >
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5272FF] focus:border-transparent transition-all text-[#1E293B]"
              />
            </div>
          </div>

          {/* Email (Read-only) */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#334155] mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              readOnly
              className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg bg-gray-50 text-[#64748B] cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-[#334155] mb-2"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5272FF] focus:border-transparent transition-all text-[#1E293B]"
              />
            </div>

            <div>
              <label
                htmlFor="contact_number"
                className="block text-sm font-medium text-[#334155] mb-2"
              >
                Contact Number
              </label>
              <input
                type="tel"
                id="contact_number"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5272FF] focus:border-transparent transition-all text-[#1E293B]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="birthday"
              className="block text-sm font-medium text-[#334155] mb-2"
            >
              Birthday
            </label>
            <input
              type="date"
              id="birthday"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5272FF] focus:border-transparent transition-all text-[#1E293B]"
            />
          </div>

          {/* Bio */}
          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-[#334155] mb-2"
            >
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5272FF] focus:border-transparent transition-all text-[#1E293B] resize-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-[#5272FF] text-white rounded-lg font-medium hover:bg-[#4461EE] transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[150px]"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="px-8 py-3 bg-[#8CA3CD] text-white rounded-lg font-medium hover:bg-[#7a92bb] transition-colors min-w-[150px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}