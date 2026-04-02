export const JOB_CATEGORIES = [
  'Central Govt',
  'Banking',
  'State Govt',
  'Defence',
  'Teaching',
] as const;

export type JobCategory = (typeof JOB_CATEGORIES)[number];

export const EDUCATION_LEVELS = [
  '10th Pass',
  '12th Pass',
  'ITI',
  'Diploma',
  'Graduate',
  'Post Graduate',
  'PhD',
] as const;

export const RESERVATION_CATEGORIES = [
  'General',
  'OBC',
  'SC',
  'ST',
  'EWS',
  'PwD',
] as const;

export const INDIAN_STATES = [
  'All India',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Jammu & Kashmir',
  'Ladakh',
  'Chandigarh',
  'Puducherry',
] as const;

export const STATE_COMMISSIONS: Record<string, string[]> = {
  'Telangana': ['TSPSC', 'TSGENCO', 'TSRTC', 'TSSPDCL'],
  'Andhra Pradesh': ['APPSC', 'APGENCO', 'APSRTC'],
  'Maharashtra': ['MPSC', 'Mahavitaran', 'MSRTC'],
  'Karnataka': ['KPSC', 'KPTCL', 'KSP'],
  'Tamil Nadu': ['TNPSC', 'TANGEDCO', 'TNEB'],
  'Kerala': ['Kerala PSC', 'KSEB', 'KSRTC'],
  'Gujarat': ['GPSC', 'GSSSB', 'GSRTC'],
  'Rajasthan': ['RPSC', 'RSMSSB', 'RSRTC'],
  'Uttar Pradesh': ['UPPSC', 'UPSSSC', 'UPSRTC'],
  'Bihar': ['BPSC', 'BSSC', 'BSPHCL'],
  'Madhya Pradesh': ['MPPSC', 'MPESB', 'MPPEB'],
  'Delhi': ['DSSSB', 'Delhi Police', 'DTC'],
  'Punjab': ['PPSC', 'Punjab Police', 'PSSSB'],
  'Haryana': ['HPSC', 'HSSC', 'HRTC'],
  'West Bengal': ['WBPSC', 'WBSSC', 'WBSEDCL'],
  'Jharkhand': ['JPSC', 'JSSC', 'JUVNL'],
  'Chhattisgarh': ['CGPSC', 'CGVYAPAM', 'CSPHCL'],
  'Odisha': ['OPSC', 'OSSSC', 'OSSC'],
  'Assam': ['APSC', 'PNRD Assam', 'DHS Assam'],
  'Himachal Pradesh': ['HPPSC', 'HPSSSB', 'HPBOSE'],
  'Uttarakhand': ['UKPSC', 'UKSSSC', 'UPCL'],
  'Goa': ['Goa PSC', 'Goa Shipyard'],
  'Jammu & Kashmir': ['JKPSC', 'JKSSB', 'JKBOSE'],
  'Sikkim': ['SPSC', 'Sikkim Govt'],
  'Meghalaya': ['MPSC Meghalaya', 'MePSC'],
  'Manipur': ['MPSC Manipur', 'Manipur Govt'],
  'Nagaland': ['NPSC', 'Nagaland Govt'],
  'Tripura': ['TPSC', 'Tripura Govt'],
  'Arunachal Pradesh': ['APPSC AP', 'APSSB'],
  'Mizoram': ['MPSC Mizoram', 'Mizoram Govt'],
};

export const CENTRAL_SUBCATEGORIES = [
  'SSC', 'UPSC', 'Railway', 'India Post', 'FCI', 'ESIC', 'NHM', 'DRDO', 'ISRO', 'HAL',
];

export const BANKING_SUBCATEGORIES = [
  'IBPS', 'SBI', 'RBI', 'NABARD', 'LIC', 'GIC', 'NICL', 'UIICL',
];

export const DEFENCE_SUBCATEGORIES = [
  'Indian Army', 'Indian Navy', 'Indian Air Force', 'Coast Guard',
  'CRPF', 'BSF', 'CISF', 'ITBP', 'SSB', 'NDA', 'CDS',
];

export const TEACHING_SUBCATEGORIES = [
  'KVS', 'NVS', 'DSSSB Teachers', 'CTET', 'State TET', 'University',
];

export const JOB_RSS_FEEDS = [
  'https://www.sarkariresult.com/feed/',
  'https://www.freejobalert.com/feed/',
  'https://www.freshersworld.com/government-jobs/feed',
  'https://www.sarkariexam.com/feed/',
  'https://www.govtjobguru.in/feed/',
  'https://www.sarkarijobfind.com/feed/',
];

export const SCRAPING_TARGETS = [
  'https://www.sarkariresult.com',
  'https://www.freejobalert.com',
  'https://www.sarkariexam.com',
];

export const PAY_LEVELS: Record<number, { min: number; max: number }> = {
  1: { min: 18000, max: 56900 },
  2: { min: 19900, max: 63200 },
  3: { min: 21700, max: 69100 },
  4: { min: 25500, max: 81100 },
  5: { min: 29200, max: 92300 },
  6: { min: 35400, max: 112400 },
  7: { min: 44900, max: 142400 },
  8: { min: 47600, max: 151100 },
  9: { min: 53100, max: 167800 },
  10: { min: 56100, max: 177500 },
  11: { min: 67700, max: 208700 },
  12: { min: 78800, max: 209200 },
  13: { min: 123100, max: 215900 },
  14: { min: 144200, max: 218200 },
  15: { min: 182200, max: 224100 },
  16: { min: 205400, max: 224400 },
  17: { min: 225000, max: 225000 },
  18: { min: 250000, max: 250000 },
};

export const MAJOR_EXAMS = [
  { slug: 'ssc-cgl', name: 'SSC CGL', category: 'Central Govt', org: 'Staff Selection Commission' },
  { slug: 'ssc-chsl', name: 'SSC CHSL', category: 'Central Govt', org: 'Staff Selection Commission' },
  { slug: 'ssc-mts', name: 'SSC MTS', category: 'Central Govt', org: 'Staff Selection Commission' },
  { slug: 'ssc-gd', name: 'SSC GD Constable', category: 'Central Govt', org: 'Staff Selection Commission' },
  { slug: 'upsc-ias', name: 'UPSC Civil Services (IAS/IPS)', category: 'Central Govt', org: 'UPSC' },
  { slug: 'upsc-cds', name: 'UPSC CDS', category: 'Defence', org: 'UPSC' },
  { slug: 'upsc-nda', name: 'NDA Examination', category: 'Defence', org: 'UPSC' },
  { slug: 'upsc-capf', name: 'UPSC CAPF', category: 'Defence', org: 'UPSC' },
  { slug: 'ibps-po', name: 'IBPS PO', category: 'Banking', org: 'IBPS' },
  { slug: 'ibps-clerk', name: 'IBPS Clerk', category: 'Banking', org: 'IBPS' },
  { slug: 'ibps-so', name: 'IBPS SO', category: 'Banking', org: 'IBPS' },
  { slug: 'ibps-rrb', name: 'IBPS RRB', category: 'Banking', org: 'IBPS' },
  { slug: 'sbi-po', name: 'SBI PO', category: 'Banking', org: 'State Bank of India' },
  { slug: 'sbi-clerk', name: 'SBI Clerk', category: 'Banking', org: 'State Bank of India' },
  { slug: 'rbi-grade-b', name: 'RBI Grade B', category: 'Banking', org: 'Reserve Bank of India' },
  { slug: 'rbi-assistant', name: 'RBI Assistant', category: 'Banking', org: 'Reserve Bank of India' },
  { slug: 'rrb-ntpc', name: 'RRB NTPC', category: 'Central Govt', org: 'Railway Recruitment Board' },
  { slug: 'rrb-group-d', name: 'RRB Group D', category: 'Central Govt', org: 'Railway Recruitment Board' },
  { slug: 'rrb-alp', name: 'RRB ALP', category: 'Central Govt', org: 'Railway Recruitment Board' },
  { slug: 'rrb-je', name: 'RRB JE', category: 'Central Govt', org: 'Railway Recruitment Board' },
  { slug: 'indian-army', name: 'Indian Army Recruitment', category: 'Defence', org: 'Indian Army' },
  { slug: 'indian-navy', name: 'Indian Navy Recruitment', category: 'Defence', org: 'Indian Navy' },
  { slug: 'indian-air-force', name: 'Indian Air Force (AFCAT)', category: 'Defence', org: 'Indian Air Force' },
  { slug: 'kvs-teacher', name: 'KVS Teacher Recruitment', category: 'Teaching', org: 'Kendriya Vidyalaya Sangathan' },
  { slug: 'nvs-teacher', name: 'NVS Teacher Recruitment', category: 'Teaching', org: 'Navodaya Vidyalaya Samiti' },
  { slug: 'ctet', name: 'CTET Examination', category: 'Teaching', org: 'CBSE' },
  { slug: 'lic-aao', name: 'LIC AAO', category: 'Banking', org: 'Life Insurance Corporation' },
];

export function formatIndianNumber(num: number): string {
  const str = num.toString();
  if (str.length <= 3) return str;
  let lastThree = str.substring(str.length - 3);
  const otherNumbers = str.substring(0, str.length - 3);
  if (otherNumbers !== '') lastThree = ',' + lastThree;
  return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export function daysUntil(dateStr: string): number {
  if (!dateStr) return Infinity;
  const target = new Date(dateStr);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function getStateSlug(state: string): string {
  return state.toLowerCase().replace(/[&\s]+/g, '-').replace(/--+/g, '-');
}

export function getCategoryColor(category: string): string {
  const map: Record<string, string> = {
    'Central Govt': 'bg-blue-100 text-blue-800',
    'Banking': 'bg-green-100 text-green-800',
    'State Govt': 'bg-purple-100 text-purple-800',
    'Defence': 'bg-red-100 text-red-800',
    'Teaching': 'bg-yellow-100 text-yellow-800',
  };
  return map[category] || 'bg-gray-100 text-gray-800';
}

export function getVacancyBadgeColor(count: number): string {
  if (count >= 1000) return 'bg-green-100 text-green-800';
  if (count >= 100) return 'bg-blue-100 text-blue-800';
  if (count >= 10) return 'bg-orange-100 text-orange-800';
  return 'bg-gray-100 text-gray-800';
}
