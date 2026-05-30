<?php

namespace App\Enums;

enum LeadSource: string
{
    case Website   = 'website';
    case WhatsApp  = 'whatsapp';
    case Instagram = 'instagram';
    case Facebook  = 'facebook';
    case LinkedIn  = 'linkedin';
    case Referral  = 'referral';

    public function label(): string
    {
        return match($this) {
            self::Website   => 'Website',
            self::WhatsApp  => 'WhatsApp',
            self::Instagram => 'Instagram',
            self::Facebook  => 'Facebook',
            self::LinkedIn  => 'LinkedIn',
            self::Referral  => 'Referral',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
