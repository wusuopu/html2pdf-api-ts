import fs from "fs-extra";
import path from "path";
import { v4 as uuidv4 } from 'uuid';
import wkhtmltopdf from "wkhtmltopdf";
import config, { ROOT_PATH } from '@/config';

interface Options {
  url: string;
  html: string;
  wkhtmltopdfOptions: any;
  chromeOptions: any;
}

const convertor = {
  wkhtmltopdf (options: Options, output: string): Promise<void> {
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
