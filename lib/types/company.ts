export interface Company {
  id: string;
  symbol: string;
  name: string;
  sector: string;
  lastTradedPrice?: string;
  percentChange?: string;
}

export interface CompanyListResponse {
  companies: Company[];
  total: number;
}