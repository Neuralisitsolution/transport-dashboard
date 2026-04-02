import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import EmailSubscriber from '@/models/EmailSubscriber';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { email, categories, states } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

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
  } catch (error) {
    console.error('POST /api/subscribe error:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
