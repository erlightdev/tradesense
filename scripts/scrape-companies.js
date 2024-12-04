const playwright = require('playwright');
const fs = require('fs').promises;
const path = require('path');
const { createLogger, format, transports } = require('winston');

// Set up logging
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' }),
    new transports.Console({
      format: format.simple()
    })
  ]
});

function validateCompanyData(companies) {
  if (!Array.isArray(companies) || companies.length === 0) {
    throw new Error('No companies data found');
  }

  const requiredFields = ['symbol', 'name', 'sector', 'lastTradedPrice', 'percentChange'];
  
  companies.forEach((company, index) => {
    requiredFields.forEach(field => {
      if (!company[field]) {
        logger.warn(`Missing ${field} for company at index ${index}`);
      }
    });
  });

  return companies;
}

async function scrapeCompanies() {
  let browser = null;
  try {
    browser = await playwright.chromium.launch({ 
      headless: true, // Changed to true for production
      args: [
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--disable-blink-features=AutomationControlled'
      ]
    });
    
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      bypassCSP: true,
      extraHTTPHeaders: {
        'Accept-Language': 'en-US,en;q=0.9',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1'
      },
      viewport: { width: 1920, height: 1080 }
    });
    
    const page = await context.newPage();

    // Logging page events
    page.on('console', (msg) => logger.info('Page log:', msg.text()));
    page.on('pageerror', (err) => logger.error('Page error:', err));

    await page.setDefaultTimeout(90000);
    
    try {
      logger.info('Navigating to the website...');
      const response = await page.goto('https://www.nepalstock.com.np/company', { 
        waitUntil: 'networkidle',
        timeout: 90000
      });

      logger.info('Response status:', response ? response.status() : 'No response');
      
      // Wait for table with extended timeout
      logger.info('Waiting for table selector...');
      await page.waitForSelector('table.table', { 
        timeout: 90000,
        state: 'visible'
      });

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

      // Validate company data
      const validatedCompanies = validateCompanyData(companies);

      // Ensure content directory exists
      const contentDir = path.join(process.cwd(), 'content');
      await fs.mkdir(contentDir, { recursive: true });

      // Save to JSON
      const jsonFilePath = path.join(contentDir, 'companies.json');
      await fs.writeFile(jsonFilePath, JSON.stringify(validatedCompanies, null, 2));

      // Create Markdown content
      const markdownContent = validatedCompanies.map(company => 
        `## ${company.name}
- **Symbol**: ${company.symbol}
- **Sector**: ${company.sector}
- **Last Traded Price**: ${company.lastTradedPrice}
- **Percent Change**: ${company.percentChange}`
      ).join('\n\n');

      // Save to Markdown file
      const mdFilePath = path.join(contentDir, 'companies.md');
      await fs.writeFile(mdFilePath, markdownContent);

      logger.info(`Successfully scraped ${validatedCompanies.length} companies`);
      logger.info(`Data saved to ${jsonFilePath} and ${mdFilePath}`);

      return validatedCompanies;

    } catch (navigationError) {
      logger.error('Navigation or scraping error:', navigationError);
      throw navigationError;
    }
  } catch (error) {
    logger.error('Critical error in scraping process:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Periodic scraping function
async function scheduleScraping(interval = 24 * 60 * 60 * 1000) { // Default: 24 hours
  try {
    logger.info('Starting scheduled scraping...');
    await scrapeCompanies();
    
    // Schedule next scrape
    setTimeout(scheduleScraping, interval);
  } catch (error) {
    logger.error('Scheduled scraping failed:', error);
    // Retry after a shorter interval in case of failure
    setTimeout(scheduleScraping, 60 * 60 * 1000); // 1 hour
  }
}

// Export functions for potential use in other scripts
module.exports = {
  scrapeCompanies,
  scheduleScraping
};

// If run directly, start scheduled scraping
if (require.main === module) {
  scheduleScraping();
}