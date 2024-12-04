const playwright = require('playwright');
const fs = require('fs').promises;
const path = require('path');

async function scrapeCompanies() {
  let browser = null;
  try {
    browser = await playwright.chromium.launch({ 
      headless: false, // Keep browser visible for debugging
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

    // Add console logging in the page context
    page.on('console', (msg) => console.log('Page log:', msg.text()));

    // Extensive error logging and debugging
    page.on('pageerror', (err) => {
      console.error('Page error:', err);
    });

    // Increase timeout and add more robust waiting
    await page.setDefaultTimeout(90000); // Increased to 90 seconds
    
    try {
      // Navigate to the page with extensive logging
      console.log('Navigating to the website...');
      const response = await page.goto('https://www.nepalstock.com.np/company', { 
        waitUntil: 'networkidle',
        timeout: 90000
      });

      // Log response details
      console.log('Response status:', response ? response.status() : 'No response');
      
      // Take a screenshot for debugging
      await page.screenshot({ path: 'debug-screenshot.png' });

      // Check page content
      const pageContent = await page.content();
      console.log('Page content length:', pageContent.length);

      // Wait for table with extended timeout and logging
      console.log('Waiting for table selector...');
      await page.waitForSelector('table.table', { 
        timeout: 90000,
        state: 'visible'
      });

      // Extract company data using a more robust method
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

      // Ensure content directory exists
      const contentDir = path.join(process.cwd(), 'content');
      await fs.mkdir(contentDir, { recursive: true });

      // Save to JSON for backup
      const jsonFilePath = path.join(contentDir, 'companies.json');
      await fs.writeFile(jsonFilePath, JSON.stringify(companies, null, 2));

      // Create Markdown content
      const markdownContent = companies.map(company => 
        `## ${company.name}
- **Symbol**: ${company.symbol}
- **Sector**: ${company.sector}
- **Last Traded Price**: ${company.lastTradedPrice}
- **Percent Change**: ${company.percentChange}`
      ).join('\n\n');

      // Save to Markdown file
      const mdFilePath = path.join(contentDir, 'companies.md');
      await fs.writeFile(mdFilePath, markdownContent);

      console.log(`Successfully scraped ${companies.length} companies`);
      console.log(`Data saved to ${jsonFilePath} and ${mdFilePath}`);

    } catch (navigationError) {
      console.error('Navigation or scraping error:', navigationError);
      
      // Additional debugging: save error screenshot
      await page.screenshot({ path: 'error-screenshot.png' });
    }
  } catch (error) {
    console.error('Critical error in scraping process:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

scrapeCompanies();