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
  const { id } = params;

  if (role === 'PRIVATE_MEMBER') {
    const privateMemberId = (session.user as any).privateMemberId;
    if (privateMemberId !== id) {
      return NextResponse.json({ error: 'Not authorized to view this member' }, { status: 403 });
    }
  } else if (role !== 'OWNER') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }

  try {
    const member = await prisma.privateMember.findUnique({
      where: { id },
      include: {
        trips: {
          include: { lorry: true },
          orderBy: { date: 'desc' },
        },
        payments: {
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const thisMonthCredit = member.trips
      .filter((t) => t.date >= monthStart && t.date < monthEnd)
      .reduce((sum, t) => sum + t.totalAmount, 0);

    const thisMonthPayments = member.payments
      .filter((p) => p.date >= monthStart && p.date < monthEnd)
      .reduce((sum, p) => sum + p.amount, 0);

    const totalTrips = member.trips.reduce((sum, t) => sum + t.totalAmount, 0);
    const totalPayments = member.payments.reduce((sum, p) => sum + p.amount, 0);
    const totalOutstanding = totalTrips - totalPayments;

    return NextResponse.json({
      ...member,
      thisMonthCredit,
      thisMonthPayments,
      thisMonthBalance: thisMonthCredit - thisMonthPayments,
      totalOutstanding,
    });
  } catch (error: any) {
    console.error('Private [id] GET error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch member' },
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
    const { name, phone, address, notes, isActive } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const member = await prisma.privateMember.update({
      where: { id: params.id },
      data: {
        name: name.trim(),
        phone: phone?.trim() || null,
        address: address?.trim() || null,
        notes: notes?.trim() || null,
        isActive: typeof isActive === 'boolean' ? isActive : undefined,
      },
    });

    return NextResponse.json(member);
  } catch (error: any) {
    console.error('Private [id] PUT error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }
    return NextResponse.json(
      { error: error.message || 'Failed to update member' },
      { status: 500 }
    );
  }
}
