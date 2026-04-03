import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function authorizeOwner() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: NextResponse.json({ error: 'Not authenticated' }, { status: 401 }) };
  }
  if ((session.user as any).role !== 'OWNER') {
    return { error: NextResponse.json({ error: 'Not authorized' }, { status: 403 }) };
  }
  return { session };
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await authorizeOwner();
  if (auth.error) return auth.error;

  try {
    const { id: clientId } = params;
    const body = await request.json();
    const { date, amount, paymentMode, referenceNumber, notes } = body;

    // Validate required fields
    if (!date || !paymentMode) {
      return NextResponse.json(
        { error: 'Date and payment mode are required' },
        { status: 400 }
      );
    }

    // Validate date not in future
    const paymentDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (paymentDate > today) {
      return NextResponse.json(
        { error: 'Payment date cannot be in the future' },
        { status: 400 }
      );
    }

    // Validate amount
    if (!amount || parseFloat(amount) <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Verify client exists
    const client = await prisma.commercialClient.findUnique({
      where: { id: clientId },
    });
    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const payment = await prisma.commercialPayment.create({
      data: {
        clientId,
        date: new Date(date),
        amount: parseFloat(amount),
        paymentMode,
        referenceNumber: referenceNumber?.trim() || null,
        notes: notes?.trim() || null,
      },
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error: any) {
    console.error('Commercial payments POST error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add payment' },
      { status: 500 }
    );
  }
}
