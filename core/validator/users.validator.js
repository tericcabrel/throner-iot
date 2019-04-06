import User from '../../models/users.model';
import { translate, validationHandler } from '../../core/utils/helpers';
const { check, validationResult }  = require('express-validator/check');

exports.validate = (method) => {
switch (method) {
    case 'createUser': {
     return [ 
        check('username', translate('username.empty', 'en')).not().isEmpty(),
        check('name', translate('name.empty', 'en')).not().isEmpty(),
        check('email', translate('email.empty', 'en')).not().isEmpty(),
        check('email', translate('email.invalid', 'en')).isEmail(),
        check('password', translate('password.invalid', 'en')).isLength({ min: 5 }),
        check('password', translate('password.empty', 'en')).not().isEmpty(),
        check('email')
          .custom((value, {req}) => {
            return new Promise((resolve, reject) => {
              User.findOne({email:req.body.email}, function(err, user){
                if(err) {
                  reject(new Error('Server Error'))
                }
                if(Boolean(user)) {
                  reject(new Error(translate('email.exist', 'en')))
                }
                resolve(true)
              });
            });
          }),
        check('username')
          .custom((value, {req}) => {
            return new Promise((resolve, reject) => {
              User.findOne({username:req.body.username}, function(err, user){
                if(err) {
                  reject(new Error('Server Error'))
                }
                if(Boolean(user)) {
                  reject(new Error(translate('username.exist', 'en')))
                }
                resolve(true)
              });
            });
          }),

        (req, res, next) => {
         validationHandler(res, req, next);
        }

       ]   
    }
    case 'updateUser': {
     return [
        check('email')
          .custom((value, {req}) => {
            return new Promise((resolve, reject) => {
              User.findOne({email:req.body.email}, function(err, user){
                if(err) {
                  reject(new Error('Server Error'))
                }
                if(Boolean(user)) {
                  if (user.user_id != req.userId) {
                  	  //console.log(user.user_id)
                  	  reject(new Error(translate('email.exist', 'en')))
                  }   
                }
                resolve(true)
              });
            });
          }),
        check('username')
          .custom((value, {req}) => {
            return new Promise((resolve, reject) => {
              User.findOne({username:req.body.username}, function(err, user){
                if(err) {
                  reject(new Error('Server Error'))
                }
                if(Boolean(user)) {
                  if (user.user_id != req.userId) {
                  	  //console.log(user.user_id)
                  	  reject(new Error(translate('username.exist', 'en')))
                  }   
                }
                resolve(true)
              });
            });
          }),

        (req, res, next) => {
         validationHandler(res, req, next);
        }

       ]   
    }
  }
}