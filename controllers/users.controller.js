
import uuid from 'uuid/v4';
import * as bcrypt from 'bcryptjs';
import config from '../config/jwt';
import * as jwt from 'jsonwebtoken';
import User from '../models/users.model';
import logger from '../core/logger/app-logger';
import userTransformer from '../core/transformers/user';
import { parseRequest, validationHandler } from '../core/utils/helpers'; 
import userCollectionTransformer from '../core/transformers/usercollection';

import {
  DELETION_FAILED, DELETION_SUCCESS, DEV_CREATION_FAILED, DEV_FIND_FAILED, DEV_FINDALL_FAILED,
  DEV_UPDATE_FAILED, PROD_CREATION_FAILED, PROD_FIND_FAILED, PROD_FINDALL_FAILED,
  PROD_UPDATE_FAILED, EMAIL_EXIST, UNAUTHORIZED_RESSOURCE,NOT_FOUND_MESSAGE
} from '../core/utils/constants';

const controller = {};

controller.index = async (req, res) => {
    try {
      const users = await User.getAll();
      res.json(userCollectionTransformer(users));
    } catch (err) {
      logger.error(`${DEV_FINDALL_FAILED} users- ${err}`);
      res.status(400).json({ error: `${PROD_FINDALL_FAILED} users` });
    }
};

controller.store = async (req, res) => { 
  try {
    const { name, username, email } = req.body
    const password = bcrypt.hashSync(req.body.password, 8)
    const user_id = uuid()
    const email_token = bcrypt.hashSync(email, 8);
    const user = new User({
      user_id, name, username,email, password, email_token
    })
    const savedUser = await User.add(user)
    // create a token
    var token = jwt.sign({ id: user.user_id }, config.secret, {
      expiresIn: config.expiresIn
    })

    res.status(201).json({ auth: true, user_id: savedUser.user_id, token: token, })
  
  } catch (err) {
    logger.error(`${DEV_CREATION_FAILED} user - ${err}`);
    res.status(400).json({ error: `${PROD_CREATION_FAILED} user` });
  }
};

controller.show = async (req, res) => {
    try {
      const user = await User.get(req.params.id); 
      if (!user)
         return res.status(404).json({ message: NOT_FOUND_MESSAGE });
      res.json(userTransformer(user));
    } catch (err) {
      logger.error(`${DEV_FIND_FAILED} user- ${err}`);
      res.status(400).json({ error: `${PROD_FIND_FAILED} user` });
    }
};

controller.update = async (req, res, io) => {
  const id = req.params.id;
  const authUserId = req.userId;
  const user = parseRequest(req.body, User.updateParams);
  let updatedUser = null;

  try {
    if (id !==authUserId) {
      return res.status(403).json({ auth: false, message: UNAUTHORIZED_RESSOURCE });
    }
    if (user !== null) {
      await User.change(id, user);
    }
    updatedUser = await User.get(id);
    res.json(userTransformer(updatedUser));
  } catch (err) {
    logger.error(`${DEV_UPDATE_FAILED} user- ${err}`);
    res.status(400).json({ error: `${PROD_UPDATE_FAILED} user` });
  }
};



controller.destroy = async (req, res) => {
  const id = req.params.id;
  const authUserId = req.userId;

  try {
    if (id !==authUserId) {
      return res.status(403).json({ auth: false, message: UNAUTHORIZED_RESSOURCE });
    }
    const user = await User.delete(id);
    return res.json({ message: DELETION_SUCCESS });
  } catch (err) {
    logger.error(`${DELETION_FAILED} user- ${err}`);
    res.status(400).json({ error: `${DELETION_FAILED} user` });
  }
};



export default controller;
