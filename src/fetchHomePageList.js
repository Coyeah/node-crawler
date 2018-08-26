const puppeteer = require('puppeteer');

(async () => {
  // const browser = await puppeteer.launch({headless: false});
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    width: 700,
    height: 1080
  });
  console.log('open new page and reset viewport.');

  await page.goto('https://yaopin.51240.com/8a2c9_1__yaopinlist/');
  console.log('go to https://yaopin.51240.com/8a2c9_1__yaopinlist/');

  // await page.focus('#zdssname');
  // await page.keyboard.sendCharacter('金嗓清音丸');
  // await page.click('#button');
  // console.log('go to search page.');

  // page.on('load', async () => {
    console.log('page loading done, start fetch...');

    let aTags = await page.evaluate(() => {
      let as = [...document.querySelectorAll('.list li a')];
      return as.map((a) =>{
        return {
          href: a.href.trim(),
          name: a.text
        };
      });
    });

    console.log(aTags.length);

    await browser.close();
  // });

  // await page.screenshot({
  //   path: `${route}/${Date.now()}.png`
  // });
  // await browser.close();
})();
