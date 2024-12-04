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
import type { Company } from "@/lib/types/company"
import companiesData from '@/content/companies.json'

const ITEMS_PER_PAGE = 10

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
        // Filter companies based on search term
        const filteredCompanies = companiesData.filter(company => 
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
    <div className="w-full">
      <CompanySearch />
      
      {isLoading ? (
        <div className="text-center py-4">Loading companies...</div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead>Last Traded Price</TableHead>
                <TableHead>Percent Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>{company.symbol}</TableCell>
                  <TableCell>{company.name}</TableCell>
                  <TableCell>{company.sector}</TableCell>
                  <TableCell>{company.lastTradedPrice}</TableCell>
                  <TableCell>{company.percentChange}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <Button 
              variant="outline" 
              disabled={currentPage === 1}
              onClick={() => window.history.pushState(
                null, 
                '', 
                `?page=${currentPage - 1}${searchTerm ? `&search=${searchTerm}` : ''}`
              )}
            >
              <ChevronLeft className="mr-2" /> Previous
            </Button>
            <span>Page {currentPage} of {totalPages}</span>
            <Button 
              variant="outline" 
              disabled={currentPage === totalPages}
              onClick={() => window.history.pushState(
                null, 
                '', 
                `?page=${currentPage + 1}${searchTerm ? `&search=${searchTerm}` : ''}`
              )}
            >
              Next <ChevronRight className="ml-2" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}