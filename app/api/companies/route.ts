import { NextResponse } from 'next/server'
import { getCompanies } from '@/lib/api/companies'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || undefined
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')

  const data = await getCompanies(search, page, limit)
  
  return NextResponse.json(data)
}