import { useContext } from 'react';
import { AuthContext } from './auth-types';

/**
 * Custom hook to use the auth context
 * Ensures the hook is used within an AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
