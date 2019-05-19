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
  sendCommand: {
    send: 'send_command_request',
    receive: 'send_command_response',
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

  /* ======================================= SEND COMMAND ======================================= */
  channel.assertQueue(exchanges.sendCommand.send, { durable: false });
  channel.consume(exchanges.sendCommand.send, async (msg) => {
    if (msg !== null) {
      logInDev(msg);
      const message = JSON.parse(msg.content.toString());

      const { type, action } = message;

      // TODO child process to manage action

      const data = JSON.stringify({
        clientID: message.clientID,
        processID: message.processID,
        message: { type, action },
      });

      channel.assertQueue(exchanges.sendCommand.receive, { durable: false });
      channel.sendToQueue(exchanges.sendCommand.receive, Buffer.from(data));
    }
  }, { noAck: true });
  /* ======================================= SEND COMMAND ======================================= */
};

export default rabbitHandler;
