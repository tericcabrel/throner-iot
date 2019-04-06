import * as fs from 'fs';
import moment from 'moment';
import * as path from 'path';

export const createJSONFile = (data, filePrefix) => {
  const dirPath = path.join(__dirname, '../../public');
  const dataStr = JSON.stringify({ data });
  const filename = `${filePrefix}_${moment().format('YYYY-MM-DD_hh:mm:ss')}.json`;
  const filepath = `${dirPath}/${filename}`;
  fs.writeFileSync(filepath, dataStr);
  
  return { path: filepath, name: filename };
};

export const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};
