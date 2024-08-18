import puppeteer from "puppeteer";

const scrape = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://www.example.com');

    const title = await page.title();
    console.log(`Page title: ${title}`); 

    await browser.close();
};

scrape();
