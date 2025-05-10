import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { CustomTextarea } from '@/components/ui/custom-textarea'; // Replaced by LocalCustomTextarea or ensure it's used if preferred
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { ArrowLeft, Upload, UserRound, LoaderCircle, FileText } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface BeneficiaryFromServer {
    id: number;
    first_name: string;
    last_name: string;
    beneficiary_number: string;
    date_of_birth: string; // Expected as YYYY-MM-DD or a parsable date string
    gender: string;
    nationality: string;
    address: string;
    father_name: string;
    father_contact: string;
    mother_name: string;
    mother_contact: string;
    guardian_name: string;
    guardian_contact: string;
    occupation: string;
    health_background: string;
    emergency_contact: string;
    profile_image_path: string | null;
    supporting_documents_paths: string | null; // JSON string array of paths
    supporting_documents_names?: string | null; // JSON string array of names
}

interface BeneficiariesFormProps {
    beneficiary?: BeneficiaryFromServer;
    isEdit?: boolean;
    isView?: boolean;
}

interface DocumentPreview {
    id: string; // Unique ID: path for existing, generated for new
    name: string;
    url: string; // Display URL: server path for existing, blob URL for new
    isNew: boolean;
    file?: File; // Original file object for new uploads
}

const formatDateForInput = (dateString: string | undefined | null): string => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return ''; // Invalid date
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    } catch (e) {
        console.error("Error formatting date:", e);
        return '';
    }
};

export default function BeneficiariesForm({ beneficiary, isEdit = false, isView = false }: BeneficiariesFormProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [supportingDocumentsPreview, setSupportingDocumentsPreview] = useState<DocumentPreview[]>([]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `${isView ? 'View' : isEdit ? 'Edit' : 'Register'} Pupil`,
            href: isEdit ? route('beneficiaries.edit', beneficiary?.id) : route('beneficiaries.create'),
        },
    ];

    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: beneficiary?.first_name || '',
        last_name: beneficiary?.last_name || '',
        beneficiary_number: beneficiary?.beneficiary_number || '',
        date_of_birth: beneficiary ? formatDateForInput(beneficiary.date_of_birth) : '',
        gender: beneficiary?.gender || '',
        nationality: beneficiary?.nationality || '',
        address: beneficiary?.address || '',
        father_name: beneficiary?.father_name || '',
        father_contact: beneficiary?.father_contact || '',
        mother_name: beneficiary?.mother_name || '',
        mother_contact: beneficiary?.mother_contact || '',
        guardian_name: beneficiary?.guardian_name || '',
        guardian_contact: beneficiary?.guardian_contact || '',
        occupation: beneficiary?.occupation || '',
        health_background: beneficiary?.health_background || '',
        emergency_contact: beneficiary?.emergency_contact || '',
        supporting_documents: null as File[] | null,
        profile_image: null as File | null,
        _method: isEdit ? 'PUT' : 'POST',
    });

    useEffect(() => {
        if (beneficiary?.profile_image_path) {
            setImagePreview(`/storage/${beneficiary.profile_image_path}`); // Assuming /storage/ prefix for public assets
        } else {
            setImagePreview(null);
        }

        const initialDocs: DocumentPreview[] = [];
        if (beneficiary?.supporting_documents_paths) {
            try {
                    // Ensure paths is a non-empty string before parsing
                    const paths = beneficiary.supporting_documents_paths.trim() ? JSON.parse(beneficiary.supporting_documents_paths) as string[] : [];
                const namesString = beneficiary.supporting_documents_names;
                    // Ensure namesString is a non-empty string before parsing
                    const names = namesString && namesString.trim() ? (JSON.parse(namesString) as string[]) : [];
                
                if (Array.isArray(paths)) {
                    paths.forEach((path, index) => {
                        initialDocs.push({
                            id: path,
                            name: names[index] || path.split('/').pop() || 'document',
                            url: `/storage/${path}`, // Consistent prefix
                            isNew: false,
                        });
                    });
                }
            } catch (error) {
                console.error("Failed to parse supporting documents paths/names:", error);
                toast.error("Error loading existing documents.");
            }
        }
        setSupportingDocumentsPreview(initialDocs);
        // Reset file input data in the form state when beneficiary changes
        setData('supporting_documents', null); 
    }, [beneficiary, setData]); // setData is stable, beneficiary is the main trigger

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setData('profile_image', file);
        }
    };

    const handleSupportingDocumentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        // Append new files to existing new files in form data
        setData('supporting_documents', [...(data.supporting_documents || []), ...files]);
        
        const newPreviews: DocumentPreview[] = files.map(file => ({
            id: crypto.randomUUID(),
            name: file.name,
            url: URL.createObjectURL(file),
            isNew: true,
            file: file,
        }));
        setSupportingDocumentsPreview(prev => [...prev, ...newPreviews]);
    };

    const handleRemoveNewDocument = (docIdToRemove: string) => {
        const docToRemove = supportingDocumentsPreview.find(doc => doc.id === docIdToRemove);
        if (docToRemove?.isNew && docToRemove.url.startsWith('blob:')) {
            URL.revokeObjectURL(docToRemove.url);
        }
    
        setSupportingDocumentsPreview(prev => prev.filter(doc => doc.id !== docIdToRemove));
        // Remove the corresponding file from the form data
        if (data.supporting_documents) {
            setData('supporting_documents', data.supporting_documents.filter(file => file !== docToRemove?.file));
        }
    };

    useEffect(() => {
        return () => {
            supportingDocumentsPreview.forEach(doc => {
                if (doc.isNew && doc.url.startsWith('blob:')) {
                    URL.revokeObjectURL(doc.url); // Clean up blob URLs on unmount or when previews change
                }
            });
        };
    }, [supportingDocumentsPreview]);

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Validate required fields
        const requiredFields = [
            'first_name',
            'last_name',
            'beneficiary_number',
            'date_of_birth',
            'gender',
            'address',
            'nationality'
        ] as const;

        const missingFields = requiredFields.filter(field => !data[field]);
        if (missingFields.length > 0) {
            toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`, {
                duration: 5000,
                position: 'top-right',
            });
            return;
        }

        // Create a new object with only the necessary data
        const formData = {
            first_name: data.first_name,
            last_name: data.last_name,
            beneficiary_number: data.beneficiary_number,
            date_of_birth: data.date_of_birth,
            gender: data.gender,
            nationality: data.nationality,
            address: data.address,
            father_name: data.father_name || '',
            father_contact: data.father_contact || '',
            mother_name: data.mother_name || '',
            mother_contact: data.mother_contact || '',
            guardian_name: data.guardian_name || '',
            guardian_contact: data.guardian_contact || '',
            occupation: data.occupation || '',
            health_background: data.health_background || '',
            emergency_contact: data.emergency_contact || '',
            profile_image: data.profile_image,
            supporting_documents: data.supporting_documents,
            _method: isEdit ? 'PUT' : 'POST'
        };

        // Submit the form
        if (isEdit && beneficiary?.id) {
            post(route('beneficiaries.update', beneficiary.id), {
                ...formData,
                onSuccess: () => {
                    toast.success('Beneficiary updated successfully!', {
                        duration: 3000,
                        position: 'top-right',
                        style: {
                            background: '#008080',
                            color: '#fff',
                        },
                    });
                    router.visit(route('beneficiaries.index'), { preserveState: false });
                },
                onError: (formErrors) => {
                    console.error('Update errors:', formErrors);
                    handleFormErrors(formErrors);
                }
            });
        } else {
            post(route('beneficiaries.store'), {
                ...formData,
                onSuccess: () => {
                    reset();
                    setImagePreview(null);
                    setSupportingDocumentsPreview([]);
                    toast.success('Beneficiary registered successfully!', {
                        duration: 3000,
                        position: 'top-right',
                        style: {
                            background: '#008080',
                            color: '#fff',
                        },
                    });
                    router.visit(route('beneficiaries.index'), { preserveState: false });
                },
                onError: (formErrors) => {
                    console.error('Registration errors:', formErrors);
                    handleFormErrors(formErrors);
                }
            });
        }
    };

    const handleFormErrors = (formErrors: Record<string, string>) => {
        // Log all errors for debugging
        console.log('Form submission errors:', formErrors);

        // Check for database error
        if (formErrors.error) {
            toast.error(formErrors.error, {
                duration: 5000,
                position: 'top-right'
            });
            return;
        }

        // Handle specific error cases
        if (formErrors.beneficiary_number) {
            toast.error(formErrors.beneficiary_number, {
                duration: 5000,
                position: 'top-right'
            });
        }

        // Handle file-related errors
        if (formErrors.profile_image) {
            toast.error(`Profile image: ${formErrors.profile_image}`, {
                duration: 5000,
                position: 'top-right'
            });
        }

        if (formErrors.supporting_documents) {
            toast.error(`Supporting documents: ${formErrors.supporting_documents}`, {
                duration: 5000,
                position: 'top-right'
            });
        }

        // Handle other validation errors
        const otherErrors = Object.entries(formErrors)
            .filter(([key]) => !['error', 'beneficiary_number', 'profile_image', 'supporting_documents'].includes(key))
            .map(([_, value]) => value);

        if (otherErrors.length > 0) {
            toast.error(`Please correct the following: ${otherErrors.join('; ')}`, {
                duration: 6000,
                position: 'top-right',
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${isView ? 'View' : isEdit ? 'Edit' : 'Register'} Beneficiary`} />
            <div className="flex flex-col gap-4 p-4 max-w-7xl mx-auto w-full">
                <div className="ml-auto">
                    <Link
                        href={route('beneficiaries.index')}
                        className="text-md flex w-fit cursor-pointer items-center rounded-lg bg-[#008080] px-4 py-2 text-white hover:opacity-90"
                        as="button"
                    >
                        <ArrowLeft className="me-2" /> Back
                    </Link>
                </div>

                <Card className="border-sidebar-border/70 dark:border-sidebar-border shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-center text-[#008080]">
                            {isView ? 'Beneficiary Details' : isEdit ? 'Edit Beneficiary Profile' : 'Beneficiary Registration Form'}
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={submit} className="flex flex-col gap-6">
                            {/* Personal Information */}
                            <section>
                                <h2 className="text-lg font-semibold text-[#008080] mb-4">Personal Information</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    <InputField
                                        id="first_name"
                                        label="First Name"
                                        value={data.first_name}
                                        onChange={(e) => setData('first_name', e.target.value)}
                                        error={errors.first_name}
                                        disabled={isView || processing} />
                                    <InputField
                                        id="last_name"
                                        label="Last Name"
                                        value={data.last_name}
                                        onChange={(e) => setData('last_name', e.target.value)}
                                        error={errors.last_name}
                                        disabled={isView || processing} />
                                    <InputField
                                        id="beneficiary_number"
                                        label="Beneficiary Number"
                                        value={data.beneficiary_number}
                                        onChange={(e) => setData('beneficiary_number', e.target.value)}
                                        error={errors.beneficiary_number}
                                        disabled={isView || processing} />
                                    <InputField
                                        id="date_of_birth"
                                        label="Date of Birth"
                                        type="date"
                                        value={data.date_of_birth}
                                        onChange={(e) => setData('date_of_birth', e.target.value)}
                                        error={errors.date_of_birth}
                                        disabled={isView || processing}
                                    />
                                    <SelectField
                                        id="gender"
                                        label="Gender"
                                        value={data.gender}
                                        onChange={(e) => setData('gender', e.target.value)}
                                        options={['Male', 'Female']}
                                        error={errors.gender}
                                        disabled={isView || processing}
                                    />
                                    <InputField
                                        id="nationality"
                                        label="Nationality"
                                        value={data.nationality}
                                        onChange={(e) => setData('nationality', e.target.value)}
                                        error={errors.nationality}
                                        disabled={isView || processing} />
                                    <InputField
                                        id="address"
                                        label="Address"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        error={errors.address}
                                        disabled={isView || processing} />
                                </div>
                            </section>

                            {/* Parents Information */}
                            <section>
                                <h2 className="text-lg font-semibold text-[#008080] mb-4">Parents Information</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    <InputField
                                        id="father_name"
                                        label="Father's Name"
                                        value={data.father_name}
                                        onChange={(e) => setData('father_name', e.target.value)}
                                        error={errors.father_name}
                                        disabled={isView || processing} />
                                    <InputField
                                        id="father_contact"
                                        label="Father's Contact"
                                        value={data.father_contact}
                                        onChange={(e) => setData('father_contact', e.target.value)}
                                        error={errors.father_contact}
                                        disabled={isView || processing} />
                                    <InputField
                                        id="mother_name"
                                        label="Mother's Name"
                                        value={data.mother_name}
                                        onChange={(e) => setData('mother_name', e.target.value)}
                                        error={errors.mother_name}
                                        disabled={isView || processing} />
                                    <InputField
                                        id="mother_contact"
                                        label="Mother's Contact"
                                        value={data.mother_contact}
                                        onChange={(e) => setData('mother_contact', e.target.value)}
                                        error={errors.mother_contact}
                                        disabled={isView || processing} />
                                </div>
                            </section>

                            {/* Guardian Information */}
                            <section>
                                <h2 className="text-lg font-semibold text-[#008080] mb-4">Guardian Information</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    <InputField
                                        id="guardian_name"
                                        label="Guardian's Name"
                                        value={data.guardian_name}
                                        onChange={(e) => setData('guardian_name', e.target.value)}
                                        error={errors.guardian_name}
                                        disabled={isView || processing} />
                                    <InputField
                                        id="guardian_contact"
                                        label="Guardian's Contact"
                                        value={data.guardian_contact}
                                        onChange={(e) => setData('guardian_contact', e.target.value)}
                                        error={errors.guardian_contact}
                                        disabled={isView || processing} />
                                    <InputField
                                        id="occupation"
                                        label="Occupation"
                                        value={data.occupation}
                                        onChange={(e) => setData('occupation', e.target.value)}
                                        error={errors.occupation}
                                        disabled={isView || processing} />
                                </div>
                            </section>

                            {/* Health Information */}
                            <section>
                                <h2 className="text-lg font-semibold text-[#008080] mb-4">Health Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <LocalCustomTextarea
                                        id="health_background"
                                        label="Health Background"
                                        value={data.health_background}
                                        onChange={(e) => setData('health_background', e.target.value)}
                                        error={errors.health_background}
                                        disabled={isView || processing}
                                        rows={4}
                                    />
                                    <InputField
                                        id="emergency_contact"
                                        label="Emergency Contact"
                                        value={data.emergency_contact}
                                        onChange={(e) => setData('emergency_contact', e.target.value)}
                                        error={errors.emergency_contact}
                                        disabled={isView || processing}
                                    />
                                </div>
                            </section>


                            {/* Profile Image */}
                            <section className="space-y-4">
                                <h2 className="text-lg font-semibold text-[#008080]">Profile Image</h2>
                                <div className="space-y-2">
                                    <label htmlFor="profile_image" className="text-sm font-medium text-gray-700">
                                        Upload Profile Image
                                    </label>
                                    <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 ${isView ? 'opacity-70' : ''}`}>
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-32 h-32 object-cover rounded-md border border-gray-300"
                                            />
                                        ) : beneficiary?.profile_image_path ? (
                                            <img
                                                src={`/storage/${beneficiary.profile_image_path}`}
                                                alt="Profile"
                                                className="w-32 h-32 object-cover rounded-md border border-gray-300"
                                            />
                                        ) : (
                                            <div className="w-32 h-32 flex items-center justify-center border border-gray-300 rounded-md bg-gray-100 text-[#008080]">
                                                <UserRound size={48} />
                                            </div>
                                        )}
                                        <div>
                                            <input
                                                type="file"
                                                id="profile_image"
                                                name="profile_image"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden" // Visually hidden, label triggers it
                                                disabled={isView || processing}
                                            />
                                            {!isView && (
                                                <label
                                                    htmlFor="profile_image"
                                                    className={`inline-flex items-center gap-2 bg-[#008080] text-white px-4 py-2 rounded-md cursor-pointer hover:bg-[#006666] transition ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    <Upload size={16} />
                                                    {imagePreview ? 'Change Image' : 'Upload Image'}
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                    <InputError message={errors.profile_image} />
                                </div>
                            </section>

                            {/* Supporting Documents */}
                            <section className="space-y-4">
                                <h2 className="text-lg font-semibold text-[#008080]">Supporting Documents</h2>
                                {!isView && (
                                    <div className="space-y-2">
                                        <label htmlFor="supporting_documents_input" className="text-sm font-medium text-gray-700">
                                            Upload Supporting Documents (PDF, DOC, DOCX, JPG, PNG)
                                        </label>
                                        <input
                                            type="file"
                                            id="supporting_documents_input" // Unique ID for the input
                                            name="supporting_documents_input"
                                            onChange={handleSupportingDocumentsChange}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008080]"
                                            multiple
                                            accept=".pdf,.doc,.docx,image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                            disabled={isView || processing}
                                        />
                                        <InputError message={errors.supporting_documents as string} />
                                    </div>
                                )}
                                
                                {/* Display existing and newly added document previews */}
                                {(supportingDocumentsPreview.length > 0 || (isView && beneficiary?.supporting_documents_paths && JSON.parse(beneficiary.supporting_documents_paths).length > 0)) && (
                                    <div className="mt-4">
                                        <h3 className="text-sm font-medium text-gray-700 mb-2">
                                            {isView && supportingDocumentsPreview.filter(doc => !doc.isNew).length === 0 
                                                ? 'No Documents Uploaded' 
                                                : 'Uploaded Documents:'}
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                            {supportingDocumentsPreview.map((doc) => (
                                                <div key={doc.id} className="relative group">
                                                    <a
                                                        href={doc.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="block p-2 border border-gray-300 rounded-md hover:border-[#008080] transition"
                                                    >
                                                        <div className="aspect-square flex items-center justify-center bg-gray-100 rounded">
                                                            <FileText size={24} className="text-[#008080]" />
                                                        </div>
                                                        <p className="mt-1 text-xs text-gray-600 truncate" title={doc.name}>
                                                            {doc.name}
                                                        </p>
                                                    </a>
                                                    {!isView && doc.isNew && ( // Show remove button only for new files in edit/create mode
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveNewDocument(doc.id)}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                                                            aria-label="Remove document"
                                                        >
                                                            &times; {/* Multiplication sign for 'X' */}
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </section>

                            {!isView && (
                                <Button 
                                    type="submit" 
                                    className="w-fit bg-[#008080] hover:bg-[#006666] text-white px-6 py-2 rounded-md transition-colors" 
                                    disabled={processing}
                                >
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                    {isEdit ? 'Update Profile' : 'Save Profile'}
                                </Button>
                            )}
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

const InputField = ({ id, label, value, onChange, type = 'text', error, disabled }: { id: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; error?: string; disabled?: boolean }) => (
    <div className="space-y-1">
        <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>
        <input
            type={type}
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            className={`w-full rounded-md border ${error ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008080] ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            disabled={disabled}
        />
        <InputError message={error} />
    </div>
);

const SelectField = ({ id, label, value, onChange, options, error, disabled }: { id: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: string[]; error?: string; disabled?: boolean }) => (
    <div className="space-y-1">
        <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>
        <select
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            className={`w-full rounded-md border ${error ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008080] ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            disabled={disabled}
        >
            <option value="">Select {label}</option>
            {options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
            ))}
        </select>
        <InputError message={error} />
    </div>
);

const LocalCustomTextarea = ({ id, label, value, onChange, placeholder, rows = 3, error, disabled }: { id: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; placeholder?: string; rows?: number; error?: string; disabled?: boolean }) => (
    <div>
        <label htmlFor={id} className="text-sm font-medium block mb-1">{label}</label>
        <textarea
            id={id}
            name={id}
            rows={rows}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#008080] ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            disabled={disabled}
        />
        <InputError message={error} />
    </div>
);