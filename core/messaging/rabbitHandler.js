import axios from 'axios';
import logger from '../logger/app-logger';
import RabbitConnectionManager from './rabbitConnectionManager';

const logInDev = (msg) => {
  logger.info(`[*] Received data: ${msg.content.toString()}`);
};

const exchanges = {
  takePicture: {
    send: 'SEND_PICTURE_CAPTURE',
    receive: 'RECEIVE_PICTURE_CAPTURE',
  },
};

module.exports = async (conn) => {
  const channel = await RabbitConnectionManager.getChannelInstance(conn);

  channel.assertQueue(exchanges.takePicture.send, { durable: false });
  channel.consume(exchanges.takePicture.send, async (msg) => {
    if (msg !== null) {
      logInDev(msg);
	const response = await axios.get(`${process.env.MOTION_URL}0/action/snapshot`);
	const data = '{"message": "ok"}';
      channel.assertQueue(exchanges.takePicture.receive, { durable: false });
      channel.sendToQueue(exchanges.takePicture.receive, Buffer.from(data));
    }
  }, { noAck: true });
};
