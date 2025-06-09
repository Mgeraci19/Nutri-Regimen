import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'lg', 
  className = '' 
}) => {
  const sizeClass = `loading-${size}`;
  
  return (
    <div className={`flex justify-center ${className}`}>
      <span className={`loading loading-spinner ${sizeClass}`}></span>
    </div>
  );
};
