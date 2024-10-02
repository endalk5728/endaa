import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export async function GET() {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query<RowDataPacket[]>('SELECT * FROM categories');
    return NextResponse.json(rows);
  } catch (error: unknown) {
    console.error('Error fetching categories:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Failed to fetch categories', details: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Failed to fetch categories', details: 'An unknown error occurred' }, { status: 500 });
    }
  } finally {
    if (connection) connection.release();
  }
}

export async function POST(request: Request) {
  let connection;
  try {
    const { name, slug, meta_title, meta_description } = await request.json();
    connection = await pool.getConnection();
    const [result] = await connection.query<ResultSetHeader>(
      'INSERT INTO categories (name, slug, meta_title, meta_description) VALUES (?, ?, ?, ?)',
      [name, slug, meta_title, meta_description]
    );
    return NextResponse.json({ message: 'Category created successfully', id: result.insertId });
  } catch (error: unknown) {
    console.error('Error creating category:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Failed to create category', details: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Failed to create category', details: 'An unknown error occurred' }, { status: 500 });
    }
  } finally {
    if (connection) connection.release();
  }
}
