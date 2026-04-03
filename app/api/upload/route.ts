import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadToGoogleDrive } from '@/lib/google-drive';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const subfolder = formData.get('subfolder') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!['CommercialSlips', 'PrivateSlips', 'PaymentScreenshots'].includes(subfolder)) {
      return NextResponse.json({ error: 'Invalid subfolder' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { fileId, viewUrl } = await uploadToGoogleDrive(
      buffer,
      file.name,
      file.type,
      subfolder as any
    );

    return NextResponse.json({ fileId, viewUrl });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
