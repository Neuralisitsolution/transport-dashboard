import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface ProcessedJobData {
  title: string;
  organization: string;
  department: string;
  category: string;
  subCategory: string;
  totalVacancies: number;
  eligibility: {
    age: { min: number; max: number };
    ageRelaxation: string;
    education: string;
    experience: string;
  };
  importantDates: {
    notificationDate: string;
    applicationStart: string;
    applicationEnd: string;
    examDate: string;
    admitCardDate: string;
    resultDate: string;
  };
  applicationFee: {
    general: number;
    obc: number;
    scSt: number;
    female: number;
    exServiceman: number;
  };
  salary: {
    payScale: string;
    minSalary: number;
    maxSalary: number;
    inHandEstimate: number;
  };
  location: string;
  applyOnlineLink: string;
  officialNotificationLink: string;
  officialWebsite: string;
  examPattern: string;
  selectionProcess: string;
  statesAccepted: string[];
}

export async function processJobWithAI(
  rawTitle: string,
  rawContent: string,
  sourceLink: string
): Promise<ProcessedJobData | null> {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('[AI] No GEMINI_API_KEY set, using basic extraction');
    return basicExtraction(rawTitle, sourceLink);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a government job data extractor for India. Extract structured information from this job posting.

IMPORTANT RULES:
- Use ONLY information present in the text. Do NOT make up data.
- For dates, use YYYY-MM-DD format. If year is not mentioned, assume 2025 or 2026.
- For unknown fields, use empty string "" for text and 0 for numbers.
- The source link is the REAL job page - use it as the applyOnlineLink if no better link found.
- Category MUST be exactly one of: "Central Govt", "Banking", "State Govt", "Defence", "Teaching"
- Return ONLY valid JSON, no markdown code blocks.

Job Title: ${rawTitle}
Source URL: ${sourceLink}
Content: ${rawContent.substring(0, 3000)}

Return this JSON structure:
{
  "title": "Clean job title with year (e.g. SSC CGL 2025)",
  "organization": "Hiring organization name",
  "department": "Government department",
  "category": "Central Govt|Banking|State Govt|Defence|Teaching",
  "subCategory": "e.g. SSC, UPSC, Railway, IBPS, SBI, TSPSC, etc.",
  "totalVacancies": 0,
  "eligibility": {
    "age": { "min": 18, "max": 65 },
    "ageRelaxation": "",
    "education": "",
    "experience": ""
  },
  "importantDates": {
    "notificationDate": "",
    "applicationStart": "",
    "applicationEnd": "",
    "examDate": "",
    "admitCardDate": "",
    "resultDate": ""
  },
  "applicationFee": { "general": 0, "obc": 0, "scSt": 0, "female": 0, "exServiceman": 0 },
  "salary": { "payScale": "", "minSalary": 0, "maxSalary": 0, "inHandEstimate": 0 },
  "location": "All India or state name",
  "applyOnlineLink": "real apply URL from text or source URL",
  "officialNotificationLink": "PDF or notification URL if found",
  "officialWebsite": "organization official website",
  "examPattern": "",
  "selectionProcess": "",
  "statesAccepted": ["All India"]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Extract JSON from response (handle markdown code blocks)
    let jsonStr = text;
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || text.match(/(\{[\s\S]*\})/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }

    const parsed = JSON.parse(jsonStr) as ProcessedJobData;

    // Ensure applyOnlineLink is set
    if (!parsed.applyOnlineLink) {
      parsed.applyOnlineLink = sourceLink;
    }
    if (!parsed.officialNotificationLink) {
      parsed.officialNotificationLink = sourceLink;
    }

    // Validate category
    const validCategories = ['Central Govt', 'Banking', 'State Govt', 'Defence', 'Teaching'];
    if (!validCategories.includes(parsed.category)) {
      parsed.category = guessCategory(parsed.title + ' ' + parsed.organization);
    }

    return parsed;
  } catch (error) {
    console.error('[AI] Processing failed:', (error as Error).message);
    return basicExtraction(rawTitle, sourceLink);
  }
}

/**
 * Basic extraction without AI - used as fallback
 */
function basicExtraction(title: string, link: string): ProcessedJobData {
  const category = guessCategory(title);
  const subCategory = guessSubCategory(title);
  const org = guessOrganization(title);

  return {
    title: cleanTitle(title),
    organization: org,
    department: '',
    category,
    subCategory,
    totalVacancies: extractNumber(title) || 0,
    eligibility: {
      age: { min: 18, max: 40 },
      ageRelaxation: 'OBC: 3 years, SC/ST: 5 years as per govt rules',
      education: title.toLowerCase().includes('10th') ? '10th Pass' :
                 title.toLowerCase().includes('12th') ? '12th Pass' : 'Graduate',
      experience: 'Check official notification',
    },
    importantDates: {
      notificationDate: new Date().toISOString().split('T')[0],
      applicationStart: '',
      applicationEnd: '',
      examDate: '',
      admitCardDate: '',
      resultDate: '',
    },
    applicationFee: { general: 0, obc: 0, scSt: 0, female: 0, exServiceman: 0 },
    salary: { payScale: 'As per government norms', minSalary: 0, maxSalary: 0, inHandEstimate: 0 },
    location: 'All India',
    applyOnlineLink: link,
    officialNotificationLink: link,
    officialWebsite: link,
    examPattern: 'Check official notification',
    selectionProcess: 'Check official notification',
    statesAccepted: ['All India'],
  };
}

function guessCategory(text: string): string {
  const t = text.toLowerCase();
  if (/bank|ibps|sbi|rbi|nabard|lic|gic|insurance|clerical/.test(t)) return 'Banking';
  if (/army|navy|air force|defence|military|nda|cds|coast guard|crpf|bsf|cisf|itbp|ssb|afcat|agniveer/.test(t)) return 'Defence';
  if (/teacher|teaching|kvs|nvs|ctet|tet|education|lecturer|professor|school/.test(t)) return 'Teaching';
  if (/tspsc|appsc|mpsc|kpsc|tnpsc|rpsc|uppsc|bpsc|gpsc|wbpsc|jpsc|hpsc|ppsc|dsssb|state/.test(t)) return 'State Govt';
  return 'Central Govt';
}

function guessSubCategory(text: string): string {
  const t = text.toLowerCase();
  if (/ssc/.test(t)) return 'SSC';
  if (/upsc/.test(t)) return 'UPSC';
  if (/railway|rrb/.test(t)) return 'Railway';
  if (/ibps/.test(t)) return 'IBPS';
  if (/sbi/.test(t)) return 'SBI';
  if (/rbi/.test(t)) return 'RBI';
  if (/army/.test(t)) return 'Indian Army';
  if (/navy/.test(t)) return 'Indian Navy';
  if (/air force|afcat/.test(t)) return 'Indian Air Force';
  if (/kvs/.test(t)) return 'KVS';
  if (/nvs/.test(t)) return 'NVS';
  if (/ctet/.test(t)) return 'CTET';
  if (/tspsc/.test(t)) return 'TSPSC';
  if (/appsc/.test(t)) return 'APPSC';
  if (/mpsc/.test(t)) return 'MPSC';
  return '';
}

function guessOrganization(title: string): string {
  const patterns: [RegExp, string][] = [
    [/ssc/i, 'Staff Selection Commission'],
    [/upsc/i, 'Union Public Service Commission'],
    [/rrb|railway/i, 'Railway Recruitment Board'],
    [/ibps/i, 'Institute of Banking Personnel Selection'],
    [/sbi/i, 'State Bank of India'],
    [/rbi/i, 'Reserve Bank of India'],
    [/lic/i, 'Life Insurance Corporation'],
    [/army|agniveer/i, 'Indian Army'],
    [/navy/i, 'Indian Navy'],
    [/air force|afcat/i, 'Indian Air Force'],
    [/kvs/i, 'Kendriya Vidyalaya Sangathan'],
    [/nvs/i, 'Navodaya Vidyalaya Samiti'],
    [/drdo/i, 'DRDO'],
    [/isro/i, 'ISRO'],
    [/india post/i, 'India Post'],
    [/fci/i, 'Food Corporation of India'],
    [/esic/i, 'ESIC'],
  ];
  for (const [pat, org] of patterns) {
    if (pat.test(title)) return org;
  }
  return 'Government of India';
}

function cleanTitle(title: string): string {
  return title.replace(/\s+/g, ' ').replace(/^[-–—•·]+\s*/, '').trim();
}

function extractNumber(text: string): number {
  const match = text.match(/(\d[\d,]+)\s*(?:vacanc|post|seat|opening)/i);
  if (match) return parseInt(match[1].replace(/,/g, ''));
  return 0;
}
