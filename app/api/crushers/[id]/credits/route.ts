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
    const { date, material, quantity, unit, ratePerUnit, totalAmount, notes } = body;

    // Validations
    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    const entryDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (entryDate > today) {
      return NextResponse.json({ error: 'Date cannot be in the future' }, { status: 400 });
    }

    if (!material || !material.trim()) {
      return NextResponse.json({ error: 'Material is required' }, { status: 400 });
    }

    if (!quantity || quantity <= 0) {
      return NextResponse.json({ error: 'Quantity must be greater than 0' }, { status: 400 });
    }

    if (!unit || !unit.trim()) {
      return NextResponse.json({ error: 'Unit is required' }, { status: 400 });
    }

    if (!ratePerUnit || ratePerUnit <= 0) {
      return NextResponse.json({ error: 'Rate per unit must be greater than 0' }, { status: 400 });
    }

    // Verify crusher exists
    const crusher = await prisma.crusher.findUnique({
      where: { id: params.id },
    });

    if (!crusher) {
      return NextResponse.json({ error: 'Crusher not found' }, { status: 404 });
    }

    const credit = await prisma.crusherCreditEntry.create({
      data: {
        crusherId: params.id,
        date: entryDate,
        material: material.trim(),
        quantity: parseFloat(quantity),
        unit: unit.trim(),
        ratePerUnit: parseFloat(ratePerUnit),
        totalAmount: totalAmount ? parseFloat(totalAmount) : parseFloat(quantity) * parseFloat(ratePerUnit),
        notes: notes?.trim() || null,
      },
    });

    return NextResponse.json(credit, { status: 201 });
  } catch (error: any) {
    console.error('Error creating credit entry:', error);
    return NextResponse.json({ error: 'Failed to create credit entry' }, { status: 500 });
  }
}
