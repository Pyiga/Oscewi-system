
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BarChart2, Activity } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const Reports = () => {
  const recentReports = [
    { id: 1, name: "Monthly Progress Report", date: "2024-04-20", status: "Completed" },
    { id: 2, name: "Treatment Analysis", date: "2024-04-18", status: "In Progress" },
    { id: 3, name: "Health Records Update", date: "2024-04-15", status: "Completed" },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-[#07648c] dark:text-blue-300">
        Reports
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800/50">
          <CardHeader className="flex flex-row items-center gap-4">
            <FileText className="h-8 w-8 text-[#07648c] dark:text-blue-300" />
            <CardTitle>Monthly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300">
              View and analyze monthly progress reports for all pupils
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800/50">
          <CardHeader className="flex flex-row items-center gap-4">
            <BarChart2 className="h-8 w-8 text-[#07648c] dark:text-blue-300" />
            <CardTitle>Treatment Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300">
              Analyze treatment effectiveness and outcomes
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800/50">
          <CardHeader className="flex flex-row items-center gap-4">
            <Activity className="h-8 w-8 text-[#07648c] dark:text-blue-300" />
            <CardTitle>Health Records</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300">
              Access detailed health records and documentation
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="dark:bg-gray-800/50">
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.name}</TableCell>
                  <TableCell>{report.date}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      report.status === "Completed" 
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                    }`}>
                      {report.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
