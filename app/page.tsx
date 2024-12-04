"use client";

import { AnimatedText } from '@/components/AnimatedText';
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="container mx-auto px-4 min-h-screen flex items-center justify-center text-center">
      <div className='max-w-4xl mx-auto px-4'>
        <AnimatedText 
          as="h1"
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight"
        >
          Build confidence with every single trade
        </AnimatedText>

        <AnimatedText 
          className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto text-gray-600"
          staggered
        >
          Your comprehensive platform for Nepal stock market data and analysis.
        </AnimatedText>

        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button>Get Started</Button>
          <Button variant="outline">Learn More</Button>
        </div>
      </div>
    </div>
  );
}