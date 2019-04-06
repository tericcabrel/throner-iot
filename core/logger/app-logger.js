require('dotenv').config();

import path from 'path';
import * as fs from 'fs';
import * as winston from 'winston';
import * as rotate from 'winston-daily-rotate-file';

const dir = path.join(__dirname, process.env.LOG_FILE_DIR);

const logger = {};

const localLogger = new winston.Logger({
  level: 'info',
  transports: [
    new (winston.transports.Console)({
      colorize: true,
    }),
    new winston.transports.DailyRotateFile({
      filename: process.env.LOG_FILE_NAME,
      dirname: dir,
      maxsize: 20971520, // 20MB
      maxFiles: 25,
      datePattern: '.dd-MM-yyyy',
    }),
  ],
});

logger.error = (message) => {
  localLogger.error((message.stack) ? message.stack : message);
};

logger.info = (message) => {
  localLogger.info(message);
};

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

export default logger;
