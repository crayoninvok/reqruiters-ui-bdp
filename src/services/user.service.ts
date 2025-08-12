import api from './api';

// Types based on your Prisma schema
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'HR';
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  name: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateEmailData {
  newEmail: string;
  password: string;
}

export interface DeleteAccountData {
  password: string;
  confirmDelete: string; // Should be 'DELETE'
}

export interface ApiResponse<T = any> {
  message: string;
  user?: T;
}

export class UserService {
  // Get current user profile
  static async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get('/user/profile');
      return response.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
    }
  }

  // Update user profile with optional avatar
  static async updateProfile(data: UpdateProfileData, avatarFile?: File): Promise<User> {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const response = await api.put('/user/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  }

  // Remove user avatar
  static async removeAvatar(): Promise<User> {
    try {
      const response = await api.delete('/user/avatar');
      return response.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to remove avatar');
    }
  }

  // Change password
  static async changePassword(data: ChangePasswordData): Promise<void> {
    try {
      await api.put('/user/change-password', data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to change password');
    }
  }

  // Update email
  static async updateEmail(data: UpdateEmailData): Promise<User> {
    try {
      const response = await api.put('/user/update-email', data);
      return response.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update email');
    }
  }

  // Delete user account
  static async deleteAccount(data: DeleteAccountData): Promise<void> {
    try {
      await api.delete('/user/account', { data });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete account');
    }
  }

  // Upload avatar only
  static async uploadAvatar(avatarFile: File): Promise<User> {
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);

      const response = await api.put('/user/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to upload avatar');
    }
  }

  // Validate file type for avatar upload
  static validateAvatarFile(file: File): { isValid: boolean; error?: string } {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.',
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'File size too large. Please upload an image smaller than 5MB.',
      };
    }

    return { isValid: true };
  }

  // Validate email format
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    if (password.length > 128) {
      errors.push('Password must be less than 128 characters');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}