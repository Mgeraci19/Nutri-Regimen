import React from 'react';

interface ErrorAlertProps {
  error: string | null;
  onDismiss?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, onDismiss }) => {
  if (!error) return null;

  return (
    <div className="alert alert-error">
      <span>{error}</span>
      {onDismiss && (
        <button 
          className="btn btn-sm btn-ghost"
          onClick={onDismiss}
          aria-label="Dismiss error"
        >
          ✕
        </button>
      )}
    </div>
  );
};
