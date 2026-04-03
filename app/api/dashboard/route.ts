import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'OWNER') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const dateFrom = url.searchParams.get('dateFrom');
  const dateTo = url.searchParams.get('dateTo');

  const from = dateFrom ? new Date(dateFrom) : new Date(new Date().setHours(0, 0, 0, 0));
  const to = dateTo ? new Date(new Date(dateTo).setHours(23, 59, 59, 999)) : new Date(new Date().setHours(23, 59, 59, 999));

  try {
    // Today's stats
    const [
      commercialTripsToday,
      privateTripsToday,
      commercialPaymentsToday,
      privatePaymentsToday,
      crusherPaymentsToday,
    ] = await Promise.all([
      prisma.commercialTrip.aggregate({
        where: { date: { gte: from, lte: to } },
        _sum: { totalAmount: true },
        _count: true,
      }),
      prisma.privateTrip.aggregate({
        where: { date: { gte: from, lte: to } },
        _sum: { totalAmount: true },
        _count: true,
      }),
      prisma.commercialPayment.aggregate({
        where: { date: { gte: from, lte: to } },
        _sum: { amount: true },
      }),
      prisma.privatePayment.aggregate({
        where: { date: { gte: from, lte: to } },
        _sum: { amount: true },
      }),
      prisma.crusherPayment.aggregate({
        where: { date: { gte: from, lte: to } },
        _sum: { amount: true },
      }),
    ]);

    // All-time balances
    const [
      totalCrusherCredit,
      totalCrusherPaid,
      totalCommercialBilled,
      totalCommercialPaid,
      totalPrivateBilled,
      totalPrivatePaid,
    ] = await Promise.all([
      prisma.crusherCreditEntry.aggregate({ _sum: { totalAmount: true } }),
      prisma.crusherPayment.aggregate({ _sum: { amount: true } }),
      prisma.commercialTrip.aggregate({ _sum: { totalAmount: true } }),
      prisma.commercialPayment.aggregate({ _sum: { amount: true } }),
      prisma.privateTrip.aggregate({ _sum: { totalAmount: true } }),
      prisma.privatePayment.aggregate({ _sum: { amount: true } }),
    ]);

    // Monthly data for charts (last 6 months)
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);

      const [commBilled, commPaid, privBilled, privPaid, crushCredit, crushPaid] = await Promise.all([
        prisma.commercialTrip.aggregate({ where: { date: { gte: monthStart, lte: monthEnd } }, _sum: { totalAmount: true } }),
        prisma.commercialPayment.aggregate({ where: { date: { gte: monthStart, lte: monthEnd } }, _sum: { amount: true } }),
        prisma.privateTrip.aggregate({ where: { date: { gte: monthStart, lte: monthEnd } }, _sum: { totalAmount: true } }),
        prisma.privatePayment.aggregate({ where: { date: { gte: monthStart, lte: monthEnd } }, _sum: { amount: true } }),
        prisma.crusherCreditEntry.aggregate({ where: { date: { gte: monthStart, lte: monthEnd } }, _sum: { totalAmount: true } }),
        prisma.crusherPayment.aggregate({ where: { date: { gte: monthStart, lte: monthEnd } }, _sum: { amount: true } }),
      ]);

      monthlyData.push({
        month: monthStart.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
        billed: (commBilled._sum.totalAmount || 0) + (privBilled._sum.totalAmount || 0),
        received: (commPaid._sum.amount || 0) + (privPaid._sum.amount || 0),
        crusherCredit: crushCredit._sum.totalAmount || 0,
        crusherPaid: crushPaid._sum.amount || 0,
      });
    }

    // Top 5 commercial clients by outstanding
    const commercialClients = await prisma.commercialClient.findMany({
      where: { isActive: true },
      include: {
        trips: { select: { totalAmount: true } },
        payments: { select: { amount: true } },
      },
    });
    const topCommercial = commercialClients
      .map((c) => ({
        name: c.companyName,
        billed: c.trips.reduce((s, t) => s + t.totalAmount, 0),
        paid: c.payments.reduce((s, p) => s + p.amount, 0),
        outstanding: c.trips.reduce((s, t) => s + t.totalAmount, 0) - c.payments.reduce((s, p) => s + p.amount, 0),
      }))
      .filter((c) => c.outstanding > 0)
      .sort((a, b) => b.outstanding - a.outstanding)
      .slice(0, 5);

    // Top 5 private members by outstanding
    const privateMembers = await prisma.privateMember.findMany({
      where: { isActive: true },
      include: {
        trips: { select: { totalAmount: true } },
        payments: { select: { amount: true } },
      },
    });
    const topPrivate = privateMembers
      .map((m) => ({
        name: m.name,
        billed: m.trips.reduce((s, t) => s + t.totalAmount, 0),
        paid: m.payments.reduce((s, p) => s + p.amount, 0),
        outstanding: m.trips.reduce((s, t) => s + t.totalAmount, 0) - m.payments.reduce((s, p) => s + p.amount, 0),
      }))
      .filter((m) => m.outstanding > 0)
      .sort((a, b) => b.outstanding - a.outstanding)
      .slice(0, 5);

    // Daily report - trips and payments for selected date range
    const [dailyCommTrips, dailyPrivTrips, dailyCommPayments, dailyPrivPayments, dailyCrusherPayments] =
      await Promise.all([
        prisma.commercialTrip.findMany({
          where: { date: { gte: from, lte: to } },
          include: { lorry: true, client: true },
          orderBy: { date: 'desc' },
        }),
        prisma.privateTrip.findMany({
          where: { date: { gte: from, lte: to } },
          include: { lorry: true, member: true },
          orderBy: { date: 'desc' },
        }),
        prisma.commercialPayment.findMany({
          where: { date: { gte: from, lte: to } },
          include: { client: true },
          orderBy: { date: 'desc' },
        }),
        prisma.privatePayment.findMany({
          where: { date: { gte: from, lte: to } },
          include: { member: true },
          orderBy: { date: 'desc' },
        }),
        prisma.crusherPayment.findMany({
          where: { date: { gte: from, lte: to } },
          include: { crusher: true },
          orderBy: { date: 'desc' },
        }),
      ]);

    // Monthly report for selected range
    const selectedMonthStart = new Date(from.getFullYear(), from.getMonth(), 1);
    const selectedMonthEnd = new Date(from.getFullYear(), from.getMonth() + 1, 0, 23, 59, 59, 999);

    const [monthlyMaterialTrips] = await Promise.all([
      prisma.commercialTrip.groupBy({
        by: ['material'],
        where: { date: { gte: selectedMonthStart, lte: selectedMonthEnd } },
        _sum: { quantity: true, totalAmount: true },
      }),
    ]);

    const [monthlyPrivMaterialTrips] = await Promise.all([
      prisma.privateTrip.groupBy({
        by: ['material'],
        where: { date: { gte: selectedMonthStart, lte: selectedMonthEnd } },
        _sum: { quantity: true, totalAmount: true },
      }),
    ]);

    const totalTripsCount = (commercialTripsToday._count || 0) + (privateTripsToday._count || 0);
    const totalBilledToday = (commercialTripsToday._sum.totalAmount || 0) + (privateTripsToday._sum.totalAmount || 0);
    const totalReceivedToday = (commercialPaymentsToday._sum.amount || 0) + (privatePaymentsToday._sum.amount || 0);
    const totalCrusherOwed = (totalCrusherCredit._sum.totalAmount || 0) - (totalCrusherPaid._sum.amount || 0);
    const totalCommReceivable = (totalCommercialBilled._sum.totalAmount || 0) - (totalCommercialPaid._sum.amount || 0);
    const totalPrivReceivable = (totalPrivateBilled._sum.totalAmount || 0) - (totalPrivatePaid._sum.amount || 0);

    return NextResponse.json({
      summary: {
        totalTrips: totalTripsCount,
        totalBilled: totalBilledToday,
        totalReceived: totalReceivedToday,
        crusherOwed: totalCrusherOwed,
        commercialReceivable: totalCommReceivable,
        privateReceivable: totalPrivReceivable,
        crusherPaidToday: crusherPaymentsToday._sum.amount || 0,
      },
      monthlyData,
      topCommercial,
      topPrivate,
      dailyReport: {
        trips: [
          ...dailyCommTrips.map((t) => ({
            type: 'Commercial',
            client: (t as any).client.companyName,
            lorry: t.lorry.registrationNumber,
            material: t.material,
            quantity: t.quantity,
            unit: t.unit,
            amount: t.totalAmount,
            date: t.date,
          })),
          ...dailyPrivTrips.map((t) => ({
            type: 'Private',
            client: (t as any).member.name,
            lorry: t.lorry.registrationNumber,
            material: t.material,
            quantity: t.quantity,
            unit: t.unit,
            amount: t.totalAmount,
            date: t.date,
          })),
        ],
        paymentsReceived: [
          ...dailyCommPayments.map((p) => ({
            type: 'Commercial',
            from: (p as any).client.companyName,
            amount: p.amount,
            mode: p.paymentMode,
            date: p.date,
          })),
          ...dailyPrivPayments.map((p) => ({
            type: 'Private',
            from: (p as any).member.name,
            amount: p.amount,
            mode: p.paymentMode,
            date: p.date,
          })),
        ],
        crusherPayments: dailyCrusherPayments.map((p) => ({
          crusher: (p as any).crusher.name,
          amount: p.amount,
          mode: p.paymentMode,
          date: p.date,
        })),
        netCashFlow: totalReceivedToday - (crusherPaymentsToday._sum.amount || 0),
      },
      monthlyReport: {
        materialBreakdown: [
          ...monthlyMaterialTrips.map((m) => ({
            material: m.material,
            quantity: m._sum.quantity || 0,
            amount: m._sum.totalAmount || 0,
            source: 'Commercial',
          })),
          ...monthlyPrivMaterialTrips.map((m) => ({
            material: m.material,
            quantity: m._sum.quantity || 0,
            amount: m._sum.totalAmount || 0,
            source: 'Private',
          })),
        ],
      },
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ error: 'Failed to load dashboard' }, { status: 500 });
  }
}
