const express = require('express');
const { ADMIN } = require('../constants/userEnum');
const router = express.Router();
const Flight = require('../models/flightModel');
const Place = require('../models/PlaceModel');

// helper functions

// remove the fields that cannot be modified
const sanatizeData = (data) => {
  ['creatorId', '_id'].forEach((f) => delete data[f]);
  return data;
};

// it gets an array of flights and replaces the locations ID with name
// from the places model
const joinFlightAndPlace = async (flights) => {
  const map = new Map();
  const result = [];
  for (let flight of flights) {
    let d_id = flight.departureLocation,
      a_id = flight.arrivalLocation;

    if (!map.has(d_id)) {
      let place = await Place.findOne({ _id: d_id });
      map.set(d_id, place.name);
    }

    if (!map.has(a_id)) {
      let place = await Place.findOne({ _id: a_id });
      map.set(a_id, place.name);
    }

    result.push({
      ...flight._doc,
      departureLocation: map.get(d_id),
      arrivalLocation: map.get(a_id),
    });
  }

  return result;
};

// use middleware to handle unautherized access
router.use((req, res, next) => {
  if (
    req.userData?.role === ADMIN ||
    (!req.url.includes('flights') && req.method === 'GET')
  ) {
    next();
    return;
  } else {
    res.status(401).json({
      success: false,
      msg: 'unautherized access',
    });
  }
});

//git req to view all the flights
router.get('/flights/:page', async (req, res) => {
  try {
    const page = Number(req.params.page);
    let flights = await Flight.find()
      .skip((page - 1) * 20)
      .limit(20);

    // join flight and place table
    flights = await joinFlightAndPlace(flights);

    res.status(200).json({
      success: true,
      msg: 'ok',
      flights,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: 'some server err',
      err,
    });
  }
});

//git req to view a required flight
router.get('/flight/:flightId', async (req, res) => {
  try {
    const _id = req.params.flightId;
    let flight = await Flight.findOne({ _id });

    // join the flight and place models
    [flight] = await joinFlightAndPlace([flight]);

    res.status(200).json({
      success: true,
      msg: 'ok',
      flight,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: 'some db err',
      err,
    });
  }
});

// post req to add a flight
router.post('/flight', async (req, res) => {
  try {
    let flight = await Flight.create(req.body);

    res.status(200).json({
      success: true,
      msg: 'ok',
      flight,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: 'some db err',
      err,
    });
  }
});

//patch req to update a flight using an id
router.put('/flight/:flightId', async (req, res) => {
  try {
    const _id = req.params.flightId;
    // remove unmodified data
    const newData = sanatizeData(req.body);
    const flight = await Flight.updateOne({ _id }, { $set: newData });

    res.status(200).json({
      success: true,
      msg: 'ok',
      flight,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: 'some db err',
      err,
    });
  }
});

//delete req
router.delete('/flight/:flightId', async (req, res) => {
  try {
    const _id = req.params.flightId;
    const result = await Flight.deleteOne({ _id });

    res.status(200).json({
      success: true,
      msg: 'ok',
      result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: 'some db err',
      err,
    });
  }
});

module.exports = router;
