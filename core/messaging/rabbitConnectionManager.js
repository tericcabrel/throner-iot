import logger from '../logger/app-logger';

const amqp = require('amqplib/callback_api');

class RabbitConnectionManager {
  static connection = null;
  static channel = null;
  
  static getInstance() {
    try {
      if (this.connection === null) {
        this.connection = this.getRabbitConnection();
      }
      
      return this.connection;
    } catch (ex) {
      throw new Error(ex);
    }
  }
  
  static getChannelInstance(conn) {
    try {
      if (this.channel === null) {
        this.channel = this.createChannel(conn);
      }
      
      return this.channel;
    } catch (ex) {
      throw new Error(ex);
    }
  }
  
  static async getRabbitConnection() {
    const opts = { };
    const { RABBITMQ_HOST, RABBITMQ_PORT, RABBITMQ_USER, RABBITMQ_PASSWORD, RABBITMQ_VHOST } = process.env;

    // create a new promise inside of the async function
    let promise = new Promise((resolve, reject) => {
      amqp.connect({
        protocol: 'amqp',
        hostname: RABBITMQ_HOST,
        port: RABBITMQ_PORT,
        username: RABBITMQ_USER,
        password: RABBITMQ_PASSWORD,
        locale: 'en_US',
        frameMax: 0,
        heartbeat: 0,
        vhost: RABBITMQ_VHOST,
      }, opts, function(err, conn) {
        if (err) {
          return reject(err);
        }
        logger.info('Successfully connected to RabbitMQ Server !');
        return resolve(conn);
      });
    });
    
    // wait for the promise to resolve
    return await promise;
  }
  
  static async createChannel(conn) {
    let promise = new Promise((resolve, reject) => {
      conn.createChannel(function(err, ch) {
        if (err) {
          return reject(err);
        }
        return resolve(ch);
      });
    });
    
    return await promise;
  }
}

export default RabbitConnectionManager;
