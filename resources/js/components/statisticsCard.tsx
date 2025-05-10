
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

interface StatisticsCardProps {
  title: string;
  value: string | number;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

const StatisticsCard = ({ title, value, description, icon, className }: StatisticsCardProps) => {
  return (
    <Card className={`w-full h-full overflow-hidden backdrop-blur-sm ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
        <CardTitle className="text-base font-medium tracking-tight text-muted-foreground">
          {title}
        </CardTitle>
        <div className="p-2 bg-background/10 rounded-full">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="text-2xl lg:text-3xl font-bold tracking-tight mt-2">{value}</div>
        {description && (
          <p className="text-sm mt-2 font-medium">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
