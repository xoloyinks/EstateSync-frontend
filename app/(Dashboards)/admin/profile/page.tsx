"use client";
import React, { useContext, useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { FaPen } from 'react-icons/fa';
import { ImSpinner9 } from 'react-icons/im';
import { toast, ToastContainer } from 'react-toastify';
import Cookies from 'js-cookie';
import { User } from '../adminContext';
import { userType } from '@/app/types';
import Input from '@/components/input';

const defaultImage = "https://www.citypng.com/public/uploads/preview/hd-man-user-illustration-icon-transparent-png-701751694974843ybexneueic.png";

export default function Profile() {
  const user = useContext(User);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<userType>({
    image: defaultImage,
    last_name: '',
    first_name: '',
    email: '',
    phone_number: '',
    gender: '',
  });
  const [fileObj, setFileObj] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        image: user.image || defaultImage,
        last_name: user.last_name || '',
        first_name: user.first_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        gender: user.gender || '',
      });
    }
  }, [user]);

  // Handle image preview
  useEffect(() => {
    if (fileObj) {
      const imageUrl = URL.createObjectURL(fileObj);
      setProfileImage(imageUrl);
      return () => URL.revokeObjectURL(imageUrl);
    } else {
      setProfileImage(null);
    }
  }, [fileObj]);

  // Memoized handlers
  const handleButtonClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileObj(file);
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!user) {
        toast.error('User data is missing', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'dark',
        });
        return;
      }

      const profileData = new FormData();
      profileData.append('email', user.email || '');
      if (user.email !== formData.email) {
        profileData.append('new_email', formData.email);
      }
      if (fileObj) {
        profileData.append('image', fileObj);
      }
      
      profileData.append('first_name', formData.first_name || '');
      profileData.append('last_name', formData.last_name || '');
      profileData.append('phone_number', formData.phone_number || '');

      const token = Cookies.get('token')?.trim()?.replace(/^"|"$/g, '');
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

      if (!backendUrl) {
        console.error('Backend URL is not defined');
        toast.error('Server configuration error', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'dark',
        });
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`${backendUrl}/users/update`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: profileData,
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        Cookies.set('user', JSON.stringify(data.user));
        toast.success('Profile updated successfully!', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'dark',
        });

        // Reset file input and image preview
        setFileObj(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (error) {
        console.error('Error updating profile:', error);
        toast.error('Failed to update profile', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'dark',
        });
      } finally {
        setLoading(false);
      }
    },
    [user, formData, fileObj]
  );

  return (
    <section className="w-full max-w-lg mx-auto mt-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <h2 className="text-3xl font-bold text-sky-900 tracking-tight mb-8 text-center">Update Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Image Upload */}
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 rounded-full bg-sky-50 border-2 border-sky-300 overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            {profileImage ? (
              <Image
                alt="Profile preview"
                src={profileImage}
                fill
                className="object-cover"
                sizes="128px"
              />
            ) : (
              <Image
                alt="Profile image"
                src={formData.image || defaultImage}
                fill
                className="object-cover"
                sizes="128px"
              />
            )}
            <button
              type="button"
              onClick={handleButtonClick}
              className="absolute bottom-2 right-2 p-2 rounded-full bg-sky-600 hover:bg-sky-700 text-white shadow-sm transition-transform transform hover:scale-105"
              aria-label="Change profile image"
            >
              <FaPen className="text-sm" />
            </button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            aria-label="Profile image upload"
          />
          <span className="text-xs text-gray-500 mt-2">Click to upload new image</span>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="first_name"
              onChange={handleChange}
              value={formData.first_name}
            />
            <Input
              label="Last Name"
              name="last_name"
              onChange={handleChange}
              value={formData.last_name}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              name="phone_number"
              type="tel"
              onChange={handleChange}
              value={formData.phone_number}
            />
            <div className="opacity-50">
                 <Input
                  label="Email"
                  name="email"
                  type="email"
                  onChange={handleChange}
                  value={formData.email}
                  disabled
                />
            </div>
          </div>
          <div className="opacity-50">
              <Input
                label="Gender"
                name="gender"
                onChange={handleChange}
                value={formData.gender || ''}
                disabled
                
              />
          </div>
          
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-sky-600 to-sky-500 text-white py-3 rounded-lg font-semibold text-lg shadow-lg hover:from-sky-700 hover:to-sky-600 transition-transform transform hover:scale-105 disabled:opacity-50 flex justify-center items-center"
        >
          {loading ? <ImSpinner9 className="animate-spin text-xl" /> : 'Save Changes'}
        </button>
      </form>
    </section>
  );
}