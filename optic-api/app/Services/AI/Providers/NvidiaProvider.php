<?php

namespace App\Services\AI\Providers;

class NvidiaProvider extends OpenAICompatibleProvider
{
    public function __construct(?string $apiKey = null, ?string $model = null)
    {
        parent::__construct(
            baseUrl:      config('ai.providers.nvidia.base_url'),
            apiKey:       $apiKey ?? config('ai.api_key'),
            model:        $model  ?? config('ai.providers.nvidia.default_model', 'meta/llama-3.3-70b-instruct'),
            providerName: 'nvidia',
        );
    }
}
