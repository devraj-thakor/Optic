<?php

namespace App\Services\AI;

use App\Services\AI\Contracts\AIProviderInterface;
use App\Services\AI\Providers\CloudflareProvider;
use App\Services\AI\Providers\GeminiProvider;
use App\Services\AI\Providers\GroqProvider;
use App\Services\AI\Providers\NvidiaProvider;
use App\Services\AI\Providers\OpenRouterProvider;
use InvalidArgumentException;

class AIProviderFactory
{
    /**
     * Build the PRIMARY provider — always Gemini, using GEMINI_API_KEY + GEMINI_MODEL.
     */
    public static function makePrimary(): AIProviderInterface
    {
        return new GeminiProvider(
            apiKey:  config('ai.primary.api_key'),
            model:   config('ai.primary.model'),
            baseUrl: config('ai.primary.base_url'),
        );
    }

    /**
     * Build the FALLBACK provider — whatever AI_PROVIDER is set to in .env.
     * Uses AI_API_KEY and AI_MODEL (with per-provider defaults).
     */
    public static function make(): AIProviderInterface
    {
        $provider  = config('ai.provider', 'cloudflare');
        $apiKey    = config('ai.api_key');
        $model     = config('ai.model') ?: config("ai.providers.{$provider}.default_model");

        return match ($provider) {
            'groq'       => self::makeGroq($apiKey, $model),
            'openrouter' => self::makeOpenRouter($apiKey, $model),
            'nvidia'     => self::makeNvidia($apiKey, $model),
            'gemini'     => new GeminiProvider(apiKey: $apiKey, model: $model),
            'cloudflare' => self::makeCloudflare($apiKey, $model),
            default      => throw new InvalidArgumentException("Unsupported AI provider: [{$provider}]"),
        };
    }

    // ─── Private builder helpers ──────────────────────────────────────────────

    private static function makeGroq(string $apiKey, string $model): GroqProvider
    {
        return new GroqProvider($apiKey, $model);
    }

    private static function makeOpenRouter(string $apiKey, string $model): OpenRouterProvider
    {
        return new OpenRouterProvider($apiKey, $model);
    }

    private static function makeNvidia(string $apiKey, string $model): NvidiaProvider
    {
        return new NvidiaProvider($apiKey, $model);
    }

    private static function makeCloudflare(string $apiKey, string $model): CloudflareProvider
    {
        return new CloudflareProvider($apiKey, $model);
    }
}
