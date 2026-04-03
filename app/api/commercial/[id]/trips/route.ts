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
    const {
      lorryId,
      date,
      material,
      quantity,
      unit,
      ratePerUnit,
      totalAmount,
      slipNumber,
      slipImageUrl,
      slipImageDriveId,
      notes,
    } = body;

    // Validate required fields
    if (!lorryId || !date || !material || !unit) {
      return NextResponse.json(
        { error: 'Lorry, date, material, and unit are required' },
        { status: 400 }
      );
    }

    // Validate date not in future
    const tripDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (tripDate > today) {
      return NextResponse.json(
        { error: 'Trip date cannot be in the future' },
        { status: 400 }
      );
    }

    // Validate quantity and rate
    if (!quantity || quantity <= 0) {
      return NextResponse.json(
        { error: 'Quantity must be greater than 0' },
        { status: 400 }
      );
    }

    if (!ratePerUnit || ratePerUnit <= 0) {
      return NextResponse.json(
        { error: 'Rate per unit must be greater than 0' },
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

    const trip = await prisma.commercialTrip.create({
      data: {
        clientId,
        lorryId,
        date: new Date(date),
        material,
        quantity: parseFloat(quantity),
        unit,
        ratePerUnit: parseFloat(ratePerUnit),
        totalAmount: parseFloat(totalAmount) || parseFloat(quantity) * parseFloat(ratePerUnit),
        slipNumber: slipNumber?.trim() || null,
        slipImageUrl: slipImageUrl || null,
        slipImageDriveId: slipImageDriveId || null,
        notes: notes?.trim() || null,
      },
      include: { lorry: true },
    });

    return NextResponse.json(trip, { status: 201 });
  } catch (error: any) {
    console.error('Commercial trips POST error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add trip' },
      { status: 500 }
    );
  }
}
