"use client"

import { useEffect, useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { CompanySearch } from "./company-search"
import companiesData from '@/content/companies/companies.json'
import { Badge } from "@/components/ui/badge"

const ITEMS_PER_PAGE = 10

// Updated type to match new JSON structure
interface Company {
  serialNumber: number;
  symbol: string;
  name: string;
  status: string;
  sector: string;
  lastUpdated: string;
}

export function CompanyList() {
  const searchParams = useSearchParams()
  const [companies, setCompanies] = useState<Company[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const currentPage = Number(searchParams.get('page')) || 1
  const searchTerm = searchParams.get('search') || ''

  useEffect(() => {
    function loadCompanies() {
      setIsLoading(true)
      try {
        // Use the new JSON structure
        const allCompanies = companiesData.companies || [];

        // Filter companies based on search term
        const filteredCompanies = allCompanies.filter(company => 
          company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Paginate companies
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const paginatedCompanies = filteredCompanies.slice(
          startIndex, 
          startIndex + ITEMS_PER_PAGE
        );

        setCompanies(paginatedCompanies);
        setTotalItems(filteredCompanies.length);
      } catch (error) {
        console.error('Error loading companies:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadCompanies();
  }, [currentPage, searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return (
    <div className="w-full space-y-4 bg-background p-4 rounded-lg shadow-sm">
      <CompanySearch />
      
      {isLoading ? (
        <div className="text-center py-4 text-muted-foreground dark:text-accent">
          Loading companies...
        </div>
      ) : (
        <>
          <Table className="border rounded-lg overflow-hidden">
            <TableHeader className="bg-muted/50 dark:bg-white dark:bg-opacity-10">
              <TableRow>
                <TableHead className="w-[50px] text-muted-foreground dark:text-accent">S.N.</TableHead>
                <TableHead className="text-muted-foreground dark:text-accent">Symbol</TableHead>
                <TableHead className="text-muted-foreground dark:text-accent">Name</TableHead>
                <TableHead className="text-muted-foreground dark:text-accent">Status</TableHead>
                <TableHead className="text-muted-foreground dark:text-accent">Sector</TableHead>
                <TableHead className="text-muted-foreground dark:text-accent">Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company) => (
                <TableRow 
                  key={`${company.symbol}-${company.serialNumber}`} 
                  className="hover:bg-opacity-20 transition-colors"
                >
                  <TableCell className="font-medium text-muted-foreground dark:text-accent">
                    {company.serialNumber}
                  </TableCell>
                  <TableCell className="font-semibold text-primary dark:text-accent">
                    {company.symbol}
                  </TableCell>
                  <TableCell className="dark:text-accent">{company.name}</TableCell>
                  <TableCell className="dark:text-accent">
                    <Badge 
                      variant={company.status === 'Active' ? 'default' : 'destructive'}
                      className="capitalize"
                    >
                      {company.status.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground dark:text-accent">
                    {company.sector}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground dark:text-accent">
                    {new Date(company.lastUpdated).toLocaleString('en-US', {
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric'
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4 bg-muted/50 dark:bg-white dark:bg-opacity-10 p-3 rounded-lg">
            <Button 
              variant="outline" 
              size="sm"
              disabled={currentPage === 1}
              onClick={() => window.history.pushState(
                null, 
                '', 
                `?page=${currentPage - 1}${searchTerm ? `&search=${searchTerm}` : ''}`
              )}
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>

            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
              <span className="ml-2 text-xs">
                ({totalItems} companies)
              </span>
            </span>

            <Button 
              variant="outline" 
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => window.history.pushState(
                null, 
                '', 
                `?page=${currentPage + 1}${searchTerm ? `&search=${searchTerm}` : ''}`
              )}
            >
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  )
}