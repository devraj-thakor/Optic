<?php

namespace App\Services\AI\Contracts;

interface AIProviderInterface
{
    /**
     * Analyze a lead inquiry and return structured AI response data.
     *
     * @param  string  $source  The lead channel/source
     * @param  string  $message The lead's inquiry message
     * @return array            Parsed JSON response from the AI
     */
    public function analyze(string $source, string $message): array;

    /**
     * Get the model identifier string (e.g., "llama-3.3-70b-versatile").
     */
    public function getModelName(): string;

    /**
     * Get the provider name (e.g., "groq", "gemini").
     */
    public function getProviderName(): string;
}
