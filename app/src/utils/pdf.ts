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
      if (!content) {
        content = options.html
        fs.writeFile(`${output}.html`, content)
      }
      wkhtmltopdf(content, {
        ...options.wkhtmltopdfOptions,
        output,
      }, (err) => {
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
    // await (convertor[config.CONVERTOR] || convertor.wkhtmltopdf)(options, filename)
    await convertor.wkhtmltopdf(options, filename)
    return filename
  },
}
