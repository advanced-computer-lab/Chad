const { Router } = require('express');
const Flight = require('../models/flightModel');
const mongoose = require('mongoose');
const { ADMIN } = require('../constants/userEnum');

let router = new Router();

router.post('/searchFlights', async (req, res) => {
  const [attributes, page] = formAttributes(req.body.attributes);
  try {
    if (
      (Object.keys(attributes).length != 0) |
      ((Object.keys(attributes).length = 0) & (req.userData.role === ADMIN))
    ) {
      let flights = await Flight.find(attributes)
        .skip((page - 1) * 20)
        .limit(20);
      res.status(200).json({
        success: true,
        msg: 'ok',
        Flight: flights,
      });
    } else {
      res.status(401).json({
        success: false,
        msg: 'you are Unauthorized',
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: 'some db err',
    });
  }
});

const formAttributes = (attributes) => {
  let formAttributes = {};
  let page = 1;
  for (let key in attributes) {
    switch (key) {
      case 'arrivalLocation':
      case 'depatureLocation':
        formAttributes[key] = new RegExp(attributes[key], 'i');
        break;
      case '_id':
      case 'creatorId':
        formAttributes[key] = mongoose.Types.ObjectId(attributes[key]);
        break;
      case 'flightNumber':
        formAttributes[key] = Number(attributes[key]);
        break;
      case 'arrival':
      case 'depature':
        formAttributes[key] = Date(attributes[key]);
        break;
      case 'classInfo':
        formAttributes[key] = attributes[key];
        break;
      case 'page':
        page = attributes[key];
        break;
      default:
        break;
    }
  }
  return [formAttributes, page];
};

module.exports = router;
