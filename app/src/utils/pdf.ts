import fs from "fs-extra";
import path from "path";
import { v4 as uuidv4 } from 'uuid';
import wkhtmltopdf from "wkhtmltopdf";
import puppeteer from 'puppeteer-core';
import config, { ROOT_PATH } from '@/config';

interface Options {
  url: string;
  html: string;
  wkhtmltopdfOptions: any;
  chromeOptions: any;
}

let CHROMIUM_BROWSER
const createChromium = async () => {
  if (CHROMIUM_BROWSER) {
    return CHROMIUM_BROWSER
  }
  CHROMIUM_BROWSER = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    headless: true,
    executablePath: config.GOOGLE_CHROME_BIN_PATH,
    defaultViewport: {
      width: 550,
      height: 550
    },
    args: [
      '--disable-background-networking',
      '--disable-background-timer-throttling',
      '--disable-client-side-phishing-detection',
      '--disable-default-apps',
      '--disable-extensions',
      '--disable-hang-monitor',
      '--disable-popup-blocking',
      '--disable-prompt-on-repost',
      '--disable-sync',
      '--disable-translate',
      '--disable-gpu',
      '--metrics-recording-only',
      '--no-first-run',
      '--safebrowsing-disable-auto-update',
      '--no-sandbox',
      '--hide-scrollbars',
      // '--default-background-color=00000000',    // 透明背景
    ]
  })

  CHROMIUM_BROWSER.on('disconnected', () => {
    console.log('chromium disconnected')
    CHROMIUM_BROWSER = null
  })

  return CHROMIUM_BROWSER
}

const convertor = {
  wkhtmltopdf (options: Options, output: string): Promise<void> {
    // https://wkhtmltopdf.org/usage/wkhtmltopdf.txt
    return new Promise((resolve, reject) => {
      let content = options.url
      let htmlFile
      if (!content) {
        if (config.NODE_ENV === 'development') {
          htmlFile = `${output}.html`
          fs.writeFile(htmlFile, options.html)
        }
        // content = `file://${htmlFile}`
        content = options.html
      }
      wkhtmltopdf(content, {
        encoding: 'utf8',
        ...options.wkhtmltopdfOptions,
        debug: config.NODE_ENV === 'development',
        output,
      }, (err) => {
        if (config.NODE_ENV === 'production' && htmlFile) {
          // 删除生成的文件
          fs.unlink(htmlFile)
        }
        if (err) {
          console.log('wkhtmltopdf error:', err)
          reject(err)
        }
        resolve()
      })
    })

  },
  async chrome (options: Options, output: string) {
    // https://pptr.dev/api
    await createChromium()
    const page = await CHROMIUM_BROWSER.newPage()
    if (options.url) {
      await page.goto(options.url);
    } else {
      if (config.NODE_ENV === 'development') {
        fs.writeFile(`${output}.html`, options.html)
      }
      await page.evaluate(`document.body.innerHTML = ${JSON.stringify(options.html)}`)
    }

    await page.pdf({
      ...options.chromeOptions,
      path: output,
    })

    await page.close()
  },
}

export default {
  async convert (options: Options): Promise<string> {
    const outDir = path.join(ROOT_PATH, 'tmp/pdf')
    await fs.ensureDir(outDir)
    const filename = path.join(outDir, `${uuidv4()}.pdf`)
    await (convertor[config.CONVERTOR] || convertor.wkhtmltopdf)(options, filename)
    return filename
  },
}
