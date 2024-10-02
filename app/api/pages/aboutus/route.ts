import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket, OkPacket } from 'mysql2';

export async function POST(req: NextRequest) {
  try {
    const { aboutUsContent } = await req.json();

    if (!aboutUsContent || typeof aboutUsContent !== 'string') {
      return NextResponse.json({ error: 'Invalid about us content' }, { status: 400 });
    }

    const connection = await pool.getConnection();
    
    try {
      // First, delete all existing content
      await connection.query('DELETE FROM about_us');

      // Then, insert the new content
      const [result] = await connection.query<OkPacket>(
        'INSERT INTO about_us (content) VALUES (?)',
        [aboutUsContent]
      );

      if (result.affectedRows === 0) {
        throw new Error('No rows were affected');
      }

      return NextResponse.json({ message: 'About Us content updated successfully' });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating About Us content:', error);
    return NextResponse.json({ error: 'Failed to update About Us content' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const connection = await pool.getConnection();
    
    try {
      const [rows] = await connection.query<RowDataPacket[]>(
        'SELECT content FROM about_us LIMIT 1'
      );

      if (rows.length === 0) {
        return NextResponse.json({ error: 'About Us content not found' }, { status: 404 });
      }

      return NextResponse.json({ content: rows[0].content });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching About Us content:', error);
    return NextResponse.json({ error: 'Failed to fetch About Us content' }, { status: 500 });
  }
}
