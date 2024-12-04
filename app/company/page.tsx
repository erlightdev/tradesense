import { Suspense } from 'react'
import { CompanyList } from "@/components/company-list"
import { Skeleton } from "@/components/ui/skeleton"

function CompanyListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-10 w-1/3" />
      </div>
      <div className="space-y-2">
        {[...Array(10)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  )
}

export default function CompanyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Listed Companies</h1>
      <Suspense fallback={<CompanyListSkeleton />}>
        <CompanyList />
      </Suspense>
    </div>
  )
}