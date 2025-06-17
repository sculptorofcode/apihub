import React, { useState, useEffect, ReactNode } from 'react';
import { useToast } from '../../hooks/use-toast';
import { User, AuthContext } from './auth-types';
import apiClient from '../../api/apiConfig';
import { API_ROUTES } from '../../api/apiRoutes';

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await apiClient.get(API_ROUTES.user.details);
          setUser(response.data.user);
        } catch (error) {
          console.error('Authentication check error:', error);
          localStorage.removeItem('auth_token');
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [token]);

  // Login function
  const login = async (login: string, password: string): Promise<boolean> => {
    try {
      const response = await apiClient.post(API_ROUTES.auth.login, { login, password });

      if (response.data.success) {
        localStorage.setItem('auth_token', response.data.token);
        setToken(response.data.token);
        setUser(response.data.user);
        toast({
          title: "Success",
          description: "You've been logged in successfully",
        });
        return true;
      } else {
        toast({
          title: "Login failed",
          description: response.data.message || "Invalid credentials",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Register function
  const register = async (
    name: string,
    email: string,
    username: string,
    password: string,
    password_confirmation: string
  ): Promise<boolean> => {
    try {
      const response = await apiClient.post(API_ROUTES.auth.register, {
        name,
        email,
        username,
        password,
        password_confirmation
      });

      if (response.data.success) {
        localStorage.setItem('auth_token', response.data.token);
        setToken(response.data.token);
        setUser(response.data.user);
        toast({
          title: "Success",
          description: "Your account has been created successfully",
        });
        return true;
      } else {
        toast({
          title: "Registration failed",
          description: response.data.message || "Please check your information and try again",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    if (token) {
      try {
        await apiClient.post(API_ROUTES.auth.logout);
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
    toast({
      title: "Logged out",
      description: "You've been logged out successfully",
    });
  };

  // Update profile function
  const updateProfile = async (profileData: Partial<User>): Promise<boolean> => {
    if (!token) return false;

    try {
      const formData = new FormData();

      Object.entries(profileData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'avatar' && value instanceof File) {
            formData.append(key, value, value.name);
          } else {
            formData.append(key, value as string);
          }
        }
      });

      const response = await apiClient.post(API_ROUTES.user.profile, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.data.success) {
        setUser(response.data.user);
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully",
        });
        return true;
      } else {
        toast({
          title: "Update failed",
          description: response.data.message || "Failed to update profile",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: "Update error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Forgot password function
  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      const response = await apiClient.post(API_ROUTES.auth.forgotPassword, { email });

      if (response.data.success) {
        toast({
          title: "Password reset email sent",
          description: "Check your email for a password reset link",
        });
        return true;
      } else {
        toast({
          title: "Failed to send reset email",
          description: response.data.message || "Please check your email and try again",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Reset password function
  const resetPassword = async (
    token: string,
    email: string,
    password: string,
    password_confirmation: string
  ): Promise<boolean> => {
    try {
      const response = await apiClient.post(API_ROUTES.auth.resetPassword, {
        token,
        email,
        password,
        password_confirmation
      });

      if (response.data.success) {
        toast({
          title: "Password reset successful",
          description: "You can now login with your new password",
        });
        return true;
      } else {
        toast({
          title: "Password reset failed",
          description: response.data.message || "Please check your information and try again",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Reset password error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };
  // Check username availability
  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    try {
      // Don't check for empty usernames
      if (!username || username.trim() === '') {
        return false;
      }

      const response = await apiClient.get(API_ROUTES.auth.checkUsername, {
        params: { username }
      });

      // Return true if username is available (not taken)
      return response.data.available;
    } catch (error) {
      console.error('Username availability check error:', error);
      return false;
    }
  };

  // Email verification function
  const verifyEmail = async (id: string, hash: string, expires: string, signature: string): Promise<boolean> => {
    try {
      const response = await apiClient.get(`${API_ROUTES.auth.verifyEmail}/${id}/${hash}`, {
        params: { expires, signature }
      });

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Your email has been verified successfully",
        });
        return true;
      } else {
        toast({
          title: "Verification failed",
          description: response.data.message || "Could not verify your email address",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Email verification error:', error);
      toast({
        title: "Verification error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Resend verification email function
  const resendVerificationEmail = async (email: string): Promise<boolean> => {
    try {
      const response = await apiClient.post(API_ROUTES.auth.resendVerificationEmail, { email });

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Verification link has been sent to your email",
        });
        return true;
      } else {
        toast({
          title: "Failed to resend verification email",
          description: response.data.message || "Please check your email address",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Resend verification email error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Prepare the context value
  const contextValue = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    error: null,
    login,
    register,
    logout,
    updateProfile,
    forgotPassword,
    resetPassword,
    checkUsernameAvailability,
    verifyEmail,
    resendVerificationEmail,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
