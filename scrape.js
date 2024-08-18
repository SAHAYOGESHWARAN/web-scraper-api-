import puppeteer from "puppeteer";
import fs from "fs";

const scrape = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const allBooks = [];
    let currentPage = 1;
    const maxPages = 10;

    

    while (currentPage <= maxPages) {
        const url = `https://books.toscrape.com/catalogue/page-${currentPage}.html`;

        // Navigate to the URL
        await page.goto(url);

        // Get the page title
        const title = await page.title();
        console.log(`Page title: ${title}`); 

        // Extract book information
        const books = await page.evaluate(() => {
            const books = document.querySelectorAll('.product_pod');
            return Array.from(books).map(book => {
                // Extract the book title and price
                const title = book.querySelector('h3 a').getAttribute('title');
                const price = book.querySelector('.price_color').innerText;

                // Extract stock information (if available)
                const stock = book.querySelector('.instock.availability').innerText.trim();

                // Extract rating information (based on class name)
                const ratingClass = book.querySelector('.star-rating').classList;
                const rating = ratingClass.contains('One') ? 1 : 
                               ratingClass.contains('Two') ? 2 : 
                               ratingClass.contains('Three') ? 3 : 
                               ratingClass.contains('Four') ? 4 : 5;

                // Extract the link to the book's detail page
                const link = book.querySelector('h3 a').getAttribute('href');
                const fullLink = new URL(link, document.baseURI).href;

                return { title, price, stock, rating, link: fullLink };
            });
        });

        allBooks.push(...books);
        console.log(`Scraped page ${currentPage} successfully`);

        // Increment the current page
        currentPage++;
    }

    // Save the scraped data to a JSON file
    fs.writeFileSync('books.json', JSON.stringify(allBooks, null, 2));

    // Log a success message
    console.log('Data saved to books.json');

    // Close the browser
    await browser.close();
};

// Run the scrape function
scrape();
