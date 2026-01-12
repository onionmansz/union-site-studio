/**
 * Generates a short, memorable party code for RSVP invitations
 * Format: 6 uppercase alphanumeric characters (e.g., "A7K3M2")
 */
export function generatePartyCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed similar-looking characters (I, O, 0, 1)
  let code = '';

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }

  return code;
}

/**
 * Validates if a party code has the correct format
 */
export function isValidPartyCode(code: string): boolean {
  return /^[A-Z0-9]{4,10}$/.test(code);
}
