import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Statistics',
        href: '/statistics',
    },
];

const COLORS = ['#008080', '#00B4B4', '#00D4D4', '#00E4E4', '#00F4F4'];

interface StatisticsProps extends PageProps {
    statistics: {
        totalBeneficiaries: number;
        totalParents: number;
        totalGuardians: number;
        documentCompletion: number;
        ageDistribution: Array<{ age: string; count: number }>;
        locationData: Array<{ address: string; count: number }>;
        genderData: Array<{ gender: string; value: number }>;
        guardianTypeData: Array<{ type: string; value: number }>;
        occupationData: Array<{ occupation: string; count: number }>;
        mostCommonLocation: { address: string; count: number };
        mostCommonOccupation: { occupation: string; count: number };
        guardianCoverage: number;
    };
}

export default function Statistics({ statistics }: StatisticsProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Statistics" />
            <div className="container mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Beneficiary Statistics</h1>
                    <Select defaultValue="2024">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2024">2024</SelectItem>
                            <SelectItem value="2023">2023</SelectItem>
                            <SelectItem value="2022">2022</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Beneficiaries</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-[#008080]">{statistics.totalBeneficiaries}</div>
                            <p className="text-sm text-gray-600">Active beneficiaries</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Total Parents</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-[#008080]">{statistics.totalParents}</div>
                            <p className="text-sm text-gray-600">Registered parents</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Total Guardians</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-[#008080]">{statistics.totalGuardians}</div>
                            <p className="text-sm text-gray-600">Registered guardians</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Document Completion</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-[#008080]">{statistics.documentCompletion}%</div>
                            <p className="text-sm text-gray-600">Complete profiles</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Age Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={statistics.ageDistribution}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="age" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="#008080" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Location Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={statistics.locationData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="address" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="#00B4B4" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Additional Analytics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Guardian Type Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={statistics.guardianTypeData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {statistics.guardianTypeData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Top Occupations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={statistics.occupationData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="occupation" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="#00D4D4" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Additional Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Most Common Location</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-[#008080]">{statistics.mostCommonLocation?.address || 'N/A'}</div>
                            <p className="text-sm text-gray-600">{statistics.mostCommonLocation?.count || 0} beneficiaries</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Most Common Occupation</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-[#008080]">{statistics.mostCommonOccupation?.occupation || 'N/A'}</div>
                            <p className="text-sm text-gray-600">{statistics.mostCommonOccupation?.count || 0} parents/guardians</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Guardian Coverage</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-[#008080]">{statistics.guardianCoverage}%</div>
                            <p className="text-sm text-gray-600">Beneficiaries with guardians</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
} 