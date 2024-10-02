import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { OkPacket } from 'mysql2';
import { RowDataPacket } from 'mysql2';

export async function POST(req: NextRequest) {
  try {
    const { facebook, twitter, instagram, linkedin, telegram } = await req.json();

    const socialMediaLinks = {
      facebook,
      twitter,
      instagram,
      linkedin,
      telegram
    };

    const connection = await pool.getConnection();
    
    try {
      for (const [platform, url] of Object.entries(socialMediaLinks)) {
        if (typeof url !== 'string') {
          continue; // Skip if the URL is not a string
        }

        const [result] = await connection.query<OkPacket>(
          `INSERT INTO social_media (platform, url) 
           VALUES (?, ?) 
           ON DUPLICATE KEY UPDATE 
           url = VALUES(url)`,
          [platform, url]
        );

        if (result.affectedRows === 0) {
          console.warn(`No rows affected for ${platform}`);
        }
      }

      return NextResponse.json({ message: 'Social media links updated successfully' });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating social media links:', error);
    return NextResponse.json({ error: 'Failed to update social media links' }, { status: 500 });
  }
}

export async function GET() {
    try {
      const connection = await pool.getConnection();
      
      try {
        // First, let's get the column names
        const [columns] = await connection.query<RowDataPacket[]>(
          'SHOW COLUMNS FROM social_media'
        );
  
        const columnNames = columns.map(column => column.Field).join(', ');
  
        // Now, let's query all the data using the actual column names
        const [rows] = await connection.query<RowDataPacket[]>(
          `SELECT ${columnNames} FROM social_media`
        );
  
        if (rows.length === 0) {
          return NextResponse.json({ error: 'Social media links not found' }, { status: 404 });
        }
  
        return NextResponse.json(rows);
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Error fetching social media links:', error);
      return NextResponse.json({ error: 'Failed to fetch social media links' }, { status: 500 });
    }
  }