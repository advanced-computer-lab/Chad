const { Router } = require('express');
const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const userRouter = new Router();

// remove the fields that cannot be modified
const sanatizeData = (data) => {
  ['role', '_id', 'password'].forEach((f) => delete data[f]);
  return data;
};

userRouter.get('/user-info', async (req, res) => {
  try {
    let user = await User.getUserInfo(req.userData);
    res.status(200).json({
      success: true,
      msg: 'ok',
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: 'some db err',
      err,
    });
  }
});

userRouter.put('/user', async (req, res) => {
  try {
    const _id = req.userData.id;

    var newData = sanatizeData(req.body);

    const user = await User.updateOne({ _id }, { $set: newData });

    res.status(200).json({
      success: true,
      msg: 'user updated',
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: 'error updating user',
      err,
    });
  }
});

userRouter.put('/user/change-password', async (req, res) => {
  try {
    const _id = req.userData.id;

    var newData = req.body;

    if (newData['oldPassword'] != null && newData['newPassword'] != null) {
      let user = await User.findOne({ _id });
      let valid = await bcrypt.compare(newData['oldPassword'], user.password);

      if (valid) {
        let data = {};
        data['password'] = await bcrypt.hash(newData['newPassword'], 10);
        await User.updateOne({ _id }, { $set: data });

        res.status(200).json({
          success: true,
          msg: 'user updated',
          user,
        });
      } else {
        throw new Error('wrong old password');
      }
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: 'error updating user',
      err,
    });
  }
});

userRouter.delete('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await User.deleteOne({ userId });
    res.status(200).json({
      success: true,
      msg: 'user deleted',
      result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: 'error deleting user',
      err,
    });
  }
});
module.exports = userRouter;
