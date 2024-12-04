import { NextResponse } from 'next/server'
import { getCompanies } from '@/lib/api/companies'

export const dynamic = 'force-static'
export const fetchCache = 'force-cache'
export const revalidate = 3600 // 1 hour

export async function GET() {
  try {
    // Provide default static parameters for static export
    const result = await getCompanies(undefined, 1, 10)
    return NextResponse.json({ 
      companies: result.companies, 
      total: result.total,
      page: 1,
      limit: 10
    })
  } catch (error) {
    console.error('API route error:', error)
    // Fallback error handling with empty dataset
    return NextResponse.json({ 
      companies: [], 
      total: 0, 
      page: 1,
      limit: 10,
      error: 'Failed to fetch companies' 
    }, { status: 500 })
  }
}