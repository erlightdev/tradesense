"use client";

import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

interface MarketPerformanceCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color?: string;
}

export function MarketPerformanceCard({
  title, 
  value, 
  change, 
  icon: Icon, 
  color = "text-blue-500"
}: MarketPerformanceCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${color} flex items-center`}>
          <ArrowUpRight className="h-4 w-4 mr-1" /> {change}
        </p>
      </CardContent>
    </Card>
  );
}
