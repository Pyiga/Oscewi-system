import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, isValid } from "date-fns";
import { Button } from "@/components/ui/button";
import { router } from "@inertiajs/react";

interface Beneficiary {
    id: number;
    first_name: string;
    last_name: string;
    photo?: string;
    registration_date: string;
    status: string;
}

interface RecentBeneficiariesProps {
    beneficiaries: Beneficiary[];
}

export default function RecentBeneficiaries({ beneficiaries }: RecentBeneficiariesProps) {
    const handleViewBeneficiary = (id: number) => {
        router.visit(`/beneficiaries/${id}`);
    };

    const getFullName = (beneficiary: Beneficiary) => {
        return `${beneficiary.first_name} ${beneficiary.last_name}`.trim();
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            if (isValid(date)) {
                return format(date, 'MMM dd, yyyy');
            }
            return 'Date not available';
        } catch (error) {
            return 'Date not available';
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#008080]">Recently Registered Beneficiaries</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {beneficiaries.slice(0, 4).map((beneficiary) => {
                        const fullName = getFullName(beneficiary);
                        return (
                            <div key={beneficiary.id} className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={beneficiary.photo} alt={fullName} />
                                    <AvatarFallback>{beneficiary.first_name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{fullName}</p>
                                    <p className="text-xs text-gray-500">
                                        Registered on {formatDate(beneficiary.registration_date)}
                                    </p>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                    beneficiary.status === 'active' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {beneficiary.status}
                                </span>
                                <Button 
                                    variant="default" 
                                    size="sm"
                                    onClick={() => handleViewBeneficiary(beneficiary.id)}
                                    className="ml-2 bg-[#008080] hover:bg-[#006666] text-white"
                                >
                                    View
                                </Button>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
} 