// Format number in Indian style (lakhs, crores)
export function formatIndianCurrency(amount: number): string {
  if (amount < 0) return '-' + formatIndianCurrency(-amount);
  const str = Math.round(amount).toString();
  let result = '';
  const len = str.length;

  if (len <= 3) return '\u20B9' + str;

  result = str.substring(len - 3);
  let remaining = str.substring(0, len - 3);

  while (remaining.length > 2) {
    result = remaining.substring(remaining.length - 2) + ',' + result;
    remaining = remaining.substring(0, remaining.length - 2);
  }

  if (remaining.length > 0) {
    result = remaining + ',' + result;
  }

  return '\u20B9' + result;
}

// Format date in Indian style
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Format date for input fields (YYYY-MM-DD)
export function formatDateForInput(date: Date | string): string {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

// Get today's date as YYYY-MM-DD
export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

// Get start of current month
export function getMonthStartString(): string {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0];
}

// Materials list
export const MATERIALS = ['20mm', '40mm', 'Sand', 'M-Sand', 'Gravel'];

// Units list
export const UNITS = ['MT', 'CFT', 'Load'];

// Payment modes
export const PAYMENT_MODES = ['Cash', 'NEFT', 'UPI', 'Cheque', 'RTGS'];
