<?php

namespace App\Http\Controllers;

use App\Http\Requests\BeneficiaryFormRequest;
use App\Models\Beneficiary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BeneficiaryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
   /* {
        return Inertia::render('beneficiaries/index');
    }*/
    {
        $beneficiariesQuery = Beneficiary::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $beneficiariesQuery->where(function ($query) use ($search) {
                $query->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('beneficiary_number', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%");
                // Add other fields you want to search
            });
        }

        $beneficiaries = $beneficiariesQuery->latest()->paginate(10)->withQueryString();

        return Inertia::render('beneficiaries/index', [
            'beneficiaries' => $beneficiaries,
            'filters' => $request->only(['search']),
        ]);
    } 

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('beneficiaries/beneficiariesForm');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\BeneficiaryFormRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(BeneficiaryFormRequest $request)
    {
        try {
            \Log::info('Store request data:', $request->all());
            \Log::info('Request headers:', $request->headers->all());
            
            $data = $request->validated();
            \Log::info('Validated data:', $data);
            
            // Handle profile image upload
            if ($request->hasFile('profile_image')) {
                try {
                    $profileImage = $request->file('profile_image');
                    \Log::info('Profile image details:', [
                        'original_name' => $profileImage->getClientOriginalName(),
                        'mime_type' => $profileImage->getMimeType(),
                        'size' => $profileImage->getSize()
                    ]);
                    $originalName = $profileImage->getClientOriginalName();
                    $extension = $profileImage->getClientOriginalExtension();
                    $filename = time() . '_' . $originalName;
                    
                    // Store in storage/app/public/profiles
                    $path = $profileImage->storeAs('profiles', $filename, 'public');
                    if (!$path) {
                        throw new \Exception('Failed to store profile image');
                    }
                    $data['profile_image_path'] = $path;
                    $data['profile_image_original_name'] = $originalName;
                    \Log::info('Profile image uploaded:', ['path' => $path, 'original_name' => $originalName]);
                } catch (\Exception $e) {
                    \Log::error('Profile image upload failed: ' . $e->getMessage());
                    throw new \Exception('Failed to upload profile image: ' . $e->getMessage());
                }
            }

            // Handle supporting documents upload
            if ($request->hasFile('supporting_documents')) {
                try {
                    $documentPaths = [];
                    $documentNames = [];
                    
                    foreach ($request->file('supporting_documents') as $document) {
                        $originalName = $document->getClientOriginalName();
                        $extension = $document->getClientOriginalExtension();
                        $filename = time() . '_' . $originalName;
                        
                        // Store in storage/app/public/documents/{beneficiary_number}
                        $path = $document->storeAs('documents/' . $data['beneficiary_number'], $filename, 'public');
                        if (!$path) {
                            throw new \Exception('Failed to store supporting document: ' . $originalName);
                        }
                        
                        $documentPaths[] = $path;
                        $documentNames[] = $originalName;
                    }
                    
                    $data['supporting_documents_paths'] = json_encode($documentPaths);
                    $data['supporting_documents_names'] = json_encode($documentNames);
                    \Log::info('Supporting documents uploaded:', [
                        'paths' => $documentPaths,
                        'names' => $documentNames
                    ]);
                } catch (\Exception $e) {
                    \Log::error('Supporting documents upload failed: ' . $e->getMessage());
                    throw new \Exception('Failed to upload supporting documents: ' . $e->getMessage());
                }
            }

            // Create the beneficiary record
            try {
                $beneficiary = Beneficiary::create($data);
                if (!$beneficiary) {
                    throw new \Exception('Failed to create beneficiary record');
                }
                \Log::info('Beneficiary created:', ['id' => $beneficiary->id]);

                return redirect()->route('beneficiaries.index')
                    ->with('success', 'Beneficiary registered successfully.');
            } catch (\Exception $e) {
                \Log::error('Database error during beneficiary creation: ' . $e->getMessage());
                \Log::error('SQL State: ' . ($e instanceof \Illuminate\Database\QueryException ? $e->getSqlState() : 'N/A'));
                \Log::error('Error Code: ' . ($e instanceof \Illuminate\Database\QueryException ? $e->getCode() : 'N/A'));
                \Log::error('Data being inserted: ' . json_encode($data));
                throw new \Exception('Database error occurred while creating beneficiary record: ' . $e->getMessage());
            }

        } catch (\Exception $e) {
            \Log::error('Beneficiary registration failed: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            \Log::error('Request data: ' . json_encode($request->all()));
            
            // Check if it's a validation error
            if ($e instanceof \Illuminate\Validation\ValidationException) {
                return redirect()->back()
                    ->withErrors($e->errors())
                    ->withInput();
            }
            
            // Check if it's a database error
            if ($e instanceof \Illuminate\Database\QueryException) {
                \Log::error('Database error: ' . $e->getMessage());
                return redirect()->back()
                    ->withErrors(['error' => 'Database error occurred. Please try again.'])
                    ->withInput();
            }
            
            // Check if it's a file storage error
            if ($e instanceof \Illuminate\Contracts\Filesystem\FileNotFoundException) {
                \Log::error('File storage error: ' . $e->getMessage());
                return redirect()->back()
                    ->withErrors(['error' => 'File storage error occurred. Please try again.'])
                    ->withInput();
            }
            
            return redirect()->back()
                ->withErrors(['error' => $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Beneficiary  $beneficiary
     * @return \Inertia\Response
     */
    public function show(Beneficiary $beneficiary)
    {
        return Inertia::render('beneficiaries/view', [
            'beneficiary' => $beneficiary,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Beneficiary  $beneficiary
     * @return \Inertia\Response
     */
    public function edit(Beneficiary $beneficiary)
    {
        return Inertia::render('beneficiaries/beneficiariesForm', [
            'beneficiary' => $beneficiary,
            'isEdit' => true,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\BeneficiaryFormRequest  $request
     * @param  \App\Models\Beneficiary  $beneficiary
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(BeneficiaryFormRequest $request, Beneficiary $beneficiary)
    {
        try {
            \Log::info('Update request data:', $request->all());
            
            $data = $request->validated();
            \Log::info('Validated data:', $data);
            
            // Handle profile image update
            if ($request->hasFile('profile_image')) {
                // Delete the old image if it exists
                if ($beneficiary->profile_image_path) {
                    Storage::disk('public')->delete($beneficiary->profile_image_path);
                    Log::info('Old profile image deleted:', ['path' => $beneficiary->profile_image_path]);
                }
                $profileImage = $request->file('profile_image');
                $originalName = $profileImage->getClientOriginalName();
                $filename = time() . '_' . $originalName;
                // Store in storage/app/public/profiles
                $path = $profileImage->storeAs('profiles', $filename, 'public');
                if (!$path) {
                    throw new \Exception('Failed to store updated profile image');
                }
                $data['profile_image_path'] = $path;
                $data['profile_image_original_name'] = $profileImage->getClientOriginalName();
                Log::info('Profile image updated:', ['path' => $path, 'original_name' => $originalName]);
            } else {
                // If no new profile image is uploaded, ensure we don't accidentally nullify the existing path
                // by unsetting it from $data if it wasn't part of validated() and not 'nullable' in a specific way.
                // However, if 'profile_image' is nullable and not sent, validated() might not include it.
                // It's often safer to only set $data['profile_image_path'] if a new file is uploaded.
                // The Beneficiary model should handle not updating fields that aren't in the $data array.
            }

            // Handle supporting documents update
            if ($request->hasFile('supporting_documents')) {
                // 1. Delete all old supporting documents for this beneficiary
                if ($beneficiary->supporting_documents_paths) {
                    $oldDocumentPaths = json_decode($beneficiary->supporting_documents_paths, true);
                    if (is_array($oldDocumentPaths)) {
                        foreach ($oldDocumentPaths as $oldPath) {
                            Storage::disk('public')->delete($oldPath);
                        }
                        Log::info('Old supporting documents deleted for beneficiary ID: ' . $beneficiary->id);
                    }
                }

                // 2. Store new documents
                $newDocumentPaths = [];
                $newDocumentNames = [];
                foreach ($request->file('supporting_documents') as $document) {
                    $originalName = $document->getClientOriginalName();
                    $filename = time() . '_' . $originalName;
                    // Store in storage/app/public/documents/{beneficiary_number}
                    $path = $document->storeAs('documents/' . $beneficiary->beneficiary_number, $filename, 'public');
                    if (!$path) {
                        throw new \Exception('Failed to store updated supporting document: ' . $originalName);
                    }
                    $newDocumentPaths[] = $path;
                    $newDocumentNames[] = $originalName;
                }
                $data['supporting_documents_paths'] = json_encode($newDocumentPaths);
                $data['supporting_documents_names'] = json_encode($newDocumentNames); // Also update names
                Log::info('Supporting documents updated:', ['paths' => $newDocumentPaths, 'names' => $newDocumentNames]);
            } else {
                // If no new supporting documents are uploaded, we typically want to keep the existing ones.
                // So, we don't modify $data['supporting_documents_paths'] or $data['supporting_documents_names'].
                // The update will only apply fields present in $data.
            }

            $beneficiary->update($data);
            \Log::info('Beneficiary updated:', ['id' => $beneficiary->id]);

            return redirect()->route('beneficiaries.index')
                ->with('success', 'Beneficiary updated successfully.');

        } catch (\Exception $e) {
            \Log::error('Beneficiary update failed: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            return redirect()->back()
                ->withErrors(['error' => 'Unable to update beneficiary. Please try again.'])
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Beneficiary  $beneficiary
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Beneficiary $beneficiary)
    {
        try {
            // Delete associated profile image
            if ($beneficiary->profile_image_path) {
                Storage::disk('public')->delete($beneficiary->profile_image_path);
            }

            // Delete associated supporting documents directory (and its contents)
            $documentsDirectory = 'documents/' . $beneficiary->beneficiary_number;
            if (Storage::disk('public')->exists($documentsDirectory)) {
                Storage::disk('public')->deleteDirectory($documentsDirectory);
            }

            $beneficiary->delete();

            return redirect()->route('beneficiaries.index')
                ->with('success', 'Beneficiary deleted successfully.');

        } catch (\Exception $e) {
            \Log::error('Beneficiary deletion failed: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            return redirect()->back()
                ->withErrors(['error' => 'Unable to delete beneficiary. Please try again.']);
        }
    }
}
