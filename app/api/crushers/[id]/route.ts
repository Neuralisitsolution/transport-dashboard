import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'OWNER') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }

  try {
    const crusher = await prisma.crusher.findUnique({
      where: { id: params.id },
      include: {
        credits: {
          orderBy: { date: 'desc' },
        },
        payments: {
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!crusher) {
      return NextResponse.json({ error: 'Crusher not found' }, { status: 404 });
    }

    const totalCredit = crusher.credits.reduce((sum, c) => sum + c.totalAmount, 0);
    const totalPaid = crusher.payments.reduce((sum, p) => sum + p.amount, 0);

    return NextResponse.json({
      ...crusher,
      totalCredit,
      totalPaid,
      balance: totalCredit - totalPaid,
    });
  } catch (error: any) {
    console.error('Error fetching crusher:', error);
    return NextResponse.json({ error: 'Failed to fetch crusher' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'OWNER') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, contactName, phone, address, notes } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Crusher name is required' }, { status: 400 });
    }

    const crusher = await prisma.crusher.update({
      where: { id: params.id },
      data: {
        name: name.trim(),
        contactName: contactName?.trim() || null,
        phone: phone?.trim() || null,
        address: address?.trim() || null,
        notes: notes?.trim() || null,
      },
    });

    return NextResponse.json(crusher);
  } catch (error: any) {
    console.error('Error updating crusher:', error);
    return NextResponse.json({ error: 'Failed to update crusher' }, { status: 500 });
  }
}
