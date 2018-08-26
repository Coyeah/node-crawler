const fs = require('fs');
const puppeteer = require('puppeteer');
const {
  route
} = require('./config/default');

let pageKey = 1;
let pageMap = {
  // 1: 'https://yaopin.51240.com/8a2c9_1__yaopinlist/'
  1: 'https://yaopin.51240.com/qbxut_1__yaopinlist/'
};
let data = [];

(async () => {
  // const browser = await puppeteer.launch({headless: false});
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    width: 700,
    height: 1080
  });
  console.log('open new page and reset viewport.');

  page.on('load', async () => {
    console.log('page loading done, start fetch...');

    pageMap = await page.evaluate(() => {
      var as = [...document.querySelectorAll('.k_pagelist a')];
      var target = {};
      as.map((a) => {
        target[a.text] = a.href.trim();
      });
      return target;
    });
    console.log('recorded the page map.');

    var aTags = await page.evaluate(() => {
      var as = [...document.querySelectorAll('.list li a')];
      return as.map((a) => {
        return {
          href: a.href.trim(),
          name: a.text
        };
      });
    });

    data = [...data, ...aTags];
    console.log('data saved.');
  });

  for (; pageKey <= 20; pageKey++) {
    if (!pageMap[pageKey]) continue;

    console.log(`going to ${pageMap[pageKey]}`);
    await page.goto(pageMap[pageKey]);

    await page.waitFor(2000);
  }

  console.log(data.length);

  await browser.close();

  await fs.writeFile(route + '/itemMap-2.json', JSON.stringify(data), (err) => {
    if(err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });


})();
