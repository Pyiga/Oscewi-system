<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\EventController;
use App\Models\Event;
use App\Models\Beneficiary;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\StatisticsController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        $events = Event::latest()->take(5)->get();
        $recentBeneficiaries = Beneficiary::latest()->take(4)->get();

        // Get statistics data
        $totalPupils = Beneficiary::count();
        $malePupils = Beneficiary::where('gender', 'male')->count();
        $femalePupils = Beneficiary::where('gender', 'female')->count();

        // Get parents data (using beneficiaries with parent information)
        $totalParents = Beneficiary::whereNotNull('father_name')
            ->orWhereNotNull('mother_name')
            ->count();

        // Get guardians data
        $totalGuardians = Beneficiary::whereNotNull('guardian_name')->count();

        // Get upcoming programs data
        $upcomingEvents = Event::where('date', '>=', now())
            ->where('date', '<=', now()->addDays(7))
            ->count();
        
        $upcomingMeetings = Event::where('date', '>=', now())
            ->where('date', '<=', now()->addDays(30))
            ->where('type', 'meeting')
            ->count();
        
        $upcomingActivities = Event::where('date', '>=', now())
            ->where('date', '<=', now()->addDays(7))
            ->where('type', 'activity')
            ->count();

        return Inertia::render('dashboard', [
            'events' => $events,
            'recentBeneficiaries' => $recentBeneficiaries,
            'statistics' => [
                'totalPupils' => [
                    'total' => $totalPupils,
                    'male' => $malePupils,
                    'female' => $femalePupils,
                ],
                'parents' => [
                    'total' => $totalParents,
                ],
                'guardians' => [
                    'total' => $totalGuardians,
                ],
                'upcomingPrograms' => [
                    'events' => $upcomingEvents,
                    'meetings' => $upcomingMeetings,
                    'activities' => $upcomingActivities,
                ],
            ],
        ]);
    })->name('dashboard');

    // Add new route for adding users
    Route::get('/users/create', [App\Http\Controllers\Auth\RegisteredUserController::class, 'create'])
        ->name('users.create');
    Route::post('/users', [App\Http\Controllers\Auth\RegisteredUserController::class, 'store'])
        ->name('users.store');

    Route::get('reports', function () {
        return Inertia::render('reports');
    })->name('reports');

    Route::get('/statistics', [StatisticsController::class, 'index'])->name('statistics');

    Route::get('events', [App\Http\Controllers\EventController::class, 'index'])->name('events.index');
    Route::post('events', [App\Http\Controllers\EventController::class, 'store'])->name('events.store');
    Route::put('events/{event}', [App\Http\Controllers\EventController::class, 'update'])->name('events.update');
    Route::delete('events/{event}', [App\Http\Controllers\EventController::class, 'destroy'])->name('events.destroy');
    Route::put('/events/{event}/status', [EventController::class, 'updateStatus'])->name('events.status.update');

    Route::get('beneficiaries', [App\Http\Controllers\BeneficiaryController::class, 'index'])->name('beneficiaries.index');
    Route::get('beneficiaries/create', [App\Http\Controllers\BeneficiaryController::class, 'create'])->name('beneficiaries.create');
    Route::post('beneficiaries', [App\Http\Controllers\BeneficiaryController::class, 'store'])->name('beneficiaries.store');
    Route::get('beneficiaries/{beneficiary}', [App\Http\Controllers\BeneficiaryController::class, 'show'])->name('beneficiaries.show');
    Route::get('beneficiaries/{beneficiary}/edit', [App\Http\Controllers\BeneficiaryController::class, 'edit'])->name('beneficiaries.edit');
    Route::put('beneficiaries/{beneficiary}', [App\Http\Controllers\BeneficiaryController::class, 'update'])->name('beneficiaries.update');
    Route::delete('beneficiaries/{beneficiary}', [App\Http\Controllers\BeneficiaryController::class, 'destroy'])->name('beneficiaries.destroy');
    Route::get('beneficiaries/{beneficiary}/documents', [App\Http\Controllers\BeneficiaryController::class, 'documents'])->name('beneficiaries.documents');
    Route::post('beneficiaries/{beneficiary}/documents', [App\Http\Controllers\BeneficiaryController::class, 'storeDocument'])->name('beneficiaries.documents.store');
    Route::delete('beneficiaries/{beneficiary}/documents/{document}', [App\Http\Controllers\BeneficiaryController::class, 'destroyDocument'])->name('beneficiaries.documents.destroy');
    Route::get('beneficiaries/{beneficiary}/documents/{document}/download', [App\Http\Controllers\BeneficiaryController::class, 'downloadDocument'])->name('beneficiaries.documents.download');
    Route::get('beneficiaries/{beneficiary}/documents/{document}/preview', [App\Http\Controllers\BeneficiaryController::class, 'previewDocument'])->name('beneficiaries.documents.preview');
    Route::get('beneficiaries/{beneficiary}/documents/{document}/delete', [App\Http\Controllers\BeneficiaryController::class, 'deleteDocument'])->name('beneficiaries.documents.delete');
    Route::get('beneficiaries/{beneficiary}/documents/{document}/restore', [App\Http\Controllers\BeneficiaryController::class, 'restoreDocument'])->name('beneficiaries.documents.restore');
    Route::get('beneficiaries/{beneficiary}/documents/{document}/force-delete', [App\Http\Controllers\BeneficiaryController::class, 'forceDeleteDocument'])->name('beneficiaries.documents.force-delete');
    Route::get('beneficiaries/{beneficiary}/documents/{document}/edit', [App\Http\Controllers\BeneficiaryController::class, 'editDocument'])->name('beneficiaries.documents.edit');
    Route::put('beneficiaries/{beneficiary}/documents/{document}', [App\Http\Controllers\BeneficiaryController::class, 'updateDocument'])->name('beneficiaries.documents.update');

    // Analytics routes
    Route::get('/api/analytics/monthly', function () {
        $monthlyData = DB::table('beneficiaries')
            ->selectRaw('
                DATE_FORMAT(created_at, "%Y-%m") as month,
                COUNT(*) as beneficiaries,
                COUNT(DISTINCT CASE WHEN father_name IS NOT NULL OR mother_name IS NOT NULL 
                    THEN CONCAT(COALESCE(father_name, ""), COALESCE(mother_name, "")) 
                    ELSE NULL END) as parents
            ')
            ->groupBy('month')
            ->orderBy('month')
            ->limit(12)
            ->get()
            ->map(function ($item) {
                $date = new DateTime($item->month . '-01');
                return [
                    'month' => $date->format('M'),
                    'date' => $item->month . '-01',
                    'beneficiaries' => (int)$item->beneficiaries,
                    'parents' => (int)$item->parents
                ];
            });

        // Ensure we have all months, even if there's no data
        $allMonths = [];
        $currentYear = date('Y');
        for ($i = 1; $i <= 12; $i++) {
            $date = new DateTime("$currentYear-$i-01");
            $monthKey = $date->format('M');
            $monthData = $monthlyData->firstWhere('month', $monthKey);
            
            $allMonths[] = [
                'month' => $monthKey,
                'date' => $date->format('Y-m-d'),
                'beneficiaries' => $monthData ? $monthData['beneficiaries'] : 0,
                'parents' => $monthData ? $monthData['parents'] : 0
            ];
        }

        return response()->json($allMonths);
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
