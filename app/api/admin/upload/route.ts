import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get('image') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // With the file data in the buffer, you can do whatever you want with it.
  // For this example, we'll just write it to the filesystem in a new location
  const path = join(process.cwd(), 'public/images', file.name);
  await writeFile(path, buffer);

  const filePath = `/images/${file.name}`;

  return NextResponse.json({ success: true, filePath });
}
