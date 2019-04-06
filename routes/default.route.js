import * as path from 'path';

import { WELCOME_MESSAGE } from '../core/utils/constants';

const routes = (app) => {
  app.get('/', (req, res) => {
    res.json(WELCOME_MESSAGE);
  });

  app.get('/api/documentation', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/apidoc/index.html'));
  });

  app.use((error, req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
      return res.status(500).json({ error: `Unexpected error: ${error}` });
    }
    next(error);
  });
};

export default routes;
