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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await authorizeOwner();
  if (auth.error) return auth.error;

  try {
    const { id } = params;

    const client = await prisma.commercialClient.findUnique({
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

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const totalTrips = client.trips.length;
    const totalBilled = client.trips.reduce((sum, t) => sum + t.totalAmount, 0);
    const totalPaid = client.payments.reduce((sum, p) => sum + p.amount, 0);

    return NextResponse.json({
      ...client,
      totalTrips,
      totalBilled,
      totalPaid,
    });
  } catch (error: any) {
    console.error('Commercial [id] GET error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch client' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await authorizeOwner();
  if (auth.error) return auth.error;

  try {
    const { id } = params;
    const body = await request.json();
    const { companyName, contactName, phone, address, notes, isActive } = body;

    if (companyName !== undefined && !companyName?.trim()) {
      return NextResponse.json(
        { error: 'Company name cannot be empty' },
        { status: 400 }
      );
    }

    const client = await prisma.commercialClient.update({
      where: { id },
      data: {
        ...(companyName !== undefined && { companyName: companyName.trim() }),
        ...(contactName !== undefined && { contactName: contactName?.trim() || null }),
        ...(phone !== undefined && { phone: phone?.trim() || null }),
        ...(address !== undefined && { address: address?.trim() || null }),
        ...(notes !== undefined && { notes: notes?.trim() || null }),
        ...(typeof isActive === 'boolean' && { isActive }),
      },
    });

    return NextResponse.json(client);
  } catch (error: any) {
    console.error('Commercial [id] PUT error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }
    return NextResponse.json(
      { error: error.message || 'Failed to update client' },
      { status: 500 }
    );
  }
}
