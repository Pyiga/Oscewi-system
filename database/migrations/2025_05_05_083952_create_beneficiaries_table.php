<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('beneficiaries', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('beneficiary_number')->unique();
            $table->date('date_of_birth');
            $table->string('gender');
            $table->text('address');
            $table->string('nationality');
            $table->text('health_background')->nullable();
            $table->string('father_name')->nullable();
            $table->string('father_contact')->nullable();
            $table->string('mother_name')->nullable();
            $table->string('mother_contact')->nullable();
            $table->string('guardian_name')->nullable();
            $table->string('guardian_contact')->nullable();
            $table->string('occupation')->nullable();
            $table->string('emergency_contact')->nullable();
            $table->string('profile_image_path')->nullable();
            $table->string('profile_image_original_name')->nullable();
            $table->json('supporting_documents_paths')->nullable();
            $table->json('supporting_documents_names')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('beneficiaries');
    }
};