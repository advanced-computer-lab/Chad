const { Router } = require('express');
const User = require('../models/UserModel');

const userRouter = new Router();

const sanatizeData = (data) => {
  ['creatorId', '_id'].forEach((f) => delete data[f]);
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

userRouter.post('/user', async (req, res) => {
  try {
    let user = await User.create(req.body);

    res.status(200).json({
      success: true,
      msg: 'user created',
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: 'error creating user',
      err,
    });
  }
});
userRouter.put('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const newData = sanatizeData(req.body);
    const user = await User.updateOne({ userId }, { $set: newData });

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
