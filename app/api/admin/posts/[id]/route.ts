import { NextResponse } from 'next/server'
import db from '@/lib/db'
import { ResultSetHeader, RowDataPacket } from 'mysql2'

interface Post extends RowDataPacket {
  id: number;
  title: string;
  content: string;
  description: string;
  category_id: number;
  status: string;
  category_name?: string;
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id

  if (!id) {
    return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
  }

  try {
    const body = await request.json()
    const { title, content, description, category_id, status } = body

    const [result] = await db.query<ResultSetHeader>(
      'UPDATE posts SET title = ?,  content = ?, description=?, category_id = ?, status = ?, updated_at = NOW() WHERE id = ?',
      [title, content, description, category_id, status, id]
    )

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Post updated successfully' })
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id

  if (!id) {
    return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
  }

  try {
    const [rows] = await db.query<Post[]>(
      'SELECT p.*, c.name as category_name FROM posts p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?',
      [id]
    )

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const post = rows[0]

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
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
    const [result] = await db.query<ResultSetHeader>('DELETE FROM posts WHERE id = ?', [id])
    
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
