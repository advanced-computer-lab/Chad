const { Router } = require('express');
const Flight = require('../models/flightModel');
const mongoose = require('mongoose');
const ADMIN = 'ADMIN';
let router = new Router();

router.post('/search', async (req, res) => {
  console.log(req.body);
  const [regexAttributes, page] = Regex(req.body);
  console.log(regexAttributes);
  try {
    if (Object.keys(regexAttributes).length != 0) {
      let flights = await Flight.find(regexAttributes)
        .skip((page - 1) * 20)
        .limit(20);
      res.status(200).send({
        success: true,
        msg: 'ok',
        Flight: flights,
      });
    } else if (req.userData.role === ADMIN) {
      let flights = await Flight.find(regexAttributes)
        .skip((page - 1) * 20)
        .limit(20);
      res.status(200).send({
        success: true,
        msg: 'ok',
        Flight: flights,
      });
    }
  } catch (err) {
    res.status(500).send({
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
