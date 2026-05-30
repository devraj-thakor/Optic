<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Primary AI Provider (Gemini)
    |--------------------------------------------------------------------------
    |
    | The primary provider is ALWAYS Gemini, with its own dedicated key.
    | If Gemini fails for any reason (rate limit, quota, etc.) the system
    | automatically retries once using the fallback provider below.
    |
    */

    'primary' => [
        'provider' => 'gemini',
        'api_key'  => env('GEMINI_API_KEY'),
        'model'    => env('GEMINI_MODEL', 'gemini-3.5-flash'),
        'base_url' => 'https://generativelanguage.googleapis.com/v1beta/openai',
    ],

    /*
    |--------------------------------------------------------------------------
    | Fallback AI Provider
    |--------------------------------------------------------------------------
    |
    | Used when the primary (Gemini) fails. Set AI_PROVIDER to one of:
    | groq | openrouter | nvidia | cloudflare
    | Each has its own base URL; only the key and model need to be provided.
    |
    */

    'provider' => env('AI_PROVIDER', 'cloudflare'),
    'api_key'  => env('AI_API_KEY'),
    'model'    => env('AI_MODEL'),

    'cloudflare_account_id' => env('CLOUDFLARE_ACCOUNT_ID'),

    'providers' => [
        'groq' => [
            'base_url'     => 'https://api.groq.com/openai/v1',
            'default_model' => 'llama-3.3-70b-versatile',
        ],
        'openrouter' => [
            'base_url'     => 'https://openrouter.ai/api/v1',
            'default_model' => 'meta-llama/llama-3.3-70b-instruct:free',
        ],
        'nvidia' => [
            'base_url'     => 'https://integrate.api.nvidia.com/v1',
            'default_model' => 'meta/llama-3.3-70b-instruct',
        ],
        'gemini' => [
            'base_url'     => 'https://generativelanguage.googleapis.com/v1beta/openai',
            'default_model' => 'gemini-3.5-flash',
        ],
        'cloudflare' => [
            'base_url'     => 'https://api.cloudflare.com/client/v4/accounts',
            'default_model' => '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
        ],
    ],
];
