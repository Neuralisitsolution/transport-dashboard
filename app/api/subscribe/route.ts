import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, categories, states } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    // Try MongoDB
    if (process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('YOUR_')) {
      try {
        const { connectDB } = await import('@/lib/mongodb');
        const EmailSubscriber = (await import('@/models/EmailSubscriber')).default;
        await connectDB();

        const existing = await EmailSubscriber.findOne({ email });
        if (existing) {
          await EmailSubscriber.updateOne(
            { email },
            { categories: categories || existing.categories, states: states || existing.states, isActive: true }
          );
          return NextResponse.json({ message: 'Subscription updated' });
        }

        await EmailSubscriber.create({
          email,
          categories: categories || [],
          states: states || [],
          isActive: true,
        });

        return NextResponse.json({ message: 'Subscribed successfully' }, { status: 201 });
      } catch (dbError) {
        console.warn('MongoDB unavailable:', dbError);
      }
    }

    // Demo mode - just acknowledge
    console.log(`[DEMO] Email subscription: ${email}`, { categories, states });
    return NextResponse.json({ message: 'Subscribed successfully (demo mode)' }, { status: 201 });
  } catch (error) {
    console.error('POST /api/subscribe error:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
