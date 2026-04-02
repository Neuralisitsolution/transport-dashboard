import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Job from '@/models/Job';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category') || '';
    const state = searchParams.get('state') || '';
    const search = searchParams.get('search') || '';
    const education = searchParams.get('education') || '';
    const sortBy = searchParams.get('sortBy') || 'latest';
    const featured = searchParams.get('featured') || '';
    const vacancyMin = searchParams.get('vacancyMin') || '';

    const filter: Record<string, unknown> = { isActive: true };

    if (category) filter.category = category;
    if (state) filter.statesAccepted = { $in: [state, 'All India'] };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { organization: { $regex: search, $options: 'i' } },
        { subCategory: { $regex: search, $options: 'i' } },
      ];
    }
    if (education) filter['eligibility.education'] = { $regex: education, $options: 'i' };
    if (featured === 'true') filter.isFeatured = true;
    if (vacancyMin) filter.totalVacancies = { $gte: parseInt(vacancyMin) };

    let sort: Record<string, 1 | -1> = { createdAt: -1 };
    if (sortBy === 'deadline') sort = { 'importantDates.applicationEnd': 1 };
    else if (sortBy === 'vacancies') sort = { totalVacancies: -1 };

    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      Job.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Job.countDocuments(filter),
    ]);

    return NextResponse.json({
      jobs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('GET /api/jobs error:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const job = await Job.create(body);

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    console.error('POST /api/jobs error:', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}
