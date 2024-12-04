"use client";

import { AnimatedText } from '@/components/AnimatedText';
import { Button } from "@/components/ui/button";
import { TradeTabs } from "@/components/TradeTabs";
import { ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto px-4 min-h-[calc(100vh-80px)] flex items-center justify-center">
      <div className='max-w-3xl w-full mx-auto px-4 sm:px-6 md:px-8 space-y-6 sm:space-y-8 md:space-y-10 text-center'>
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

        <div className="flex justify-center py-6 sm:py-8 md:py-10 px-4 sm:px-0">
          <TradeTabs />
        </div>
      </div>
    </div>
  );
}