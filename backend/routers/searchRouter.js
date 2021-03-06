const { Router } = require('express');
const Flight = require('../models/flightModel');
const mongoose = require('mongoose');
const { ADMIN } = require('../constants/userEnum');
const SortTypes = require('../constants/SortAttributes');

let router = new Router();

router.post('/search-flights', async (req, res) => {
  const [
    attributes,
    page,
    returnPage,
    sortAttribute,
    roundtrip,
    roundTripAttr,
  ] = formAttributes(req.body.attributes);
  // when th body is empty we return all the flights paginated
  // note the use of the `?.` conditional chain as the userData is not guaranteed
  try {
    if (
      Object.keys(attributes).length != 0 ||
      (Object.keys(attributes).length === 0 && req.userData?.role === ADMIN)
    ) {
      let numberOflights = await Flight.find(attributes).countDocuments();
      let numberOfReturnFlights = 0;

      let flights = await Flight.find(attributes)
        .populate('departureLocation')
        .populate('arrivalLocation')
        .sort(sortAttribute)
        .skip((page - 1) * 20)
        .limit(20);

      let returnFlights = [];
      if (roundtrip) {
        numberOfReturnFlights = await Flight.find(
          roundTripAttr
        ).countDocuments();
        returnFlights = await Flight.find(roundTripAttr)
          .populate('departureLocation')
          .populate('arrivalLocation')
          .sort(sortAttribute)
          .skip((returnPage - 1) * 20)
          .limit(20);
      }

      res.status(200).json({
        success: true,
        msg: 'ok',
        roundtrip,
        returnFlights,
        flights,
        maxPages: Math.ceil(numberOflights / 20),
        maxRPages: Math.ceil(numberOfReturnFlights / 20),
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
  return str.replaceAll(/[^a-zA-Z0-9\\-]/g, '');
};

const formAttributes = (attributes) => {
  let formAttributes = {};
  let page = 1,
    returnPage = 1;
  let dayAfter;
  let roundtrip = false;
  let childQuery, adultQuery;
  let sortAttribute = 'departure';

  for (let key in attributes) {
    if (!attributes[key]) continue;
    switch (key) {
      case 'flightNumber':
        attributes[key] = sanatizeText(attributes[key]);
        attributes[key] = attributes[key].substr(0, 15);
        formAttributes[key] = new RegExp(attributes[key], 'i');
        break;
      case 'arrivalLocation':
      case 'departureLocation':
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
      case 'baggageAllowanceForAdult':
      case 'priceForAdult':
        formAttributes[`classInfo.${key}`] = {
          $gte: attributes[key].min,
          $lte: attributes[key].max,
        };
        break;
      case 'availableSeats':
        childQuery = Number(attributes[key].child);
        adultQuery = Number(attributes[key].adult) + childQuery;
        formAttributes['classInfo.availabelChildrenSeats'] = {
          $gte: childQuery,
        };
        formAttributes['classInfo.availabelAdultsSeats'] = {
          $gte: adultQuery,
        };
        break;
      case 'roundtrip':
        roundtrip = attributes[key];
        break;
      case 'sort':
        sortAttribute = SortTypes[attributes[key]];
        break;
      case 'page':
        page = attributes[key];
        break;
      case 'returnPage':
        returnPage = attributes[key];
        break;
    }
  }
  // for the round trip search
  let roundTripAttr = {};
  if (
    roundtrip &&
    attributes['arrivalLocation'] &&
    attributes['departureLocation']
  ) {
    roundTripAttr['arrivalLocation'] = formAttributes['departureLocation'];
    roundTripAttr['departureLocation'] = formAttributes['arrivalLocation'];
    dayAfter = addOneDay(attributes['roundDate']);
    if (attributes['roundDate'])
      roundTripAttr['departure'] = {
        $gte: new Date(attributes['roundDate']),
        $lt: dayAfter,
      };
    else if (attributes['departure'])
      roundTripAttr['departure'] = {
        $gt: new Date(attributes['departure']),
      };
    // merge the common attributes
    roundTripAttr = { ...formAttributes, ...roundTripAttr };

    // remove from the roundTripAttr
    [
      'arrival',
      'flightNumber',
      !(attributes['roundDate'] || attributes['departure']) && 'departure',
    ].forEach((a) => delete roundTripAttr[a]);
  }

  return [
    formAttributes,
    page,
    returnPage,
    sortAttribute,
    roundtrip,
    roundTripAttr,
  ];
};

module.exports = router;
