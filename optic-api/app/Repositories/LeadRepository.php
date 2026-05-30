<?php

namespace App\Repositories;

use App\Models\Lead;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;

class LeadRepository
{
    public function getFiltered(array $filters, int $perPage = 20): LengthAwarePaginator
    {
        // Do NOT cache search results — the filter parameters make every combination unique
        // and the 30s cache prevents search results from appearing after new leads are added.
        $isSearching = !empty($filters['search']);
        $cacheKey    = 'leads:list:' . md5(json_encode(array_merge($filters, ['per_page' => $perPage])));

        $build = function () use ($filters, $perPage, $isSearching) {
            $query = Lead::with('insight')->latest();

            if (!empty($filters['status'])) {
                $query->where('status', $filters['status']);
            }

            if (!empty($filters['priority'])) {
                $query->where('priority', $filters['priority']);
            }

            if (!empty($filters['source'])) {
                $query->where('source', $filters['source']);
            }

            if ($isSearching) {
                $term  = $filters['search'];
                $like  = '%' . $term . '%';

                // Primary: ILIKE substring match across all searchable columns
                // This catches: name, email, phone, full inquiry message keywords
                $query->where(function ($q) use ($like, $term) {
                    $q->whereRaw('name ILIKE ?', [$like])
                      ->orWhereRaw('email ILIKE ?', [$like])
                      ->orWhereRaw('COALESCE(phone, \'\') ILIKE ?', [$like])
                      ->orWhereRaw('inquiry_message ILIKE ?', [$like])
                      // Secondary: fuzzy name similarity for typos (e.g. "Marcuss" → "Marcus")
                      ->orWhereRaw('similarity(lower(name), lower(?)) > 0.3', [$term]);
                });
            }

            return $query->paginate($perPage);
        };

        // Skip cache entirely when searching (results must be real-time)
        if ($isSearching) {
            return $build();
        }

        return Cache::remember($cacheKey, 30, $build);
    }

    public function findByUuid(string $uuid): ?Lead
    {
        return Cache::remember("lead:{$uuid}", 60, function () use ($uuid) {
            return Lead::with(['insight', 'statusHistory'])->find($uuid);
        });
    }

    public function invalidateLeadCache(string $uuid): void
    {
        Cache::forget("lead:{$uuid}");
        // Invalidate list caches (pattern-based not natively supported; clear entire prefix)
        // In production, use cache tags or Redis SCAN
        Cache::forget('leads:list:' . md5(''));
    }
}
