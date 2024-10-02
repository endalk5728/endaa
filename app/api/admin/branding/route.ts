import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Branding, BrandingFormData } from '@/types/post';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const result = await query<BrandingFormData[]>('SELECT * FROM branding ORDER BY id DESC LIMIT 1');
    const branding = result[0] as Branding | undefined;
    return NextResponse.json(branding || {});
  } catch (error) {
    console.error('Failed to fetch branding:', error);
    return NextResponse.json({ error: 'Failed to fetch branding' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const logo_type = formData.get('logo_type') as string;
    const logo_text = formData.get('logo_text') as string;
    let logo_image = formData.get('logo_image') as string;
    let favicon = formData.get('favicon') as string;

    // Fetch current branding
    const currentBranding = await query<BrandingFormData[]>('SELECT * FROM branding ORDER BY id DESC LIMIT 1');
    const current = currentBranding[0] as Branding | undefined;

    // Handle logo image upload
    const logoFile = formData.get('logo_image') as File | null;
    if (logoFile && logoFile instanceof File) {
      // Delete previous logo if exists
      if (current?.logo_image) {
        const previousLogoPath = path.join(process.cwd(), 'public', current.logo_image);
        await unlink(previousLogoPath).catch(() => {});
      }

      const logoFileName = `logo_${Date.now()}${path.extname(logoFile.name)}`;
      const logoPath = path.join(process.cwd(), 'public', 'logo', logoFileName);
      await writeFile(logoPath, Buffer.from(await logoFile.arrayBuffer()));
      logo_image = `/logo/${logoFileName}`;
    }

    // Handle favicon upload
    const faviconFile = formData.get('favicon') as File | null;
    if (faviconFile && faviconFile instanceof File) {
      // Delete previous favicon if exists
      if (current?.favicon) {
        const previousFaviconPath = path.join(process.cwd(), 'public', current.favicon);
        await unlink(previousFaviconPath).catch(() => {});
      }

      const faviconFileName = `favicon_${Date.now()}${path.extname(faviconFile.name)}`;
      const faviconPath = path.join(process.cwd(), 'public', 'logo', faviconFileName);
      await writeFile(faviconPath, Buffer.from(await faviconFile.arrayBuffer()));
      favicon = `/logo/${faviconFileName}`;
    }

    // Update or insert new branding
    if (current) {
      await query<BrandingFormData[]>(
        'UPDATE branding SET logo_type = ?, logo_image = ?, logo_text = ?, favicon = ? WHERE id = ?',
        [logo_type, logo_image, logo_text, favicon, current.id]
      );
    } else {
      await query<BrandingFormData[]>(
        'INSERT INTO branding (logo_type, logo_image, logo_text, favicon) VALUES (?, ?, ?, ?)',
        [logo_type, logo_image, logo_text, favicon]
      );
    }

    // Fetch updated branding
    const updatedBranding = await query<BrandingFormData[]>('SELECT * FROM branding ORDER BY id DESC LIMIT 1');
    const updated = updatedBranding[0] as Branding;

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating branding:', error);
    return NextResponse.json({ error: 'Failed to update branding' }, { status: 500 });
  }
}
