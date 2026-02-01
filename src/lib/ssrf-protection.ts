/**
 * SSRF Protection — prevents server-side requests to internal/private networks.
 * Resolves hostnames and rejects private, loopback, link-local, and metadata IPs.
 */

import { resolve4, resolve6 } from 'dns/promises';

// Private/reserved IPv4 ranges
const PRIVATE_IPV4_RANGES = [
  { prefix: '10.', mask: null },         // 10.0.0.0/8
  { prefix: '172.', mask: (ip: string) => {
    const second = parseInt(ip.split('.')[1]);
    return second >= 16 && second <= 31;   // 172.16.0.0/12
  }},
  { prefix: '192.168.', mask: null },     // 192.168.0.0/16
  { prefix: '127.', mask: null },         // Loopback
  { prefix: '169.254.', mask: null },     // Link-local / cloud metadata
  { prefix: '0.', mask: null },           // Current network
  { prefix: '100.64.', mask: null },      // Shared address space (CGNAT)
  { prefix: '198.18.', mask: null },      // Benchmark testing
  { prefix: '198.19.', mask: null },
  { prefix: '203.0.113.', mask: null },   // Documentation
  { prefix: '224.', mask: null },         // Multicast
  { prefix: '240.', mask: null },         // Reserved
  { prefix: '255.', mask: null },         // Broadcast
];

function isPrivateIPv4(ip: string): boolean {
  for (const range of PRIVATE_IPV4_RANGES) {
    if (ip.startsWith(range.prefix)) {
      if (range.mask === null) return true;
      if (typeof range.mask === 'function' && range.mask(ip)) return true;
    }
  }
  return false;
}

function isPrivateIPv6(ip: string): boolean {
  const normalized = ip.toLowerCase();
  // Loopback
  if (normalized === '::1' || normalized === '0:0:0:0:0:0:0:1') return true;
  // Link-local
  if (normalized.startsWith('fe80:')) return true;
  // Unique local
  if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true;
  // IPv4-mapped IPv6 (::ffff:x.x.x.x)
  if (normalized.startsWith('::ffff:')) {
    const ipv4 = normalized.slice(7);
    if (ipv4.includes('.')) return isPrivateIPv4(ipv4);
  }
  return false;
}

/**
 * Validates a URL is safe to fetch (not targeting internal infrastructure).
 * Throws an error if the URL targets a private/reserved IP.
 */
export async function validateUrlNotInternal(urlString: string): Promise<void> {
  const url = new URL(urlString);
  const hostname = url.hostname;

  // Check if hostname is a raw IP
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) {
    if (isPrivateIPv4(hostname)) {
      throw new Error(`Blocked: ${hostname} resolves to a private/internal IP address`);
    }
    return;
  }

  // Check IPv6 literal
  if (hostname.startsWith('[') && hostname.endsWith(']')) {
    const ipv6 = hostname.slice(1, -1);
    if (isPrivateIPv6(ipv6)) {
      throw new Error(`Blocked: ${hostname} resolves to a private/internal IP address`);
    }
    return;
  }

  // Block common internal hostnames
  const blockedHostnames = ['localhost', 'metadata.google.internal', 'instance-data'];
  if (blockedHostnames.includes(hostname.toLowerCase())) {
    throw new Error(`Blocked: ${hostname} is a reserved internal hostname`);
  }

  // Resolve DNS and check all IPs
  try {
    const ipv4Addresses = await resolve4(hostname).catch(() => [] as string[]);
    const ipv6Addresses = await resolve6(hostname).catch(() => [] as string[]);

    for (const ip of ipv4Addresses) {
      if (isPrivateIPv4(ip)) {
        throw new Error(`Blocked: ${hostname} resolves to private IP ${ip}`);
      }
    }

    for (const ip of ipv6Addresses) {
      if (isPrivateIPv6(ip)) {
        throw new Error(`Blocked: ${hostname} resolves to private IPv6 ${ip}`);
      }
    }

    // If no addresses resolved at all, block as a precaution
    if (ipv4Addresses.length === 0 && ipv6Addresses.length === 0) {
      throw new Error(`Blocked: ${hostname} could not be resolved`);
    }
  } catch (err) {
    if (err instanceof Error && err.message.startsWith('Blocked:')) throw err;
    throw new Error(`DNS resolution failed for ${hostname}: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
}
