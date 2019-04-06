import uuid from 'uuid/v4';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import config from '../config/jwt';
import * as jwt from 'jsonwebtoken';
import User from '../models/users.model';
import logger from '../core/logger/app-logger';
import smtpTransport from '../core/mailer/app-mailer';
import { parseRequest } from '../core/utils/helpers';

import {
  DEV_FIND_FAILED,PROD_FIND_FAILED,NO_TOKEN_PROVIDED,AUTHENTICATION_FAILED,USER_NOT_FOUND,
  MAIL_FAILED,RESET_PASSWORD_SUCCESS,RESET_PASSWORD_FAILED,MAIL_SUCCESS,RESET_PASSWORD_EXPIRED
} from '../core/utils/constants';

const controller = {};

controller.login = async (req, res) => {
    try {
      User.findOne({ email: req.body.email }, function (err, user) {
        if (err) return res.status(500).send(DEV_FIND_FAILED);
        if (!user) return res.status(404).send(USER_NOT_FOUND);
        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
        var token = jwt.sign({ id: user.user_id }, config.secret, {
          expiresIn: config.expiresIn 
        });
        res.status(200).send({ auth: true, user_id : user.user_id, token: token });
      });
    } catch (err) {
      logger.error(`${DEV_FIND_FAILED} auth- ${err}`);
      res.status(400).json({ error: `${PROD_FIND_FAILED} auth` });
    }
};

controller.forgotPassword = async (req, res) => {
    try {
      const email = req.body.email;
      let user = await User.findOne({email: email});

      if (!user) 
        return res.status(422).json({ error: USER_NOT_FOUND });

      let token = bcrypt.hashSync(user.email, 8);

      user = await User.findOneAndUpdate({ user_id: user.user_id }, { email_token: token, reset_password_expires: Date.now() + 86400 });

      var data = {
        to: user.email,
        from: email,
        template: 'forgot-password-email',
        subject: 'Password help has arrived!',
        context: {
          url: `${process.env.BASE_URL}:${process.env.SERVER_PORT}/auth/reset_password?token=${token}`,
          name: user.username
        }
      };

      smtpTransport.sendMail(data);

      return res.json({ message: MAIL_SUCCESS });

    } catch (err) {
      logger.error(`${MAIL_FAILED} auth- ${err}`);
      res.status(400).json({ error: `${MAIL_FAILED} auth` });
    }
};

controller.resetPassword = async (req, res) => {
    const email_token = req.body.email_token;
    let data = parseRequest(req.body, User.updateParams);
    data.password = bcrypt.hashSync(data.password, 8);

    try {
      let user = await User.findOne({ email_token: email_token });
      let expired = user.reset_password_expires;
      let today = Date.now();

      if (today >= expired){
        return res.status(400).json({ message: RESET_PASSWORD_EXPIRED });
      }

      await User.change(user.user_id, data);

      return res.json({ message: RESET_PASSWORD_SUCCESS });
    } catch (err) {
      logger.error(`${RESET_PASSWORD_FAILED} auth- ${err}`);
      res.status(400).json({ error: `${RESET_PASSWORD_FAILED}` });
    }
};

controller.me = async (req, res) => {
    try {
      var token = req.headers['x-access-token'];
      if (!token) return res.status(401).json({ auth: false, message: NO_TOKEN_PROVIDED });
      
      jwt.verify(token, config.secret, function(err, decoded) {
        if (err) 
          return res.status(400).json({ auth: false, message: AUTHENTICATION_FAILED });
        user = User.findOne({user_id: decoded.id}, { password: 0 });
        res.json(user);
      });
    } catch (err) {
      logger.error(`${DEV_FIND_FAILED} auth- ${err}`);
      res.status(400).json({ error: `${PROD_FIND_FAILED} auth` });
    }
};

export default controller;
