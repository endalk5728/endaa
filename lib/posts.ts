import pool from './db'
import { Post, PostInput,PostCategory } from '@/types/post'
import { RowDataPacket, ResultSetHeader } from 'mysql2'

export async function getPosts(): Promise<Post[]> {
  const [rows] = await pool.query<RowDataPacket[]>(`
    SELECT p.*, c.name as category_name 
    FROM posts p 
    LEFT JOIN categories c ON p.category_id = c.id 
    ORDER BY p.created_at DESC
  `)
  return rows as Post[]
}

export async function getCategories(): Promise<PostCategory[]> {
  const [rows] = await pool.query<RowDataPacket[]>(`
    SELECT * FROM categories 
    ORDER BY name
  `);
  return rows as PostCategory[];
} 
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM posts WHERE slug = ?',
    [slug]
  )
  return rows[0] as Post | null
}

export async function createPost(postData: PostInput): Promise<Post> {
  const { 
    title, 
    slug, 
    category_id, 
    description, 
    content, 
    meta_title, 
    meta_description, 
    meta_keywords, 
    featured_image, 
    url,
    url_label,
    status,
   
  } = postData

  const connection = await pool.getConnection()
  
  try {
    await connection.beginTransaction()

    const [result] = await connection.query<ResultSetHeader>(
      `INSERT INTO posts (
        title, slug, category_id, description, content, 
        meta_title, meta_description, meta_keywords, 
        featured_image, url, url_label, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, slug, category_id, description, content,
        meta_title, meta_description, meta_keywords,
        featured_image, url, url_label, status
      ]
    )

    const postId = result.insertId



    await connection.commit()

    const newPost = await getPostById(postId)
    return newPost
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

export async function updatePost(id: number, postData: Partial<PostInput>): Promise<Post> {
  const { 
    title, 
    slug, 
    category_id, 
    description, 
    content, 
    meta_title, 
    meta_description, 
    meta_keywords, 
    featured_image, 
    url,
    url_label,
    status,
   
  } = postData

  const connection = await pool.getConnection()
  
  try {
    await connection.beginTransaction()

    await connection.query(
      `UPDATE posts SET 
        title = IFNULL(?, title),
        slug = IFNULL(?, slug),
        category_id = IFNULL(?, category_id),
        description = IFNULL(?, description),
        content = IFNULL(?, content),
        meta_title = IFNULL(?, meta_title),
        meta_description = IFNULL(?, meta_description),
        meta_keywords = IFNULL(?, meta_keywords),
        featured_image = IFNULL(?, featured_image),
        url = IFNULL(?, url),
        url_label = IFNULL(?, url_label),
        status = IFNULL(?, status)
      WHERE id = ?`,
      [
        title, slug, category_id, description, content,
        meta_title, meta_description, meta_keywords,
        featured_image, url, url_label, status, id
      ]
    )

   
    await connection.commit()

    const updatedPost = await getPostById(id)
    return updatedPost
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

export async function deletePost(id: number): Promise<void> {
  await pool.query('DELETE FROM posts WHERE id = ?', [id])
}

async function getPostById(id: number): Promise<Post> {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM posts WHERE id = ?',
    [id]
  )
  return rows[0] as Post
}
