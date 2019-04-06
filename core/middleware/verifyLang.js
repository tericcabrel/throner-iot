const verifyLang = (req, res, next) => {
  var lang = req.headers['language'];
  if (!lang)
    global.language= 'en';
  global.language= lang;
  next();
};

export default verifyLang;