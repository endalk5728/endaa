import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { RowDataPacket, ResultSetHeader } from 'mysql2'

interface Advertisement extends RowDataPacket {
  id: number;
  ad_name: string;
  ad_type: string;
  ad_code: string;
  placement: string;
  start_date: Date;
  end_date: Date;
  is_active: boolean;
}

export async function GET() {
  try {
    const [rows] = await pool.query<Advertisement[]>('SELECT * FROM advertisements')
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Failed to fetch advertisements:', error)
    return NextResponse.json({ error: 'Failed to fetch advertisements' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO advertisements (ad_name, ad_type, ad_code, placement, start_date, end_date, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [data.adName, data.adType, data.adCode, data.placement, data.startDate, data.endDate, data.isActive]
    )

    const [newAd] = await pool.query<Advertisement[]>('SELECT * FROM advertisements WHERE id = ?', [result.insertId])

    return NextResponse.json(newAd[0])
  } catch (error) {
    console.error('Failed to create advertisement:', error)
    return NextResponse.json({ error: 'Failed to create advertisement' }, { status: 500 })
  }
}
