import { useState, useEffect } from 'react';
import { Branding } from '@/types/post';

export function useBranding() {
  const [branding, setBranding] = useState<Branding | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBranding() {
      try {
        const response = await fetch('/api/branding');
        if (!response.ok) {
          throw new Error('Failed to fetch branding');
        }
        const data = await response.json();
        setBranding(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchBranding();
  }, []);

  return { branding, isLoading, error };
}
