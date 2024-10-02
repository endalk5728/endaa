import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const { name, slug, meta_title, meta_description } = await request.json();

  try {
    await pool.execute(
      'UPDATE categories SET name = ?, slug = ?, meta_title = ?, meta_description = ? WHERE id = ?',
      [name, slug, meta_title, meta_description, id]
    );
    return NextResponse.json({ message: 'Category updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    await pool.execute('DELETE FROM categories WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
