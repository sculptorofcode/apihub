
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface FeedErrorStateProps {
  onRetry: () => void;
}

const FeedErrorState: React.FC<FeedErrorStateProps> = ({ onRetry }) => {
  return (
    <div className="min-h-screen bg-[var(--background)] px-4 py-8">
      <div className="max-w-4xl mx-auto">
        
        <Alert className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Failed to load posts. Please try again.</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              className="ml-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default FeedErrorState;
