"use client"

import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"
import TradesenseLogo from "./tradesense-logo"
import { Menu } from "lucide-react"
import { MobileMenu } from "./mobile-menu"

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto flex h-14 items-center px-4 sm:px-6 lg:px-8">
        {/* Logo and Site Name */}
        <Link href="/" className="flex items-center space-x-2 font-bold">
          <TradesenseLogo className="h-6 w-6" />
          <span className="text-sm sm:text-base hidden sm:inline">Tradesense</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center space-x-6 ml-6">
          <Link href="/company" className="text-sm font-medium transition-colors hover:text-primary dark:hover:text-white dark:hover:opacity-80">
            Companies
          </Link>
          <Link href="/market" className="text-sm font-medium transition-colors hover:text-primary dark:hover:text-white dark:hover:opacity-80">
            Market
          </Link>
        </nav>

        {/* Theme Toggle and Additional Actions */}
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          
          {/* Mobile Menu Toggle */}
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}