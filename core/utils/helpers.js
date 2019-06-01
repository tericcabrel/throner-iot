import * as fs from 'fs';
import * as path from 'path';

import logger from '../logger/app-logger';

const publicPath = '../../public/uploads';
const storeFileName = 'store.json';
const dirPath = path.join(__dirname, publicPath);
const filepath = `${dirPath}/${storeFileName}`;

export const writeStoreFile = (data) => {
  const dataStr = JSON.stringify({ pictures: data });
  fs.writeFileSync(filepath, dataStr);
};

export const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

export const readStoreFile = () => {
  const data = fs.readFileSync(filepath);
  try {
    const parsed = JSON.parse(data);
    return parsed.pictures;
  } catch (e) {
    logger.error(e);
    return [];
  }
};

export const readDirectory = (directoryPath) => {
  return fs.readdirSync(directoryPath);
};
