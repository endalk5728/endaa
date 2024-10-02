import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import fs from 'fs/promises'
import path from 'path'

// Define an interface for the SEO data
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

export async function GET() {
  try {
    const result = await query('SELECT * FROM seo LIMIT 1') as SEOData[]
    const seoData = result[0] || {}

    // Read the robots.txt file content
    const robotsTxtPath = path.join(process.cwd(), 'public', 'robots.txt')
    let robotsTxtContent = ''
    try {
      robotsTxtContent = await fs.readFile(robotsTxtPath, 'utf-8')
    } catch (error) {
      console.error('Failed to read robots.txt file:', error)
    }

    return NextResponse.json({ ...seoData, robots_txt: robotsTxtContent })
  } catch (error) {
    console.error('Failed to fetch SEO settings:', error)
    return NextResponse.json({ error: 'Failed to fetch SEO settings' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as SEOData
    const {
      meta_title,
      meta_description,
      meta_keywords,
      og_title,
      og_description,
      og_image,
      twitter_card,
      google_analytics_id,
      bing_webmaster_id,
      robots_txt,
      sitemap_url,
    } = body
    
    await query(
      `INSERT INTO seo (meta_title, meta_description, meta_keywords, og_title, og_description, og_image, twitter_card, google_analytics_id, bing_webmaster_id, robots_txt, sitemap_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       meta_title = VALUES(meta_title),
       meta_description = VALUES(meta_description),
       meta_keywords = VALUES(meta_keywords),
       og_title = VALUES(og_title),
       og_description = VALUES(og_description),
       og_image = VALUES(og_image),
       twitter_card = VALUES(twitter_card),
       google_analytics_id = VALUES(google_analytics_id),
       bing_webmaster_id = VALUES(bing_webmaster_id),
       robots_txt = VALUES(robots_txt),
       sitemap_url = VALUES(sitemap_url)`,
      [meta_title, meta_description, meta_keywords, og_title, og_description, og_image, twitter_card, google_analytics_id, bing_webmaster_id, robots_txt, sitemap_url]
    )

    return NextResponse.json({ message: 'SEO settings updated successfully' })
  } catch (error) {
    console.error('Failed to update SEO settings:', error)
    return NextResponse.json({ error: 'Failed to update SEO settings' }, { status: 500 })
  }
}
