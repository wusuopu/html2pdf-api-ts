# html2pdf-api-ts
使用 typescript 开发的将html转为pdf的程序。

开发环境：
  * node v16.13.0
  * yarn 1.22.15

## api 手册
  * POST /api/v1/pdf        生成pdf
```
请求body：
  url: string;
    需要转换的网址
  html: string;
    需要转换的html内容，html 与 url 参数二者必须传一个
  wkhtmltopdfOptions: object;(选填)
    wkhtmltopdf 的额外参数，使用小驼峰形式；参考： https://wkhtmltopdf.org/usage/wkhtmltopdf.txt
  chromeOptions: object;(选填)
    生成 pdf 时的一些配置；参考： https://pptr.dev/api/puppeteer.pdfoptions

返回：
  执行成功则返回 200 状态码和 pdf 文件的二进制内容。
```

## 启动服务
### 使用 docker 启动
使用 chrome 进行转换： `docker run -d -it -p 80 wusuopu/html2pdf-api-ts:v1.1.0-chrome`

使用 wkhtmltopdf 进行转换： `docker run -d -it -p 80 wusuopu/html2pdf-api-ts:v1.1.0-wkhtml2pdf`


### 通过源码启动
下载源代码之后，基于 `.env.example` 创建 `.env` 文件；

```
cd app/
yarn
yarn build
yarn start
```
