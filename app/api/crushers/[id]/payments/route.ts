import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'OWNER') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { date, amount, paymentMode, referenceNumber, notes } = body;

    // Validations
    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    const paymentDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (paymentDate > today) {
      return NextResponse.json({ error: 'Date cannot be in the future' }, { status: 400 });
    }

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Amount must be greater than 0' }, { status: 400 });
    }

    if (!paymentMode || !paymentMode.trim()) {
      return NextResponse.json({ error: 'Payment mode is required' }, { status: 400 });
    }

    // Verify crusher exists
    const crusher = await prisma.crusher.findUnique({
      where: { id: params.id },
    });

    if (!crusher) {
      return NextResponse.json({ error: 'Crusher not found' }, { status: 404 });
    }

    const payment = await prisma.crusherPayment.create({
      data: {
        crusherId: params.id,
        date: paymentDate,
        amount: parseFloat(amount),
        paymentMode: paymentMode.trim(),
        referenceNumber: referenceNumber?.trim() || null,
        notes: notes?.trim() || null,
      },
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error: any) {
    console.error('Error creating payment:', error);
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
  }
}
