import logger from '../core/logger/app-logger';
import { translate } from '../core/utils/helpers';

import {
  DEV_FINDALL_FAILED, PROD_FINDALL_FAILED,
} from '../core/utils/constants';

const controller = {};

controller.hello = (req, res) => {
  if (!req.body.name) {
    return res.send('An error occurred: Name is a required parameter !');
  }

  const name = req.body.name;
  const lang = req.headers.language || 'en';
  switch (lang) {
    case 'en':
      return res.send(`Hello, ${name}`);
    case 'es':
      return res.send(`Halo, ${name}`);
    case 'de':
      return res.send(`Hallo, ${name}`);
    default:
      return res.send('Error: Invalid Language !');
  }
};

controller.getAll = (req, res) => {
  try {
    res.json(translate('login', 'fr'));
  } catch (err) {
    logger.error(`${DEV_FINDALL_FAILED} example- ${err.stack}`);
    res.status(400).json({ error: `${PROD_FINDALL_FAILED} example` });
  }
};

export default controller;
