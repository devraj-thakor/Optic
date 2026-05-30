<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leads', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('gen_random_uuid()'));
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone', 50)->nullable();
            $table->string('source', 50);
            $table->text('inquiry_message');
            $table->string('status', 50)->default('new');
            $table->string('priority', 50)->default('medium');
            $table->integer('lead_score')->nullable();
            $table->boolean('is_demo')->default(false);
            $table->timestamps();
        });

        // Standard indexes
        DB::statement('CREATE INDEX idx_leads_status ON leads(status)');
        DB::statement('CREATE INDEX idx_leads_priority ON leads(priority)');
        DB::statement('CREATE INDEX idx_leads_source ON leads(source)');
        DB::statement('CREATE INDEX idx_leads_created_at ON leads(created_at DESC)');
        DB::statement('CREATE INDEX idx_leads_is_demo ON leads(is_demo)');
        DB::statement('CREATE INDEX idx_leads_lead_score ON leads(lead_score DESC NULLS LAST)');
        DB::statement('CREATE INDEX idx_leads_status_priority ON leads(status, priority)');
        DB::statement('CREATE INDEX idx_leads_status_source ON leads(status, source)');

        // Trigram fuzzy search index
        DB::statement("
            CREATE INDEX idx_leads_search_trgm ON leads
            USING GIN (
                (name || ' ' || COALESCE(email, '') || ' ' || COALESCE(phone, '') || ' ' || inquiry_message)
                gin_trgm_ops
            )
        ");
    }

    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
