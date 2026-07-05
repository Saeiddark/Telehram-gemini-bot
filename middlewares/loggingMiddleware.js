import { logger } from '../utils/logger.js';

export default async function loggingMiddleware(ctx, next) {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  const updateType = ctx.updateType || 'unknown';
  const from = ctx.from ? `${ctx.from.id} (@${ctx.from.username || 'no-username'})` : 'no-user';
  logger.info(`[${updateType}] from ${from} in ${ms}ms`);
}
