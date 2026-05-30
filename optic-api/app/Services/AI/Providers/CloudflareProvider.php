<?php

namespace App\Services\AI\Providers;

/**
 * CloudflareProvider — uses Cloudflare Workers AI via the OpenAI-compatible endpoint.
 *
 * Base URL: https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/v1
 * Auth:     Bearer {CF_API_TOKEN}
 * Docs:     https://developers.cloudflare.com/workers-ai/configuration/open-ai-compatibility/
 *
 * Model identifiers use the @cf/vendor/name format, e.g.:
 *   @cf/meta/llama-3.3-70b-instruct-fp8-fast
 *   @cf/meta/llama-4-scout-17b-16e-instruct
 *   @cf/mistralai/mistral-small-3.1-24b-instruct
 */
class CloudflareProvider extends OpenAICompatibleProvider
{
    public function __construct(?string $apiKey = null, ?string $model = null)
    {
        $accountId = config('ai.cloudflare_account_id');
        $baseUrl   = "https://api.cloudflare.com/client/v4/accounts/{$accountId}/ai/v1";

        parent::__construct(
            baseUrl:      $baseUrl,
            apiKey:       $apiKey ?? config('ai.api_key'),
            model:        $model  ?? config('ai.providers.cloudflare.default_model', '@cf/meta/llama-3.3-70b-instruct-fp8-fast'),
            providerName: 'cloudflare',
        );
    }
}
