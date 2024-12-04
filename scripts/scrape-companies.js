const playwright = require("playwright");
const fs = require("node:fs").promises;
const path = require("node:path");
const winston = require('winston');

// Custom console transport that only logs the message without metadata
const simpleConsoleFormat = winston.format.printf(({ message }) => {
    return message;
});

// Ensure logs directory exists
const logsDir = path.join(__dirname, '..', 'logs');
fs.mkdir(logsDir, { recursive: true }).catch(console.error);

// Logger setup
const logger = winston.createLogger({
    level: 'info',
    transports: [
        // Console transport with simple output
        new winston.transports.Console({
            format: winston.format.combine(
                simpleConsoleFormat
            )
        }),
        // Info log file
        new winston.transports.File({ 
            filename: path.join(logsDir, 'scraper-info.log'),
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        }),
        // Error log file
        new winston.transports.File({ 
            filename: path.join(logsDir, 'scraper-error.log'),
            level: 'error',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        })
    ]
});

// Wrapper to ensure both console and file logging
function logInfo(message) {
    logger.info(message);
}

function logError(message, error) {
    logger.error(message, error);
}

// Optimized configuration
const SCRAPER_CONFIG = {
    TIMEOUT: 60000,
    MAX_RETRIES: 3,
    HEADLESS: true,
    VIEWPORT: { width: 1920, height: 1080 }
};

const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
];

async function scrapeCompanies() {
    let browser = null;
    try {
        // Launch browser with optimized settings
        browser = await playwright.chromium.launch({
            headless: SCRAPER_CONFIG.HEADLESS,
            timeout: SCRAPER_CONFIG.TIMEOUT,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote'
            ]
        });

        const context = await browser.newContext({
            userAgent: USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
            viewport: SCRAPER_CONFIG.VIEWPORT
        });

        const page = await context.newPage();
        page.setDefaultTimeout(SCRAPER_CONFIG.TIMEOUT);

        // Navigate to the page
        await page.goto("https://www.nepalstock.com.np/company", { 
            waitUntil: 'networkidle',
            timeout: SCRAPER_CONFIG.TIMEOUT
        });

        // Wait for the table to load
        await page.waitForSelector('table.table', { timeout: SCRAPER_CONFIG.TIMEOUT });

        // Extract companies with precise column mapping
        const companies = await page.evaluate(() => {
            const rows = document.querySelectorAll('table.table tbody tr');
            const extractedCompanies = [];

            rows.forEach((row, index) => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 4) {
                    const company = {
                        serialNumber: index + 1,
                        symbol: cells[2]?.textContent?.trim() || '',  // Symbol is in 3rd column
                        name: cells[1]?.textContent?.trim() || '',    // Name is in 2nd column
                        status: cells[3]?.textContent?.trim() || '',  // Status is in 4th column
                        sector: cells[0]?.textContent?.trim() || '',  // Sector is in 1st column
                        lastUpdated: new Date().toISOString()
                    };

                    // Only add if essential fields are present
                    if (company.symbol && company.name) {
                        extractedCompanies.push(company);
                    }
                }
            });

            return extractedCompanies;
        });

        // Save companies data
        await saveCompanyData(companies);

        logInfo(`✅ Scraping Complete: ${companies.length} Companies`);
        return companies;
    } catch (error) {
        logError('Scraping failed:', error);
        throw error;
    } finally {
        if (browser) await browser.close();
    }
}

async function saveCompanyData(companies) {
    const contentDir = path.join(__dirname, '..', 'content', 'companies');
    
    // Ensure the directory exists
    await fs.mkdir(contentDir, { recursive: true });

    // Prepare data with timestamp
    const companyData = {
        timestamp: new Date().toISOString(),
        total: companies.length,
        companies: companies
    };

    const jsonFilePath = path.join(contentDir, 'companies.json');
    const mdFilePath = path.join(contentDir, 'companies.md');

    // Write JSON file
    await fs.writeFile(jsonFilePath, JSON.stringify(companyData, null, 2));

    // Generate Markdown
    const mdContent = `# Nepal Stock Exchange Companies

**Total Companies**: ${companies.length}
**Last Updated**: ${new Date().toISOString()}

${companies.map(company => `## ${company.symbol}
- **Symbol**: ${company.symbol}
- **Name**: ${company.name}
- **Status**: ${company.status}
- **Sector**: ${company.sector}
- **lastUpdated**: "${company.lastUpdated}"
`).join('\n')}

*Disclaimer: This data is automatically scraped and should be verified with official sources.*`;

    // Write Markdown file
    await fs.writeFile(mdFilePath, mdContent);

    logInfo(`✅ Saved: companies.json, companies.md`);
}

async function runScraper() {
    try {
        await scrapeCompanies();
        logInfo('✅ Scraping Completed');
    } catch (error) {
        logError('Scraping failed:', error);
    }
}

// Run immediately if script is executed directly
if (require.main === module) {
    runScraper();
}

module.exports = {
    scrapeCompanies,
    runScraper
};