import * as jwt from 'jsonwebtoken';
import config from '../../config/jwt';

import {
  NO_TOKEN_PROVIDED,AUTHENTICATION_FAILED,UNAUTHORIZED_MESSAGE
} from '../../core/utils/constants';

const authenticated = (req, res, next) => {

  var token = req.headers['x-access-token'];
  if (!token)
    return res.status(403).json({ auth: false, message: NO_TOKEN_PROVIDED });
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err)
      return res.status(500).json({ auth: false, message: AUTHENTICATION_FAILED });
    if (!decoded.id) 
      return res.status(401).json({ message: UNAUTHORIZED_MESSAGE });
    // if everything good, save to request for use in other routes
    req.userId = decoded.id;
    next();
  });
  
  //return next();
};

export default authenticated;
