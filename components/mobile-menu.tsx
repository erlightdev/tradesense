"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { 
      name: "Companies", 
      href: "/company", 
      icon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18" />
          <path d="M18 17V9" />
          <path d="M13 17V5" />
          <path d="M8 17v-4" />
        </svg>
      )
    },
    { 
      name: "Market", 
      href: "/market", 
      icon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      )
    }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="sm:hidden text-foreground hover:bg-accent hover:text-accent-foreground rounded-md p-1 transition-colors">
          <Menu className="h-6 w-6" />
        </button>
      </DialogTrigger>
      <DialogContent 
        className="sm:max-w-[425px] w-full max-w-md 
        bg-background text-foreground 
        dark:bg-background dark:text-foreground 
        border border-border 
        dark:border-border 
        rounded-lg 
        shadow-xl"
      >
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold text-foreground dark:text-foreground">
            Navigation Menu
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-2 py-4">
          {menuItems.map((item) => (
            <Link 
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 
                p-3 
                hover:bg-accent/10 
                rounded-lg 
                transition-colors 
                group"
            >
              <span className="text-muted-foreground group-hover:text-foreground">
                <item.icon />
              </span>
              <span className="text-sm font-medium text-foreground group-hover:text-primary">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
