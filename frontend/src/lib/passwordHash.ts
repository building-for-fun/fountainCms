/**
 * Hash password on the client so the raw password is never sent over the network.
 * Uses SHA-256; the server stores and compares bcrypt(hexHash).
 */
export async function hashPasswordForTransport(plainPassword: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plainPassword);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
