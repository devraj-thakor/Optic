<?php

namespace App\Services\AI\Providers;

class OpenRouterProvider extends OpenAICompatibleProvider
{
    public function __construct(?string $apiKey = null, ?string $model = null)
    {
        parent::__construct(
            baseUrl:      config('ai.providers.openrouter.base_url'),
            apiKey:       $apiKey ?? config('ai.api_key'),
            model:        $model  ?? config('ai.providers.openrouter.default_model', 'meta-llama/llama-3.3-70b-instruct:free'),
            providerName: 'openrouter',
        );
    }

    protected function getHeaders(): array
    {
        return array_merge(parent::getHeaders(), [
            'HTTP-Referer' => config('app.url'),
            'X-Title'      => 'Optic AI Lead Intelligence',
        ]);
    }
}
