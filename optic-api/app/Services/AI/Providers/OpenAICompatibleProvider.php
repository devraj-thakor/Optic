<?php

namespace App\Services\AI\Providers;

use App\Exceptions\AIProcessingException;
use App\Services\AI\Contracts\AIProviderInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

abstract class OpenAICompatibleProvider implements AIProviderInterface
{
    protected string $baseUrl;
    protected string $apiKey;
    protected string $model;
    protected string $providerName;

    public function __construct(string $baseUrl, string $apiKey, string $model, string $providerName)
    {
        $this->baseUrl      = $baseUrl;
        $this->apiKey       = $apiKey;
        $this->model        = $model;
        $this->providerName = $providerName;
    }

    public function analyze(string $source, string $message): array
    {
        $prompt = $this->buildPrompt($source, $message);

        $response = Http::withHeaders($this->getHeaders())
            ->timeout(30)
            ->post("{$this->baseUrl}/chat/completions", [
                'model'           => $this->model,
                'messages'        => [
                    ['role' => 'user', 'content' => $prompt],
                ],
                'temperature'     => 0.3,
                'max_tokens'      => 3000,
                'response_format' => ['type' => 'json_object'],  // Force pure JSON output
            ]);

        if (!$response->successful()) {
            Log::error('AI provider HTTP error', [
                'provider' => $this->providerName,
                'status'   => $response->status(),
                'body'     => $response->body(),
            ]);
            throw new AIProcessingException("AI provider '{$this->providerName}' returned HTTP {$response->status()}");
        }

        $content = $response->json('choices.0.message.content', '');

        // Some providers (e.g. Cloudflare) can return content as an array of parts
        if (is_array($content)) {
            $content = implode('', array_map(fn($p) => is_array($p) ? ($p['text'] ?? json_encode($p)) : (string) $p, $content));
        }
        $content = (string) $content;

        return $this->parseJsonResponse($content);

    }

    protected function getHeaders(): array
    {
        return [
            'Authorization' => "Bearer {$this->apiKey}",
            'Content-Type'  => 'application/json',
        ];
    }

    protected function buildPrompt(string $source, string $message): string
    {
        $template = file_get_contents(resource_path('prompts/lead_insight.txt'));

        return str_replace(
            ['{source}', '{message}'],
            [$source, $message],
            $template
        );
    }

    protected function parseJsonResponse(string $content): array
    {
        // Strip markdown code fences
        $content = preg_replace('/```(?:json)?\s*/i', '', $content);
        $content = preg_replace('/```\s*$/', '', $content);
        $content = trim($content);

        // Try direct decode first
        $decoded = json_decode($content, true);

        // If that fails, try extracting the first {...} block from prose
        // (some models add an intro sentence before the JSON)
        if (json_last_error() !== JSON_ERROR_NONE) {
            if (preg_match('/\{[\s\S]*\}/u', $content, $m)) {
                $decoded = json_decode($m[0], true);
            }
        }

        if (json_last_error() !== JSON_ERROR_NONE || !is_array($decoded)) {
            Log::error('AI JSON parse error', [
                'provider' => $this->providerName,
                'model'    => $this->model,
                'content'  => $content,
                'error'    => json_last_error_msg(),
                'hint'     => 'If content is prose/error-text, the model name may be wrong or the model refused the prompt.',
            ]);
            throw new AIProcessingException(
                "AI returned non-JSON response. Content: " . substr($content, 0, 150)
            );
        }

        $required = ['ai_summary', 'lead_intent', 'urgency_level', 'recommended_action', 'lead_score', 'confidence_level'];
        foreach ($required as $key) {
            if (!isset($decoded[$key])) {
                throw new AIProcessingException("AI response missing required field: {$key}");
            }
        }

        return $decoded;
    }

    public function getModelName(): string
    {
        return $this->model;
    }

    public function getProviderName(): string
    {
        return $this->providerName;
    }
}
