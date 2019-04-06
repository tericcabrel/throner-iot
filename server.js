require('dotenv').config();

import * as path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import socketIO from 'socket.io';

import logger from './core/logger/app-logger';
import defaultRoute from './routes/default.route';
import exampleRoute from './routes/example.route';
import userRoute from './routes/users.route';
import authRoute from './routes/auth.route';
import  expressValidator from  'express-validator';
import RabbitConnectionManager from './core/messaging/rabbitConnectionManager';
import rabbitHandler from './core/messaging/rabbitHandler';


const port = process.env.SERVER_PORT;
logger.stream = {
  write(message, encoding) {
    // logger.info(`${message} - ${encoding !== undefined ? encoding.toString() : ''}`);
  },
};

let conn = null;
const rabbitConnection = async () => {
  conn = await RabbitConnectionManager.getInstance();
  await rabbitHandler(conn);
};

const app = express();

const server = http.createServer(app);
const io = socketIO(server);
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev', { stream: logger.stream }));
app.use(expressValidator());

rabbitConnection();

//defaultRoute(router, io);
//exampleRoute(router, io);
//userRoute(router, io);
//authRoute(router, io);
//app.use(router);

server.listen(port, () => {
  logger.info(`Server started - ${port}`, 1);
});
