import { NextRequest, NextResponse } from 'next/server';
import  pool  from '@/lib/db';
import { BacklinkFormData } from '@/types/post';
import { ResultSetHeader } from 'mysql2';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body: BacklinkFormData = await request.json();
    const { url, anchor_text, target_url, rel_attribute, is_active } = body;

    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE backlinks SET url = ?, anchor_text = ?, target_url = ?, rel_attribute = ?, is_active = ? WHERE id = ?',
      [url, anchor_text, target_url, rel_attribute, is_active, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Backlink not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Backlink updated successfully' });
  } catch (error) {
    console.error('Error updating backlink:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const [result] = await pool.query<ResultSetHeader>('DELETE FROM backlinks WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Backlink not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Backlink deleted successfully' });
  } catch (error) {
    console.error('Error deleting backlink:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
