# 基于医疗大数据的爬虫NODE

## 对象网站：

[便民查询网 - 药品查询](https://yaopin.51240.com/)

这个网站很多东西都能查询，而且网站结构简单有规律，相对爬起来容易。所以我写的代码比较入门，也是刚入门nodeJS。

**【持续更新】**

## 使用框架：

```
npm i --save puppeteer
```

## 文件结构：

```
data                       =>  存放爬取数据
src                        =>  主要代码
src/config/default.js      =>  默认属性
src/fetchHomePageList.js   =>  爬取首页列表数据
src/fetchItemContent-*.js  =>  对应路径数组对应内容，根据不同需求
src/index.js               =>  爬取路径数组
```
## 关于puppeteer：

puppeteer(木偶师)，我觉得这个名字就很有意思，github上的README上有着清晰的例子，这里就不过多赘述。[[传送门]](https://github.com/GoogleChrome/puppeteer)

### 部分API：

```
const browser = await puppeteer.launch({  // 设置模拟浏览器
  timeout: 15000,  // 设置超时时间
  headless: false,  // 关闭headless模式，则不会打开模拟浏览器
  devtools: true,  // 打开开发者工具
});

const page = browser.newPage();  // 打开一个新标签页

await page.goto(URL);  // 跳转指定URL页面，如果页面跳转中有加载超时会报错
await page.goto(URL, {timeout: 3000}).then(() => {
  // do someting...
});

await page.focus('#elementId/.elementClass/elementTag');  // 设置焦点所在

await page.click('#elementId/.elementClass/elementTag');  // 设置点击元素

await page.$();  // 获取DOM属性，类似 querySelector()

await page.$$();  // 获取DOM属性，类似 querySelectorALL()

await page.evaluate(() => { ... });  // 跳转环境到浏览器环境，类似于在浏览器中使用JS

await page.waitFor(1200);  // 设置等待时间

await page.screenshot({  // 浏览器截屏
  path: route,  // 保存路径
});

await page.pdf({
  path: route,  // 保存路径
  format: 'A4',  // 保存尺寸
});

await browser.close();  // 关闭浏览器
```
