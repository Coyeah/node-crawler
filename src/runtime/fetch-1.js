const fs = require('fs');
const chalk = require('chalk');
const puppeteer = require('puppeteer');
const { route } = require('../config/default');

const sourceData = fs.readFileSync('../../data/yp3.txt').toString().split('|');
let tempObj = {};
let outData = {};

sourceData.map(value => {
  tempObj[value] = 1;
})
const data = [];
for (let key in tempObj) {
  data.push(key);
}
for (let i = 0; i < 5; i++) {
  data.shift();
}

function keyWordReplace (kw) {
  if (kw.indexOf('(') > 0 || kw.indexOf('（') > 0 || kw.indexOf('〖') > 0 || kw.indexOf('【') > 0) {
    if (kw.indexOf(')') > 0 || kw.indexOf('）') > 0 || kw.indexOf('〗') > 0 || kw.indexOf('】') > 0) {
      {
        let reg = /(\(|（|〖|【)(\d|\D)*(\)|）|〗|】)/g;
        let temp = kw.match(reg);
        let shadow = rejectWord(temp[0]);
        return kw.replace(temp[0], shadow.slice(1, -1).replace('(', '').replace(')', '').replace('（', '').replace('）', ''))
      }
    } else {
      {
        let reg = /(\(|（|〖)(\d|\D)*/g;
        let temp = kw.match(reg);
        let shadow = rejectWord(temp[0]);
        return kw.replace(temp[0], shadow.slice(1).replace('(', '').replace(')', '').replace('（', '').replace('）', ''))
      }
    }
  } else {
    return kw;
  }
}

function rejectWord (word) {
  return word
    .replace('胶囊', '')
    .replace('颗粒', '')
    .replace('滴丸', '')
    .replace('制药', '')
    .replace('药业', '')
    .replace('集团', '')
    .replace('现用', '')
    .replace('片', '')
    .replace('大盒', '')
    .replace('盒', '')
    .replace('新', '')
    .replace('粒', '')
    .replace('支', '')
    .replace('丸', '')
    .replace('国', '')
    .replace('有糖型', '')
    .replace('无糖型', '')
    .replace('有糖', '')
    .replace('无糖', '')
    .replace('/', '')
    .replace(',', '')
    .replace('、', '')
    .replace('、', '')
    .replace('县级', '')
    .replace('本院', '')
    .replace('进口', '')
    .replace('贵州', '')
    .replace('山西', '')
    .replace('广州', '')
    .replace('贵', '')
    .replace('基', '')
    .replace('的', '')
    .replace('省', '')
    .replace('增', '')
    .replace('*', '')
    .replace('mg', '')
    .replace('g', '')
    .replace('lm', '')
    .replace('天圣', '')
    .replace('仟源', '')
    .replace('白云山', '');
}

(async () => {
  // const browser = await puppeteer.launch({headless: false});
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    width: 1366,
    height: 1080
  });
  console.log(chalk.blue('LOG >>> ') + 'open new page and reset viewport');

  for (let i = 9000; i < 10000; i++) {
    console.log(chalk.red('NEW ONE >>>') + `num:< ${i} - ${data[i]} >`);
    let kw = keyWordReplace(data[i]);

    console.log(chalk.blue('LOG >>> ') + `going to http://yp.120ask.com/search?kw=${kw}`);
    await page.goto(`http://yp.120ask.com/search?kw=${kw}`);

    const targetUrl = await page.evaluate(() => {
      let temp = document.querySelector('.s_result_content ul li dl dt a');
      return temp ? temp.href : '';
    });

    console.log(chalk.blue('LOG >>> ') + `target url is ${targetUrl}`);
    if (!targetUrl) {
      continue;
    }

    await page.goto(targetUrl);

    console.log(chalk.blue('LOG >>> ') + chalk.green(data[i]) + ` is here`);
    const obj = await page.evaluate(() => {
      let obj = {};
      let target = [...document.querySelectorAll('.drugDecri .box .clears')];
      target.map((value, index) => {
        let temp = value.children;
        if (index === 0) {
          obj[temp[0].innerText] = temp[1].children[0].innerText.split('：')[1];
        } else {
          obj[temp[0].innerText] = temp[1].innerText;
        }
      })
      return obj;
    });

    console.log(chalk.blue('LOG >>> ') + chalk.green(obj['药品名称']) + ` is saved`);
    outData[data[i]] = obj;

    if (i % 1000 == 0 && i != 9000) {
      await fs.writeFile(`${route}/detialData-${1}-${Date.now()}.json`, JSON.stringify(outData), (err) => {
        if(err) {
          return console.log(err);
        }
        console.log(chalk.red('MAKE >>>') + `${route}/detialData-${1}-${Date.now()}.json was saved!`);
      });

      outData = {};
    }
  }

  await browser.close();

  await fs.writeFile(`${route}/detialData-${1}-${Date.now()}.json`, JSON.stringify(outData), (err) => {
    if(err) {
      return console.log(err);
    }
    console.log(chalk.red('MAKE >>>') + `${route}/detialData-${1}-${Date.now()}.json was saved!`);
  });
})();
