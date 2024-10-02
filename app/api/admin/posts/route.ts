import { NextResponse } from 'next/server'
import { createPost } from '@/lib/posts'
import db from '@/lib/db'
import { createTag, getTagByName } from '@/lib/tags'
import { slugify } from '@/lib/utils'

export async function POST(request: Request) {
  const connection = await db.getConnection();

  try {
    const postData = await request.json()
    
    await connection.beginTransaction()

    // Create the post
    const newPost = await createPost(postData)

    // Handle tags
    if (postData.tags && Array.isArray(postData.tags)) {
      for (const tagName of postData.tags) {
        let tag = await getTagByName(tagName)
        if (!tag) {
          // Create new tag if it doesn't exist
          tag = await createTag({ name: tagName, slug: slugify(tagName) })
        }

        // Associate tag with post
        await connection.execute('INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)', [newPost.id, tag.id])
      }
    }

    await connection.commit()

    return NextResponse.json(newPost, { status: 201 })
  } catch (error) {
    await connection.rollback()
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  } finally {
    connection.release()
  }
}

interface DbRow {
  id: number;
  title: string;
  category_name: string | null;
  created_at: string;
  updated_at: string;
}

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT p.id, p.title, p.created_at, p.updated_at, c.name as category_name
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `)

    const posts = (rows as DbRow[]).map(row => ({
      id: row.id,
      title: row.title,
      category_name: row.category_name || 'Uncategorized',
      created_at: new Date(row.created_at).toISOString(),
      updated_at: new Date(row.updated_at).toISOString(),
    }))

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

interface DeleteResult {
  affectedRows: number;
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id

  if (!id) {
    return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
  }

  try {
    const [result] = await db.query('DELETE FROM posts WHERE id = ?', [id])
    
    if ((result as DeleteResult).affectedRows === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
