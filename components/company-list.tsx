"use client"

import { useEffect, useState } from "react"
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

const ITEMS_PER_PAGE = 10

export function CompanyList() {
  const searchParams = useSearchParams()
  const [companies, setCompanies] = useState<Company[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const currentPage = Number(searchParams.get('page')) || 1
  const searchTerm = searchParams.get('search') || ''

  useEffect(() => {
    async function fetchCompanies() {
      setIsLoading(true)
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: ITEMS_PER_PAGE.toString(),
          ...(searchTerm && { search: searchTerm })
        })
        
        const response = await fetch(`/api/companies?${params}`)
        const data = await response.json()
        
        setCompanies(data.companies)
        setTotalItems(data.total)
      } catch (error) {
        console.error('Error fetching companies:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompanies()
  }, [currentPage, searchTerm])

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

  return (
    <div className="space-y-4">
      <CompanySearch />
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Sector</TableHead>
              <TableHead>Last Traded Price</TableHead>
              <TableHead>Change %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : companies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No companies found
                </TableCell>
              </TableRow>
            ) : (
              companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">{company.symbol}</TableCell>
                  <TableCell>{company.name}</TableCell>
                  <TableCell>{company.sector}</TableCell>
                  <TableCell>{company.lastTradedPrice}</TableCell>
                  <TableCell>{company.percentChange}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          Showing {companies.length} of {totalItems} companies
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const params = new URLSearchParams(searchParams)
              params.set('page', (currentPage - 1).toString())
              window.history.pushState(null, '', `?${params.toString()}`)
            }}
            disabled={currentPage === 1 || isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const params = new URLSearchParams(searchParams)
              params.set('page', (currentPage + 1).toString())
              window.history.pushState(null, '', `?${params.toString()}`)
            }}
            disabled={currentPage === totalPages || isLoading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}