import fs from 'fs/promises';
import path from 'path';

interface Company {
  serialNumber: number;
  symbol: string;
  name: string;
  status: string;
  sector: string;
  lastUpdated: string;
}

interface CompaniesData {
  timestamp: string;
  total: number;
  companies: Company[];
}

const DATA_FILE = path.join(process.cwd(), 'content', 'companies', 'companies.json');

export async function getCompanies(search?: string, page: number = 1, limit: number = 10) {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const parsedData: CompaniesData = JSON.parse(data);
    let companies = parsedData.companies;

    if (search) {
      const searchLower = search.toLowerCase();
      companies = companies.filter(company => 
        company.name.toLowerCase().includes(searchLower) ||
        company.symbol.toLowerCase().includes(searchLower) ||
        company.sector.toLowerCase().includes(searchLower)
      );
    }

    const total = companies.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      companies: companies.slice(start, end),
      total
    };
  } catch (error) {
    console.error('Error reading companies:', error);
    return { companies: [], total: 0 };
  }
}