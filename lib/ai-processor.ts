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
  link: string
): Promise<ProcessedJobData | null> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Extract structured job information from this government job posting. Return ONLY valid JSON, no markdown.

Title: ${rawTitle}
Content: ${rawContent}
Link: ${link}

Return JSON with this exact structure:
{
  "title": "string - clean job title",
  "organization": "string - hiring organization",
  "department": "string - government department",
  "category": "one of: Central Govt, Banking, State Govt, Defence, Teaching",
  "subCategory": "string - e.g. SSC, UPSC, Railway, IBPS, SBI, etc.",
  "totalVacancies": number,
  "eligibility": {
    "age": { "min": number, "max": number },
    "ageRelaxation": "string",
    "education": "string",
    "experience": "string"
  },
  "importantDates": {
    "notificationDate": "YYYY-MM-DD or empty",
    "applicationStart": "YYYY-MM-DD or empty",
    "applicationEnd": "YYYY-MM-DD or empty",
    "examDate": "YYYY-MM-DD or empty",
    "admitCardDate": "YYYY-MM-DD or empty",
    "resultDate": "YYYY-MM-DD or empty"
  },
  "applicationFee": {
    "general": number, "obc": number, "scSt": number, "female": number, "exServiceman": number
  },
  "salary": {
    "payScale": "string", "minSalary": number, "maxSalary": number, "inHandEstimate": number
  },
  "location": "string",
  "applyOnlineLink": "string",
  "officialNotificationLink": "string",
  "officialWebsite": "string",
  "examPattern": "string",
  "selectionProcess": "string",
  "statesAccepted": ["string array"]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]) as ProcessedJobData;
    return parsed;
  } catch (error) {
    console.error('AI processing failed:', error);
    return null;
  }
}
