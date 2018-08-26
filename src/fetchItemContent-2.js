const fs = require('fs');
const puppeteer = require('puppeteer');
const {
  route
} = require('./config/default');

let data = [];
let textData = {};
let index = 0;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    width: 700,
    height: 1080
  });
  console.log('open new page and reset viewport');

  page.on('load', async () => {
    console.log('page loading done, start fetch...');

    var content = await page.evaluate(() => {
      return document.querySelector('.neirong').innerHTML;
    });

    var name = await page.evaluate(() => {
      return document.querySelector('.h2dabiaoti').innerHTML;
    });

    var extract = content.split('<br>');
    var obj = {
      '名字': name,
    };
    if (textData[name]) {
      var obj = textData[name];
    }

    {
      extract.forEach(value => {
        if (value.indexOf('【化学成分】') > 0) {
          obj['化学成分'] = value.replace('【化学成分】', '').trim();
          return;
        } else if (value.indexOf('【药理作用】')) {
          obj['药理作用'] = value.replace('【药理作用】', '').trim();
          return;
        }
      })
    }

    textData[name] = obj;
    console.log('textData saved.');
    // console.log(extract);
  });

  data = await JSON.parse(fs.readFileSync('./data/itemMap-2.json'));
  console.log(data.length);

  for (; index < data.length; index++) {
    if (!data[index]) continue;

    console.log(`going to ${index} ${data[index].href}`);
    await page.goto(data[index].href);

    await page.waitFor(1200);
  }

  await browser.close();

  await fs.writeFile(route + '/detialData-2.json', JSON.stringify(textData), (err) => {
    if(err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
})();
