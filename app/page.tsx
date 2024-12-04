"use client";

import { AnimatedText } from '@/components/AnimatedText';
import { Button } from "@/components/ui/button";
import { TradeTabs } from "@/components/TradeTabs";
import { ChevronRight } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  ArrowUpRight, 
  TrendingUp, 
  DollarSign 
} from "lucide-react";
import { MarketPerformanceCard } from "@/components/MarketInsights/MarketPerformanceCard";
import { MarketPerformanceChart } from "@/components/MarketInsights/MarketPerformanceChart";

// Sample data for charts
const marketData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 5500 },
];

const performanceCards = [
  {
    title: "Total Volume",
    value: "₹45,231.89",
    change: "+20.1%",
    icon: DollarSign,
    color: "text-green-500"
  },
  {
    title: "Market Trend",
    value: "Bullish",
    change: "+15.3%",
    icon: TrendingUp,
    color: "text-blue-500"
  }
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <div className="container mx-auto px-4 h-96 my-24 py-6 flex items-center justify-center">
        <div className='max-w-3xl w-full mx-auto  px-4 sm:px-6 md:px-8 space-y-6 sm:space-y-8 md:space-y-10 text-center'>
          <AnimatedText 
            as="h1"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight px-4 sm:px-0"
          >
            Build confidence with every single trade
          </AnimatedText>

          <AnimatedText 
            className="text-base sm:text-lg md:text-xl mb-4 sm:mb-6 md:mb-8 max-w-2xl mx-auto text-muted-foreground px-4 sm:px-0"
            staggered
          >
            Your comprehensive platform for Nepal stock market data and analysis.
          </AnimatedText>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 md:gap-6 w-full px-4 sm:px-0">
            <Button 
              size="lg" 
              className="w-full sm:w-auto max-w-xs group flex items-center justify-center"
            >
              Get Started
              <ChevronRight 
                className="ml-2 group-hover:translate-x-1 transition-transform" 
                size={20} 
              />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto max-w-xs"
            >
              Learn More
            </Button>
          </div>

          <div className="flex justify-center py-4 sm:py-6 md:py-6 px-4 sm:px-0">
            <TradeTabs />
          </div>
        </div>
      </div>

      {/* Market Insights Section */}
      <div className="container mx-auto px-4 py-6 md:py-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight px-4 sm:px-0">Market Insights</h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive market analysis and real-time performance tracking for informed trading decisions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Performance Cards */}
            <div className="md:col-span-1 space-y-6">
              {performanceCards.map((card, index) => (
                <MarketPerformanceCard 
                  key={index}
                  title={card.title}
                  value={card.value}
                  change={card.change}
                  icon={card.icon}
                  color={card.color}
                />
              ))}
            </div>

            {/* Market Chart */}
            <MarketPerformanceChart 
              data={marketData}
              title="Market Performance Trends"
              description="Detailed analysis of market volume and trends"
            />
          </div>
        </div>
      </div>
    </>
  );
}