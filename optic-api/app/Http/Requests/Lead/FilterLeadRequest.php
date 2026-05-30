<?php

namespace App\Http\Requests\Lead;

use App\Enums\LeadPriority;
use App\Enums\LeadSource;
use App\Enums\LeadStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FilterLeadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status'   => ['nullable', Rule::in(LeadStatus::values())],
            'priority' => ['nullable', Rule::in(LeadPriority::values())],
            'source'   => ['nullable', Rule::in(LeadSource::values())],
            'search'   => ['nullable', 'string', 'max:255'],
            'page'     => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}
