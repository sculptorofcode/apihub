
import React from 'react';
import { Button } from '@/components/ui/button';

const FeedEmptyState: React.FC = () => {
  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">💡</div>
      <h3 className="text-xl font-semibold text-[var(--text-900)] dark:text-[var(--text-50)] mb-2">
        No ideas found
      </h3>
      <p className="text-muted-foreground mb-6">
        Try following tags or posting your first idea to get started!
      </p>
      <Button variant="default">
        Post Your Idea
      </Button>
    </div>
  );
};

export default FeedEmptyState;
