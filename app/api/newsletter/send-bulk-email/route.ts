import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import nodemailer from 'nodemailer';
import { BulkEmailRequest, ApiResponse, ApiError } from '@/types/post';
import { RowDataPacket } from 'mysql2';

export async function POST(req: Request) {
  try {
    const { subject, content }: BulkEmailRequest = await req.json();

    // Fetch all subscriber emails
    const [rows] = await pool.query<RowDataPacket[]>('SELECT email FROM subscribers');
    const emails = rows.map((row: RowDataPacket) => row.email as string);

    // Configure nodemailer (replace with your email service details)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send emails
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      bcc: emails,
      subject: subject,
      text: content,
    });

    const response: ApiResponse = { message: 'Bulk email sent successfully' };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Bulk email error:', error);
    const errorResponse: ApiError = { error: 'Failed to send bulk email' };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
