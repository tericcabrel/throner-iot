import mongoose from 'mongoose';

import uuid from 'uuid/v4';

const { Schema } = mongoose;

const UserSchema = new Schema({
  user_id: {
    type: String,
    default: uuid()
  },
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email_token: {
    type: String,
    required: false,
    unique: true,
  },
  confirmed: {
    type: Boolean,
    required: true,
    default: false,
  },
  token: String,
  avatar: String,
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at', resetPasswordExpires: 'reset_password_expires' }, collection: 'users' });

const UsersModel = mongoose.model('User', UserSchema);

export const cleanCollection = () => UsersModel.remove({}).exec();

UsersModel.getAll = () => {
  return UsersModel.find({}).sort('-created_at').exec();
};

UsersModel.add = (user) => {
  return user.save();
};

UsersModel.delete = (id) => {
  return UsersModel.remove({ user_id: id });
};

UsersModel.get = (id) => {
  return UsersModel.findOne({ user_id: id });
};

UsersModel.change = (id, data) => {
  return UsersModel.findOneAndUpdate({ user_id: id }, data);
};

UsersModel.getBy = (param) => {
  return UsersModel.find(param);
};

UsersModel.updateParams = [
  'name',
  'username',
  'email',
  'password',
  'confirmed',
  'avatar',
];

export default UsersModel;
