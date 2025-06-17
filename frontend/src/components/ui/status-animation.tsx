import React from 'react';
import { cn } from '../../lib/utils';

interface StatusAnimationProps {
  status: 'idle' | 'checking' | 'available' | 'taken';
  children: React.ReactNode;
  className?: string;
}

export function StatusAnimation({ status, children, className }: StatusAnimationProps) {
  // Define animation classes based on status
  const animationClass = {
    idle: '',
    checking: 'animate-pulse',
    available: 'animate-fadeIn',
    taken: 'animate-shake',
  }[status];

  return (
    <div className={cn("transition-all duration-200", animationClass, className)}>
      {children}
    </div>
  );
}
