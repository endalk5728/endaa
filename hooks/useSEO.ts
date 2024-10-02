import { useState, useEffect } from 'react';

interface SEOData {
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  og_title: string;
  og_description: string;
  og_image: string;
  twitter_card: string;
  google_analytics_id: string;
  bing_webmaster_id: string;
  robots_txt: string;
  sitemap_url: string;
}

export function useSEO() {
  const [seoData, setSeoData] = useState<SEOData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchSEOData() {
      try {
        const response = await fetch('/api/admin/seo');
        if (!response.ok) {
          throw new Error('Failed to fetch SEO data');
        }
        const data = await response.json();
        setSeoData(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchSEOData();
  }, []);

  return { seoData, isLoading, error };
}
