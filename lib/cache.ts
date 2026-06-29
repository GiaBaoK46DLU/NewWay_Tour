// Caching utilities for performance optimization
// Reduces repeated database queries for frequently accessed data

import { USER_ROLES } from "@/lib/constants";

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number;
}

const roleCache = new Map<string, CacheEntry<string>>();
const ROLE_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get cached user role if available and not expired.
 */
export function getCachedUserRole(userId: string): string | null {
  const cached = roleCache.get(userId);

  if (!cached) {
    return null;
  }

  if (Date.now() - cached.timestamp > cached.ttl) {
    roleCache.delete(userId);
    return null;
  }

  return cached.value;
}

/**
 * Cache user role for subsequent queries.
 */
export function cacheUserRole(userId: string, role: string): void {
  roleCache.set(userId, {
    value: role,
    timestamp: Date.now(),
    ttl: ROLE_CACHE_TTL
  });
}

/**
 * Invalidate user role cache (call after role changes).
 */
export function invalidateUserRoleCache(userId: string): void {
  roleCache.delete(userId);
}

/**
 * Clear all caches (use after bulk operations or in testing).
 */
export function clearAllCaches(): void {
  roleCache.clear();
}

/**
 * Get cache statistics for monitoring.
 */
export function getCacheStats(): {
  rolesCached: number;
  totalEntries: number;
} {
  return {
    rolesCached: roleCache.size,
    totalEntries: roleCache.size
  };
}
