import { query } from '@/lib/db'
import { Tag } from '@/types'

export async function getTagByName(name: string): Promise<Tag | null> {
  const [tag] = await query('SELECT * FROM tags WHERE name = ?', [name])
  return tag || null
}

export async function createTag(tagData: { name: string; slug: string }): Promise<Tag> {
  const result = await query('INSERT INTO tags (name, slug) VALUES (?, ?)', [tagData.name, tagData.slug])
  return { id: result.insertId, ...tagData, created_at: new Date(), updated_at: new Date() }
}
