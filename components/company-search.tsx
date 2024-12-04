"use client"

import { Input } from "@/components/ui/input"
import { useCallback, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"

export function CompanySearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('search', term)
    } else {
      params.delete('search')
    }
    params.set('page', '1') // Reset to first page on search
    startTransition(() => {
      router.push(`/company?${params.toString()}`)
    })
  }, 300)

  return (
    <div className="w-full max-w-sm mb-4">
      <Input
        type="search"
        placeholder="Search companies..."
        className="w-full"
        defaultValue={searchParams.get('search')?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  )
}