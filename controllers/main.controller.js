import _ from 'lodash';
import * as fs from 'fs';

import logger from '../core/logger/app-logger';
import { readDirectory, readStoreFile, writeStoreFile } from '../core/utils/helpers';

const ftp = require('basic-ftp');
const httpClient = require('unirest');

const controller = {};

controller.savePictureInRemote = (files) => {
  return new Promise((resolve, reject) => {
    httpClient
      .post(`${process.env.API_URL}/pictures`)
      .headers({ Accept: 'application/json', 'Content-Type': 'application/json' })
      .send({ pictures: files })
      .then((response) => {
        console.log(response.body);
        return resolve(response.body);
      })
      .catch((err) => {
        logger.error(err);
        return reject(err);
      });
  });
};

controller.sendToServer = async (directory, files) => {
  let success = true;
  const length = files.length;
  const { FTP_HOST, FTP_USER, FTP_PASSWORD, FTP_SECURE, FTP_DIR } = process.env;
  const client = new ftp.Client();
  client.ftp.verbose = true;
  try {
    await client.access({
      host: FTP_HOST,
      user: FTP_USER,
      password: FTP_PASSWORD,
      secure: FTP_SECURE === 'true',
    });

    // Make sure that the given dirPath exists on the server, creating all directories as necessary.
    // The working directory is at dirPath after calling this method.
    await client.ensureDir(FTP_DIR);

    for (let i = 0; i < length; i += 1) {
      await client.upload(fs.createReadStream(`${directory}/${files[i]}`), files[i]);
    }
    await controller.savePictureInRemote(files);
  } catch (err) {
    success = false;
    logger.error(err);
  }
  client.close();

  return success;
};

controller.folderWatchDaemon = async () => {
  const directoryPath = process.env.WATCH_FOLDER_PATH;
  try {
    const filesOfDir = readDirectory(directoryPath);
    console.log(filesOfDir);
    const storedFiles = readStoreFile();
    console.log(storedFiles);

    const newFiles = _.difference(filesOfDir, storedFiles);
    console.log(newFiles);
    if (newFiles.length > 0) {
      const success = await controller.sendToServer(directoryPath, newFiles);
      if (success) {
        const newArray = [...storedFiles, ...newFiles];
        writeStoreFile(newArray);
      }
    }
  } catch (e) {
    logger.error(e);
  }
};

export default controller;
