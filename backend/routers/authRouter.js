const { Router } = require('express');
const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const { USER } = require('../constants/userEnum');

const authRouter = new Router();

authRouter.post('/auth', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      success: false,
      msg: 'bad req body',
    });
    return;
  }

  try {
    let user = await User.checkUser(req.body);
    if (user) {
      res.status(200).json({
        success: true,
        msg: 'ok',
        token: jwt.sign(
          {
            id: user._id,
            role: user.role,
          },
          process.env.SECRET
        ),
        user,
      });
    } else {
      res.status(200).json({
        success: false,
        msg: 'user not found',
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: 'some db err',
      err,
    });
  }
});

authRouter.post('/register', async (req, res) => {
  const user = req.body;
  if (!user) {
    res.status(400).json({
      success: false,
      msg: 'bad req body',
    });
    return;
  }

  // override or add the role as the ADMIN can't be created
  user.role = USER;

  // insert the user into the db
  try {
    const result = await User.findOne({ email: user.email });
    if (result) {
      res.status(200).json({
        success: false,
        msg: 'user Already exists',
      });
    } else {
      await User.addUser(user);
      res.status(200).json({
        success: true,
        msg: 'ok',
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: 'some db err',
      err,
    });
  }
});

module.exports = authRouter;
