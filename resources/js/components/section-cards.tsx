"use client"

import * as React from "react";
import { Users, HeartPulse, Calendar, UserRound, TrendingUp } from "lucide-react";
import { Label, Pie, PieChart, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface StatisticsData {
  totalPupils: {
    total: number;
    male: number;
    female: number;
  };
  parents: {
    total: number;
  };
  guardians: {
    total: number;
  };
  upcomingPrograms: {
    events: number;
    meetings: number;
    activities: number;
  };
}

interface StatisticsSectionProps {
  data: StatisticsData;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded shadow">
        <p className="font-medium">{`${label}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const StatisticsSection = ({ data }: StatisticsSectionProps) => {
  const genderData = [
    { name: "Male", value: data.totalPupils.male, fill: "#008080" },
    { name: "Female", value: data.totalPupils.female, fill: "#e0e0e0" }
  ];

  const chartConfig = {
    male: {
      label: "Male",
      color: "#008080",
    },
    female: {
      label: "Female",
      color: "#e0e0e0",
    },
  } satisfies ChartConfig;

  const chartData = [
    {
      name: "Male",
      value: data.totalPupils.male,
      fill: chartConfig.male.color
    },
    {
      name: "Female",
      value: data.totalPupils.female,
      fill: chartConfig.female.color
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-4 w-full">
      {/* Total Pupils Card with Radial Chart */}
      <Card className="flex flex-col h-[200px] bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20">
        <CardHeader className="items-center pb-0">
          <CardTitle className="text-lg">Total Pupils</CardTitle>
          <CardDescription>Gender Distribution</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 items-center justify-center pb-0">
          <ResponsiveContainer width="100%" height={150}>
            <RadialBarChart
              data={chartData}
              endAngle={180}
              innerRadius={60}
              outerRadius={100}
            >
              <Tooltip content={<CustomTooltip />} />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) - 16}
                            className="fill-foreground text-2xl font-bold"
                          >
                            {data.totalPupils.total.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 4}
                            className="fill-muted-foreground"
                          >
                            Total
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </PolarRadiusAxis>
              <RadialBar
                dataKey="value"
                fill="#008080"
                cornerRadius={5}
                className="stroke-transparent stroke-2"
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            Male: {data.totalPupils.male} | Female: {data.totalPupils.female}
          </div>
        </CardFooter>
      </Card>

      {/* Total Parents Card with Pie Chart */}
      <Card className="flex flex-col h-[200px] bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
        <CardHeader className="items-center pb-0">
          <CardTitle className="text-lg">Total Parents</CardTitle>
          <CardDescription>Gender Distribution</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 items-center justify-center pb-0">
          <ResponsiveContainer width="100%" height={100}>
            <PieChart>
              <Pie
                data={genderData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={50}
                fill="#008080"
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox && typeof viewBox.cy === 'number') {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan x={viewBox.cx} y={viewBox.cy - 12} className="fill-foreground text-2xl font-bold">
                            {data.parents.total}
                          </tspan>
                          <tspan x={viewBox.cx} y={viewBox.cy + 12} className="fill-muted-foreground text-sm">
                            Parents
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Total Guardians Card */}
      <Card className="flex flex-col h-[200px] bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20">
        <CardHeader className="items-center pb-0">
          <CardTitle className="text-lg">Total Guardians</CardTitle>
          <CardDescription>Registered Guardians</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 items-center justify-center pb-0">
          <div className="text-center">
            <div className="text-4xl font-bold text-[#008080] mb-2">
              {data.guardians.total.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Guardians</div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Programs Card */}
      <Card className="flex flex-col h-[200px] bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20">
        <CardHeader className="items-center pb-0">
          <CardTitle className="text-lg">Upcoming Programs</CardTitle>
          <CardDescription>Next 7 days</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 items-center justify-center pb-0">
          <div className="flex items-center justify-center gap-4">
            <div className="flex flex-col items-center">
              <Calendar className="h-8 w-8 text-[#008080]" />
              <span className="text-sm mt-2">{data.upcomingPrograms.events} Events</span>
            </div>
            <div className="flex flex-col items-center">
              <Users className="h-8 w-8 text-[#008080]" />
              <span className="text-sm mt-2">{data.upcomingPrograms.meetings} Meetings</span>
            </div>
            <div className="flex flex-col items-center">
              <HeartPulse className="h-8 w-8 text-[#008080]" />
              <span className="text-sm mt-2">{data.upcomingPrograms.activities} Activities</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsSection;
