import pool from './db';
import { Post, PostCategory, Tag } from '@/types/post';
import { RowDataPacket } from 'mysql2';

// Define interfaces that extend RowDataPacket for your custom types
interface PostRow extends Post, RowDataPacket {}
interface TagRow extends Tag, RowDataPacket {}
interface PostCategoryRow extends PostCategory, RowDataPacket {}
interface TotalCountRow extends RowDataPacket { total: number }

export async function getPosts(category?: string, page = 1, limit = 10): Promise<{ posts: Post[], total: number }> {
  const offset = (page - 1) * limit;

  const [rows] = await pool.query<PostRow[]>(
    `SELECT p.*, c.name as category_name, c.slug as category_slug
     FROM posts p
     LEFT JOIN post_categories c ON p.category_id = c.id
     WHERE p.status = 'published'
     ${category ? 'AND c.slug = ?' : ''}
     ORDER BY p.published_at DESC
     LIMIT ? OFFSET ?`,
    category ? [category, limit, offset] : [limit, offset]
  );

  const [totalRows] = await pool.query<TotalCountRow[]>(
    `SELECT COUNT(*) as total
     FROM posts p
     LEFT JOIN post_categories c ON p.category_id = c.id
     WHERE p.status = 'published'
     ${category ? 'AND c.slug = ?' : ''}`,
    category ? [category] : []
  );

  const posts = await Promise.all(rows.map(async (post) => {
    const [tagRows] = await pool.query<TagRow[]>(
      `SELECT t.* FROM tags t
       JOIN post_tags pt ON t.id = pt.tag_id
       WHERE pt.post_id = ?`,
      [post.id]
    );
    return { ...post, tags: tagRows };
  }));

  return { posts, total: totalRows[0].total };
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const [rows] = await pool.query<PostRow[]>(
    `SELECT p.*, c.name as category_name, c.slug as category_slug
     FROM posts p
     LEFT JOIN post_categories c ON p.category_id = c.id
     WHERE p.slug = ? AND p.status = 'published'
     LIMIT 1`,
    [slug]
  );

  if (rows.length === 0) return null;

  const post = rows[0];
  const [tagRows] = await pool.query<TagRow[]>(
    `SELECT t.* FROM tags t
     JOIN post_tags pt ON t.id = pt.tag_id
     WHERE pt.post_id = ?`,
    [post.id]
  );
  post.tags = tagRows;

  return post;
}

export async function getCategories(): Promise<PostCategory[]> {
  const [rows] = await pool.query<PostCategoryRow[]>(
    'SELECT * FROM post_categories ORDER BY name'
  );
  return rows;
}
