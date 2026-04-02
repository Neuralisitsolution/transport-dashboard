import { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://naukrialert.ai';
const SITE_NAME = 'NaukriAlert AI';

export function generateJobMetadata(job: {
  title: string;
  organization: string;
  totalVacancies: number;
  applicationEnd: string;
  salary: string;
  slug: string;
}): Metadata {
  const title = `${job.title} - ${job.organization} Recruitment 2025`;
  const description = `Apply for ${job.title} at ${job.organization}. ${job.totalVacancies} vacancies. Last date: ${job.applicationEnd}. Salary: ${job.salary}. Apply online now.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/jobs/${job.slug}`,
      siteName: SITE_NAME,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export function generateJobPostingSchema(job: {
  title: string;
  organization: string;
  description: string;
  location: string;
  salary: { min: number; max: number };
  applicationEnd: string;
  applicationStart: string;
  slug: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    hiringOrganization: {
      '@type': 'Organization',
      name: job.organization,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'IN',
        addressRegion: job.location,
      },
    },
    baseSalary: {
      '@type': 'MonetaryAmount',
      currency: 'INR',
      value: {
        '@type': 'QuantitativeValue',
        minValue: job.salary.min,
        maxValue: job.salary.max,
        unitText: 'MONTH',
      },
    },
    datePosted: job.applicationStart,
    validThrough: job.applicationEnd,
    employmentType: 'FULL_TIME',
    url: `${SITE_URL}/jobs/${job.slug}`,
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generatePageMetadata(
  title: string,
  description: string,
  path: string = ''
): Metadata {
  const fullTitle = `${title} | ${SITE_NAME} - Government Job Alerts India`;
  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url: `${SITE_URL}${path}`,
      siteName: SITE_NAME,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
    },
  };
}
