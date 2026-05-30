<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lead_status_history', function (Blueprint $table) {
            $table->id();
            $table->uuid('lead_id');
            $table->string('from_status', 50)->nullable();
            $table->string('to_status', 50);
            $table->timestamp('changed_at')->useCurrent();

            $table->foreign('lead_id')
                  ->references('id')
                  ->on('leads')
                  ->onDelete('cascade');
        });

        DB::statement('CREATE INDEX idx_history_lead_id ON lead_status_history(lead_id)');
        DB::statement('CREATE INDEX idx_history_changed_at ON lead_status_history(changed_at DESC)');
    }

    public function down(): void
    {
        Schema::dropIfExists('lead_status_history');
    }
};
