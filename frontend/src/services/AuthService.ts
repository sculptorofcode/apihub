import apiClient from '../api/apiConfig';
import { API_ROUTES } from '../api/apiRoutes';
import { User } from '../contexts/auth/auth-types';
import { ErrorService } from './ErrorService';

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
  unverified?: boolean;
  email_sent?: boolean;
  email?: string;
}

export interface RegisterResponse {
  success: boolean;
  user?: User;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PasswordResetResponse {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

/**
 * Service for handling authentication operations
 */
export class AuthService {
  /**
   * Log in a user
   * @param login - Email or username
   * @param password - User password
   */
  static async login(login: string, password: string): Promise<LoginResponse> {
    try {
      const response = await apiClient.post(API_ROUTES.auth.login, {
        login,
        password
      });
      
      return response.data;
    } catch (error) {
      ErrorService.logError('AuthService.login', error);
      
      // If there's a response with data, return it
      if (typeof error === 'object' && error !== null) {
        const axiosError = error as { response?: { data?: LoginResponse } };
        if (axiosError.response?.data) {
          return axiosError.response.data;
        }
      }
      
      throw error;
    }
  }

  /**
   * Register a new user
   * @param name - Full name
   * @param email - Email address
   * @param username - Username
   * @param password - Password
   * @param password_confirmation - Password confirmation
   */
  static async register(
    name: string,
    email: string,
    username: string,
    password: string,
    password_confirmation: string
  ): Promise<RegisterResponse> {
    try {
      const response = await apiClient.post(API_ROUTES.auth.register, {
        name,
        email,
        username,
        password,
        password_confirmation
      });
      
      return response.data;
    } catch (error) {
      ErrorService.logError('AuthService.register', error);
      
      if (typeof error === 'object' && error !== null) {
        const axiosError = error as { response?: { data?: RegisterResponse } };
        if (axiosError.response?.data) {
          return axiosError.response.data;
        }
      }
      
      throw error;
    }
  }

  /**
   * Log out the current user
   */
  static async logout(): Promise<boolean> {
    try {
      const response = await apiClient.post(API_ROUTES.auth.logout);
      return response.data.success;
    } catch (error) {
      ErrorService.logError('AuthService.logout', error);
      throw error;
    }
  }

  /**
   * Get the current authenticated user
   */
  static async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get(API_ROUTES.user.details);
      
      if (response.data.success) {
        return response.data.user;
      }
      
      return null;
    } catch (error) {
      ErrorService.logError('AuthService.getCurrentUser', error);
      return null;
    }
  }

  /**
   * Send a password reset link
   * @param email - User's email
   */
  static async forgotPassword(email: string): Promise<PasswordResetResponse> {
    try {
      const response = await apiClient.post(API_ROUTES.auth.forgotPassword, { email });
      return response.data;
    } catch (error) {
      ErrorService.logError('AuthService.forgotPassword', error);
      
      if (typeof error === 'object' && error !== null) {
        const axiosError = error as { response?: { data?: PasswordResetResponse } };
        if (axiosError.response?.data) {
          return axiosError.response.data;
        }
      }
      
      throw error;
    }
  }

  /**
   * Reset password using token
   * @param token - Reset token
   * @param email - User email
   * @param password - New password
   * @param password_confirmation - Password confirmation
   */
  static async resetPassword(
    token: string,
    email: string,
    password: string,
    password_confirmation: string
  ): Promise<PasswordResetResponse> {
    try {
      const response = await apiClient.post(API_ROUTES.auth.resetPassword, {
        token,
        email,
        password,
        password_confirmation
      });
      
      return response.data;
    } catch (error) {
      ErrorService.logError('AuthService.resetPassword', error);
      
      if (typeof error === 'object' && error !== null) {
        const axiosError = error as { response?: { data?: PasswordResetResponse } };
        if (axiosError.response?.data) {
          return axiosError.response.data;
        }
      }
      
      throw error;
    }
  }

  /**
   * Check if a username is available
   * @param username - Username to check
   */
  static async checkUsernameAvailability(username: string): Promise<boolean> {
    try {
      const response = await apiClient.get(
        `${API_ROUTES.auth.checkUsername}?username=${encodeURIComponent(username)}`
      );
      
      return response.data.available === true;
    } catch (error) {
      ErrorService.logError('AuthService.checkUsernameAvailability', error);
      return false;
    }
  }

  /**
   * Verify email using verification link data
   * @param id - User ID
   * @param hash - Verification hash
   * @param expires - Expiration timestamp
   * @param signature - Signature for verification
   */
  static async verifyEmail(
    id: string,
    hash: string,
    expires: string,
    signature: string
  ): Promise<boolean> {
    try {
      const response = await apiClient.get(
        `${API_ROUTES.auth.verifyEmail}/${id}/${hash}?expires=${expires}&signature=${signature}`
      );
      
      return response.data.success;
    } catch (error) {
      ErrorService.logError('AuthService.verifyEmail', error);
      return false;
    }
  }

  /**
   * Resend verification email
   * @param email - User's email
   */
  static async resendVerificationEmail(email: string): Promise<boolean> {
    try {
      const response = await apiClient.post(API_ROUTES.auth.resendVerificationEmail, { email });
      return response.data.success;
    } catch (error) {
      ErrorService.logError('AuthService.resendVerificationEmail', error);
      return false;
    }
  }
}

export default AuthService;
