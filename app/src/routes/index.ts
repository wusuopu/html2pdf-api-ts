import express from 'express';
import * as health from '../controllers/health';
import pdf from './pdf';

export default {
  init (app: express.Application) {
    app.get('/_health', health.check);
    app.use('/api/v1/pdf', pdf);
  },
}
