import apiClient from '../api/apiConfig';
import { API_ROUTES } from '../api/apiRoutes';
import { User } from '../contexts/auth/auth-types';

/**
 * Service for managing user profile operations
 */
export class ProfileService {
  /**
   * Get a user profile by username
   * @param username - The username of the profile to fetch
   */
  static async getUserProfile(username: string): Promise<User> {
    try {
      const response = await apiClient.get(API_ROUTES.profile.get(username));
      
      if (response.data.success) {
        return response.data.user;
      }
      
      throw new Error(response.data.message || 'Failed to fetch profile');
    } catch (error) {
      console.error('ProfileService.getUserProfile error:', error);
      throw error;
    }
  }

  /**
   * Update a user's profile
   * @param profileData - The profile data to update
   * @param hasFileUpload - Whether the update includes file uploads
   */
  static async updateProfile(profileData: Partial<User>, hasFileUpload: boolean = false): Promise<User> {
    let requestData: FormData | object = profileData;

    // Handle file uploads with FormData if needed
    if (hasFileUpload) {
      const formData = new FormData();
      
      // Handle banner upload
      if (profileData.banner instanceof File) {
        formData.append('banner', profileData.banner);
      }

      // Handle avatar upload
      if (profileData.avatar instanceof File) {
        formData.append('avatar', profileData.avatar);
      }

      // Add all other fields
      Object.entries(profileData).forEach(([key, value]) => {
        if ((key !== 'banner' || typeof value === 'string') &&
          (key !== 'avatar' || typeof value === 'string') &&
          value !== undefined) {
          formData.append(key, String(value));
        }
      });

      requestData = formData;
    }
    
    try {
      const response = await apiClient.post(API_ROUTES.profile.update, requestData, {
        headers: {
          'Content-Type': hasFileUpload ? 'multipart/form-data' : 'application/json'
        }
      });
      
      if (response.data.success) {
        return response.data.user;
      }
      
      throw new Error(response.data.message || 'Update failed');
    } catch (error) {
      console.error('ProfileService.updateProfile error:', error);
      throw error;
    }
  }
  
  /**
   * Update user's last active timestamp
   */
  static async updateActivity(): Promise<boolean> {
    try {
      const response = await apiClient.post(API_ROUTES.profile.activity);
      return response.data.success;
    } catch (error) {
      console.error('ProfileService.updateActivity error:', error);
      return false;
    }
  }
}

export default ProfileService;
