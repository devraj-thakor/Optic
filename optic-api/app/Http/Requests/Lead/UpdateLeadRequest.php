<?php

namespace App\Http\Requests\Lead;

use App\Enums\LeadPriority;
use App\Enums\LeadSource;
use App\Enums\LeadStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateLeadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'            => ['sometimes', 'string', 'max:255'],
            'email'           => ['nullable', 'email', 'max:255'],
            'phone'           => ['nullable', 'string', 'max:50'],
            'source'          => ['sometimes', Rule::in(LeadSource::values())],
            'inquiry_message' => ['sometimes', 'string', 'min:10'],
            'status'          => ['sometimes', Rule::in(LeadStatus::values())],
            'priority'        => ['sometimes', Rule::in(LeadPriority::values())],
        ];
    }
}
