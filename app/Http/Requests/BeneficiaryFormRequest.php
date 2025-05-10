<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;

class BeneficiaryFormRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $isUpdate = $this->isMethod('PUT') || $this->isMethod('PATCH');
        $beneficiaryId = $this->route('beneficiary')?->id;

        return [
            'first_name' => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z\s]+$/'],
            'last_name' => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z\s]+$/'],
            'beneficiary_number' => [
                'required',
                'string',
                'max:255',
                Rule::unique('beneficiaries')->ignore($beneficiaryId),
            ],
            'date_of_birth' => ['required', 'date'],
            'gender' => ['required', 'string', 'in:Male,Female'],
            'nationality' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string', 'max:255'],
            'father_name' => ['nullable', 'string', 'max:255', 'regex:/^[a-zA-Z\s]+$/'],
            'father_contact' => ['nullable', 'string', 'max:255'],
            'mother_name' => ['nullable', 'string', 'max:255', 'regex:/^[a-zA-Z\s]+$/'],
            'mother_contact' => ['nullable', 'string', 'max:255'],
            'guardian_name' => ['nullable', 'string', 'max:255', 'regex:/^[a-zA-Z\s]+$/'],
            'guardian_contact' => ['nullable', 'string', 'max:255'],
            'occupation' => ['nullable', 'string', 'max:255'],
            'health_background' => ['nullable', 'string'],
            'emergency_contact' => ['nullable', 'string', 'max:255'],
            'profile_image' => ['nullable', 'image', 'max:2048'],
            'supporting_documents.*' => ['nullable', 'file', 'max:5120'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'first_name.required' => 'First name is required',
            'first_name.regex' => 'First name should only contain letters and spaces',
            'last_name.required' => 'Last name is required',
            'last_name.regex' => 'Last name should only contain letters and spaces',
            'beneficiary_number.required' => 'Beneficiary number is required',
            'beneficiary_number.unique' => 'This beneficiary number is already in use',
            'date_of_birth.required' => 'Date of birth is required',
            'date_of_birth.date' => 'Date of birth must be a valid date',
            'gender.required' => 'Gender is required',
            'nationality.required' => 'Nationality is required',
            'address.required' => 'Address is required',
            'father_name.regex' => 'Father\'s name should only contain letters and spaces',
            'mother_name.regex' => 'Mother\'s name should only contain letters and spaces',
            'guardian_name.regex' => 'Guardian\'s name should only contain letters and spaces',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'first_name' => trim($this->first_name),
            'last_name' => trim($this->last_name),
            'beneficiary_number' => trim($this->beneficiary_number),
            'father_name' => trim($this->father_name),
            'mother_name' => trim($this->mother_name),
            'guardian_name' => trim($this->guardian_name),
        ]);
    }
}
