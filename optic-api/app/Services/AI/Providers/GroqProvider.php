<?php

namespace App\Services\AI\Providers;

class GroqProvider extends OpenAICompatibleProvider
{
    public function __construct(?string $apiKey = null, ?string $model = null)
    {
        parent::__construct(
            baseUrl:      config('ai.providers.groq.base_url'),
            apiKey:       $apiKey ?? config('ai.api_key'),
            model:        $model  ?? config('ai.providers.groq.default_model', 'llama-3.3-70b-versatile'),
            providerName: 'groq',
        );
    }
}
