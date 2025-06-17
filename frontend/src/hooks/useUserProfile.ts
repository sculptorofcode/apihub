import { useState, useEffect } from 'react';
import { ProfileService, ErrorService } from '../services';
import { User } from '@/contexts/auth/auth-types';

interface UseUserProfileReturn {
  profile: User | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useUserProfile = (username: string): UseUserProfileReturn => {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchTrigger, setFetchTrigger] = useState<number>(0);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) {
        setError('Username is required');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);      try {
        const user = await ProfileService.getUserProfile(username);
        setProfile(user);
      } catch (err) {
        const errorMessage = ErrorService.getErrorMessage(
          err, 
          'An error occurred while fetching the user profile'
        );
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, fetchTrigger]);

  const refetch = () => {
    setFetchTrigger(prev => prev + 1);
  };

  return { profile, loading, error, refetch };
};
