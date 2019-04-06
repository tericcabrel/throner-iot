import * as path from 'path';

const multer = require('multer');

/** Storage Engine */
const storageEngine = multer.diskStorage({
  destination: './public/uploads',
  filename(req, file, fn) {
    fn(null, `${new Date().getTime().toString()}-${file.fieldname}${path.extname(file.originalname)}`);
  },
});

// init

const upload = multer({
  storage: storageEngine,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter(req, file, callback) {
    validateFile(file, callback);
  },
}).single('file');

const validateFile = (file, cb) => {
  const extension = (path.extname(file.originalname).toLowerCase() === '.json' || path.extname(file.originalname).toLowerCase() === '.csv');
  const mimeType = (file.mimetype.indexOf('json') > 0 || file.mimetype.indexOf('csv') > 0);
  if (extension) {
    return cb(null, true);
  } 
  cb('Invalid file type. Only JSON and CSV file are allowed !');
};

module.exports = upload;
