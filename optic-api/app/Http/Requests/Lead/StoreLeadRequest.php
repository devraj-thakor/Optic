<?php

namespace App\Http\Requests\Lead;

use App\Enums\LeadPriority;
use App\Enums\LeadSource;
use App\Enums\LeadStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreLeadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'            => ['required', 'string', 'max:255'],
            'email'           => ['nullable', 'email', 'max:255'],
            'phone'           => ['nullable', 'string', 'max:50'],
            'source'          => ['required', Rule::in(LeadSource::values())],
            'inquiry_message' => ['required', 'string', 'min:10'],
            'status'          => ['nullable', Rule::in(LeadStatus::values())],
            'priority'        => ['nullable', Rule::in(LeadPriority::values())],
            'is_demo'         => ['nullable', 'boolean'],
        ];
    }
}
