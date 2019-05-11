require('dotenv').config();

import http from 'http';
import * as path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';

import logger from './core/logger/app-logger';
import RabbitConnectionManager from './core/messaging/rabbitConnectionManager';
import rabbitHandler from './core/messaging/rabbitHandler';
import mainController from './controllers/main.controller';

const port = process.env.SERVER_PORT;

let conn = null;
const rabbitConnection = async () => {
  conn = await RabbitConnectionManager.getInstance();
  await rabbitHandler(conn);
};

const app = express();

const server = http.createServer(app);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev', { stream: logger.stream }));

server.listen(port, async () => {
  logger.info(`Server started - ${port}`, 1);

  // await rabbitConnection();

  let working = false;
  const watchInterval = process.env.WATCH_INTERVAL;

  if (watchInterval > 0) {
    setInterval(async () => {
      if (!working) {
        working = true;
        await mainController.folderWatchDaemon();
        working = false;
      }
    }, watchInterval * 1000);
  }
});
