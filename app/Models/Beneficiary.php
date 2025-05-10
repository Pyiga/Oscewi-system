<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Beneficiary extends Model
{
    protected $fillable = [
        'first_name',
        'last_name',
        'beneficiary_number',
        'date_of_birth',
        'gender',
        'address',
        'nationality',
        'health_background',
        'father_name',
        'father_contact',
        'mother_name',
        'mother_contact',
        'guardian_name',
        'guardian_contact',
        'occupation',
        'emergency_contact',
        'profile_image_path',
        'profile_image_original_name',
        'supporting_documents_paths',
        'supporting_documents_names'
    ];

    protected $casts = [
        'supporting_documents_paths' => 'array',
        'supporting_documents_names' => 'array',
        'date_of_birth' => 'date'
    ];

    protected $attributes = [
        'supporting_documents_paths' => '[]',
        'supporting_documents_names' => '[]'
    ];
}
