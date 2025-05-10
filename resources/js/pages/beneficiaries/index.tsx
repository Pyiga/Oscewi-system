// resources/js/pages/beneficiaries/index.tsx
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Beneficiary, columns } from '@/components/beneficiary/columns';
import { DataTable } from '@/components/beneficiary/data-table';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'react-hot-toast';
import { ArrowLeft, CirclePlusIcon } from 'lucide-react';

interface BeneficiariesIndexProps {
    beneficiaries: {
        data: Beneficiary[];
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Beneficiaries',
        href: '/beneficiaries',
    },
];

export default function Beneficiaries({ beneficiaries }: BeneficiariesIndexProps) {
    const handleDeleteSelected = (selectedIds: string[]) => {
        if (!confirm(`Are you sure you want to delete ${selectedIds.length} selected beneficiaries? This action cannot be undone.`)) {
            return;
        }
        router.delete(route('beneficiaries.bulkDelete'), {
            data: { ids: selectedIds },
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Beneficiaries deleted successfully!');
            },
            onError: (errors) => {
                console.error("Deletion failed:", errors);
                const errorMsg = Object.values(errors).join(' ');
                toast.error(`Failed to delete beneficiaries: ${errorMsg || 'Please try again.'}`);
            },
        });
    };

    const handleExportSelected = (selectedData: Beneficiary[]) => {
        const doc = new jsPDF();
        autoTable(doc, {
            head: [['Name', 'Beneficiary No.', 'DOB', 'Gender', 'Address']],
            body: selectedData.map(b => [
                `${b.first_name || ''} ${b.last_name || ''}`,
                b.beneficiary_number || 'N/A',
                b.date_of_birth || 'N/A',
                b.gender || 'N/A',
                b.address || 'N/A',
            ]),
        });
        doc.save('selected_beneficiaries.pdf');
    };

    const handlePageChange = (page: number) => {
        router.get(
            route('beneficiaries.index'),
            { page },
            { preserveState: true, preserveScroll: true }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="All Beneficiaries" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="container mx-auto">
                    {/* Heading and Add Beneficiary Button */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                        <h1 className="text-2xl font-bold text-[#008080]">All Beneficiaries</h1>
                        <button
                            className="btn bg-[#008080] text-white hover:bg-[#006666] transition-colors duration-200 flex items-center gap-2 p-2 rounded-md w-full sm:w-auto justify-center"
                            onClick={() => router.visit(route('beneficiaries.create'))}
                        >
                            <CirclePlusIcon className="w-5 h-5" />
                            Add Beneficiary
                        </button>
                    </div>
                    {/* DataTable */}
                    <div className="bg-white rounded-lg shadow-sm">
                        <DataTable
                            columns={columns}
                            data={beneficiaries.data}
                            onDeleteSelected={handleDeleteSelected}
                            onExportSelected={handleExportSelected}
                            currentPage={beneficiaries.current_page}
                            totalPages={beneficiaries.last_page}
                            onPageChange={handlePageChange}
                            totalItems={beneficiaries.total}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}