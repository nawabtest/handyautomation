const puppeteer = require('puppeteer');
const args = process.argv.slice(2);
var index = args[0];
const url = args[1];
const filenameOption = args[2] || 'title'; // filenameOption will be 'title' if not specified

(async() => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--headless',
      '--disable-gpu'
    ]
  });

  console.log('index='+index+' url='+url);

  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.setViewport({ width: 1024, height: 768 });

  try {
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  } catch (error) {
    console.error(`Failed to load URL: ${url}, Error: ${error}`);
    await browser.close();
    process.exit(1);
  }

  page.on('console', (msg) => console.log('', msg.text()));

  await page.evaluate(`(${(async () => {

    const innerHeight = Math.max( document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight );
    console.log('height='+innerHeight+' ');

    await new Promise((resolve) => {
      let totalHeight = 0;
      let scrolled_times = 0;
      const distance = 100;

      const timer = setInterval(() => {
        const scrollHeight = innerHeight; //document.body.scrollHeight;
        scrolled_times++;
        window.scrollBy(0, distance);
        totalHeight += distance;
  
        if (totalHeight >= scrollHeight) {
            window.scrollTo(0, 0);
            console.log("scrolled "+scrolled_times+" times");
            clearInterval(timer);
            resolve();
        }
      }, 100);
    });
  })})()`);
 

  filename = index + "_" + filenameOption+ `_${Date.now()}` + '.png';

  console.log(`filename=${filename}\n`);

  try {
    await page.screenshot({
      path: '../sc_proj/result/'+filename,
      //path: filename,
      fullPage: true
    });
  } catch (error) {
    console.error(`Failed to take screenshot for URL: ${url}, Error: ${error}`);
    await browser.close();
    process.exit(1);
  } finally {
    await browser.close();
  }
})();

