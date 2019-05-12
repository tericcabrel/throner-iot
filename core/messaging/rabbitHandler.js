import * as path from 'path';
import axios from 'axios';

import logger from '../logger/app-logger';
import RabbitConnectionManager from './rabbitConnectionManager';

const exec = require('child_process').exec;
const scriptPath = path.join(__dirname, '../../public/script/');

const logInDev = (msg) => {
  logger.info(`[*] Received data: ${msg.content.toString()}`);
};

const exchanges = {
  takePicture: {
    send: 'picture_capture_request',
    receive: 'picture_capture_response',
  },
  checkStatus: {
    send: 'check_status_request',
    receive: 'check_status_response',
  },
};

const getBatteryStatus = () => {
  const cmd = `python ${scriptPath}${process.env.BATTERY_FILENAME}`;

  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) return resolve(false);
      if (stderr) return resolve(false);
      resolve(stdout);
    });
  });
};

const rabbitHandler = async (conn) => {
  const channel = await RabbitConnectionManager.getChannelInstance(conn);
  // const battery = await getBatteryStatus();
  // console.log('Batttery => ', battery);
  channel.assertQueue(exchanges.takePicture.send, { durable: false });
  channel.consume(exchanges.takePicture.send, async (msg) => {
    if (msg !== null) {
      logInDev(msg);
      await axios.get(`${process.env.MOTION_URL}0/action/snapshot`);

      const message = JSON.parse(msg.content.toString());
      const data = JSON.stringify({ clientID: message.clientID, processID: message.processID, message: 'ok' });

      channel.assertQueue(exchanges.takePicture.receive, { durable: false });
      channel.sendToQueue(exchanges.takePicture.receive, Buffer.from(data));
    }
  }, { noAck: true });


  /* ======================================= CHECK STATUS ======================================= */
  channel.assertQueue(exchanges.checkStatus.send, { durable: false });
  channel.consume(exchanges.checkStatus.send, async (msg) => {
    if (msg !== null) {
      logInDev(msg);

      // TODO child process to run python file who return the battery status
      // const battery = Math.round(Math.random() * 100);
      const battery = await getBatteryStatus() || 0;

      const message = JSON.parse(msg.content.toString());
      const data = JSON.stringify({
        clientID: message.clientID,
        processID: message.processID,
        message: { status: 'on', battery },
      });

      channel.assertQueue(exchanges.checkStatus.receive, { durable: false });
      channel.sendToQueue(exchanges.checkStatus.receive, Buffer.from(data));
    }
  }, { noAck: true });
  /* ======================================= CHECK STATUS ======================================= */
};

export default rabbitHandler;
