import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { SubscriptionRequest, ApiResponse, ApiError, Subscriber } from '@/types/post';
import { RowDataPacket } from 'mysql2';

export async function POST(req: NextRequest) {
  try {
    const { email }: SubscriptionRequest = await req.json();
    
    await pool.query(
      'INSERT INTO subscribers (email) VALUES (?)',
      [email]
    );

    const response: ApiResponse = { message: 'Subscribed successfully' };
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Subscription error:', error);
    const errorResponse: ApiError = { error: 'Failed to subscribe' };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}


export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 10;
    const offset = (page - 1) * pageSize;

    const [subscribersResult] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM subscribers ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [pageSize, offset]
    );

    const [totalCountResult] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM subscribers'
    );

    const subscribers = subscribersResult as Subscriber[];
    const total = (totalCountResult[0] as { count: number }).count;

    return NextResponse.json({ subscribers, total }, { status: 200 });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    const errorResponse: ApiError = { error: 'Failed to fetch subscribers' };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
