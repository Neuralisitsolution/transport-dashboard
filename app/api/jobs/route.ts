import { NextRequest, NextResponse } from 'next/server';
import { SAMPLE_JOBS } from '@/lib/sample-data';

function filterSampleJobs(params: {
  category: string;
  state: string;
  search: string;
  education: string;
  featured: string;
  vacancyMin: string;
  sortBy: string;
  page: number;
  limit: number;
}) {
  let filtered = [...SAMPLE_JOBS];

  if (params.category) filtered = filtered.filter((j) => j.category === params.category);
  if (params.state) filtered = filtered.filter((j) => j.statesAccepted.includes(params.state) || j.statesAccepted.includes('All India'));
  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.organization.toLowerCase().includes(q) ||
        j.subCategory.toLowerCase().includes(q) ||
        j.category.toLowerCase().includes(q)
    );
  }
  if (params.education) {
    const edu = params.education.toLowerCase();
    filtered = filtered.filter((j) => j.eligibility.education.toLowerCase().includes(edu));
  }
  if (params.featured === 'true') filtered = filtered.filter((j) => j.isFeatured);
  if (params.vacancyMin) filtered = filtered.filter((j) => j.totalVacancies >= parseInt(params.vacancyMin));

  if (params.sortBy === 'deadline') {
    filtered.sort((a, b) => a.importantDates.applicationEnd.localeCompare(b.importantDates.applicationEnd));
  } else if (params.sortBy === 'vacancies') {
    filtered.sort((a, b) => b.totalVacancies - a.totalVacancies);
  } else {
    filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  const total = filtered.length;
  const start = (params.page - 1) * params.limit;
  const jobs = filtered.slice(start, start + params.limit);

  return { jobs, total };
}

async function tryMongoDB(filter: Record<string, unknown>, sort: Record<string, 1 | -1>, skip: number, limit: number) {
  const { connectDB } = await import('@/lib/mongodb');
  const Job = (await import('@/models/Job')).default;
  await connectDB();
  const [jobs, total] = await Promise.all([
    Job.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Job.countDocuments(filter),
  ]);
  return { jobs, total, fromDB: true };
}

export async function GET(request: NextRequest) {
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

  let jobs: unknown[] = [];
  let total = 0;
  let source = 'sample';

  // Try MongoDB if configured
  const mongoUri = process.env.MONGODB_URI || '';
  if (mongoUri && mongoUri.startsWith('mongodb')) {
    try {
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
      const result = await tryMongoDB(filter, sort, skip, limit);

      // If DB returned jobs, use them; if DB is empty, fall through to sample
      if (result.total > 0) {
        jobs = result.jobs;
        total = result.total;
        source = 'mongodb';
      }
    } catch (err) {
      console.warn('MongoDB unavailable, using sample data. Error:', (err as Error).message);
    }
  }

  // Fall back to sample data if DB had nothing or failed
  if (jobs.length === 0) {
    const result = filterSampleJobs({ category, state, search, education, featured, vacancyMin, sortBy, page, limit });
    jobs = result.jobs;
    total = result.total;
    source = 'sample';
  }

  return NextResponse.json({
    jobs,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    source,
  });
}

export async function POST(request: NextRequest) {
  try {
    const mongoUri = process.env.MONGODB_URI || '';
    if (!mongoUri || !mongoUri.startsWith('mongodb')) {
      return NextResponse.json({ error: 'MongoDB not configured. Set MONGODB_URI in .env.local' }, { status: 503 });
    }

    const { connectDB } = await import('@/lib/mongodb');
    const Job = (await import('@/models/Job')).default;
    await connectDB();

    const body = await request.json();
    const job = await Job.create(body);
    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    console.error('POST /api/jobs error:', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}
