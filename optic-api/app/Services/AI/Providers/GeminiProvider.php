<?php

namespace App\Services\AI\Providers;

/**
 * GeminiProvider — uses Google's OpenAI-compatible endpoint.
 *
 * Can be instantiated in two modes:
 *   1. Primary mode: explicit $apiKey + $model from config('ai.primary.*')
 *   2. Standard mode: no args → reads from config('ai.api_key') and config('ai.providers.gemini.*')
 *
 * Base URL: https://generativelanguage.googleapis.com/v1beta/openai
 * Docs:     https://ai.google.dev/gemini-api/docs/openai
 */
class GeminiProvider extends OpenAICompatibleProvider
{
    public function __construct(?string $apiKey = null, ?string $model = null, ?string $baseUrl = null)
    {
        parent::__construct(
            baseUrl:      $baseUrl  ?? config('ai.providers.gemini.base_url'),
            apiKey:       $apiKey   ?? config('ai.api_key'),
            model:        $model    ?? config('ai.providers.gemini.default_model', 'gemini-3.5-flash'),
            providerName: 'gemini',
        );
    }
}
