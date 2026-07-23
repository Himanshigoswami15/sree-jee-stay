/**
 * Normalizes phone numbers and customer IDs for strict duplicate prevention.
 * 
 * Examples:
 * - "+91 98765 43210" -> "9876543210"
 * - "98765-43210"     -> "9876543210"
 * - "09876543210"     -> "9876543210"
 * - "Cust-102"        -> "CUST102"
 */
export function normalizeContact(input) {
  if (!input) return '';
  
  const trimmed = String(input).trim();
  if (!trimmed) return '';

  // Extract all digits
  const digits = trimmed.replace(/\D/g, '');

  // If input contains a valid phone number (10+ digits), extract the core 10-digit number
  if (digits.length >= 10) {
    return digits.slice(-10);
  }
  
  // If numeric but shorter (e.g. 5-9 digit room/ID number), return clean digits
  if (digits.length > 0) {
    return digits;
  }

  // If alphanumeric Customer ID (e.g. "CUST-99"), clean special characters & uppercase
  return trimmed.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

/**
 * Checks if a contact string matches any existing stored contact.
 */
export function isSameContact(contactA, contactB) {
  const normA = normalizeContact(contactA);
  const normB = normalizeContact(contactB);
  
  if (!normA || !normB) return false;
  return normA === normB;
}
