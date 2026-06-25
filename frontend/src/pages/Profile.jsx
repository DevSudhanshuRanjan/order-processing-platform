import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const profileSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
});

const Profile = () => {
  const { user, token, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    }
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      const response = await axios.put('http://localhost:5000/api/users/profile', data, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success(response.data.message);
        updateUser(response.data.user);
        setIsEditing(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="bg-surface dark:bg-black min-h-[calc(100vh-80px)] flex justify-center py-margin-desktop px-margin-mobile">
      <div className="w-full max-w-xl">
        <h1 className="font-headline-xl text-headline-xl text-on-surface dark:text-white mb-stack-md">My Profile</h1>
        
        <div className="bg-surface-container-low dark:bg-[#141b2b]/40 backdrop-blur-md rounded-3xl p-8 border border-outline-variant/20 shadow-lg">
          <div className="flex items-center gap-6 mb-stack-lg">
            <div className="w-20 h-20 rounded-full bg-primary-fixed dark:bg-[#dce2f7] flex items-center justify-center text-on-primary-fixed text-headline-lg font-headline-lg shadow-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-headline-lg text-[24px] text-on-surface dark:text-white">{user?.name}</h2>
              <p className="font-body-md text-on-surface-variant dark:text-[#c0c6db] capitalize">{user?.role} Account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block font-label-md text-on-surface dark:text-white mb-2">Full Name</label>
              <input
                type="text"
                disabled={!isEditing}
                {...register('name')}
                className={`w-full bg-transparent border ${errors.name ? 'border-error' : 'border-outline-variant/30'} rounded-xl py-3 px-4 font-body-md text-on-surface dark:text-white focus:outline-none focus:border-primary-fixed transition-colors disabled:opacity-50`}
              />
              {errors.name && <span className="text-error text-sm mt-1 block">{errors.name.message}</span>}
            </div>

            <div>
              <label className="block font-label-md text-on-surface dark:text-white mb-2">Email Address</label>
              <input
                type="email"
                disabled={!isEditing}
                {...register('email')}
                className={`w-full bg-transparent border ${errors.email ? 'border-error' : 'border-outline-variant/30'} rounded-xl py-3 px-4 font-body-md text-on-surface dark:text-white focus:outline-none focus:border-primary-fixed transition-colors disabled:opacity-50`}
              />
              {errors.email && <span className="text-error text-sm mt-1 block">{errors.email.message}</span>}
            </div>

            <div className="pt-4 flex gap-4">
              {isEditing ? (
                <>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-primary dark:bg-white text-on-primary dark:text-black font-label-md py-3 rounded-xl hover:bg-inverse-surface dark:hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      reset({ name: user.name, email: user.email });
                    }}
                    className="flex-1 bg-surface-container dark:bg-transparent border border-outline-variant/20 dark:text-white font-label-md py-3 rounded-xl hover:bg-surface-variant dark:hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-surface-container dark:bg-white/10 text-on-surface dark:text-white font-label-md py-3 rounded-xl hover:bg-surface-variant dark:hover:bg-white/20 transition-colors border border-outline-variant/20"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
