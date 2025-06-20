import { useEffect } from 'react';
import { RealtimeService } from '@/services';
import { useAuth } from '../contexts/auth/useAuth';

/**
 * Component for initializing the realtime service when the application loads
 * This is rendered in the App component
 */
const RealtimeInitializer = () => {
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    // Initialize realtime connection when user is authenticated
    if (isAuthenticated && token) {
      console.log('Initializing WebSocket connection with auth token');
      const realtimeService = RealtimeService.getInstance();
      realtimeService.connect();

      // Disconnect when component unmounts
      return () => {
        realtimeService.disconnect();
      };
    }
  }, [isAuthenticated, token]);

  // This component doesn't render anything
  return null;
};

export default RealtimeInitializer;
