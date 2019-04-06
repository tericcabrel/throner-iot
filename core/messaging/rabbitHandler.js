import axios from 'axios';
import logger from '../logger/app-logger';
import RabbitConnectionManager from './rabbitConnectionManager';

const logInDev = (msg) => {
  logger.info(`[*] Received data: ${msg.content.toString()}`);
};

const exchanges = {
  takePicture: {
    send: 'picture_capture_request',
    receive: 'picture_capture_response',
  },
};

const rabbitHandler = async (conn) => {
  const channel = await RabbitConnectionManager.getChannelInstance(conn);

  channel.assertQueue(exchanges.takePicture.send, { durable: false });
  channel.consume(exchanges.takePicture.send, async (msg) => {
    if (msg !== null) {
      logInDev(msg);
      const response = await axios.get(`${process.env.MOTION_URL}0/action/snapshot`);
      console.log(response);
      const message = JSON.parse(msg.content.toString());
      const data = JSON.stringify({ clientID: message.clientID, processID: message.processID, message: 'ok' });

      channel.assertQueue(exchanges.takePicture.receive, { durable: false });
      channel.sendToQueue(exchanges.takePicture.receive, Buffer.from(data));
    }
  }, { noAck: true });
};

export default rabbitHandler;
