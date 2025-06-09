import { useState, useCallback, useEffect } from 'react';
import { checkApiHealth } from '../apiClient';

interface UseApiHealthReturn {
  isHealthy: boolean | null;
  checkHealth: () => Promise<void>;
  isChecking: boolean;
}

export function useApiHealth(): UseApiHealthReturn {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const checkHealth = useCallback(async () => {
    setIsChecking(true);
    try {
      const healthy = await checkApiHealth();
      setIsHealthy(healthy);
      console.log(`🏥 API Health Check: ${healthy ? 'Healthy' : 'Unhealthy'}`);
    } catch (error) {
      console.error('❌ Health check failed:', error);
      setIsHealthy(false);
    } finally {
      setIsChecking(false);
    }
  }, []);

  // Check health on mount
  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  return {
    isHealthy,
    checkHealth,
    isChecking,
  };
}
