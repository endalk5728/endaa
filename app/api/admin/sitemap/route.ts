import { NextResponse } from 'next/server'
import { execSync } from 'child_process'

export async function POST() {
  try {
    // Run the next-sitemap script
    execSync('npm run postbuild')

    // Assuming your sitemap is generated at the root of your public directory
    const sitemapUrl = `${process.env.NEXTAUTH_URL}/sitemap.xml`

    return NextResponse.json({ sitemapUrl })
  } catch (error) {
    console.error('Failed to generate sitemap:', error)
    return NextResponse.json({ error: 'Failed to generate sitemap' }, { status: 500 })
  }
}
