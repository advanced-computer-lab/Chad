const { Router } = require('express');
const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sendMail = require('../controllers/mailSender');

const router = Router();

router.post('/forgetPassword', async (req, res) => {
  const { email } = req.body;
  try {
    if (email) {
      const user = await User.findOne({ email });
      if (!user) {
        // for security reasons
        res.status(200).json({
          success: true,
          msg: 'email sent',
        });
        return;
      }
      const tempPassword = crypto.randomBytes(10).toString('hex');
      const passhashed = await bcrypt.hash(tempPassword, 10);
      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() + 2);
      await User.findOneAndUpdate(
        { email },
        {
          tempPassword: passhashed,
          expirationDate,
        }
      );
      await sendMail(
        user.email,
        'Forget Password',
        `temp password: ${tempPassword}\n note that this password will expire after two hours`
      );
      res.status(200).json({
        success: true,
        msg: 'ok',
      });
    } else {
      res.status(400).json({
        success: false,
        msg: 'bad format',
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: 'some db error',
    });
  }
});

module.exports = router;
