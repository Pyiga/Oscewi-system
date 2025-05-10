import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Download, Mail, Phone, MapPin, Calendar, User, FileText } from 'lucide-react';
import React from 'react';
import Profile from '../settings/profile';

interface Beneficiary {
    id: number;
    first_name: string;
    last_name: string;
    beneficiary_number: string;
    date_of_birth: string;
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
    profile_image_path: string;
    supporting_documents_paths: string;
}

interface Props {
    beneficiary: Beneficiary;
}

export default function BeneficiaryView({ beneficiary }: Props) {
    const calculateAge = (dateOfBirth: string) => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Beneficiaries',
            href: route('beneficiaries.index'),
        },
        {
            title: 'View Beneficiary',
            href: route('beneficiaries.show', beneficiary.id),
        },
    ];

    const downloadDocuments = () => {
        const documents = JSON.parse(beneficiary.supporting_documents_paths || '[]');
        documents.forEach((doc: string) => {
            const link = document.createElement('a');
            link.href = `/${doc}`;
            link.download = doc.split('/').pop() || 'document';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="View Beneficiary" />
            <div className="flex flex-col gap-4 p-4 max-w-7xl mx-auto w-full">
                <div className="flex justify-between items-center">
                    <Link
                        href={route('beneficiaries.index')}
                        className="text-md flex w-fit cursor-pointer items-center rounded-lg bg-[#008080] px-4 py-2 text-white hover:opacity-90"
                        as="button"
                    >
                        <ArrowLeft className="me-2" /> Back to List
                    </Link>
                    <Button
                        onClick={downloadDocuments}
                        className="bg-[#008080] hover:bg-[#006666] text-white"
                    >
                        <Download className="me-2 h-4 w-4" />
                        Support Documents
                    </Button>
                </div>

                <Card className="border-sidebar-border/70 dark:border-sidebar-border shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-center text-[#008080]">
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                    {beneficiary.first_name} {beneficiary.last_name} - Beneficiary Profile
                                </h1>
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        {/* Profile Header */}
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 p-4 bg-gray-50 rounded-lg">
                            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-[#008080]">
                                {beneficiary.profile_image_path ? (
                                    <img
                                        src={`/${beneficiary.profile_image_path}`}
                                        alt={`${beneficiary.first_name} ${beneficiary.last_name}`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-[#008080]">
                                        <User size={64} />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                    {beneficiary.first_name} {beneficiary.last_name}
                                </h1>
                                <p className="text-gray-600 mb-1">
                                    <span className="font-semibold">Beneficiary Number:</span> {beneficiary.beneficiary_number}
                                </p>
                                <p className="text-gray-600 mb-1">
                                    <span className="font-semibold">Age:</span> {calculateAge(beneficiary.date_of_birth)} years
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-semibold">Gender:</span> {beneficiary.gender}
                                </p>
                            </div>
                        </div>

                        {/* Personal Information */}
                        <section className="mb-8">
                            <h2 className="text-lg font-semibold text-[#008080] mb-4 flex items-center">
                                <User className="mr-2 h-5 w-5" />
                                Personal Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <InfoCard
                                    icon={<Calendar className="h-5 w-5" />}
                                    label="Date of Birth"
                                    value={new Date(beneficiary.date_of_birth).toLocaleDateString()}
                                />
                                <InfoCard
                                    icon={<MapPin className="h-5 w-5" />}
                                    label="Address"
                                    value={beneficiary.address}
                                />
                                <InfoCard
                                    icon={<FileText className="h-5 w-5" />}
                                    label="Nationality"
                                    value={beneficiary.nationality}
                                />
                            </div>
                        </section>

                        {/* Parents Information */}
                        <section className="mb-8">
                            <h2 className="text-lg font-semibold text-[#008080] mb-4 flex items-center">
                                <User className="mr-2 h-5 w-5" />
                                Parents Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-900 mb-2">Father's Details</h3>
                                    <InfoCard
                                        icon={<User className="h-5 w-5" />}
                                        label="Name"
                                        value={beneficiary.father_name}
                                    />
                                    <InfoCard
                                        icon={<Phone className="h-5 w-5" />}
                                        label="Contact"
                                        value={beneficiary.father_contact}
                                    />
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-900 mb-2">Mother's Details</h3>
                                    <InfoCard
                                        icon={<User className="h-5 w-5" />}
                                        label="Name"
                                        value={beneficiary.mother_name}
                                    />
                                    <InfoCard
                                        icon={<Phone className="h-5 w-5" />}
                                        label="Contact"
                                        value={beneficiary.mother_contact}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Guardian Information */}
                        <section className="mb-8">
                            <h2 className="text-lg font-semibold text-[#008080] mb-4 flex items-center">
                                <User className="mr-2 h-5 w-5" />
                                Guardian Information
                            </h2>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <InfoCard
                                        icon={<User className="h-5 w-5" />}
                                        label="Name"
                                        value={beneficiary.guardian_name}
                                    />
                                    <InfoCard
                                        icon={<Phone className="h-5 w-5" />}
                                        label="Contact"
                                        value={beneficiary.guardian_contact}
                                    />
                                    <InfoCard
                                        icon={<FileText className="h-5 w-5" />}
                                        label="Occupation"
                                        value={beneficiary.occupation}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Health Information */}
                        <section>
                            <h2 className="text-lg font-semibold text-[#008080] mb-4 flex items-center">
                                <FileText className="mr-2 h-5 w-5" />
                                Health Information
                            </h2>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoCard
                                        icon={<FileText className="h-5 w-5" />}
                                        label="Health Background"
                                        value={beneficiary.health_background}
                                    />
                                    <InfoCard
                                        icon={<Phone className="h-5 w-5" />}
                                        label="Emergency Contact"
                                        value={beneficiary.emergency_contact}
                                    />
                                </div>
                            </div>
                        </section>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

interface InfoCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
}

const InfoCard = ({ icon, label, value }: InfoCardProps) => (
    <div className="flex items-start gap-2">
        <div className="text-[#008080] mt-1">{icon}</div>
        <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-gray-900">{value}</p>
        </div>
    </div>
); 