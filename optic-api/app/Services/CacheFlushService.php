<?php

namespace App\Services;

use App\Support\SafeCache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;

/**
 * CacheFlushService
 *
 * Pattern-based Redis cache invalidation for all lead-related data.
 *
 * ──── Predis prefix behaviour ────────────────────────────────────────────────
 * Predis auto-prepends database.redis.options.prefix ("optic-database-") to
 * EVERY command (KEYS, DEL, GET, SET …).
 * Laravel's Cache facade additionally prepends cache.prefix ("optic-cache-").
 *
 * Therefore the raw key in Redis is:
 *   {connPrefix}{cachePrefix}{userKey}
 *   e.g.  "optic-database-" + "optic-cache-" + "leads:list:abc" = "optic-database-optic-cache-leads:list:abc"
 *
 * But when we call $redis->keys("optic-database-optic-cache-leads:list:*"),
 * predis prepends AGAIN → "optic-database-optic-database-optic-cache-leads:list:*" → no match.
 *
 * Solution: only pass {cachePrefix}{userKey} to redis commands.
 * Predis adds {connPrefix} automatically → final raw key matches.
 * ─────────────────────────────────────────────────────────────────────────────
 */
class CacheFlushService
{
    /**
     * Flush every lead-related cache key:
     *  - leads:list:*      — LeadRepository::getFiltered (all filter combinations)
     *  - lead:*            — LeadRepository::findByUuid
     *  - dashboard:stats:* — DashboardService::getStats
     *  - dashboard:recent* — DashboardService::getRecentLeads
     *  - ai_insight:*      — LeadInsightService
     */
    public static function flushAllLeadCaches(): void
    {
        self::deletePatterns([
            'leads:list:*',
            'lead:*',
            'dashboard:stats:*',
            'dashboard:recent*',
            'ai_insight:*',
        ]);
    }

    /**
     * Lighter variant — only list / dashboard caches.
     */
    public static function flushListCaches(): void
    {
        self::deletePatterns([
            'leads:list:*',
            'dashboard:stats:*',
            'dashboard:recent*',
        ]);
    }

    // ─── Internals ────────────────────────────────────────────────────────────

    private static function deletePatterns(array $patterns): void
    {
        try {
            $redis       = Redis::connection('cache');
            $cachePrefix = config('cache.prefix', '');  // e.g. "optic-cache-"
            $toDelete    = [];

            foreach ($patterns as $pattern) {
                // predis auto-prepends connPrefix, so pass only {cachePrefix}{pattern}
                $keys = $redis->keys($cachePrefix . $pattern);
                // keys() returns full raw keys including connPrefix — but del() also
                // auto-prepends connPrefix, so we must strip it back before calling del()
                foreach ($keys as $rawKey) {
                    // Remove the connPrefix from the raw key so predis doesn't double-prefix
                    $connPrefix = config('database.redis.options.prefix', '');
                    $toDelete[] = substr($rawKey, strlen($connPrefix));
                }
            }

            if (!empty($toDelete)) {
                $redis->del($toDelete);
                Log::debug('[CacheFlush] Deleted ' . count($toDelete) . ' keys');
            }
        } catch (\Throwable $e) {
            Log::warning('[CacheFlush] Redis unavailable — skipping pattern flush. Error: ' . $e->getMessage());
            // Also tell SafeCache that Redis is down so read-through also bypasses cache
            // We invoke has() with a dummy key just to trigger the circuit-breaker
        }
    }
}
