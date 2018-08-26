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
      let lock = false;
      for (let i = 0; i < extract.length; i++) {
        if (lock) {
          if (extract[i].indexOf('【') > 0 || extract[i].indexOf('】') > 0) {
            break;
          } else {
            obj['处方'] += ' ' + extract[i];
          }
        } else if (extract[i].indexOf('【处方】') > 0) {
          lock = true;
          obj['处方'] = extract[i].replace('【处方】', '').trim();
        }
      }

      let temp = obj['处方'] || '';
      if (temp.indexOf('<span') > 0) {
        obj['处方'] = temp.split('<span')[0];
      }

      extract.forEach(value => {
        if (value.indexOf('【功能与主治】') > 0) {
          if (obj['功能与主治'])  {
            obj['功能与主治'] += value.replace('【功能与主治】', '').trim();
          } else {
            obj['功能与主治'] = value.replace('【功能与主治】', '').trim();
          }
          return;
        }
      })
    }

    textData[name] = obj;
    console.log('textData saved.');
    // console.log(extract);
  });

  data = await JSON.parse(fs.readFileSync('./data/itemMap-1.json'));
  console.log(data.length);

  for (; index < data.length; index++) {
    if (!data[index]) continue;

    console.log(`going to ${index} ${data[index].href}`);
    await page.goto(data[index].href);

    await page.waitFor(1200);
  }

  await browser.close();

  await fs.writeFile(route + '/detialData.json', JSON.stringify(textData), (err) => {
    if(err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
})();
