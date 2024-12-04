import { CompanyList } from "@/components/company-list"

export default function CompanyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Listed Companies</h1>
      <CompanyList />
    </div>
  )
}