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
    const lorries = await prisma.lorry.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(lorries);
  } catch (error: any) {
    console.error('Fleet GET error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch lorries' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await authorizeOwner();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const { registrationNumber, driverName } = body;

    if (!registrationNumber?.trim() || !driverName?.trim()) {
      return NextResponse.json(
        { error: 'Registration number and driver name are required' },
        { status: 400 }
      );
    }

    const lorry = await prisma.lorry.create({
      data: {
        registrationNumber: registrationNumber.trim(),
        driverName: driverName.trim(),
      },
    });

    return NextResponse.json(lorry, { status: 201 });
  } catch (error: any) {
    console.error('Fleet POST error:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A lorry with this registration number already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to create lorry' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const auth = await authorizeOwner();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const { id, registrationNumber, driverName, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: 'Lorry ID is required' }, { status: 400 });
    }

    if (!registrationNumber?.trim() || !driverName?.trim()) {
      return NextResponse.json(
        { error: 'Registration number and driver name are required' },
        { status: 400 }
      );
    }

    const lorry = await prisma.lorry.update({
      where: { id },
      data: {
        registrationNumber: registrationNumber.trim(),
        driverName: driverName.trim(),
        isActive: typeof isActive === 'boolean' ? isActive : undefined,
      },
    });

    return NextResponse.json(lorry);
  } catch (error: any) {
    console.error('Fleet PUT error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Lorry not found' }, { status: 404 });
    }
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A lorry with this registration number already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to update lorry' },
      { status: 500 }
    );
  }
}
