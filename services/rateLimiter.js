const userCooldowns = new Map();
const LIMIT_MS = 2000; // 2 seconds between requests per user

export function isRateLimited(userId) {
  const now = Date.now();
  const last = userCooldowns.get(userId) || 0;
  if (now - last < LIMIT_MS) return true;
  userCooldowns.set(userId, now);
  return false;
}
