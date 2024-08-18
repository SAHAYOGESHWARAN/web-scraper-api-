import puppeteer from "puppeteer";

const scrape = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Define the URL to visit
    const url = 'https://books.toscrape.com';
    
    // Navigate to the URL
    await page.goto(url);

    // Get the page title
    const title = await page.title();
    console.log(`Page title: ${title}`); 

    // Extract book information
    const books = await page.evaluate(() => {
        const books = document.querySelectorAll('.product_pod');
        return Array.from(books).map(book => {
            // Extract and return the book title and price
            const title = book.querySelector('h3 a').getAttribute('title');
            const price = book.querySelector('.price_color').innerText;
            return { title, price };
        });
    });

    // Log the extracted book data
    console.log(books);

    // Close the browser
    await browser.close();
};

// Run the scrape function
scrape();
