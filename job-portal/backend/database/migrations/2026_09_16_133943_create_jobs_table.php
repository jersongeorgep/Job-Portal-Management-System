<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->string('title', 255);
            $table->string('slug', 280)->unique();
            $table->text('description');
            $table->string('location', 255);
            $table->enum('employment_type', ['full_time', 'part_time', 'contract', 'internship', 'remote']);
            $table->enum('experience_level', ['entry', 'junior', 'mid', 'senior', 'lead']);
            $table->decimal('salary_min', 12, 2)->nullable();
            $table->decimal('salary_max', 12, 2)->nullable();
            $table->string('company_name', 255);
            $table->date('application_deadline');
            $table->enum('status', ['draft', 'published', 'closed'])->default('draft');
            $table->boolean('is_featured')->default(false);
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'application_deadline']);
            $table->index(['experience_level', 'employment_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jobs');
    }
};