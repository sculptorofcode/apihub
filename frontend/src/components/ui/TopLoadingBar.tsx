import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface TopLoadingBarProps {
  color?: string;
  height?: number;
}

const TopLoadingBar: React.FC<TopLoadingBarProps> = ({ 
  color = 'var(--primary-500)', 
  height = 3 
}) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Start progress when location changes
    setProgress(0);
    setIsVisible(true);

    const incrementProgress = () => {
      setProgress(prev => {
        // Slow down as we approach 90%
        if (prev >= 90) {
          return prev + 0.5;
        }
        // Move faster initially
        return prev + (100 - prev) / 10;
      });
    };

    // Start incrementing
    const timer = setInterval(incrementProgress, 100);

    // Finish loading after a short delay
    const completeTimer = setTimeout(() => {
      setProgress(100);
      
      // Hide the bar after completion animation
      setTimeout(() => {
        setIsVisible(false);
      }, 300);
    }, 500);

    return () => {
      clearInterval(timer);
      clearTimeout(completeTimer);
    };
  }, [location.pathname]); // Trigger on route change

  if (!isVisible && progress === 0) return null;

  return (
    <div 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        height: `${height}px`,
        width: `${progress}%`,
        backgroundColor: color,
        zIndex: 9999,
        transition: `width 0.2s ease-out${progress === 100 ? ', opacity 0.3s ease-out 0.1s' : ''}`,
        opacity: progress === 100 ? 0 : 1,
      }}
    />
  );
};

export default TopLoadingBar;
