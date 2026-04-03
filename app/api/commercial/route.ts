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

export async function GET() {
  const auth = await authorizeOwner();
  if (auth.error) return auth.error;

  try {
    const clients = await prisma.commercialClient.findMany({
      orderBy: { companyName: 'asc' },
      include: {
        trips: {
          select: { totalAmount: true },
        },
        payments: {
          select: { amount: true },
        },
      },
    });

    const result = clients.map((client) => {
      const totalBilled = client.trips.reduce((sum, t) => sum + t.totalAmount, 0);
      const totalPaid = client.payments.reduce((sum, p) => sum + p.amount, 0);
      const { trips, payments, ...rest } = client;
      return {
        ...rest,
        totalBilled,
        totalPaid,
      };
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Commercial GET error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await authorizeOwner();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const { companyName, contactName, phone, address, notes } = body;

    if (!companyName?.trim()) {
      return NextResponse.json(
        { error: 'Company name is required' },
        { status: 400 }
      );
    }

    const client = await prisma.commercialClient.create({
      data: {
        companyName: companyName.trim(),
        contactName: contactName?.trim() || null,
        phone: phone?.trim() || null,
        address: address?.trim() || null,
        notes: notes?.trim() || null,
      },
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error: any) {
    console.error('Commercial POST error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create client' },
      { status: 500 }
    );
  }
}
