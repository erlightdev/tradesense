// Company type reflecting the new JSON structure
export interface Company {
  serialNumber: number;
  symbol: string;
  name: string;
  status: string;
  sector: string;
  lastUpdated: string;
}

// Optional metadata about the entire dataset
export interface CompanyDataset {
  lastUpdated: string;
  totalCompanies: number;
  companies: Company[];
}

export interface CompanyListResponse {
  companies: Company[];
  total: number;
}