import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'OWNER') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }

  try {
    const crushers = await prisma.crusher.findMany({
      orderBy: { name: 'asc' },
      include: {
        credits: {
          select: { totalAmount: true },
        },
        payments: {
          select: { amount: true },
        },
      },
    });

    const result = crushers.map((crusher) => {
      const totalCredit = crusher.credits.reduce((sum, c) => sum + c.totalAmount, 0);
      const totalPaid = crusher.payments.reduce((sum, p) => sum + p.amount, 0);
      return {
        id: crusher.id,
        name: crusher.name,
        contactName: crusher.contactName,
        phone: crusher.phone,
        address: crusher.address,
        notes: crusher.notes,
        createdAt: crusher.createdAt,
        totalCredit,
        totalPaid,
        balance: totalCredit - totalPaid,
      };
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching crushers:', error);
    return NextResponse.json({ error: 'Failed to fetch crushers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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

    const crusher = await prisma.crusher.create({
      data: {
        name: name.trim(),
        contactName: contactName?.trim() || null,
        phone: phone?.trim() || null,
        address: address?.trim() || null,
        notes: notes?.trim() || null,
      },
    });

    return NextResponse.json(crusher, { status: 201 });
  } catch (error: any) {
    console.error('Error creating crusher:', error);
    return NextResponse.json({ error: 'Failed to create crusher' }, { status: 500 });
  }
}
