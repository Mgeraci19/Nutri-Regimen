import React from 'react';

interface ApiHealthIndicatorProps {
  isHealthy: boolean | null;
  onRetry: () => void;
  isChecking?: boolean;
}

export const ApiHealthIndicator: React.FC<ApiHealthIndicatorProps> = ({
  isHealthy,
  onRetry,
  isChecking = false
}) => {
  const getAlertClass = () => {
    if (isHealthy === true) return 'alert-success';
    if (isHealthy === false) return 'alert-error';
    return 'alert-warning';
  };

  const getStatusText = () => {
    if (isChecking) return '⏳ Checking...';
    if (isHealthy === true) return '✅ Connected';
    if (isHealthy === false) return '❌ Disconnected';
    return '⏳ Checking...';
  };

  return (
    <div className={`alert ${getAlertClass()}`}>
      <span>
        API Status: {getStatusText()}
        {isHealthy === false && (
          <>
            <br />
            <button 
              className="btn btn-sm btn-outline mt-2" 
              onClick={onRetry}
              disabled={isChecking}
            >
              {isChecking ? 'Checking...' : 'Retry Connection'}
            </button>
          </>
        )}
      </span>
    </div>
  );
};
