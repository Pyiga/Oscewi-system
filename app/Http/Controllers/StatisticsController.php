<?php

namespace App\Http\Controllers;

use App\Models\Beneficiary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StatisticsController extends Controller
{
    public function index()
    {
        // Get total counts
        $totalBeneficiaries = Beneficiary::count();
        $totalParents = Beneficiary::whereNotNull('father_name')
            ->orWhereNotNull('mother_name')
            ->count();
        $totalGuardians = Beneficiary::whereNotNull('guardian_name')->count();
        
        // Calculate document completion percentage
        $completeProfiles = Beneficiary::whereNotNull('profile_image_path')
            ->whereNotNull('supporting_documents_paths')
            ->count();
        $documentCompletion = $totalBeneficiaries > 0 
            ? round(($completeProfiles / $totalBeneficiaries) * 100) 
            : 0;

        // Age distribution
        $ageDistribution = Beneficiary::select(
            DB::raw('CASE 
                WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 0 AND 5 THEN "0-5"
                WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 6 AND 10 THEN "6-10"
                WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 11 AND 15 THEN "11-15"
                WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 16 AND 20 THEN "16-20"
                ELSE "21+"
            END as age'),
            DB::raw('COUNT(*) as count')
        )
        ->groupBy('age')
        ->get();

        // Location distribution
        $locationData = Beneficiary::select('address', DB::raw('COUNT(*) as count'))
            ->groupBy('address')
            ->orderByDesc('count')
            ->limit(5)
            ->get();

        // Gender distribution
        $genderData = Beneficiary::select('gender', DB::raw('COUNT(*) as value'))
            ->groupBy('gender')
            ->get();

        // Guardian type distribution
        $guardianTypeData = Beneficiary::select(
            DB::raw('CASE 
                WHEN father_name IS NOT NULL AND mother_name IS NOT NULL THEN "Both Parents"
                WHEN father_name IS NOT NULL OR mother_name IS NOT NULL THEN "Single Parent"
                WHEN guardian_name IS NOT NULL THEN "Guardian"
                ELSE "Other"
            END as type'),
            DB::raw('COUNT(*) as value')
        )
        ->groupBy('type')
        ->get();

        // Occupation distribution
        $occupationData = Beneficiary::select('occupation', DB::raw('COUNT(*) as count'))
            ->whereNotNull('occupation')
            ->groupBy('occupation')
            ->orderByDesc('count')
            ->limit(5)
            ->get();

        // Most common location
        $mostCommonLocation = Beneficiary::select('address', DB::raw('COUNT(*) as count'))
            ->groupBy('address')
            ->orderByDesc('count')
            ->first();

        // Most common occupation
        $mostCommonOccupation = Beneficiary::select('occupation', DB::raw('COUNT(*) as count'))
            ->whereNotNull('occupation')
            ->groupBy('occupation')
            ->orderByDesc('count')
            ->first();

        // Guardian coverage percentage
        $guardianCoverage = $totalBeneficiaries > 0 
            ? round(($totalGuardians / $totalBeneficiaries) * 100) 
            : 0;

        return Inertia::render('statistics', [
            'statistics' => [
                'totalBeneficiaries' => $totalBeneficiaries,
                'totalParents' => $totalParents,
                'totalGuardians' => $totalGuardians,
                'documentCompletion' => $documentCompletion,
                'ageDistribution' => $ageDistribution,
                'locationData' => $locationData,
                'genderData' => $genderData,
                'guardianTypeData' => $guardianTypeData,
                'occupationData' => $occupationData,
                'mostCommonLocation' => $mostCommonLocation,
                'mostCommonOccupation' => $mostCommonOccupation,
                'guardianCoverage' => $guardianCoverage,
            ],
        ]);
    }
} 