const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');
const BASE_URL = 'http://localhost:3567';

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function captureScreenshots() {
    console.log('Launching browser with WebGL support...');

    const browser = await puppeteer.launch({
        headless: false,
        args: [
            '--enable-webgl',
            '--enable-webgl2',
            '--enable-gpu',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--ignore-gpu-blocklist',
            '--window-size=1920,1080',
            '--enable-accelerated-2d-canvas',
            '--enable-unsafe-swiftshader'
        ],
        defaultViewport: {
            width: 1920,
            height: 1080
        }
    });

    const page = await browser.newPage();

    // Suppress console spam
    page.on('console', msg => {
        const text = msg.text();
        if (!text.includes('projectionMatrixInverse') && !text.includes('404')) {
            console.log('PAGE:', text);
        }
    });

    try {
        // Load the page fresh for additional screenshots
        console.log(`Navigating to ${BASE_URL}...`);
        await page.goto(BASE_URL, {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });

        console.log('Waiting for scene to render...');
        await delay(6000);

        // Capture different camera angles by moving mouse
        console.log('Capturing additional Above scene angles...');

        // Top-left area
        await page.mouse.move(400, 300);
        await delay(2000);
        console.log('Capturing: scene1_topleft.png');
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, 'scene1_topleft.png'),
            fullPage: false
        });

        // Bottom-right area
        await page.mouse.move(1500, 800);
        await delay(2000);
        console.log('Capturing: scene1_bottomright.png');
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, 'scene1_bottomright.png'),
            fullPage: false
        });

        // Center close
        await page.mouse.move(960, 540);
        await delay(2000);
        console.log('Capturing: scene1_center.png');
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, 'scene1_center.png'),
            fullPage: false
        });

        console.log('\nScreenshot capture complete!');
        console.log(`Screenshots saved to: ${SCREENSHOTS_DIR}`);

        const files = fs.readdirSync(SCREENSHOTS_DIR);
        console.log(`\nTotal ${files.length} screenshots:`);
        files.forEach(f => console.log(`  - ${f}`));

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        console.log('\nClosing browser...');
        await browser.close();
    }
}

captureScreenshots().catch(console.error);
