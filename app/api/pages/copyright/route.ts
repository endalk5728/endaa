import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket, OkPacket } from 'mysql2';

export async function POST(req: NextRequest) {
  try {
    const { copyrightText, year } = await req.json();

    if (typeof copyrightText !== 'string' || typeof year !== 'string' || !/^\d{4}$/.test(year)) {
      return NextResponse.json({ error: 'Invalid copyright information' }, { status: 400 });
    }

    const connection = await pool.getConnection();
    
    try {
      const [result] = await connection.query<OkPacket>(
        'INSERT INTO copyright (copyright_text, year) VALUES (?, ?) ON DUPLICATE KEY UPDATE copyright_text = ?, year = ?',
        [copyrightText, year, copyrightText, year]
      );

      if (result.affectedRows === 0) {
        throw new Error('No rows were affected');
      }

      return NextResponse.json({ message: 'Copyright information updated successfully' });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating copyright information:', error);
    return NextResponse.json({ error: 'Failed to update copyright information' }, { status: 500 });
  }
}
export async function GET() {
    try {
      const connection = await pool.getConnection();
      
      try {
        const [rows] = await connection.query<RowDataPacket[]>(
          'SELECT copyright_text, year FROM copyright LIMIT 1'
        );
  
        if (rows.length === 0) {
          return NextResponse.json({ error: 'Copyright information not found' }, { status: 404 });
        }
  
        return NextResponse.json(rows[0]);
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Error fetching copyright information:', error);
      return NextResponse.json({ error: 'Failed to fetch copyright information' }, { status: 500 });
    }
  }