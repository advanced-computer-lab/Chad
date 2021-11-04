const { Router } = require('express');
const Flight = require('../models/flightModel');
const mongoose = require('mongoose');
const { ADMIN } = require('../constants/userEnum');

let router = new Router();

router.post('/search', async (req, res) => {
  console.log(req.body.attributes);
  const [regexAttributes, page] = Regex(req.body.attributes);
  console.log(req.userData);
  try {
    if (Object.keys(regexAttributes).length != 0) {
      let flights = await Flight.find(regexAttributes)
        .skip((page - 1) * 20)
        .limit(20);
      res.status(200).json({
        success: true,
        msg: 'ok',
        Flight: flights,
      });
    } else if (req.userData.role === ADMIN) {
      let flights = await Flight.find(regexAttributes)
        .skip((page - 1) * 20)
        .limit(20);
      res.status(200).json({
        success: true,
        msg: 'ok',
        Flight: flights,
      });
    } else {
      res.status(403).json({
        success: false,
        msg: 'you are Unauthorized',
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      msg: 'some db err',
    });
  }
});

const Regex = (attributes) => {
  let regexAttributes = {};
  let page = 1;
  for (let key in attributes) {
    switch (key) {
      case 'arrivalLocation' | 'depatureLocation':
        regexAttributes[key] = new RegExp(attributes[key], 'i');
        break;
      case '_id' | 'creatorId':
        regexAttributes[key] = mongoose.Types.ObjectId(attributes[key]);
        break;
      case 'flightNumber':
        regexAttributes[key] = Number(attributes[key]);
        break;
      case 'arrival' | 'depature':
        regexAttributes[key] = Date(attributes[key]);
        break;
      case 'classInfo':
        regexAttributes[key] = attributes[key];
        break;
      case 'page':
        page = attributes[key];
        break;
      default:
        break;
    }
  }
  return [regexAttributes, page];
};

module.exports = router;
