const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

async function scrapeCompanies() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('https://www.nepalstock.com.np/company');
    
    // Wait for the table to load
    await page.waitForSelector('table.table tbody tr', { timeout: 30000 });
    
    // Extract company data
    const companies = await page.evaluate(() => {
      const rows = document.querySelectorAll('table.table tbody tr');
      return Array.from(rows).map((row, index) => {
        const columns = row.querySelectorAll('td');
        return {
          id: index.toString(),
          symbol: columns[1]?.textContent?.trim() || '',
          name: columns[2]?.textContent?.trim() || '',
          sector: columns[3]?.textContent?.trim() || '',
          lastTradedPrice: columns[4]?.textContent?.trim() || '',
          percentChange: columns[5]?.textContent?.trim() || ''
        };
      });
    });
    
    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'data');
    await fs.mkdir(dataDir, { recursive: true });
    
    // Save to JSON file
    const filePath = path.join(dataDir, 'companies.json');
    await fs.writeFile(filePath, JSON.stringify(companies, null, 2));
    
    console.log(`Successfully scraped ${companies.length} companies`);
    
  } catch (error) {
    console.error('Error scraping companies:', error);
  } finally {
    await browser.close();
  }
}

scrapeCompanies();