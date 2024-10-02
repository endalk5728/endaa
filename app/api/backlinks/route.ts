import { NextRequest, NextResponse } from 'next/server';
import  pool  from '@/lib/db';
import { BacklinkFormData } from '@/types/post';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM backlinks ORDER BY created_at DESC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching backlinks:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

  
  export async function POST(request: NextRequest) {
    try {
      const body: BacklinkFormData = await request.json();
      const { url, anchor_text, target_url, rel_attribute, is_active } = body;
  
      const [result] = await pool.query<ResultSetHeader>(
        'INSERT INTO backlinks (url, anchor_text, target_url, rel_attribute, is_active) VALUES (?, ?, ?, ?, ?)',
        [url, anchor_text, target_url, rel_attribute, is_active]
      );
  
      return NextResponse.json({ message: 'Backlink created successfully', id: result.insertId }, { status: 201 });
    } catch (error) {
      console.error('Error creating backlink:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
  
  