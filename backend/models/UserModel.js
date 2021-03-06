const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { ADMIN, USER } = require('../constants/userEnum');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      unique: true,
      require: true,
    },
    phone: {
      type: String,
      require: true,
    },
    passport: {
      type: String,
      require: true,
    },
    tempPassword: {
      type: String,
    },
    expirationDate: {
      type: Date,
    },
    role: {
      type: String,
      enum: [ADMIN, USER],
      default: USER,
    },
  },
  { timestamps: true }
);

// some global queries

// this function is to add a use to the db with password hashed
UserSchema.statics.addUser = async function (user) {
  user.password = await bcrypt.hash(user.password, 10);
  return this.create(user);
};

// check if the login credentials are valid
UserSchema.statics.checkUser = async function ({ email, password }) {
  let user = await this.findOne({ email });
  let validPass = await bcrypt.compare(password, user.password),
    validTempPass = false;
  let validDate = user.expirationDate >= new Date();

  if (user.tempPassword)
    validTempPass = await bcrypt.compare(password, user.tempPassword);

  if (!validPass && !(validTempPass && validDate)) return null;

  return { ...user._doc, password: 'hi' };
};

//get user info
UserSchema.statics.getUserInfo = async function ({ id }) {
  let user = await this.findOne({ _id: id });
  return { ...user._doc, password: 'hi' };
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
