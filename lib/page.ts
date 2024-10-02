import { Pages } from '@/types/post'

const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

export async function fetchPageBySlug(slug: string): Promise<Pages | null> {
  try {
    const response = await fetch(`${baseUrl}/api/pages?slug=${slug}`)
    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      console.error('Failed to fetch page')
      return null
    }
  } catch (error) {
    console.error('Error fetching page:', error)
    return null
  }
}
