<?php

namespace App\Support;

use Closure;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

/**
 * SafeCache
 *
 * A transparent wrapper around Laravel's Cache facade that catches any
 * Redis / connection errors and falls through to the DB callback directly.
 *
 * When Redis is healthy, behaviour is identical to Cache::remember() / put() / etc.
 * When Redis is unavailable (e.g. Upstash request-limit exceeded), every cache
 * operation is silently skipped and the source-of-truth DB query runs instead.
 * This keeps the application fully functional without any error responses.
 *
 * Usage (drop-in for Cache::*):
 *   SafeCache::remember('key', 60, fn () => DB::query(...));
 *   SafeCache::put('key', $value, 60);
 *   SafeCache::has('key');
 *   SafeCache::get('key');
 *   SafeCache::forget('key');
 */
class SafeCache
{
    /**
     * Whether Redis has been detected as unavailable in this request cycle.
     * Once set to true, all subsequent cache calls are skipped to avoid
     * hammering a broken connection.
     */
    private static bool $redisDown = false;

    // ─── Public API ────────────────────────────────────────────────────────────

    /**
     * Retrieve an item from the cache, or execute and store the callback value.
     * Falls back to executing the callback directly when Redis is unavailable.
     */
    public static function remember(string $key, int $ttlSeconds, Closure $callback): mixed
    {
        if (self::$redisDown) {
            return $callback();
        }

        try {
            return Cache::remember($key, $ttlSeconds, $callback);
        } catch (\Throwable $e) {
            self::markDown($e);
            return $callback();
        }
    }

    /**
     * Store an item in the cache.
     * Silently skipped when Redis is unavailable.
     */
    public static function put(string $key, mixed $value, mixed $ttl): void
    {
        if (self::$redisDown) {
            return;
        }

        try {
            Cache::put($key, $value, $ttl);
        } catch (\Throwable $e) {
            self::markDown($e);
        }
    }

    /**
     * Determine if an item exists in the cache.
     * Returns false when Redis is unavailable (forces re-fetch from DB).
     */
    public static function has(string $key): bool
    {
        if (self::$redisDown) {
            return false;
        }

        try {
            return Cache::has($key);
        } catch (\Throwable $e) {
            self::markDown($e);
            return false;
        }
    }

    /**
     * Retrieve an item from the cache.
     * Returns null when Redis is unavailable.
     */
    public static function get(string $key): mixed
    {
        if (self::$redisDown) {
            return null;
        }

        try {
            return Cache::get($key);
        } catch (\Throwable $e) {
            self::markDown($e);
            return null;
        }
    }

    /**
     * Remove an item from the cache.
     * Silently skipped when Redis is unavailable.
     */
    public static function forget(string $key): void
    {
        if (self::$redisDown) {
            return;
        }

        try {
            Cache::forget($key);
        } catch (\Throwable $e) {
            self::markDown($e);
        }
    }

    // ─── Internals ─────────────────────────────────────────────────────────────

    /**
     * Mark Redis as unavailable for the rest of this request and log once.
     */
    private static function markDown(\Throwable $e): void
    {
        if (!self::$redisDown) {
            self::$redisDown = true;
            Log::warning('[SafeCache] Redis unavailable — bypassing cache for this request. Error: ' . $e->getMessage());
        }
    }

    /**
     * Allow tests or bootstrap code to reset the circuit-breaker state.
     */
    public static function reset(): void
    {
        self::$redisDown = false;
    }

    /**
     * Returns true if Redis has been detected as unavailable in this cycle.
     */
    public static function isDown(): bool
    {
        return self::$redisDown;
    }
}
