<?php

namespace App\DTOs;

use App\Enums\LeadPriority;
use App\Enums\LeadSource;
use App\Enums\LeadStatus;

readonly class LeadData
{
    public function __construct(
        public string      $name,
        public LeadSource  $source,
        public string      $inquiry_message,
        public ?string     $email    = null,
        public ?string     $phone    = null,
        public LeadStatus  $status   = LeadStatus::New,
        public LeadPriority $priority = LeadPriority::Medium,
        public bool        $is_demo  = false,
    ) {}

    public static function fromRequest(array $data): self
    {
        return new self(
            name:            $data['name'],
            source:          LeadSource::from($data['source']),
            inquiry_message: $data['inquiry_message'],
            email:           $data['email'] ?? null,
            phone:           $data['phone'] ?? null,
            status:          LeadStatus::from($data['status'] ?? 'new'),
            priority:        LeadPriority::from($data['priority'] ?? 'medium'),
            is_demo:         $data['is_demo'] ?? false,
        );
    }

    public function toArray(): array
    {
        return [
            'name'            => $this->name,
            'email'           => $this->email,
            'phone'           => $this->phone,
            'source'          => $this->source->value,
            'inquiry_message' => $this->inquiry_message,
            'status'          => $this->status->value,
            'priority'        => $this->priority->value,
            'is_demo'         => $this->is_demo,
        ];
    }
}
