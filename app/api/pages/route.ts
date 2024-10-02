import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { PagesInput, Pages } from '@/types/post';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  try {
    if (slug) {
      const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM pages WHERE slug = ?', [slug]);
      if (rows.length === 0) {
        return NextResponse.json({ error: 'Page not found' }, { status: 404 });
      }
      return NextResponse.json(rows[0] as Pages);
    } else {
      const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM pages ORDER BY created_at DESC');
      return NextResponse.json(rows as Pages[]);
    }
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function POST(request: NextRequest) {
   
    try {
      const data: PagesInput = await request.json();
     
  
      if (data.id) {
        return NextResponse.json({ error: 'ID should not be provided for new pages' }, { status: 400 });
      }
  
      const [result] = await pool.query<ResultSetHeader>('INSERT INTO pages SET ?', [data]);
      console.log('Insert result:', result);
      return NextResponse.json({ id: result.insertId, ...data }, { status: 201 });
    } catch (error) {
      console.error('Error creating page:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
  




  export async function PUT(request: NextRequest) {
    
    try {
      const data: PagesInput = await request.json();
    
  
      if (!data.id) {
        console.error('Error: ID is missing in the request data');
        return NextResponse.json({ error: 'ID is required for updates' }, { status: 400 });
      }
  
      const { id, ...updateData } = data;
      const [result] = await pool.query<ResultSetHeader>(
        'UPDATE pages SET ? WHERE id = ?',
        [updateData, id]
      );
      console.log('Update result:', result);
  
      if (result.affectedRows === 0) {
        return NextResponse.json({ error: 'Page not found' }, { status: 404 });
      }
  
      return NextResponse.json({ message: 'Page updated successfully', id });
    } catch (error) {
      console.error('Error updating page:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
  



  export async function DELETE(request: NextRequest) {
   
    try {
      const { searchParams } = new URL(request.url);
      const id = searchParams.get('id');
      if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
      }
      const [result] = await pool.query<ResultSetHeader>('DELETE FROM pages WHERE id = ?', [id]);
   
      if (result.affectedRows === 0) {
        return NextResponse.json({ error: 'Page not found' }, { status: 404 });
      }
      return NextResponse.json({ message: 'Page deleted successfully' });
    } catch (error) {
      console.error('Error deleting page:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
  

  export async function OPTIONS() {
    return new NextResponse(null, { 
      status: 200,
      headers: {
        'Allow': 'GET, POST, DELETE, OPTIONS'
      }
    });
  }
  
