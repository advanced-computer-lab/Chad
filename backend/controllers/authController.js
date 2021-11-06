const pupRoutes = require('../constants/puplicRoutes');
const jwt = require('jsonwebtoken');

async function checkToken(token) {
  if (!token) return [false, null];
  try {
    let res = await jwt.verify(token, process.env.SECRET);
    return [true, res];
  } catch (err) {
    return [false, null];
  }
}

function isPuplic({ url, method }) {
  return pupRoutes.some(
    ({ path, methods }) => path === url && methods.includes(method)
  );
}

async function authController(req, res, next) {
  const [valid, data] = await checkToken(req.headers.token);
  if (isPuplic(req) || valid) {
    req.userData = data;
    next();
  } else {
    res.status(403).json({
      success: false,
      msg: 'unautherized access',
    });
  }
}

module.exports = authController;
