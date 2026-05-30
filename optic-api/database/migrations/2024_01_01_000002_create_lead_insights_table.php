<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lead_insights', function (Blueprint $table) {
            $table->id();
            $table->uuid('lead_id');
            $table->text('ai_summary')->nullable();
            $table->string('lead_intent')->nullable();
            $table->string('urgency_level', 50)->nullable();
            $table->text('recommended_action')->nullable();
            $table->integer('lead_score')->nullable();
            $table->string('confidence_level', 50)->nullable();
            $table->string('ai_model', 100)->nullable();
            $table->string('ai_provider', 50)->nullable();
            $table->integer('processing_time_ms')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();

            $table->foreign('lead_id')
                  ->references('id')
                  ->on('leads')
                  ->onDelete('cascade');
        });

        DB::statement('CREATE INDEX idx_insights_urgency ON lead_insights(urgency_level)');
        DB::statement('CREATE INDEX idx_insights_processed_at ON lead_insights(processed_at)');
    }

    public function down(): void
    {
        Schema::dropIfExists('lead_insights');
    }
};
