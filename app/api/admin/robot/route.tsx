import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
  try {
    const { content } = await request.json()

    // Define the path to the public folder
    const publicFolderPath = path.join(process.cwd(), 'public')
    const robotsTxtPath = path.join(publicFolderPath, 'robots.txt')

    // Write the content to the robots.txt file
    await fs.writeFile(robotsTxtPath, content, 'utf-8')

    return NextResponse.json({ message: 'robots.txt file generated successfully' })
  } catch (error) {
    console.error('Failed to generate robots.txt file:', error)
    return NextResponse.json({ error: 'Failed to generate robots.txt file' }, { status: 500 })
  }
}
