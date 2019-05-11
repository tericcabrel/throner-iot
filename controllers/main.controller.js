import _ from 'lodash';
import * as fs from 'fs';
import httpClient from 'unirest';

import logger from '../core/logger/app-logger';
import {
  readDirectory, readStoreFile, writeStoreFile,
} from '../core/utils/helpers';


const uploadFile = (filePath, fileName) => {
  return new Promise((resolve, reject) => {
    httpClient
      .post(`${process.env.API_URL}/pictures/upload`)
      .headers({ 'Content-Type': 'multipart/form-data' })
      .field('filename', fileName) // Form field
      .attach('picture', filePath) // Attachment
      .then((response) => {
        // console.log(response.body);
        return resolve(response.body);
      })
      .catch((err) => {
        logger.error(err);
        return reject(err);
      });
  });
};

const controller = {};

controller.sendToServer = async (directory, files) => {
  let success = true;
  const length = files.length;

  try {
    for (let i = 0; i < length; i += 1) {
      await uploadFile(`${directory}/${files[i]}`, files[i]);
    }
  } catch (err) {
    success = false;
    logger.error(err);
  }
  return success;
};

controller.folderWatchDaemon = async () => {
  console.log('Watch daemon start !');
  const directoryPath = process.env.WATCH_FOLDER_PATH;
  try {
    const filesOfDir = readDirectory(directoryPath);
    // console.log(filesOfDir);
    const storedFiles = readStoreFile();
    // console.log(storedFiles);

    const newFiles = _.difference(filesOfDir, storedFiles);
    // console.log(newFiles);
    if (newFiles.length > 0) {
      const success = await controller.sendToServer(directoryPath, newFiles);
      if (success) {
        const newArray = [...storedFiles, ...newFiles];
        writeStoreFile(newArray);
      }
    }

    console.log('Watch daemon completed !');
  } catch (e) {
    logger.error(e);
  }
};

export default controller;
