const { Router } = require('express');
const User = require('../models/UserModel');

const userRouter = new Router();

// remove the fields that cannot be modified
const sanatizeData = (data) => {
  ['role', '_id'].forEach((f) => delete data[f]);
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
    // remove unmodifiable data
    const newData = sanatizeData(req.body);
    const user = await User.updateOne({ _id }, { $set: newData });

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

module.exports = userRouter;
