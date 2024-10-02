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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    await pool.query<ResultSetHeader>(
      'UPDATE advertisements SET ad_name = ?, ad_type = ?, ad_code = ?, placement = ?, start_date = ?, end_date = ?, is_active = ? WHERE id = ?',
      [data.adName, data.adType, data.adCode, data.placement, data.startDate, data.endDate, data.isActive, params.id]
    )

    const [updatedAd] = await pool.query<Advertisement[]>('SELECT * FROM advertisements WHERE id = ?', [params.id])

    return NextResponse.json(updatedAd[0])
  } catch (error) {
    console.error('Failed to update advertisement:', error)
    return NextResponse.json({ error: 'Failed to update advertisement' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await pool.query<ResultSetHeader>('DELETE FROM advertisements WHERE id = ?', [params.id])
    return NextResponse.json({ message: 'Advertisement deleted successfully' })
  } catch (error) {
    console.error('Failed to delete advertisement:', error)
    return NextResponse.json({ error: 'Failed to delete advertisement' }, { status: 500 })
  }
}
