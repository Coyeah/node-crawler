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
