"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Flame, PartyPopper, Library  } from "lucide-react";

export function TradeTabs() {
  const [activeTab, setActiveTab] = useState('modern');

  const tabs = [
    { 
      id: 'modern', 
      label: 'modern', 
      icon: Flame 
    },
    { 
      id: 'useful', 
      label: 'features', 
      icon: PartyPopper, 
    },
    { 
      id: 'learn', 
      label: 'learn', 
      icon: Library  
    }
  ];

  return (
    <div className="inline-flex backdrop-blur-md border border-white/20 bg-transparent rounded-full p-1 space-x-1 sm:space-x-2 shadow-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <Button
            key={tab.id}
            variant="ghost"
            className={cn(
              "rounded-full px-2.5 sm:px-4 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2 transition-all duration-300 text-[11px] sm:text-sm",
              activeTab === tab.id 
                ? "bg-black/10 dark:bg-white/20 text-black dark:text-white" 
                : "bg-transparent text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 hover:text-black dark:hover:text-white"
            )}
            onClick={() => setActiveTab(tab.id)}
          >
            <Icon 
              size={13} 
              className={cn(
                activeTab === tab.id 
                  ? "text-black dark:text-white" 
                  : "text-gray-600 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white"
              )}
            />
            {tab.label}
          </Button>
        );
      })}
    </div>
  );
}
