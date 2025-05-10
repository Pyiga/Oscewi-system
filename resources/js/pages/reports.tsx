import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, Users, UserCheck, UserX, Heart } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reports',
        href: '/reports',
    },
];

export default function Reports() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports" />
            <div className="container mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Beneficiary Reports</h1>
                    <Button className="bg-[#008080] text-white hover:bg-[#006666]">
                        <Download className="w-4 h-4 mr-2" />
                        Export All
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Input
                        placeholder="Search reports..."
                        className="md:col-span-2"
                    />
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Reports</SelectItem>
                            <SelectItem value="demographic">Demographic Reports</SelectItem>
                            <SelectItem value="health">Health Reports</SelectItem>
                            <SelectItem value="contact">Contact Information</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Users className="w-5 h-5 mr-2 text-[#008080]" />
                                Demographic Report
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 mb-4">
                                Age, gender, and nationality distribution of beneficiaries
                            </p>
                            <Button variant="outline" className="w-full">
                                <Download className="w-4 h-4 mr-2" />
                                Download
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Heart className="w-5 h-5 mr-2 text-[#008080]" />
                                Health Background Report
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 mb-4">
                                Health conditions and medical history of beneficiaries
                            </p>
                            <Button variant="outline" className="w-full">
                                <Download className="w-4 h-4 mr-2" />
                                Download
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <UserCheck className="w-5 h-5 mr-2 text-[#008080]" />
                                Parent/Guardian Report
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 mb-4">
                                Parent and guardian contact information analysis
                            </p>
                            <Button variant="outline" className="w-full">
                                <Download className="w-4 h-4 mr-2" />
                                Download
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <FileText className="w-5 h-5 mr-2 text-[#008080]" />
                                Emergency Contact Report
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 mb-4">
                                Emergency contact information and availability
                            </p>
                            <Button variant="outline" className="w-full">
                                <Download className="w-4 h-4 mr-2" />
                                Download
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <UserX className="w-5 h-5 mr-2 text-[#008080]" />
                                Missing Information Report
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 mb-4">
                                Beneficiaries with incomplete or missing information
                            </p>
                            <Button variant="outline" className="w-full">
                                <Download className="w-4 h-4 mr-2" />
                                Download
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <FileText className="w-5 h-5 mr-2 text-[#008080]" />
                                Document Status Report
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 mb-4">
                                Status of supporting documents and profile images
                            </p>
                            <Button variant="outline" className="w-full">
                                <Download className="w-4 h-4 mr-2" />
                                Download
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
} 