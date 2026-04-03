import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const role = (session.user as any).role;

  if (role === 'PRIVATE_MEMBER') {
    const privateMemberId = (session.user as any).privateMemberId;
    if (privateMemberId !== params.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }
  } else if (role !== 'OWNER') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }

  try {
    const payments = await prisma.privatePayment.findMany({
      where: { memberId: params.id },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(payments);
  } catch (error: any) {
    console.error('Private payments GET error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const role = (session.user as any).role;

  // Both OWNER and PRIVATE_MEMBER can add payments
  if (role === 'PRIVATE_MEMBER') {
    const privateMemberId = (session.user as any).privateMemberId;
    if (privateMemberId !== params.id) {
      return NextResponse.json(
        { error: 'You can only add payments for your own account' },
        { status: 403 }
      );
    }
  } else if (role !== 'OWNER') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const {
      date,
      amount,
      paymentMode,
      referenceNumber,
      screenshotUrl,
      screenshotDriveId,
      notes,
    } = body;

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

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Verify member exists
    const member = await prisma.privateMember.findUnique({
      where: { id: params.id },
    });

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    const payment = await prisma.privatePayment.create({
      data: {
        memberId: params.id,
        date: new Date(date),
        amount: parseFloat(amount),
        paymentMode,
        referenceNumber: referenceNumber?.trim() || null,
        screenshotUrl: screenshotUrl || null,
        screenshotDriveId: screenshotDriveId || null,
        submittedByMember: role === 'PRIVATE_MEMBER',
        notes: notes?.trim() || null,
      },
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error: any) {
    console.error('Private payments POST error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add payment' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  if ((session.user as any).role !== 'OWNER') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { paymentId } = body;

    if (!paymentId) {
      return NextResponse.json({ error: 'Payment ID is required' }, { status: 400 });
    }

    // Verify payment belongs to this member
    const existing = await prisma.privatePayment.findFirst({
      where: { id: paymentId, memberId: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    const payment = await prisma.privatePayment.update({
      where: { id: paymentId },
      data: { verifiedByOwner: true },
    });

    return NextResponse.json(payment);
  } catch (error: any) {
    console.error('Private payments PUT error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
