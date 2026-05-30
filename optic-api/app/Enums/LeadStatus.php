<?php

namespace App\Enums;

enum LeadStatus: string
{
    case New       = 'new';
    case Contacted = 'contacted';
    case Qualified = 'qualified';
    case Closed    = 'closed';

    public function label(): string
    {
        return match($this) {
            self::New       => 'New',
            self::Contacted => 'Contacted',
            self::Qualified => 'Qualified',
            self::Closed    => 'Closed',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
