const { Router } = require('express');
const Flight = require('../models/flightModel');
const mongoose = require('mongoose');
const { ADMIN } = require('../constants/userEnum');

let router = new Router();

router.post('/search-flights', async (req, res) => {
  const [attributes, page] = formAttributes(req.body.attributes);
  // when th body is empty we return all the flights paginated
  // note the use of the `?.` conditional chain as the userData is not guaranteed
  try {
    if (
      Object.keys(attributes).length != 0 ||
      (Object.keys(attributes).length === 0 && req.userData?.role === ADMIN)
    ) {
      let flights = await Flight.find(attributes)
        .skip((page - 1) * 20)
        .limit(20);
      res.status(200).json({
        success: true,
        msg: 'ok',
        flights: flights,
      });
    } else {
      // no one other than the admins are allowed to request all the flights
      res.status(401).json({
        success: false,
        msg: 'you are Unauthorized',
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

// add one day to the passed dateString
const addOneDay = (dateString) => {
  let _date = new Date(dateString);
  _date.setDate(_date.getDate() + 1);
  return _date;
};

// remove any none word character
const sanatizeText = (str) => {
  return str.replaceAll(/\W/g, '');
};

const formAttributes = (attributes) => {
  let formAttributes = {};
  let page = 1;
  let dayAfter;

  for (let key in attributes) {
    if (!attributes[key]) continue;
    switch (key) {
      case 'arrivalLocation':
      case 'departureLocation':
        // sanatize the string from any invalid characters
        attributes[key] = sanatizeText(attributes[key]);
        // limit the matching string
        attributes[key] = attributes[key].substr(0, 25);
        formAttributes[key] = new RegExp(attributes[key], 'i');
        break;
      case 'flightNumber':
        attributes[key] = sanatizeText(attributes[key]);
        attributes[key] = attributes[key].substr(0, 15);
        formAttributes[key] = new RegExp(attributes[key], 'i');
        break;
      case '_id':
      case 'creatorId':
        formAttributes[key] = mongoose.Types.ObjectId(attributes[key]);
        break;
      // we need to get all the flights in that day
      // also the exact query is not practical
      case 'arrival':
      case 'departure':
        dayAfter = addOneDay(attributes[key]);
        formAttributes[key] = {
          $gte: new Date(attributes[key]),
          $lt: dayAfter,
        };
        break;
      case 'classInfo':
        formAttributes['classInfo.Type'] = attributes[key];
        break;
      case 'page':
        page = attributes[key];
        break;
    }
  }
  return [formAttributes, page];
};

module.exports = router;
