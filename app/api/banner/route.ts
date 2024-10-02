import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { Banner } from '@/types/post';
import { writeFile } from 'fs/promises';
import path from 'path';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string;
    const link = formData.get('link') as string;
    const buttonText = formData.get('buttonText') as string;
    const isActive = formData.get('isActive') === 'true';
    const imageFile = formData.get('imageFile') as File;

    let imageUrl = '';
    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `banner_${Date.now()}_${imageFile.name}`;
      const filePath = path.join(process.cwd(), 'public', 'images', fileName);
      await writeFile(filePath, buffer);
      imageUrl = `/images/${fileName}`;
    }

    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query<ResultSetHeader>(
        'INSERT INTO banners (title, subtitle, link, image_url, button_text, is_active) VALUES (?, ?, ?, ?, ?, ?)',
        [title, subtitle, link, imageUrl, buttonText, isActive]
      );

      const insertId = result.insertId;

      const [rows] = await connection.query<RowDataPacket[]>('SELECT * FROM banners WHERE id = ?', [insertId]);
      const newBanner: Banner = rows[0] as Banner;

      return NextResponse.json(newBanner, { status: 201 });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query<RowDataPacket[]>(
        'SELECT * FROM banners WHERE is_active = true ORDER BY created_at DESC LIMIT 1'
      );

      const activeBanner: Banner | null = rows[0] as Banner | null;
      return NextResponse.json(activeBanner);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching active banner:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}