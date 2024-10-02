import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Fetch tags from your database or any other data source
    const tags = [
      { id: 1, name: 'Technology' },
      { id: 2, name: 'Programming' },
      { id: 3, name: 'Web Development' },
      // Add more tags as needed
    ]

    return NextResponse.json(tags)
  } catch (error) {
    console.error('Error fetching tags:', error)
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 })
  }
}
