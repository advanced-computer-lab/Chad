const { Router } = require('express');
const User = require('../models/UserModel');

const userRouter = new Router();

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

module.exports = userRouter;
