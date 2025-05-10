"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer, Tooltip, Legend } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Data type: add a 'date' field for filtering
export interface BeneficiaryChartData {
  month: string; // e.g. "Jan", "Feb", etc.
  date: string;  // ISO date string, e.g. "2024-06-01"
  beneficiaries: number;
  parents: number;
}

const TIME_RANGES = [
  { value: "3d", label: "Last 3 days" },
  { value: "7d", label: "Last 7 days" },
  { value: "1m", label: "This month" },
  { value: "3m", label: "Last 3 months" },
  { value: "1y", label: "Previous year" },
  { value: "ty", label: "This year" },
];

function filterData(data: BeneficiaryChartData[], range: string) {
  if (!data.length) return [];
  // Sort data by date ascending
  const sorted = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const lastDate = new Date(sorted[sorted.length - 1].date);

  switch (range) {
    case "3d": {
      const cutoff = new Date(lastDate);
      cutoff.setDate(cutoff.getDate() - 2);
      return sorted.filter(d => new Date(d.date) >= cutoff);
    }
    case "7d": {
      const cutoff = new Date(lastDate);
      cutoff.setDate(cutoff.getDate() - 6);
      return sorted.filter(d => new Date(d.date) >= cutoff);
    }
    case "1m": {
      const lastMonth = lastDate.getMonth();
      const lastYear = lastDate.getFullYear();
      return sorted.filter(d => {
        const dDate = new Date(d.date);
        return dDate.getMonth() === lastMonth && dDate.getFullYear() === lastYear;
      });
    }
    case "3m": {
      const cutoff = new Date(lastDate);
      cutoff.setMonth(cutoff.getMonth() - 2);
      return sorted.filter(d => new Date(d.date) >= cutoff);
    }
    case "1y": {
      const cutoff = new Date(lastDate);
      cutoff.setFullYear(cutoff.getFullYear() - 1);
      return sorted.filter(d => new Date(d.date) >= cutoff);
    }
    case "ty": {
      const cutoff = new Date(lastDate);
      cutoff.setFullYear(cutoff.getFullYear());
      return sorted.filter(d => new Date(d.date) >= cutoff);
    }
    default:
      return sorted;
  }
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm font-medium text-gray-700">
                {entry.name}:
              </span>
              <span className="text-sm text-gray-600">
                {entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

interface BeneficiaryAreaChartProps {
  initialData?: BeneficiaryChartData[];
}

export const BeneficiaryAreaChart: React.FC<BeneficiaryAreaChartProps> = ({
  initialData,
}) => {
  const [timeRange, setTimeRange] = React.useState("1y");
  const [data, setData] = React.useState<BeneficiaryChartData[]>(initialData || []);
  const [loading, setLoading] = React.useState(!initialData);

  React.useEffect(() => {
    if (!initialData) {
      const fetchData = async () => {
        try {
          const response = await fetch('/api/analytics/monthly');
          const jsonData = await response.json();
          setData(jsonData);
        } catch (error) {
          console.error('Error fetching monthly data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [initialData]);

  const filteredData = filterData(data, timeRange);

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="h-[250px] w-full bg-gray-100 animate-pulse rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Beneficiaries & Parents</CardTitle>
          <CardDescription>
            Monthly distribution of beneficiaries and parents
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px] rounded-lg sm:ml-auto" aria-label="Select a value">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {TIME_RANGES.map(r => (
              <SelectItem key={r.value} value={r.value} className="rounded-lg">
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillBeneficiaries" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="#008080"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="#008080"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillParents" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="#00b3b3"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="#00b3b3"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={16}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                dataKey="beneficiaries"
                type="monotone"
                fill="url(#fillBeneficiaries)"
                stroke="#008080"
                stackId="a"
                name="Beneficiaries"
              />
              <Area
                dataKey="parents"
                type="monotone"
                fill="url(#fillParents)"
                stroke="#00b3b3"
                stackId="a"
                name="Parents"
              />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BeneficiaryAreaChart;
