import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    if (process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('YOUR_')) {
      try {
        const { connectDB } = await import('@/lib/mongodb');
        const User = (await import('@/models/User')).default;
        await connectDB();

        const existing = await User.findOne({ email: body.email });
        if (existing) {
          const updated = await User.findOneAndUpdate({ email: body.email }, body, { new: true }).lean();
          return NextResponse.json({ user: updated });
        }

        const user = await User.create(body);
        return NextResponse.json({ user }, { status: 201 });
      } catch (dbError) {
        console.warn('MongoDB unavailable:', dbError);
      }
    }

    // Demo mode
    console.log(`[DEMO] Profile saved:`, body.email);
    return NextResponse.json({ user: { ...body, _id: 'demo-user' } }, { status: 201 });
  } catch (error) {
    console.error('POST /api/profile error:', error);
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    if (process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('YOUR_')) {
      try {
        const { connectDB } = await import('@/lib/mongodb');
        const User = (await import('@/models/User')).default;
        await connectDB();

        const user = await User.findOne({ email }).lean();
        if (user) return NextResponse.json({ user });
      } catch (dbError) {
        console.warn('MongoDB unavailable:', dbError);
      }
    }

    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  } catch (error) {
    console.error('GET /api/profile error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}
