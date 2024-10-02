import { query } from '@/lib/db';

export interface SEOData {
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

export async function getSEOData(): Promise<SEOData | null> {
  try {
    const result = await query('SELECT * FROM seo LIMIT 1');
    return result[0] || null;
  } catch (error) {
    console.error('Failed to fetch SEO settings:', error);
    return null;
  }
}
