import { Request, Response } from 'express';
import path from "path";
import fs from "fs-extra";
import validator from 'validator';
import config from '@/config'
import logger from '@/utils/logger';
import pdf from '@/utils/pdf';

export default {
  /**
   * POST /
   * body:
   *  url: string;
   *  html: string;
   *  wkhtmltopdfOptions: Object;
   *  chromeOptions Object;
   */
  async create (req: Request, res: Response) {
    if (!validator.isURL(req.body.url) && !req.body.html) {
      return res.status(400).json({errors: ['缺少 url 或者 html 参数'], success: false});
    }

    let file
    try {
      file = await pdf.convert(req.body)
    } catch (error) {
      logger.error(`convert pdf error ${error}`)
      console.log(error)
      return res.status(500).json({errors: ['pdf转化失败'], success: false});
    }

    if (!await fs.exists(file)) {
      return res.status(500).json({errors: ['pdf转化失败'], success: false});
    }

    logger.debug(`generate ${file}`)
    res.sendFile(file, {
      headers: {
        'Content-Disposition': `attachment; filename="${encodeURIComponent(path.basename(file))}"`,
        'Content-Type': 'application/octet-stream',
      },
    }, (err) => {
      if (err) {
        throw err
      }
      if (config.NODE_ENV === 'production') {
        // 删除生成的文件
        fs.unlink(file)
      }
    })
  },
}
