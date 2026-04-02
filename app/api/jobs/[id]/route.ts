import { NextRequest, NextResponse } from 'next/server';
import { SAMPLE_JOBS } from '@/lib/sample-data';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Try MongoDB first
    const mongoUri = process.env.MONGODB_URI || '';
    if (mongoUri && mongoUri.startsWith('mongodb')) {
      try {
        const { connectDB } = await import('@/lib/mongodb');
        const Job = (await import('@/models/Job')).default;
        await connectDB();

        const job = await Job.findOne({
          $or: [
            { slug: id },
            ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : []),
          ],
        }).lean();

        if (job) {
          await Job.updateOne({ _id: job._id }, { $inc: { views: 1 } });
          return NextResponse.json({ job });
        }
      } catch (err) {
        console.warn('MongoDB unavailable:', (err as Error).message);
      }
    }

    // Fallback to sample data
    const job = SAMPLE_JOBS.find((j) => j.slug === id || j._id === id);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    return NextResponse.json({ job });
  } catch (error) {
    console.error('GET /api/jobs/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const mongoUri = process.env.MONGODB_URI || '';
    if (!mongoUri || !mongoUri.startsWith('mongodb')) {
      return NextResponse.json({ error: 'MongoDB not configured' }, { status: 503 });
    }
    const { connectDB } = await import('@/lib/mongodb');
    const Job = (await import('@/models/Job')).default;
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const job = await Job.findByIdAndUpdate(id, body, { new: true }).lean();
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    return NextResponse.json({ job });
  } catch (error) {
    console.error('PUT /api/jobs/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const mongoUri = process.env.MONGODB_URI || '';
    if (!mongoUri || !mongoUri.startsWith('mongodb')) {
      return NextResponse.json({ error: 'MongoDB not configured' }, { status: 503 });
    }
    const { connectDB } = await import('@/lib/mongodb');
    const Job = (await import('@/models/Job')).default;
    await connectDB();
    const { id } = await params;

    await Job.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Job deleted' });
  } catch (error) {
    console.error('DELETE /api/jobs/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
  }
}
