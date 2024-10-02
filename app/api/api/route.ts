import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import { RowDataPacket } from 'mysql2'
import slugify from 'slugify'

function generateUniqueSlug(title: string, existingSlugs: Set<string>): string {
  const slug = slugify(title, { lower: true, strict: true })
  let uniqueSlug = slug
  let counter = 1

  while (existingSlugs.has(uniqueSlug)) {
    uniqueSlug = `${slug}-${counter}`
    counter++
  }

  existingSlugs.add(uniqueSlug)
  return uniqueSlug
}

export async function POST(req: NextRequest) {
    try {
      const { apiUrl, jobCount } = await req.json()
  
      // Fetch the category ID for "jobs"
      const [jobsCategoryRow] = await db.query<RowDataPacket[]>(
        'SELECT id FROM categories WHERE name = ?',
        ['jobs']
      )
  
      if (jobsCategoryRow.length === 0) {
        throw new Error('Jobs category not found')
      }
  
      const jobsCategoryId = jobsCategoryRow[0].id
  
      const response = await fetch(`${apiUrl}?page=1&per_page=${jobCount}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
  
      const data = await response.json()
      const jobs = data.data
  
      let jobsStored = 0
      const existingSlugs = new Set<string>()
  
      // Fetch existing slugs
      const [existingSlugRows] = await db.query<RowDataPacket[]>('SELECT slug FROM posts')
      existingSlugRows.forEach((row) => existingSlugs.add(row.slug))
  
      for (const job of jobs) {
        const [existingJob] = await db.query<RowDataPacket[]>(
          'SELECT id FROM posts WHERE title = ? AND content = ?',
          [job.title, job.description]
        )
  
        if (existingJob.length === 0) {
          const slug = generateUniqueSlug(job.title, existingSlugs)
          
          // Store only the image URL
          const featuredImage = `https://pub-f30882b481294faa997a4d11ff77ce65.r2.dev/${job.company.logo}`
          
          // Combine job description and additional details
          const fullContent = `
            ${job.description || ''}


              ${job.skills_mandatory_names && job.skills_mandatory_names.length > 0 ? `
            <h2>Required Skills</h2>
            ${job.skills_mandatory_names.join(', ')}
            ` : ''}

              ${job.skills_desired_names && job.skills_desired_names.length > 0 ? `
            <h2>Desired Skills</h2>
            ${job.skills_desired_names.join(', ')}
            ` : ''}
  
  
              ${job.language_skills_names && job.language_skills_names.length > 0 ? `
            <h2>Language Skills</h2>
            ${job.language_skills_names.join(', ')}
            ` : ''}


            <h3 className="font-bold text-blue-500">How to Apply</h3>
            ${job.how_to_apply || 'Not specified'}
  
          
       <h2>Salary Range</h2>
            ${job.salary_from && job.salary_to ? `${job.salary_from} - ${job.salary_to}` : 'Not specified'}
          `
  
          
          
  
       
          await db.query(
            `INSERT INTO posts (category_id, title, slug, content, featured_image, meta_description, status, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, 'published', NOW(), NOW())`,
            [jobsCategoryId, job.title, slug, fullContent, featuredImage, 'Jobs and Vacancies in Ethiopia | Ethiojobs']
          )
          jobsStored++
        }
      }
  
      return NextResponse.json({ success: true, jobsStored })
    } catch (error) {
      console.error('Error fetching and storing jobs:', error)
      return NextResponse.json({ error: 'Failed to fetch and store jobs' }, { status: 500 })
    }
  }